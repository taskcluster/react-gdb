import React from 'react'
import { BreaksPropType } from './common.js'
import AceEditor from './ace.jsx' // 'react-ace'
import 'brace/mode/c_cpp'
import 'brace/theme/github'
import styles from './editor.css'

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

    // Line to highlight (where the current thread is).
    let line = { startRow: highlight - 1, startCol: 0, endRow: highlight, endCol: 0,
      className: styles['reactgdb-ace-marker'], type: 'background' }

    return (
      <AceEditor mode='c_cpp' theme='github' name={'reactgdb-ace-editor-' + file}
        value={text} readOnly scrollToLine={position} width="700px" height="600px"
        breaks={breaks.map((b) => b.line - 1)} markers={highlight ? [line] : []}
        onGutterMouseDown={(e) => this.onLineClick(e.getDocumentPosition().row + 1)} />
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

