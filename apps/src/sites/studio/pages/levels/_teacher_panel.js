/* global appOptions */

import $ from 'jquery';
import {setViewType, ViewType} from '@cdo/apps/code-studio/viewAsRedux';
import queryString from 'query-string';
import {getStore} from '@cdo/apps/redux';
import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import TeacherContentToggle from '@cdo/apps/code-studio/components/TeacherContentToggle';
import {getHiddenStages} from '@cdo/apps/code-studio/hiddenStageRedux';
import {queryLockStatus} from '@cdo/apps/code-studio/teacherPanelHelpers';

$(document).ready(initPage);

function initPage() {
  const script = document.querySelector('script[data-teacherpanel]');
  const teacherPanelData = JSON.parse(script.dataset.teacherpanel);

  const store = getStore();

  initViewAs(store);
  queryLockStatus(store, teacherPanelData.script_id);
  store.dispatch(getHiddenStages(teacherPanelData.script_name, false));
  renderTeacherContentToggle(store);

  const teacherPanel = document.getElementById('level-teacher-panel');
  if (teacherPanel) {
    console.log('found #level-teacher-panel');
  }
}

function initViewAs(store) {
  const query = queryString.parse(location.search);
  const initialViewAs = query.viewAs || ViewType.Teacher;
  store.dispatch(setViewType(initialViewAs));
}

function renderTeacherContentToggle(store) {
  const levelContent = $('#level-body');
  const element = $('<div/>')
    .css('height', '100%')
    .insertAfter(levelContent)[0];
  const isBlocklyOrDroplet = !!(window.appOptions && appOptions.app);

  ReactDOM.render(
    <Provider store={getStore()}>
      <TeacherContentToggle isBlocklyOrDroplet={isBlocklyOrDroplet} />
    </Provider>,
    element
  );
}
