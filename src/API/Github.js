import { Octokit } from '@octokit/rest';
const octokit = new Octokit();

export function searchRepos({ sort, order, term }) {
  return octokit.search.repos({
    q: term,
    sort,
    order,
  });
}

export function getRepo({ owner, repo }) {
  return octokit.repos.get({ owner, repo });
}

export function listReleases({ owner, repo }) {
  return octokit.repos.listReleases({ owner, repo });
}
