export function getRepo({ id }) {
  return JSON.stringify(localStorage.getItem(id));
}

export function addRepo({ id, latestRelease, userRelease }) {
  return localStorage.setItem(id, JSON.stringify({ id, latestRelease, userRelease }));
}

export function updateRepo({ id, latestRelease, userRelease }) {
  return localStorage.setItem(id, JSON.stringify({ id, latestRelease, userRelease }));
}

export function deleteRepo({ id }) {
  return localStorage.deleteItem(id);
}
