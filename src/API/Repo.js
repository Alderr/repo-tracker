import { reduce, isNil } from 'lodash';

export function getRepo({ id }) {
  return JSON.stringify(localStorage.getItem(id));
}

export function getRepos() {
  const repos = JSON.parse(localStorage.getItem('repo-tracker'));
  const repoArr = reduce(repos, (arr, repo, id) => {
    arr.push({
      id,
      ...repo,
    });

    return arr;
  }, []);

  return repoArr;
}

export function addRepo({
  id,
  latestRelease,
  userRelease,
  owner,
  repo,
  description,
  forks,
  stars,
  link,
  isNew,
}) {
  const repos = JSON.parse(localStorage.getItem('repo-tracker'));

  return localStorage.setItem('repo-tracker', JSON.stringify({
    ...repos,
    [`${id}`]: {
      latestRelease,
      userRelease,
      owner,
      repo,
      description,
      forks,
      stars,
      link,
      isNew,
    },
  }));
}

export function updateRepo({
  id,
  latestRelease,
  userRelease,
  owner,
  repo,
  description,
  forks,
  stars,
  link,
  isNew,
}) {
  const repos = JSON.parse(localStorage.getItem('repo-tracker'));
  const prevRepo = repos[id];

  return localStorage.setItem('repo-tracker', JSON.stringify({
    ...repos,
    [`${id}`]: {
      ...prevRepo,
      ...latestRelease ? { latestRelease } : {},
      ...userRelease ? { userRelease } : {},
      ...owner ? { owner } : {},
      ...description ? { description } : {},
      ...forks ? { forks } : {},
      ...stars ? { stars } : {},
      ...link ? { link } : {},
      ...!isNil(isNew) ? { isNew } : {},
      ...repo ? { repo } : {},
    },
  }));
}

export function deleteRepo({ id }) {
  const repos = JSON.parse(localStorage.getItem('repo-tracker'));
  delete repos[id];

  return localStorage.setItem('repo-tracker', JSON.stringify(repos));
}
