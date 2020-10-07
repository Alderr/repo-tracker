import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Select from 'react-select';
import ReactMarkdown from 'react-markdown';
import Icon from '@mdi/react';
import { mdiStar, mdiSourceFork, mdiDelete } from '@mdi/js';
import { get, map } from 'lodash';

import { listReleases } from 'API/Github';

import s from './style.scss';

const cx = classNames.bind(s);

export default function RepoListItem(props) {
  const [releaseOptions, setReleaseOptions] = useState([]);
  const [reveal, setReveal] = useState(false);

  const id = get(props.item, 'id');
  const ownerName = get(props.item, 'owner.login', '--');
  const repoName = get(props.item, 'repo', '--');
  const stars = get(props.item, 'stars', '--');
  const forks = get(props.item, 'forks', '--');
  const isNew = get(props.item, 'isNew', false);
  const description = get(props.item, 'description', '--');
  const userRelease = get(props.item, 'userRelease');
  const latestRelease = get(props.item, 'latestRelease.tag');
  const releaseDate = get(props.item, 'latestRelease.date');
  const releaseDescription = get(props.item, 'latestRelease.description');
  const starsDisplay = stars.toLocaleString();
  const forksDisplay = forks.toLocaleString();
  const releaseDateDisplay = formatDate(new Date(releaseDate));

  useEffect(() => {
    async function fetchCurrRepoReleases() {
      try {
        const { data: releases } = await listReleases({ owner: ownerName, repo: repoName });
        const options = map(releases, (release) => ({ value: release.tag_name, label: release.tag_name }));

        setReleaseOptions(options);
      } catch (e) {
        setReleaseOptions([]);
      }
    }

    fetchCurrRepoReleases();
  }, [ownerName, repoName]);

  function onSelectChange({ value }) {
    props.updateRepo(id, { userRelease: value });
  }

  function formatDate(date) {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
  }

  function swallowClickEvents(event) {
    event.stopPropagation();
  }

  function toggleReveal() {
    props.updateRepo(id, { isNew: false });
    setReveal(!reveal);
  }

  function onClickDeleteRepo(event) {
    event.stopPropagation();
    props.deleteRepo(id);
  }

  return (
    <div className={cx('list-item-container')}>
      <div
        role="button"
        tabIndex={0}
        onClick={toggleReveal}
        onKeyUp={toggleReveal}
        className={cx('list-item')}
      >
        {isNew && <div className={cx('new-marker')} />}
        <div className={cx('item-row')}>
          <div className={cx('sub-header', 'item-title')}>
            <div className={cx('bold')}>{repoName}</div>
            <div className={cx('paragraph-text', 'italicize')}>{ownerName}</div>
          </div>
          <div className={cx('item-detail', 'stars')}>
            <Icon className={cx('detail-icon')} path={mdiStar} size="18px" />
            {starsDisplay}
          </div>
          <div className={cx('item-detail', 'forks')}>
            <Icon className={cx('detail-icon')} path={mdiSourceFork} size="18px" />
            {forksDisplay}
          </div>
        </div>
        <div className={cx('item-row', 'description')}>{description}</div>
        <div className={cx('item-row', 'last-row')}>
          {latestRelease && (
            <>
              <div
                role="button"
                tabIndex={0}
                onKeyUp={swallowClickEvents}
                onClick={swallowClickEvents}
                className={cx('release-picker')}
              >
                <Select
                  defaultValue={{ value: userRelease, label: userRelease }}
                  onChange={onSelectChange}
                  options={releaseOptions}
                />
              </div>
              <div className={cx('latest-release')}>
                Latest:
                <span>
                &nbsp;
                  {latestRelease}
                </span>
              </div>
            </>
          )}
          <div className={cx('actions')}>
            <div
              role="button"
              tabIndex={0}
              onKeyUp={onClickDeleteRepo}
              onClick={onClickDeleteRepo}
              className={cx('delete-item')}
            >
              <Icon className={cx('detail-icon')} path={mdiDelete} size="24px" />
            </div>
          </div>
        </div>
      </div>
      <div className={cx('extended-section', { reveal })}>
        <div className={cx('item-row')}>
          <div className={cx('small-sub-header', 'bold')}>
            {latestRelease}
          </div>
          <div className={cx('paragraph-text', 'italicize')}>
            &nbsp;--&nbsp;
            {releaseDateDisplay}
          </div>
        </div>
        <div className={cx('item-col')}>
          <ReactMarkdown escapeHtml={false} className={cx('markdown')} linkTarget="_blank" source={releaseDescription} />
        </div>
      </div>
    </div>
  );
}

RepoListItem.propTypes = {
  updateRepo: PropTypes.func,
  deleteRepo: PropTypes.func,
  item: PropTypes.object,
};
