'use strict';

import React from 'react';

require('styles//TwitchVideo.scss');

class TwitchVideoComponent extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		streamList: props.initialStreamList,
  		stream: props.initialStream,
  		count: props.streamCount
  	}
  }
  loadStreams(){
  	var clientId = 'idwl8g4zkgceb1yrcagtunmz0guz20j';
  	var that = this;
  	var streamList = null;
  	
  	Twitch.init({clientId: clientId}, function(error, status) {
		console.log('Twitch enabled');

		Twitch.api({method: 'beta/streams/random?limit=10&language=en', verb: 'GET'},function(error,list){
			streamList = list; 
			
			that.setState({
							streamList: streamList,
							stream: "http://twitch.tv/"+streamList.streams[0].channel.name+"/embed",
							count: that.state.count + 1
						});
		});
	});
	return;
  }
  loadVideo(){
  	this.setState({
		stream: "http://twitch.tv/"+this.state.streamList.streams[this.state.count].channel.name+"/embed",
		count: this.state.count + 1
	});
  }
  componentWillMount(){
  	this.loadStreams();
  }
  componentWillReceiveProps(){
  	this.loadStreams();
  }
  render() {
    return (
      <div className="twitchvideo-component">
      	<button onClick={this.loadVideo.bind(this)}>
      		Load another
      	</button>

        <iframe width="800" height="450" src={this.state.stream}></iframe>
      </div>
    );
  }
}

TwitchVideoComponent.displayName = 'TwitchVideoComponent';

// Uncomment properties you need
TwitchVideoComponent.propTypes = { 
									streamList: React.PropTypes.object,
									initialStream: React.PropTypes.string,
									streamCount: React.PropTypes.number
								};

TwitchVideoComponent.defaultProps = { 
									streamList: null,
									initialStream: null,
									streamCount: 0 
								};

export default TwitchVideoComponent;

