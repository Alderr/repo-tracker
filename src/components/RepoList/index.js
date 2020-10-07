import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';
import { map } from 'lodash';

import RepoListItem from './components/RepoListItem';

import s from './style.scss';

const cx = classNames.bind(s);

export default function RepoList(props) {
  const list = map(props.chosenRepos, (item) => <RepoListItem key={item.id} item={item} deleteRepo={props.deleteRepo} updateRepo={props.updateRepo} />);
  const noRepos = props.chosenRepos.length === 0;
  let body = '';

  if (props.loading) {
    body = <div className={cx('lds-dual-ring', 'loader')} />;
  } else if (noRepos) {
    body = <div className={cx('help-text')}>No repos saved. Add one!</div>;
  } else {
    body = (
      <>
        <div className={cx('list-actions')}>
          <div
            role="button"
            tabIndex={0}
            onKeyUp={props.forceRefresh}
            onClick={props.forceRefresh}
            className={cx('action-item')}
          >
            <Icon className={cx('action-icon')} path={mdiRefresh} size="20px" />
            <div className={cx('paragraph-text')}>Refresh</div>
          </div>
        </div>

        {list}
      </>
    );
  }
  return (
    <div className={cx('list-container')}>
      {body}
    </div>
  );
}

RepoList.propTypes = {
  forceRefresh: PropTypes.func,
  deleteRepo: PropTypes.func,
  updateRepo: PropTypes.func,
  chosenRepos: PropTypes.array,
  loading: PropTypes.bool,
};
