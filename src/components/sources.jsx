import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Editor from './editor.jsx'

class Sources extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedFile: null }
  }

  selectFile (file) {
    this.setState({ selectedFile: file })
  }

  componentWillReceiveProps (nextProps) {
    let frame = nextProps.frame
    if (frame) {
      let file = frame.get('file')
      if (this.props.frame !== frame) this.selectFile(file)
      if (!nextProps.files.has(file)) nextProps.openFile(file)
    }
  }

  render () {
    let filesList = []
    let editorsList = []
    let frame = this.props.frame
    this.props.data.forEach((value, key) => {
      filesList.push(
        <div key={key}>
          <a onClick={() => this.selectFile(key)}>{value.get('file').get('name')}</a>
          <span>(<a href="#" onClick={() => this.props.closeFile(key)}>close</a>) </span>
        </div>
      )
      let editorOptions = {
        key,
        text: value.get('file').get('src'),
        breaks: value.get('breaks'),
        visible: key === this.state.selectedFile,
        fetchFile: () => this.props.fetchFile(key),
        addBreak: (pos) => this.props.addBreak(key, pos),
        removeBreak: (pos) => this.props.removeBreak(key, pos)
      }
      editorsList.push(frame && key === frame.get('file')
        ? <Editor {...editorOptions} line={frame.get('line')} />
        : <Editor {...editorOptions} />)
    })

    return (
      <div>
        {filesList}
        {editorsList}
      </div>
    )
  }
}

Sources.propTypes = {
  files: ImmutablePropTypes.orderedSet.isRequired,
  data: ImmutablePropTypes.mapOf(
    ImmutablePropTypes.mapContains({
      file: ImmutablePropTypes.recordOf({
        name: React.PropTypes.string,
        src: React.PropTypes.string
      }).isRequired,
      breaks: ImmutablePropTypes.listOf(React.PropTypes.number).isRequired
    })
  ).isRequired,
  frame: ImmutablePropTypes.recordOf({
    file: React.PropTypes.string,
    line: React.PropTypes.number
  }),
  openFile: React.PropTypes.func.isRequired,
  closeFile: React.PropTypes.func.isRequired,
  fetchFile: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired
}

export default Sources

