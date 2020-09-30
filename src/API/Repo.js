export function getRepo({ id }) {
  return JSON.stringify(localStorage.getItem(id));
}

export function addRepo({
  id, latestRelease, userRelease, owner, repo,
}) {
  return localStorage.setItem(id, JSON.stringify({
    id, latestRelease, userRelease, owner, repo,
  }));
}

export function updateRepo({
  id, latestRelease, userRelease, owner, repo,
}) {
  const prevRepo = JSON.parse(localStorage.getItem(id));

  return localStorage.setItem(id, JSON.stringify(
    {
      ...prevRepo,
      ...latestRelease ? { latestRelease } : {},
      ...userRelease ? { userRelease } : {},
      ...owner ? { owner } : {},
      ...repo ? { repo } : {},
    },
  ));
}

export function deleteRepo({ id }) {
  return localStorage.deleteItem(id);
}
