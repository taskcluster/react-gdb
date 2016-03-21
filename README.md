GDB Frontend in React.js
========================

**Work in progress**

Things to do:

 - [x] Minimalistic test server
 - [ ] Build a proper wrapper around gdb/mi
 - [ ] Automated testing for the gdb/mi library
 - [ ] Setup webpack to build things
 - [ ] Configure UI with react-redux


**How to build**
- run `npm install`
- run `docker build -t gdb-test .` on Dockerfile-0
- run `docker build -t gdb-test .` on Dockerfile
- run `npm start`
- debugger at `localhost:3000` 
