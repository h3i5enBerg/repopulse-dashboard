import { NextRequest, NextResponse } from 'next/server';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { auditRepo, evaluateCommits, type AuditReport, type CommitRecord } from '@nirajsatam/git-commit-audit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const GITHUB_HTTPS_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?\/?$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawTarget = typeof body.target === 'string' ? body.target.trim() : '';

    if (!rawTarget) {
      return NextResponse.json(
        { error: 'Repository target is required. Provide a GitHub HTTPS URL or local directory path.' },
        { status: 400 }
      );
    }

    const rawMax = Number(body.maxCommits);
    const limit = Math.max(5, Math.min(50, !isNaN(rawMax) && rawMax > 0 ? Math.floor(rawMax) : 30));

    if (GITHUB_HTTPS_REGEX.test(rawTarget)) {
      const cleanUrl = rawTarget.replace(/\/+$/, '');
      const tmpDir = path.join(os.tmpdir(), `repopulse-${crypto.randomUUID()}`);

      try {
        execFileSync('git', ['clone', '--depth', String(limit), '--single-branch', cleanUrl, tmpDir], {
          timeout: 15000,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe']
        });

        const report: AuditReport = auditRepo(tmpDir, { maxCommits: limit });
        report.repoPath = cleanUrl;
        return NextResponse.json(report, { status: 200 });
      } catch (cloneErr: unknown) {
        try {
          const match = cleanUrl.match(/^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?$/);
          if (match) {
            const [, owner, repo] = match;
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`, {
              headers: {
                'User-Agent': 'RepoPulse-Dashboard',
                'Accept': 'application/vnd.github.v3+json'
              }
            });

            if (!res.ok) {
              const errBody = (await res.json().catch(() => ({}))) as { message?: string };
              throw new Error(errBody.message || `GitHub API responded with status ${res.status}`);
            }

            const data = (await res.json()) as Array<{
              sha: string;
              commit?: {
                message?: string;
                author?: { name?: string; email?: string; date?: string };
              };
              author?: { login?: string };
            }>;

            const commits: CommitRecord[] = data.map((item) => {
              const fullMsg = item.commit?.message || '';
              const subject = fullMsg.split('\n')[0].trim();
              return {
                hash: item.sha,
                shortHash: item.sha.slice(0, 7),
                author: item.commit?.author?.name || item.author?.login || 'Unknown',
                email: item.commit?.author?.email || '',
                date: item.commit?.author?.date || new Date().toISOString(),
                subject,
                filesChanged: 0,
                insertions: 0,
                deletions: 0
              };
            });

            const report = evaluateCommits(cleanUrl, commits, { maxCommits: limit });
            return NextResponse.json(report, { status: 200 });
          }
        } catch (apiErr: unknown) {
          const apiMsg = apiErr instanceof Error ? apiErr.message : String(apiErr);
          return NextResponse.json(
            { error: `Failed to clone or fetch repository: ${apiMsg}` },
            { status: 400 }
          );
        }

        const message = cloneErr instanceof Error ? cloneErr.message : String(cloneErr);
        return NextResponse.json(
          { error: `Failed to clone or analyze remote repository: ${message}` },
          { status: 400 }
        );
      } finally {
        try {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        } catch {
        }
      }
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Local repository paths are disabled in production. Please enter a public GitHub URL (e.g. https://github.com/owner/repo).' },
        { status: 400 }
      );
    }

    const resolvedPath = path.resolve(process.cwd(), rawTarget);
    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json(
        { error: `Local path does not exist: ${resolvedPath}` },
        { status: 400 }
      );
    }

    const report: AuditReport = auditRepo(resolvedPath, { maxCommits: limit });
    return NextResponse.json(report, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Audit process failed: ${message}` },
      { status: 500 }
    );
  }
}
