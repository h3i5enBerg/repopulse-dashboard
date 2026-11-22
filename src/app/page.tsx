'use client';

import React, { useState } from 'react';
import type { AuditReport } from '@nirajsatam/git-commit-audit';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  ExternalLink,
  GitCommit,
  GitPullRequest,
  Layers,
  Loader2,
  Package,
  Search,
  ShieldCheck,
  Users
} from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const PRESET_REPOS = [
  { label: 'git-commit-audit', url: 'https://github.com/h3i5enBerg/git-commit-audit' },
  { label: 'TerminalMusicPlayer', url: 'https://github.com/h3i5enBerg/TerminalMusicPlayer' },
  { label: 'smart-expense-tracker', url: 'https://github.com/h3i5enBerg/smart-expense-tracker' }
];

export default function DashboardPage() {
  const [target, setTarget] = useState('https://github.com/h3i5enBerg/git-commit-audit');
  const [maxCommits, setMaxCommits] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  async function handleAudit(repoToAudit?: string) {
    const url = (repoToAudit || target).trim();
    if (!url) return;

    if (repoToAudit) {
      setTarget(repoToAudit);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: url, maxCommits })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete audit');
      }

      setReport(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function getGradeBadge(grade: string) {
    switch (grade) {
      case 'A':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ring-emerald-500/20';
      case 'B':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30 ring-blue-500/20';
      case 'C':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 ring-amber-500/20';
      case 'D':
      case 'F':
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30 ring-rose-500/20';
    }
  }

  function getFixHint(rule: string): string {
    switch (rule) {
      case 'conventional-format':
        return 'Prefix subject with conventional tag (e.g. feat:, fix:, docs:, chore:) followed by a description.';
      case 'lazy-message':
        return 'Write a meaningful summary (>= 10 chars) describing the specific change instead of placeholders.';
      case 'bulk-commit':
        return 'Split wide-ranging diffs touching many files into smaller, atomic single-responsibility commits.';
      default:
        return 'Review commit content against project guidelines.';
    }
  }

  const typeEntries = report ? Object.entries(report.typeBreakdown) : [];
  const maxTypeCount = typeEntries.reduce((max, [, count]) => Math.max(max, count), 1);

  const contributorEntries = report ? Object.entries(report.contributors) : [];
  const maxContribCount = contributorEntries.reduce((max, [, count]) => Math.max(max, count), 1);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">RepoPulse</span>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Dashboard
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Git Commit Health & Conventional Compliance Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.npmjs.com/package/@nirajsatam/git-commit-audit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/70 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline font-mono text-slate-300">@nirajsatam/git-commit-audit</span>
              <span className="md:hidden">npm</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://github.com/h3i5enBerg/git-commit-audit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/70 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Source</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
          <div className="max-w-3xl space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Audit Any Git Repository
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              Analyze commit messages against Conventional Commits specification, surface lazy descriptions, detect risky bulk changes, and compute a health score.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAudit();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <GithubIcon className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm font-mono text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={maxCommits}
                  onChange={(e) => setMaxCommits(Number(e.target.value))}
                  className="bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-xs font-mono text-slate-300 outline-none"
                >
                  <option value={15}>15 commits</option>
                  <option value={30}>30 commits</option>
                  <option value={50}>50 commits</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Run Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
                One-Click Presets:
              </span>
              {PRESET_REPOS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => handleAudit(preset.url)}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-indigo-300 hover:text-white border border-slate-700/60 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Audit Failed</p>
                <p className="text-xs text-rose-300/90 mt-0.5 font-mono break-all">{error}</p>
              </div>
            </div>
          )}
        </section>

        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Analyzing Repository History</p>
              <p className="text-xs text-slate-400">
                Cloning shallow commit records and verifying Conventional Commits compliance...
              </p>
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Health Score</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {report.score}
                    <span className="text-sm font-normal text-slate-500">/100</span>
                  </div>
                  <span
                    className={`text-sm font-bold px-2.5 py-0.5 rounded-full border ring-1 ${getGradeBadge(
                      report.grade
                    )}`}
                  >
                    Grade {report.grade}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      report.score >= 90
                        ? 'bg-emerald-500'
                        : report.score >= 80
                        ? 'bg-blue-500'
                        : report.score >= 70
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${report.score}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Conventional Commits</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {report.conventionalPercentage}
                    <span className="text-sm font-normal text-slate-500">%</span>
                  </div>
                  <span className="text-xs text-slate-400">spec compliance</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${report.conventionalPercentage}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Analyzed Commits</span>
                  <GitCommit className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {report.totalCommits}
                  </div>
                  <span className="text-xs text-slate-400">sample window</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-full" />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Issues Flagged</span>
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      report.issues.length === 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {report.issues.length}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      report.issues.length === 0
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {report.issues.length === 0 ? 'Clean History' : 'Action Required'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      report.issues.length === 0 ? 'bg-emerald-500 w-full' : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, report.issues.length * 20)}%`
                    }}
                  />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <h2 className="font-semibold text-white text-sm">Commit Type Distribution</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {typeEntries.length} categories
                  </span>
                </div>

                {typeEntries.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No categorized commits found.</p>
                ) : (
                  <div className="space-y-3 pt-2">
                    {typeEntries.map(([type, count]) => {
                      const percentage = Math.round((count / report.totalCommits) * 100);
                      const barWidth = Math.round((count / maxTypeCount) * 100);

                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-medium text-slate-200 uppercase tracking-wider text-[11px]">
                              {type}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {count} <span className="text-slate-600">({percentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                type === 'feat'
                                  ? 'bg-emerald-500'
                                  : type === 'fix'
                                  ? 'bg-sky-500'
                                  : type === 'docs'
                                  ? 'bg-amber-500'
                                  : type === 'refactor'
                                  ? 'bg-purple-500'
                                  : type === 'chore'
                                  ? 'bg-slate-400'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <h2 className="font-semibold text-white text-sm">Contributor Breakdown</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {contributorEntries.length} authors
                  </span>
                </div>

                {contributorEntries.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No contributor data found.</p>
                ) : (
                  <div className="space-y-3 pt-2">
                    {contributorEntries.map(([author, count]) => {
                      const percentage = Math.round((count / report.totalCommits) * 100);
                      const barWidth = Math.round((count / maxContribCount) * 100);

                      return (
                        <div key={author} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-200 truncate max-w-[200px]">
                              {author}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {count} <span className="text-slate-600">({percentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-white text-sm">Flagged Issues</h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {report.issues.length} detected
                </span>
              </div>

              {report.issues.length === 0 ? (
                <div className="py-10 text-center space-y-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-emerald-200 text-sm">All commits passed!</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Zero conventional infractions, lazy placeholders, or bulk changes were flagged in this sample.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="py-3 px-3">Commit</th>
                        <th className="py-3 px-3">Subject</th>
                        <th className="py-3 px-3">Author</th>
                        <th className="py-3 px-3">Rule</th>
                        <th className="py-3 px-3">Penalty</th>
                        <th className="py-3 px-3">Fix Hint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {report.issues.map((issue, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                              {issue.hash ? issue.hash.slice(0, 7) : '-------'}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-xs truncate text-slate-200 font-sans">
                            {issue.subject}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-slate-400 font-sans">
                            {issue.author}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider ${
                                issue.rule === 'conventional-format'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : issue.rule === 'lazy-message'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              }`}
                            >
                              {issue.rule}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-rose-400 font-semibold">
                            -{issue.penalty}
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-sans text-xs max-w-xs">
                            {getFixHint(issue.rule)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <h2 className="font-semibold text-white text-sm">Recent Commits</h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {report.commits.length} listed
                </span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {report.commits.map((commit) => (
                  <div
                    key={commit.hash}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">
                        {commit.shortHash || commit.hash.slice(0, 7)}
                      </span>
                      <p className="text-sm text-slate-200 truncate font-medium">
                        {commit.subject}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0 pl-11 sm:pl-0">
                      <span className="text-slate-400">{commit.author}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 font-mono">
                        {new Date(commit.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          +{commit.insertions}
                        </span>
                        <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          -{commit.deletions}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>
          RepoPulse powered by{' '}
          <a
            href="https://www.npmjs.com/package/@nirajsatam/git-commit-audit"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-mono"
          >
            @nirajsatam/git-commit-audit
          </a>{' '}
          • MIT License
        </p>
      </footer>
    </div>
  );
}
