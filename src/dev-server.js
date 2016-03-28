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
  console.log("Process started");
  debug('Process started');
  if(!fs.statSync(DOCKER_SOCKET).isSocket()){
    console.log("Docker is not running");
    throw new Error("Docker is not running");
  }
  //Set up the docker server
  docker = new Docker({socketPath:DOCKER_SOCKET});
  //await docker.pull('ubuntu');
  container = await docker.createContainer({
    Image:'gdb-test',
    cmd: ['sleep','infinity']
  });

  await container.start();
  console.log("Container started");
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
  http.createServer(app).listen(3000,()=>{
    console.log("http server started on port 3000");
    debug("http server started");
  });
  app.get('/path',(req,res)=>{
    return res.json({
      port: PORT,
      path: PATH
    });
  });

  return new Promise((resolve, reject)=>{
    dockerServer.on('exit',()=>{
      return resolve();
    });
    dockerServer.on('error',(error)=>{
      console.log(error);
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
  return;
}

var run = async ()=>{
  console.log("Starting dev-server PORT:"+PORT+" PATH:"+PATH);
  await start();
  await kill();
  return;
}
Promise.resolve(run());
