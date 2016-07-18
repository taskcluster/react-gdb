import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import AceEditor from './ace.jsx' // 'react-ace'
import 'brace/mode/c_cpp'
import 'brace/theme/github'

class Editor extends React.Component {
  constructor (props) {
    super(props)
    if (!this.props.text) this.props.fetchFile()
  }

  onLineClick (line) {
    if (this.props.breaks.has(line)) {
      this.props.removeBreak(line)
    } else {
      this.props.addBreak(line)
    }
  }

  render () {
    let line = this.props.line
    let editor = (
      <AceEditor mode='c_cpp' theme='github' name='reactgdb-ace-editor'
        value={this.props.text} readonly
        markers={line ? [{ startRow: line, endRow: line + 1,
          className: 'reactgdb-ace-marker', type: 'background' }] : []}
        onGutterMouseDown={(e) => this.onLineClick(e.getDocumentPosition().row)} />
    )
    let filler = <span>Loading, please wait</span>
    return this.props.text ? editor : filler
  }
}

Editor.propTypes = {
  line: React.PropTypes.number,
  text: React.PropTypes.string,
  breaks: ImmutablePropTypes.listOf(React.PropTypes.number).isRequired,
  visible: React.PropTypes.bool.isRequired,
  fetchFile: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired
}

export default Editor

