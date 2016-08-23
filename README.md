# GDB Frontend in React

The goal of this project is to provide a GUI for GDB in the browser so that other developers can use it to easily and intuitively debug projects running in a cloud environment. 

## Example
![Tickets](http://i.imgur.com/k96eCJT.gif)
Yep, there's not much beatiful UI out here right now. But at least it works :)

## Install
```
$ npm install react-gdb
```
:warning: Note, that `react-gdb` is still under development. Use to your own risk!

## Usage
```jsx
import React from 'react'
import { render } from 'react-dom'
import ReactGDB from 'react-gdb'

render(<ReactGDB {...props} />, document.getElementById('gdb'))
```

## API
|Prop|Description|
|-----|----------|
|process|Object representing the GDB/MI process|
|process.stdin|Node.js Writable stream|
|process.stdout|Node.js Readable stream|
|process.stderr|Node.js Readable stream|
|sourceProvider|Responsible for fetching the sources|
|sourceProvider.filter|Python RegExp, files that don't match it will be ignored|
|sourceProvider.fetch|Function that accepts the full path to a file and returns Promise that resolves with the source code|
|inferiorProvider|Node.js EventEmitter with the `fork` event that emits pids, then these processes are attached to debugging session (is needed for debugging multiple processes)|
|attachOnFork|Flag that disables `detach-on-fork` GDB/MI option (all `fork`'ed and `vfork`'ed processes will be attached automatically)|
|objfileFilter|`react-gdb` refreshes source files list every time new objfile is added (e.g. new target or `execl` call), but in order to avoid unnecessary refreshes it's recommended to provide the RegExp that filters new objfiles|

## Playing with examples
```
$ npm install
$ npm run docker-pull
$ npm run docker-run
$ npm start
$ npm run docker-rm
```
This will pull the image from Docker Hub, launch it in the new container, run WebSocket server that passes process streams to the client-side and build the example application. Open `http://localhost:8080/index.html` and play along. If you want to change the example that is being debugged, change the `let example = '<example>'` line in the `client.jsx`, save it and webpack will do all the rest.

## TODO
* Split components into smaller ones
* Style components, draw some nice UI
* Enable custom theming for CSS Modules
* Tests, tests, tests...
