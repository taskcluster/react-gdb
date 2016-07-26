import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { BreaksPropType } from './common.js'
import AceEditor from './ace.jsx' // 'react-ace'
import 'brace/mode/c_cpp'
import 'brace/theme/github'

class Editor extends React.Component {
  componentDidMount () {
    if (!this.props.text) this.props.fetchFile()
  }

  onLineClick (line) {
    if (this.props.breaks.has(line)) {
      let id = this.props.breaks.findKey((b) => b.get('line') === line)
      this.props.removeBreak(id)
    } else {
      this.props.addBreak(line)
    }
  }

  render () {
    let { highlight, focus, text, breaks, visible } = this.props

    let editor = (
      // TODO: implement `focus` and `onGutterMouseDown` properties
      <div style={{ display: visible ? 'block' : 'none' }}>
        <AceEditor mode='c_cpp' theme='github' name='reactgdb-ace-editor'
          value={text} readonly focus={focus}
          markers={highlight ? [{ startRow: highlight, endRow: highlight + 1,
            className: 'reactgdb-ace-marker', type: 'background' }] : []}
          onGutterMouseDown={(e) => this.onLineClick(e.getDocumentPosition().row)} />
      </div>
    )
    let filler = <span>Loading, please wait...</span>

    return text ? editor : filler
  }
}

Editor.propTypes = {
  highlight: React.PropTypes.number,
  focus: React.PropTypes.number,
  text: React.PropTypes.string,
  breaks: BreaksPropType.isRequired,
  visible: React.PropTypes.bool.isRequired,
  fetchFile: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired
}

export default Editor

