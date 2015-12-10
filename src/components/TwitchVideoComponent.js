'use strict';

import React from 'react';

require('styles//TwitchVideo.scss');

class TwitchVideoComponent extends React.Component {
  constructor(props){
  	super(props);
  	this.state = { 
  		stream: props.initialStream,
  		count: props.streamCount
  	}
  }
  loadVideo(){
  	var clientId = 'idwl8g4zkgceb1yrcagtunmz0guz20j';
  	var that = this;
  	var streamList = null;

  	Twitch.init({clientId: clientId}, function(error, status) {
		console.log('Twitch enabled');

		Twitch.api({method: 'beta/streams/random?limit=10&language=en', verb: 'GET'},function(error,list){
			streamList = list; 
			var src = list.streams[that.state.count].channel.name;
			that.setState({
							stream: "http://twitch.tv/"+src+"/embed",
							count: that.state.count + 1
						});
		});
	});
	return;
  }
  componentWillMount(){
  	this.loadVideo();
  }
  componentWillReceiveProps(){
  	this.loadVideo();
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
									initialStream: React.PropTypes.string,
									streamCount: React.PropTypes.number
								};

TwitchVideoComponent.defaultProps = { 
									initialStream: null,
									streamCount: 0 
								};

export default TwitchVideoComponent;

