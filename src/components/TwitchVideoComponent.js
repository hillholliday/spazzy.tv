'use strict';

import React from 'react';
import FormattedNumber from './FormattedNumberComponent';

require('styles//TwitchVideo.scss');

var clientId = 't4ud6iil9usuoaf9ytm9kfpzgmo2fje';
var classNames = require('classnames');

class TwitchVideoComponent extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		streamList: props.initialStreamList,
  		count: props.streamCount,
  		loggedIn: false,
  		currentUser: null,
  		accessToken: null
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
				loggedIn: true,
				accessToken: status.token
			});
			Twitch.api({method: 'user', verb: 'GET'}, function(error,user){
				that.setState({
					currentUser: user.name
				});
			});
		}
	});
	return;
  }
  signIn(){
  	Twitch.login({
      scope: ['user_read', 'channel_read','user_follows_edit']
    });
  }
  likeChannel(){
  	var user = this.state.currentUser;
  	var target = this.state.streamList.streams[this.state.count].channel.name; 
  	var token = this.state.accessToken;
  	console.log('users/'+user+'/follows/channels/'+target+'?access_token='+token);
  	Twitch.api({method:'users/'+user+'/follows/channels/'+target, verb: 'PUT'}, function(error, status){
  		if(error === null){
  			$('button.follow').hide();
  			$('button.unfollow').show();
  		}
  	});
  }
  dislikeChannel(){
  	var user = this.state.currentUser;
  	var target = this.state.streamList.streams[this.state.count].channel.name; 
  	var token = this.state.accessToken;
  	console.log('users/'+user+'/follows/channels/'+target+'?access_token='+token);
  	Twitch.api({method:'users/'+user+'/follows/channels/'+target, verb: 'DELETE'}, function(error, status){
  		if(error === null){
  			$('button.follow').show();
  			$('button.unfollow').hide();
  		}
  	});
  }
  loadVideo(){
  	this.setState({
		count: this.state.count + 1
	});
	$('button.follow').show();
	$('button.unfollow').hide();
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
	// load the app into place
	else{
		var current = this.state.streamList.streams[this.state.count];
		var playing = "";
	    
	    if(current.game !== null){
	    	playing = "playing "+current.game;
	    }

	    var stream = "http://twitch.tv/"+current.channel.name+"/embed";
		var chat = "http://twitch.tv/chat/embed?channel="+current.channel.name;
		var status = current.channel.status
		var logo = current.channel.logo;

		var views = (current.channel.views);
		var followers = (current.channel.followers);

		var mainClass = classNames({
			'twitchvideo-component':true,
			'authenticated': this.state.loggedIn
		});

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
							<li>
								<button className="follow" onClick={this.likeChannel.bind(this)}>
									<span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-heart"><use xlink:href="#icon-heart"></use></svg>'} }></span> Follow
								</button>
								<button className="unfollow" onClick={this.dislikeChannel.bind(this)}>
									<span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-heart"><use xlink:href="#icon-heart"></use></svg>'} }></span>
								</button>
							</li>
							<li>
								<label>Share</label>
								<ul className="drop-down">
									<li>Facebook</li>
									<li>Twitter</li>
								</ul>
							</li>
						</ul>
						<ul className="stats">
							<li><span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-eye"><use xlink:href="#icon-eye"></use></svg>'} }></span><FormattedNumber number={views}/></li>
							<li><span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-heart"><use xlink:href="#icon-heart"></use></svg>'} }></span><FormattedNumber number={followers}/></li>
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