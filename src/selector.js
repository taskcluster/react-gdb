import { createSelector } from 'reselect'
import { Map } from 'immutable'

export default () => {
  let UIStateSelector = (state) => state.UIState
  let breaksSelector = (state) => state.breaks
  let sourcesSelector = (state) => state.sources
  let threadsSelector = (state) => state.threads

  let threadIdSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('selectedThread')
  )

  let threadSelector = createSelector(
    threadIdSelector,
    threadsSelector,
    (id, threads) => threads.get(id)
  )

  let currentBreaksSelector = createSelector(
    threadIdSelector,
    breaksSelector,
    (id, breaks) => breaks.filter((b) =>
      b.get('thread') === id || b.get('thread') === 'all')
  )

  let currentThreadSelector = createSelector(
    threadSelector,
    threadIdSelector,
    currentBreaksSelector,
    (thread, id, breaks) => thread ?
      thread.toMap().set('id', id).set('breaks', breaks) : null
  )

  let openedFilesSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('openedFiles')
  )

  let currentFilesSelector = createSelector(
    sourcesSelector,
    openedFilesSelector,
    currentBreaksSelector,
    (sources, openedFiles, breaks) => openedFiles.map((f) => {
      let file = sources.get(f)
      return new Map({
        fullname: f,
        name: file.get('name'),
        src: file.get('src'),
        breaks: breaks.filter((b) => b.get('file') === f)
      })
    })
  )

  let focusedFrameSelector = createSelector(
    UIStateSelector,
    (UIState) => UIState.get('focusedFrame')
  )

  return createSelector(
    currentFilesSelector,
    currentThreadSelector,
    sourcesSelector,
    threadsSelector,
    focusedFrameSelector,
    (files, thread, sources, threads, frame) => ({
      files, thread, sources, threads, frame
    })
  )
}

