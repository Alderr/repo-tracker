import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import * as RepoAPI from 'API/Repo';
import { getLatestRelease } from 'API/Github';
import { map, get } from 'lodash';
import SearchBar from './components/SearchBar';
import RepoList from './components/RepoList';

import s from './App.scss';

const cx = classNames.bind(s);

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [chosenRepos, setChosenRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function refreshReposOnMount() {
      await refreshRepos();
    }

    refreshReposOnMount();
  }, []);

  useEffect(() => {
    async function refreshReposOnRequest() {
      await refreshRepos();
      setRefresh(false);
    }

    if (refresh) {
      refreshReposOnRequest();
    }
  }, [refresh]);

  async function refreshRepos() {
    const repos = RepoAPI.getRepos();
    const refreshCalls = map(repos, async (repo) => {
      try {
        const id = get(repo, 'id');
        const repoName = get(repo, 'repo');
        const owner = get(repo, 'owner.login');
        const savedLatestReleaseDate = new Date(get(repo, 'latestRelease.date'));
        const { data: release } = await getLatestRelease({ repo: repoName, owner });
        const latestReleaseDate = new Date(release.created_at);
        const isNewRelease = latestReleaseDate.getTime() > savedLatestReleaseDate.getTime();
        const latestRelease = {
          date: release.created_at,
          tag: release.tag_name,
          description: release.body,
        };

        RepoAPI.updateRepo({ id, latestRelease, isNew: isNewRelease });

        return {
          ...repo,
          latestRelease,
          ...isNewRelease ? { isNew: true } : {}, // will not override new notification if false
        };
      } catch (e) {
        return repo;
      }
    });

    setLoading(true);

    const refreshedRepos = await Promise.all(refreshCalls);

    setLoading(false);
    setChosenRepos(refreshedRepos);
  }

  function deleteRepo(id) {
    RepoAPI.deleteRepo({ id });
    setChosenRepos(RepoAPI.getRepos());
  }

  function updateRepo(id, repoObject) {
    RepoAPI.updateRepo({ id, ...repoObject });
    setChosenRepos(RepoAPI.getRepos());
  }

  function forceRefresh() {
    setRefresh(true);
  }

  return (
    <div className={cx('app')}>
      <div className={cx('header', 'app-header')}>Repo Tracker</div>
      {errorMessage && <div className={cx('error')}>{errorMessage}</div>}
      <SearchBar
        chosenRepos={chosenRepos}
        setChosenRepos={setChosenRepos}
        setErrorMessage={setErrorMessage}
      />
      <RepoList
        loading={loading}
        forceRefresh={forceRefresh}
        chosenRepos={chosenRepos}
        deleteRepo={deleteRepo}
        updateRepo={updateRepo}
      />
    </div>
  );
}

export default App;
