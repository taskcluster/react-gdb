import React from 'react'
let DockerClient = require('docker-exec-websocket-server').DockerExecClient;

export class mainComp extends React.Component {
  constructor() {
    super();
    this.client = null;
  }

  render(){
    return <div><ul>{
      forEach(this.state.output, (op)=>{
        return <li><p>op</p></li>;
      })
    }</ul><br/>
    <button onclick={this.list}>List</button><br/>
    <button onclick= {this.run}>Run</button><br/>
    <button onclick={this.kill}>Kill</button><br/></div>;
  }

  getInitialState(){
    return {
      output: []
    }
  }

  componentWillMount(){
    this.client = new DockerClient({
      url: this.props.url,
      tty: false,
      command: ['gdb','-q','hello']
    });
  }

  componentDidMount(){
    this.client.stdout.on('data',(data)=>{
      this.setState({output: this.state.output.concat(data)});
    });
    this.client.stdout.on('error',()=>{
      this.kill();
    })
  }

  kill(){
    this.client.close();
  }

  list(){
    this.client.stdin.write("list\n");
  }

  run(){
    this.client.stdin.write("run\n");
  }
}
