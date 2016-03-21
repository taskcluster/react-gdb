import 'babel-polyfill';
import {DockerExecServer,DockerExecClient} from 'docker-exec-websocket-server';
import Docker from 'dockerode-promise';
import express from 'express';
import http from 'http';
import fs from 'fs';
import slugid from 'slugid';
import path from 'path';
import reactViews from 'express-react-views'

var debug = require('debug')('dev-server:');

const PORT = 34678;
const DOCKER_SOCKET = '/var/run/docker.sock'
const PATH = '/'+slugid.v4();

var dockerServer, container, docker,server,dockerClient;
//check if docker is running i.e socket is available
var start = async ()=>{
  debug('Process started');
  if(!fs.statSync(DOCKER_SOCKET).isSocket()){
    debug("Docker is not running");
    throw new Error("Docker is not running");
  }
  //Set up the docker server
  docker = new Docker({socketPath:DOCKER_SOCKET});
  await docker.pull('ubuntu');
  container = await docker.createContainer({
    Image:'gdb-test',
    cmd: ['sleep','600']
  });

  await container.start();
  debug("Container started");
  server = http.createServer();
  server.listen(PORT);
  debug("Server listening...")
  dockerServer = new DockerExecServer({
    server: server,
    containerId: container.id,
    path: PATH
  });
  debug("Docker server created");

  //set up express
  var app = express();
  app.set('views',__dirname+'client');
  app.set('view engine','jsx');
  app.engine('jsx',reactViews.createEngine());
  http.createServer(app).listen(3000,()=>{
    debug("http server started");
  });
  app.get('/',(req,res)=>{
    res.render('index',{url:"ws://localhost:"+PORT+PATH});
  });

  return new Promise(function(resolve, reject) {
    dockerServer.on('exit',()=>{
      return resolve();
    });
    dockerServer.on('error',()=>{
      return reject();
    });
  });
}

var kill = async ()=>{
  debug("Killing process");
  dockerClient.close();
  dockerServer.close();
  debug("Client and server closed");
  await container.remove({v:true,force:true});
  debug("Container removed");
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

var run = async ()=>{
  debug("Starting dev-server PORT:"+PORT+" PATH:"+PATH);
  await start();
  await kill();
  console.log("Killed");
  return new Promise(function(resolve, reject) {
    return resolve();
  });
}

run().then(()=>{process.exit()});
