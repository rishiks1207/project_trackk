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
    <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-[#18191E] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#D4F938]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-tight text-white">
                Stage 2 Development: GitHub Repository Sync
              </h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4F938] text-black font-extrabold uppercase">
                Live VCS Audit Trail
              </span>
            </div>
            <p className="text-[11px] text-white/60">
              Verifies continuous code progression and milestone commits for SE COMPS Track 7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {githubData?.connected && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-2 rounded-full border border-white/10 transition-colors cursor-pointer"
            >
              {showConfig ? 'Hide Config' : 'Change Repo'}
            </button>
          )}

          <button
            onClick={() => handleSync()}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black px-4 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Git HEAD'}</span>
          </button>
        </div>
      </div>

      {/* Repo Settings / Connect Form */}
      {showConfig && (
        <form onSubmit={handleSync} className="p-5 bg-[#F4F5F8] border-b border-slate-200/60 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#18191E]">Configure GitHub Repository Connection</span>
            <span className="text-slate-500 text-[11px]">Supports public repos &amp; personal access tokens</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                GitHub Repository (URL or owner/repo)
              </label>
              <input
                type="text"
                required
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="e.g. rishiks1207/dbit-project-track or https://github.com/owner/repo"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Personal Access Token (optional)
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="ghp_... (for private repos)"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Token is kept local in browser session only</span>
            </div>
            <button
              type="submit"
              disabled={isSyncing}
              className="bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-bold px-5 py-2 rounded-full transition-colors cursor-pointer"
            >
              {isSyncing ? 'Connecting...' : 'Save & Sync'}
            </button>
          </div>
        </form>
      )}

      {/* Notifications */}
      {errorMsg && (
        <div className="px-5 py-3 bg-red-50 text-red-900 text-xs flex items-center gap-2 border-b border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="px-5 py-3 bg-emerald-50 text-emerald-950 text-xs flex items-center gap-2 border-b border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Body: Connected Repo Stats & Commit Audit Feed */}
      {githubData ? (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Repo Top Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Repository</span>
              <a 
                href={githubData.repoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="font-extrabold text-[#18191E] hover:underline flex items-center gap-1 mt-0.5 truncate text-xs"
              >
                <span>{githubData.owner}/{githubData.repo}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Default Branch</span>
              <div className="flex items-center gap-1.5 font-black text-[#18191E] mt-0.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                <span>{githubData.defaultBranch}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Primary Language</span>
              <div className="flex items-center gap-1.5 font-black text-[#18191E] mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4F938] border border-black/30" />
                <span>{githubData.primaryLanguage}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Last Synced</span>
              <div className="font-bold text-[#18191E] mt-0.5 text-xs">
                {githubData.lastSyncedAt ? new Date(githubData.lastSyncedAt).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </div>

          {/* Commits Stream: Audit Trail */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-[#18191E] flex items-center gap-1.5 uppercase tracking-wide">
                <GitCommit className="w-4 h-4 text-black" />
                <span>Verified Commits Stream (Exp 5 &amp; Exp 6 Stage Progress)</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Click commit to link deliverable to current milestone
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white text-xs">
              {githubData.latestCommits && githubData.latestCommits.length > 0 ? (
                githubData.latestCommits.map((commit, idx) => (
                  <div key={idx} className="p-3.5 hover:bg-[#F4F5F8] flex flex-wrap items-center justify-between gap-2 transition-colors">
                    <div className="flex items-start gap-3 max-w-[75%]">
                      <span className="mt-0.5 font-mono text-[11px] bg-[#18191E] text-[#D4F938] px-2.5 py-0.5 rounded-full font-bold shrink-0">
                        {commit.sha}
                      </span>
                      <div>
                        <p className="font-bold text-[#18191E] line-clamp-1">
                          {commit.message}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          by <span className="font-semibold text-slate-800">{commit.author}</span> • {new Date(commit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onLinkCommitToMilestone && (
                        <button
                          type="button"
                          onClick={() => onLinkCommitToMilestone(commit.sha, commit.message)}
                          className="text-xs bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          Link to Gate
                        </button>
                      )}
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-black p-1"
                        aria-label="View commit on GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400">
                  No commits found in this repository yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-500">
          <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p>No repository connected yet. Click &ldquo;Save &amp; Sync&rdquo; above to link your GitHub project.</p>
        </div>
      )}
    </div>
  );
};
