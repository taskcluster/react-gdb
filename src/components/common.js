import React from 'react'
import { Breakpoint, Thread, Frame, Variable, ThreadGroup } from 'gdb-js'
import ImmutablePropTypes from 'react-immutable-proptypes'

export const BreaksPropType = React.PropTypes.arrayOf(
  React.PropTypes.instanceOf(Breakpoint))
export const ThreadGroupPropType = React.PropTypes.instanceOf(ThreadGroup)
export const FramePropType = React.PropTypes.instanceOf(Frame)
export const VariablePropType = React.PropTypes.instanceOf(Variable)

export const ThreadPropType = ImmutablePropTypes.recordOf({
  thread: React.PropTypes.instanceOf(Thread),
  group: ThreadGroupPropType.isRequired,
  callstack: ImmutablePropTypes.listOf(FramePropType).isRequired,
  context: ImmutablePropTypes.listOf(VariablePropType).isRequired
})

export const FilesPropType = ImmutablePropTypes.orderedSetOf(
  ImmutablePropTypes.mapContains({
    path: React.PropTypes.string.isRequired,
    src: React.PropTypes.string,
    breaks: BreaksPropType.isRequired
  })
)

export const PositionPropType = ImmutablePropTypes.recordOf({
  file: React.PropTypes.string.isRequired,
  line: React.PropTypes.number
})
