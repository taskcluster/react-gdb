import React from 'react'
import { debugUI as debug } from '../debug.js'
import { PositionPropType, FramePropType, FilesPropType } from './common.js'
import Editor from './editor.jsx'

class Sources extends React.Component {
  render () {
    let { position, frame, files, closeFile, selectPosition,
      addBreak, removeBreak } = this.props

    let filesList = []
    let editorsList = []
    files.forEach((value) => {
      let key = value.get('path')
      let currentFile = position ? position.get('file') : null

      filesList.push(
        <div key={key}>
          <a href="#" onClick={() => selectPosition(key)}>{key}</a>
          <strong> (<a href="#" onClick={() => closeFile(key)}>close</a>)</strong>
        </div>
      )

      let editor
      if (value.get('src')) {
        let editorOptions = {
          file: key,
          text: value.get('src'),
          breaks: value.get('breaks'),
          addBreak: (pos) => addBreak(key, pos),
          removeBreak
        }

        if (frame && frame.file === key) {
          editorOptions.highlight = frame.line
        }

        if (currentFile === key) {
          let line = position.get('line')
          if (line) {
            debug(`Focused on file ${key}, line ${line}.`)
            editorOptions.position = line
          }
          // Disable line positioning
          // selectPosition(currentFile)
        }

        editor = <Editor {...editorOptions} />
      } else {
        editor = <span>Hold on, fetching the source...</span>
      }

      let style = currentFile !== key ? { display: 'none' } : {}
      editorsList.push(<div key={key} style={style}>{editor}</div>)
    })

    return (
      <div>
        <div>{filesList}</div>
        <div>{editorsList}</div>
      </div>
    )
  }
}

Sources.propTypes = {
  files: FilesPropType.isRequired,
  position: PositionPropType,
  frame: FramePropType,
  selectPosition: React.PropTypes.func.isRequired,
  closeFile: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired
}

export default Sources

