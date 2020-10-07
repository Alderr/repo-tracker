import { Octokit } from '@octokit/rest';
const octokit = new Octokit();

export function searchRepos({ term }) {
  return octokit.search.repos({
    q: term,
  });
}

export function getRepo({ owner, repo }) {
  return octokit.repos.get({ owner, repo });
}

export function listReleases({ owner, repo }) {
  return octokit.repos.listReleases({ owner, repo });
}

export function getLatestRelease({ owner, repo }) {
  return octokit.repos.getLatestRelease({ owner, repo });
}
