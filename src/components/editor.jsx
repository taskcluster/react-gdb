import React from 'react'
import { BreaksPropType } from './common.js'
import AceEditor from './ace.jsx' // 'react-ace'
import 'brace/mode/c_cpp'
import 'brace/theme/github'

class Editor extends React.Component {
  onLineClick (line) {
    let { breaks } = this.props

    let breakpoint = breaks.find((b) => b.line === line)
    if (breakpoint) {
      this.props.removeBreak(breakpoint)
    } else {
      this.props.addBreak(line)
    }
  }

  render () {
    let { highlight, position, text, breaks, file } = this.props

    return (
      <AceEditor mode='c_cpp' theme='github' name={'reactgdb-ace-editor-' + file}
        value={text} readonly={true} line={position}
        markers={highlight ? [{ startRow: highlight, endRow: highlight + 1,
          className: 'reactgdb-ace-marker', type: 'background' }] : []}
        onGutterMouseDown={(e) => this.onLineClick(e.getDocumentPosition().row)} />
    )
  }
}

Editor.propTypes = {
  file: React.PropTypes.string.isRequired,
  highlight: React.PropTypes.number,
  position: React.PropTypes.number,
  text: React.PropTypes.string,
  breaks: BreaksPropType.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired
}

export default Editor

