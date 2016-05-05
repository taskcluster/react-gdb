GDB Frontend in React.js
========================

**Work in progress**

Things to do:

 - [x] Minimalistic test server
 - [ ] Build a proper wrapper around gdb/mi
 - [ ] Automated testing for the gdb/mi library
 - [ ] Setup webpack to build things
 - [ ] Configure UI with react-redux

# Notes
* To run the demo server you need to build an image from `/demo/Dockerfile` and run it in `gdb-examples` container. I'll simplify this step later (with `docker.pull`, etc.).
* This package depends on the packages from `/modules` which are not published yet. So, you should `npm link` them. (Maybe it's better to automate this with npm scripts?)
* This is a npm package without an entry point, it provides static assets, thus it has no dependencies. It has 3 abstractions: the first one is providing stdin/stdout/stderr streams when given a link (ws-exec now), the second is accepting these streams and maintains a consistent gdb state within it (gdb-state now) and the third one is a react app which maintains an UI state and using the interface of the second abstraction. It should be easy to swap any of these abstractions (this is one of the core ideas).
* What's ready: environment setup, simple test server & client: 
![Example](http://i.imgur.com/A8aksC3.png "Example")
