import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Star, 
  FolderGit2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { GitHubSyncData } from '../types';
import { parseGitHubRepo, fetchGitHubRepoDetails } from '../utils/githubService';

interface GitHubSyncPanelProps {
  githubData?: GitHubSyncData;
  onUpdateGitHubData: (data: GitHubSyncData) => void;
  onLinkCommitToMilestone?: (commitSha: string, commitMsg: string) => void;
}

export const GitHubSyncPanel: React.FC<GitHubSyncPanelProps> = ({
  githubData,
  onUpdateGitHubData,
  onLinkCommitToMilestone
}) => {
  const [repoInput, setRepoInput] = useState(
    githubData ? `${githubData.owner}/${githubData.repo}` : 'rishiks1207/dbit-project-track'
  );
  const [tokenInput, setTokenInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(!githubData?.connected);

  const handleSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const parsed = parseGitHubRepo(repoInput);
    if (!parsed) {
      setErrorMsg('Please enter a valid GitHub repository in format "owner/repo" or full URL.');
      return;
    }

    setIsSyncing(true);
    try {
      const data = await fetchGitHubRepoDetails(parsed.owner, parsed.repo, tokenInput);
      onUpdateGitHubData(data);
      setSuccessMsg(`Successfully synced with ${parsed.owner}/${parsed.repo} (${data.latestCommits.length} commits verified)!`);
      setShowConfig(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync with GitHub.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 to-zinc-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Stage 2 Development: GitHub Repository Sync
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Live VCS Audit Trail
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Verifies continuous code progression and milestone commits for SE COMPS Track 7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {githubData?.connected && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition-colors"
            >
              {showConfig ? 'Hide Config' : 'Change Repo'}
            </button>
          )}

          <button
            onClick={() => handleSync()}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Repo...' : 'Sync Git HEAD'}</span>
          </button>
        </div>
      </div>

      {/* Repo Settings / Connect Form */}
      {showConfig && (
        <form onSubmit={handleSync} className="p-4 bg-zinc-50 border-b border-zinc-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800">Configure GitHub Repository Connection</span>
            <span className="text-zinc-500 text-[11px]">Supports public repos & personal access tokens</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                GitHub Repository (URL or owner/repo)
              </label>
              <input
                type="text"
                required
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="e.g. rishiks1207/dbit-project-track or https://github.com/owner/repo"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Personal Access Token (optional)
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="ghp_... (for private repos)"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Token is kept local in browser session only</span>
            </div>
            <button
              type="submit"
              disabled={isSyncing}
              className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              {isSyncing ? 'Connecting...' : 'Save & Sync'}
            </button>
          </div>
        </form>
      )}

      {/* Notifications */}
      {errorMsg && (
        <div className="px-5 py-2.5 bg-red-50 text-red-800 text-xs flex items-center gap-2 border-b border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="px-5 py-2.5 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border-b border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Body: Connected Repo Stats & Commit Audit Feed */}
      {githubData ? (
        <div className="p-5 space-y-4">
          {/* Repo Top Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Repository</span>
              <a 
                href={githubData.repoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5 truncate"
              >
                <span>{githubData.owner}/{githubData.repo}</span>
                <ArrowUpRight className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Default Branch</span>
              <div className="flex items-center gap-1.5 font-bold text-zinc-800 mt-0.5">
                <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
                <span>{githubData.defaultBranch}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Primary Language</span>
              <div className="flex items-center gap-1.5 font-bold text-zinc-800 mt-0.5">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{githubData.primaryLanguage}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Last Synced</span>
              <div className="font-medium text-zinc-700 mt-0.5 text-[11px]">
                {githubData.lastSyncedAt ? new Date(githubData.lastSyncedAt).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </div>

          {/* Commits Stream: Audit Trail */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Commits Stream (Exp 5 & Exp 6 Stage Progress)</span>
              </h4>
              <span className="text-[11px] text-zinc-500">
                Click commit to link deliverable to current milestone
              </span>
            </div>

            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden bg-white text-xs">
              {githubData.latestCommits && githubData.latestCommits.length > 0 ? (
                githubData.latestCommits.map((commit, idx) => (
                  <div key={idx} className="p-3 hover:bg-zinc-50 flex flex-wrap items-center justify-between gap-2 transition-colors">
                    <div className="flex items-start gap-2.5 max-w-[70%]">
                      <span className="mt-0.5 font-mono text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-300 font-semibold shrink-0">
                        {commit.sha}
                      </span>
                      <div>
                        <p className="font-medium text-zinc-900 line-clamp-1">
                          {commit.message}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          by <span className="font-semibold text-zinc-700">{commit.author}</span> • {new Date(commit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onLinkCommitToMilestone && (
                        <button
                          type="button"
                          onClick={() => onLinkCommitToMilestone(commit.sha, commit.message)}
                          className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded transition-colors"
                        >
                          Link to Milestone
                        </button>
                      )}
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-zinc-600 p-1"
                        aria-label="View commit on GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-zinc-400">
                  No commits found in this repository yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-zinc-500">
          <FolderGit2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p>No repository connected yet. Click &ldquo;Save &amp; Sync&rdquo; above to link your GitHub project.</p>
        </div>
      )}
    </div>
  );
};
