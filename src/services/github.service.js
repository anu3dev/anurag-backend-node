const { Octokit } = require('@octokit/rest');

function getOctokit() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
  });
}

async function getPullRequestFiles(owner, repo, pullNumber) {
  const octokit = getOctokit();
  const { data } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  });
  return data;
}

async function getPullRequestDetails(owner, repo, pullNumber) {
  const octokit = getOctokit();
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });
  return data;
}

module.exports = { getPullRequestFiles, getPullRequestDetails };
