import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { debugUI as debug } from '../debug.js'
import { FramePropType, FilesPropType } from './common.js'
import Editor from './editor.jsx'

class Sources extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedFile: null, focusedFrame: null }
  }

  selectFile (file) {
    this.setState({ selectedFile: file })
  }

  focus (frame) {
    this.setState({ focusedFrame: frame })
  }

  componentWillReceiveProps (nextProps) {
    let selectedFile = this.state.selectedFile
    let frame = nextProps.focusedFrame

    if (frame) {
      let file = frame.get('file')
      if (this.props.focusedFrame !== frame) {
        nextProps.openFile(file)
        this.selectFile(file)
        this.focus(frame)
      } else {
        this.focus(null)
      }
    }

    if (!selectedFile || !nextProps.files.has(selectedFile)) {
      if (nextProps.files.count()) {
        let file = nextProps.files.last().get('fullname')
        this.selectFile(file)
      } else {
        this.selectFile(null)
      }
    }
  }

  render () {
    let { threadFrame, files, closeFile,
      fetchFile, addBreak, removeBreak } = this.props
    let focusedFrame = this.state.focusedFrame

    let filesList = []
    let editorsList = []
    files.forEach((value) => {
      let key = value.get('fullname')
      filesList.push(
        <div key={key}>
          <a onClick={() => this.selectFile(key)}>{value.get('name')}</a>
          <span>(<a href="#" onClick={() => closeFile(key)}>close</a>)</span>
        </div>
      )

      let editorOptions = {
        key,
        text: value.get('src'),
        breaks: value.get('breaks'),
        visible: key === this.state.selectedFile,
        fetchFile: () => fetchFile(key),
        addBreak: (pos) => addBreak(key, pos),
        removeBreak
      }
      if (threadFrame && threadFrame.get('file') === key) {
        editorOptions.highlight = threadFrame.get('line')
      }
      if (focusedFrame && focusedFrame.get('file') === key) {
        let line = focusedFrame.get('line')
        debug(`Focused on file ${key}, line ${line}.`)
        editorOptions.focus = line
      }
      editorsList.push(<Editor {...editorOptions} />)
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
  focusedFrame: FramePropType,
  threadFrame: FramePropType,
  openFile: React.PropTypes.func.isRequired,
  closeFile: React.PropTypes.func.isRequired,
  fetchFile: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired
}

export default Sources

