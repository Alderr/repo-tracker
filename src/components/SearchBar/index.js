import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import AsyncSelect from 'react-select/async';
import { debounce, reduce, filter } from 'lodash';

import { addRepo } from 'API/Repo';
import { searchRepos, getLatestRelease } from 'API/Github';

import s from './style.scss';

const cx = classNames.bind(s);
const selectStyling = {
  option: (base) => ({
    ...base,
    color: '#2B2E30',
  }),
};

export default function SearchBar(props) {
  const [inputTerm, setInputTerm] = useState('');
  const repoMap = reduce(props.chosenRepos, (map, repo) => ({
    ...map,
    [repo.id]: 1,
  }), {});
  const loadRepoOptions = (term, callback) => debouncedLoadRepoOptions(term, callback, repoMap);
  const debouncedLoadRepoOptions = useCallback(debounce((term, callback, map) => {
    searchRepos({ term })
      .then(({ data: { items: repos } }) => {
        const repoList = repos.map((repo) => ({ value: repo.id, label: repo.full_name, repo }));
        const filteredList = filter(repoList, (repo) => !map[repo.value]);

        props.setErrorMessage('');
        callback(filteredList);
      })
      .catch(() => {
        props.setErrorMessage('Something went wrong. Try again later.');
        callback([]);
      });
  }, 500), []);

  async function onSelectChange({ repo, value }) {
    const chosenRepo = {
      id: value,
      owner: repo.owner,
      repo: repo.name,
      description: repo.description,
      forks: repo.forks,
      stars: repo.stargazers_count,
      link: repo.html_url,
      isNew: false,
    };

    try {
      const { data: release } = await getLatestRelease({ owner: repo.owner.login, repo: repo.name });
      chosenRepo.latestRelease = {
        date: 0,
        tag: release.tag_name,
        description: release.body,
      };
      chosenRepo.userRelease = release.tag_name;

      props.setChosenRepos([...props.chosenRepos, chosenRepo]);
      addRepo(chosenRepo);

      setInputTerm('');
    } catch (e) {
      props.setChosenRepos([...props.chosenRepos, chosenRepo]);
      addRepo(chosenRepo);

      setInputTerm('');
    }
  }

  function onTermChange(term) {
    setInputTerm(term);
  }

  return (
    <div className={cx('search-container')}>
      <AsyncSelect
        value={inputTerm}
        openMenuOnClick={false}
        onInputChange={onTermChange}
        onChange={onSelectChange}
        styles={selectStyling}
        placeholder="Search and add a repo"
        loadOptions={loadRepoOptions}
      />
    </div>
  );
}

SearchBar.propTypes = {
  setChosenRepos: PropTypes.func,
  setErrorMessage: PropTypes.func,
  chosenRepos: PropTypes.array,
};
