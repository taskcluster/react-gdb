import { createSelector } from 'reselect'
import { Map } from 'immutable'

export default () => {
  let UIStateSelector = (state) => state.UIState
  let breaksSelector = (state) => state.breaks
  let sourcesSelector = (state) => state.sources
  let threadsSelector = (state) => state.threads

  let selectedThreadSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('selectedThread')
  )

  let currentThreadSelector = createSelector(
    selectedThreadSelector,
    threadsSelector,
    (thread, threads) => thread ? threads.get(thread) : null
  )

  let currentBreaksSelector = createSelector(
    currentThreadSelector,
    breaksSelector,
    (thread, breaks) => breaks.toArray().filter((b) =>
      !b.thread || b.thread.id === thread.get('thread').id)
  )

  let openedFilesSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('openedFiles')
  )

  let currentFilesSelector = createSelector(
    sourcesSelector,
    openedFilesSelector,
    currentBreaksSelector,
    (sources, files, breaks) => files.map((f) => new Map({
      path: f,
      src: sources.has(f) ? sources.get(f) : 'Not a project file.',
      breaks: breaks.filter((b) => b.file === f)
    }))
  )

  let positionSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('selectedPosition')
  )

  let breaksAppliedSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('breakpointsAppliedTo')
  )

  let optionsSelector = createSelector(
    breaksAppliedSelector,
    (breakpointsAppliedTo) => new Map({ breakpointsAppliedTo })
  )

  return createSelector(
    currentFilesSelector,
    currentBreaksSelector,
    currentThreadSelector,
    sourcesSelector,
    threadsSelector,
    positionSelector,
    optionsSelector,
    (files, breaks, thread, sources, threads, position, options) => ({
      files, breaks, thread, sources, threads, position, options
    })
  )
}

