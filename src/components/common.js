import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

export const BreaksPropType = ImmutablePropTypes.mapOf(
  ImmutablePropTypes.recordOf({
    file: React.PropTypes.string.isRequired,
    thread: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
    ]).isRequired,
    line: React.PropTypes.number.isRequired
  })
)

export const FilesPropType = ImmutablePropTypes.orderedSetOf(
  ImmutablePropTypes.mapContains({
    fullname: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    src: React.PropTypes.string,
    breaks: BreaksPropType.isRequired
  })
)

export const FramePropType= ImmutablePropTypes.recordOf({
  file: React.PropTypes.string.isRequired,
  line: React.PropTypes.number.isRequired
})
