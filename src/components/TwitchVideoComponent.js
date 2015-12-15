'use strict';

import React from 'react';

require('styles//TwitchVideo.scss');

var clientId = 't4ud6iil9usuoaf9ytm9kfpzgmo2fje';
var classNames = require('classnames');

class TwitchVideoComponent extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		streamList: props.initialStreamList,
  		count: props.streamCount,
  		loggedIn: false
  	}
  }
  loadStreams(){
  	var that = this;
  	
  	Twitch.init({clientId: clientId}, function(error, status) {
		Twitch.api({method: 'beta/streams/random?limit=10&language=en', verb: 'GET'},function(error,list){
			console.log(status);
			that.setState({
							streamList: list,
							count: that.state.count
						});
		});

		if(status.authenticated){
			that.setState({
				loggedIn: true
			});
		}
	});
	return;
  }
  signIn(){
  	Twitch.login({
      scope: ['user_read', 'channel_read']
    });
  }
  likeChannel(user,target){
  	Twitch.api({method:'users/'+user+'/follows/channels/'+target, verb: 'PUT'}, function(error, status){

  	});
  }
  loadVideo(){
  	this.setState({
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
  	// load the data initially
	if (!this.state.streamList) {
		return(
			<p>Loading</p>
		)
	}
	else{
		var current = this.state.streamList.streams[this.state.count];
		var playing = "";

		var stream = "http://twitch.tv/"+current.channel.name+"/embed";
		//var chat = "http://www.twitch.tv/"+current.channel.name+"/chat";
		var chat = "http://twitch.tv/chat/embed?channel="+current.channel.name;
		var status = current.channel.status
		var logo = current.channel.logo;

		var mainClass = classNames({
			'twitchvideo-component':true,
			'authenticated': this.state.loggedIn
		});
	    
	    if(current.game !== null){
	    	playing = "playing "+current.game;
	    }

	    return (
	      <div className={mainClass}>
				<div className="video">
					<header className="stream-details">
						<div className="header-group">
					  		<div className="logo-holder" style={{backgroundImage:'url('+ logo +')'}}>
					  		</div>
					  		<h1>{status}</h1>
					    	<h2><a href={current.channel.url}>{current.channel.display_name}</a> {playing} </h2>
						</div>
						<button onClick={this.loadVideo.bind(this)}>
							<span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-repeat"><use xlink:href="#icon-repeat"></use></svg>'} }></span>
							Load another
					  	</button>
					</header>
					<section className="video-holder" style={{backgroundImage:'url('+current.preview.large+')'}}>
						<iframe width="800" height="450" src={stream}></iframe>
					</section>
					<section className="video-details">
						<ul className="actions">
							<li>Follow</li>
							<li>Share</li>
						</ul>
						<ul className="stats">
							<li>Total Views: {current.channel.views}</li>
							<li>Followers: {current.channel.followers}</li>
						</ul>
					</section>
				</div>
				<div className="chat">
					<button onClick={this.signIn.bind(this)}>
						<span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-twitch"><use xlink:href="#icon-twitch"></use></svg>'} }></span>
						Connect with Twitch
					</button>
					<iframe src={chat}></iframe>
				</div>
	      </div>
	    );
	  }
	}
}

TwitchVideoComponent.displayName = 'TwitchVideoComponent';

// Uncomment properties you need
TwitchVideoComponent.propTypes = { 
									streamList: React.PropTypes.object,
									streamCount: React.PropTypes.number
								};

TwitchVideoComponent.defaultProps = { 
									streamList: null,
									streamCount: 0 
								};

export default TwitchVideoComponent;