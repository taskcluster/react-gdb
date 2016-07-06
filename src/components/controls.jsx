import React from 'react'

class Controls extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <a onClick={this.props.next}>Next</a>
      <a onClick={this.props.run}>Run</a>
      <a onClick={this.props.continue}>Continue</a>
      <a onClick={this.props.stepOut}>Step Out</a>
      <a onClick={this.props.stepIn}>Step In</a>
    )
  }
}

Controls.propTypes = {
  next: React.propTypes.func.isRequired,
  run: React.propTypes.func.isRequired,
  continue: React.propTypes.func.isRequired,
  stepOut: React.propTypes.func.isRequired,
  stepIn: React.propTypes.func.isRequired
}

export default Controls

