/* globals appOptions */
import $ from 'jquery';
import {registerGetResult} from '@cdo/apps/code-studio/levels/codeStudioLevels';
import {
  postMilestoneForPageLoad,
  onContinue
} from '@cdo/apps/code-studio/levels/postOnLoad';
import {createVideoWithFallback} from '@cdo/apps/code-studio/videos';
import getScriptData from '@cdo/apps/util/getScriptData';
import React from 'react';
import ReactDom from 'react-dom';
import SafeMarkdown from '@cdo/apps/templates/SafeMarkdown';
import _ from 'lodash';

import {getStore} from '@cdo/apps/code-studio/redux';
import {
  overwriteProgress,
  useDbProgress
} from '@cdo/apps/code-studio/progressRedux';
var clientState = require('@cdo/apps/code-studio/clientState');
import {TestResults} from '@cdo/apps/constants';

$(document).ready(() => {
  // Workaround to get the logged-in user's progress on this script
  // when we loaded a standalone video on a cached script level.
  // Logged out user progress will be in the session storage. Non-
  // cached script progress will just be replaced with the same data.
  $.ajax(
    `/api/user_progress` +
      `/${appOptions.scriptName}` +
      `/${appOptions.stagePosition}` +
      `/${appOptions.levelPosition}` +
      `/${appOptions.serverLevelId}`
  ).done(data => {
    // Merge progress from server (loaded via AJAX)
    if (data.progress) {
      const store = getStore();

      // The server returned progress. This is the source of truth.
      store.dispatch(useDbProgress());
      clientState.clearProgress();

      // Clear any existing redux state.
      store.dispatch(
        overwriteProgress(
          _.mapValues(data.progress, level =>
            level.submitted ? TestResults.SUBMITTED_RESULT : level.result
          )
        )
      );
    }
  });

  registerGetResult();

  // make milestone post
  postMilestoneForPageLoad();

  // handle click on continue (results in navigating to next puzzle)
  $('.submitButton').click(onContinue);

  // Support toggling between notes and video.
  const showNotes = $('.show-notes');
  const showVideo = $('.show-video');
  const notes = $('.notes-content');
  const video = $('.video-content');

  showNotes.click(() => {
    showNotes.hide();
    showVideo.show();

    notes.show();
    video.hide();

    return false;
  });

  showVideo.click(() => {
    showNotes.show();
    showVideo.hide();

    notes.hide();
    video.show();

    return false;
  });

  const videoOptions = getScriptData('videoOptions');
  const videoWidth = getScriptData('videoWidth');
  const videoHeight = getScriptData('videoHeight');
  const videoFullWidth = getScriptData('videoFullWidth');
  const videoRoundedCorners = getScriptData('videoRoundedCorners');
  createVideoWithFallback(
    $('.video-content'),
    videoOptions,
    videoWidth,
    videoHeight,
    videoFullWidth,
    videoRoundedCorners
  );

  // Render markdown contents
  $('.standalone-video > .markdown-container').each(function() {
    const container = this;
    if (!container.dataset.markdown) {
      return;
    }

    ReactDom.render(
      React.createElement(SafeMarkdown, container.dataset, null),
      container
    );
  });

  // Do some dynamic sizing of full width videos.
  if (videoFullWidth) {
    const onResizeThrottled = _.throttle(onResize, 100);

    $(window).resize(onResizeThrottled);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResizeThrottled);
      window.visualViewport.addEventListener('scroll', onResizeThrottled);
    }

    onResizeThrottled();
  }
});

function onResize() {
  // The tutorial has a width:height ratio of 16:9.
  const aspectRatio = 16 / 9;

  // Let's minimize the tutorial width at 320px.
  const minAppWidth = 320;

  // Let's maximize the tutorial width at 1280px.
  const maxAppWidth = 1280;

  // Account for left and right margins.
  const reduceAppWidth = 50;

  // Leave space above the small footer.
  const reduceAppHeight = 160;

  let containerWidth;

  // Constrain video to maximum width.
  const maxContainerWidth =
    Math.min(window.innerWidth, maxAppWidth) - reduceAppWidth;

  // Use the smaller of the available screen space and the window height,
  // and leave space for the header and the small footer.
  const maxContainerHeight =
    Math.min(document.body.offsetHeight, window.innerHeight) - reduceAppHeight;

  if (maxContainerWidth / maxContainerHeight > aspectRatio) {
    // Constrain by height.
    containerWidth = maxContainerHeight * aspectRatio;
  } else {
    // Constrain by width.
    containerWidth = maxContainerWidth;
  }

  // Constrain tutorial to minimum width;
  if (containerWidth < minAppWidth) {
    containerWidth = minAppWidth;
  }

  // Set the video width.
  $('.standalone-video').width(containerWidth);
}
