import { Octokit } from '@octokit/rest';
const octokit = new Octokit();

export function searchRepos() {
  return octokit.search.repos();
}

export function getRepo() {
  return octokit.repos.get();
}

export function listReleases() {
  return octokit.repos.listReleases();
}
