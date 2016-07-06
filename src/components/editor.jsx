import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import AceEditor from 'react-ace'
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
      <AceEditor mode="c_cpp" theme="github" name="reactgdb-ace-editor"
        value={this.props.text}  readonly={true}
        markers={line ? [{ startRow: line, endRow: line + 1,
          className: 'reactgdb-ace-marker', type: 'background' }]}
        onGutterMouseDown={(e) => onLineClick(e.getDocumentPosition().row)}/>
    )
    let filler = <span>Loading, please wait</span>
    return this.props.text ? editor : filler
  }
}

Editor.propTypes = {
  line: React.propTypes.number
  text: React.propTypes.string,
  breaks: ImmutablePropTypes.listOf(React.propTypes.number).isRequired,
  visible: React.propTypes.bool.isRequired,
  fetchFile: React.propTypes.func.isRequired,
  addBreak: React.propTypes.func.isRequired
  removeBreak: React.propTypes.func.isRequired
}

export default Editor

