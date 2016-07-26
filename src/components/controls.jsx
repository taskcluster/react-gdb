import React from 'react'

class Controls extends React.Component {
  render () {
    let { proceed, interrupt, next, stepIn,
      status, stepOut } = this.props
    let flowButton = status === 'running'
      ? <a href="#" onClick={interrupt}>Pause</a>
      : <a href="#" onClick={proceed}>{status === 'idle' ? 'Run' : 'Continue'}</a>
    return (
      <div>
        {flowButton}|
        <a href="#" onClick={next}>Next</a>|
        <a href="#" onClick={stepOut}>Step Out</a>|
        <a href="#" onClick={stepIn}>Step In</a>|
      </div>
    )
  }
}

Controls.propTypes = {
  next: React.PropTypes.func.isRequired,
  interrupt: React.PropTypes.func.isRequired,
  proceed: React.PropTypes.func.isRequired,
  stepOut: React.PropTypes.func.isRequired,
  stepIn: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired
}

export default Controls

