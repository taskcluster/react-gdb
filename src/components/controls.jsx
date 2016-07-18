import React from 'react'

class Controls extends React.Component {
  render () {
    return (
      <div>
        <a href="#" onClick={this.props.next}>Next</a>|
        <a href="#" onClick={this.props.run}>Run</a>|
        <a href="#" onClick={this.props.continue}>Continue</a>|
        <a href="#" onClick={this.props.stepOut}>Step Out</a>|
        <a href="#" onClick={this.props.stepIn}>Step In</a>|
      </div>
    )
  }
}

Controls.propTypes = {
  next: React.PropTypes.func.isRequired,
  run: React.PropTypes.func.isRequired,
  continue: React.PropTypes.func.isRequired,
  stepOut: React.PropTypes.func.isRequired,
  stepIn: React.PropTypes.func.isRequired
}

export default Controls

