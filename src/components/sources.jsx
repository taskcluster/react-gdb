import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Editor from './editor'

class Sources extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedFile: null }
  }

  shouldComponentUpdate (nextProps, nextState) {
    this.focus = this.props.frame !== nextProps.frame
    return this.focus || this.props.files !== nextProps.files ||
      this.state !== nextState
  }

  selectFile (file) {
    this.setState({ selectedFile: file })
  }

  render () {
    let filesList = []
    let editorsList = []
    let frameFile = this.props.frame.get('file')
    this.props.data.forEach((value, key) => {
      filesList.push(
        <a onClick={() => this.selectFile(key)}>{value.get('file').get('name')}</a>
        <span>(<a onClick={() => this.props.closeFile(key)}>close</a>) </span>
      )
      let editorOptions = {
        text: value.get('file').get('src'),
        breaks: value.get('breaks'),
        visible: key === this.state.selectedFile,
        fetchFile: () => this.props.fetchFile(key),
        addBreak: (pos) => this.props.addBreak(key, pos)
        removeBreak: (pos) => this.props.removeBreak(key, pos)
      }
      editors.push(key === frameFile ?
        <Editor {...editorOptions} line={frame.get('line')} /> :
        <Editor {...editorOptions} />)
    })
    if (!this.props.files.has(frameFile)) this.props.openFile(frameFile)

    return (
      {filesList}
      {editorsList}
    )
  }
}

Sources.propTypes = {
  files: ImmutablePropTypes.orderedSet.isRequired,
  data: ImmutablePropTypes.mapOf(
    ImmutablePropTypes.mapContains({
      file: ImmutablePropTypes.recordOf({
        name: React.propTypes.string,
        src: React.propTypes.string
      }).isRequired,
      breaks: ImmutablePropTypes.listOf(React.propTypes.number).isRequired
    })
  ).isRequired,
  frame: ImmutablePropTypes.recordOf({
    file: React.propTypes.string,
    line: React.propTypes.number
  }).isRequired,
  openFile: React.propTypes.func.isRequired,
  closeFile: React.propTypes.func.isRequired,
  fetchFile: React.propTypes.func.isRequired,
  addBreak: React.propTypes.func.isRequired
  removeBreak: React.propTypes.func.isRequired
}

export default Sources

