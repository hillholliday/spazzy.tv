'use strict';

import React from 'react';
import NavHeader from './NavHeaderComponent';
import FormattedNumber from './FormattedNumberComponent';

require('styles//TwitchVideo.scss');

var clientId;
var classNames = require('classnames');

var config = require('config');

if(config.default.appEnv == "dev"){
	clientId = 't4ud6iil9usuoaf9ytm9kfpzgmo2fje'; 
}
else if(config.default.appEnv == "staging"){
	clientId = 'qr2qjns8zpj7foayffst9z0wspnbymm';
}
else if(config.default.appEnv == "dist"){
	clientId = 'qr2qjns8zpj7foayffst9z0wspnbymm';
}

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
  	
  	console.log("environment: " + config.default.appEnv + " | client ID: " + clientId);

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
	if(this.state.loggedIn){
		$('button.follow').show();
		$('button.unfollow').hide();
	}
  }
  openShare(){
  	$('li.share-box').toggleClass('open');
  }
  openShareBox(url, height, width){
  	newwindow=window.open(url,'name','height='+height+',width='+width);
    if (window.focus) {newwindow.focus();}
    return false;
  }
  openFacebook(){
  	var channelName = this.state.streamList.streams[this.state.count].channel.name
  	this.openShareBox('https://www.facebook.com/sharer/sharer.php?u=http://twitch.tv/'+channelName,400,600);
  }
  openTwitter(){
  	var channelName = this.state.streamList.streams[this.state.count].channel.name
  	var url = 'https://twitter.com/intent/tweet?status=I found '+channelName+'(http://twitch.com/'+channelName+') on Roulette.tv! Find more streamers here: http://roulette.tv';
  	this.openShareBox(url,400,600);
  }
  closeModal(){
  	$('body').toggleClass('modal-open');
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
			<div className="loading-screen">				
				<div className="pacman">
				   <div className="body"></div>
				   <div className="mouth"></div>
				   <div className="dot"></div>
				</div>
				<p>now loading</p>
			</div>
		)
	}
	// load the app into place
	else{
		var current = this.state.streamList.streams[this.state.count];
		var playing = "";
	    
	    if(current.game !== null){
	    	playing = 'playing ' + current.game;
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

		var aboutClass = classNames({
			'about':true,
			'modal':true
		});

	    return (
	      <div className={mainClass}>
	      		<NavHeader/>
	      		<div className={aboutClass}>
	      			<div>
	      				<button className="close" onClick={this.closeModal.bind(this)}>Close Modal</button>
						<h2>About this app</h2>
						<p>This app was built using <a href="https://github.com/justintv/twitch-js-sdk">Twitch’s own developer API</a> to help viewers find new and interesting streams through rng (random number generator).</p>
						<p>Connect your own Twitch account through Spazzy to chat with other gamers, and follow them from right within the app.</p>
						<p>The app was built using <a href="https://facebook.github.io/react/">React</a> and <a href="https://webpack.github.io/">Webpack</a>. You can check out the <a href="https://github.com/hillholliday/spazzy.tv">sourcecode for the project</a> as well. If you discover any bugs, let us know by sending us a <a href="mailto:rob@roberskine.com?subject=Spazzy.tv Feedback">note</a> or <a href="https://github.com/hillholliday/spazzy.tv/issues/new">submitting</a> an issue on github.</p>
						<p>If you got any enjoyment out of this app, feel free to let the developer know! (<a href="http://twitter.com/erskinerob">twitter</a>) (<a href="http://twitch.tv/swy13">twitch</a>)</p>
					</div>
				</div>
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
							<li className="share-box">
								<button className="share" onClick={this.openShare.bind(this)}>Share</button>
								<ul className="drop-down">
									<li>
										<button className="facebook" onClick={this.openFacebook.bind(this)}>
											<span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-facebook"><use xlink:href="#icon-facebook"></use></svg>'} }></span>
											facebook
										</button>
									</li>
									<li>
										<button className="twitter" onClick={this.openTwitter.bind(this)}>
											<span dangerouslySetInnerHTML={ {__html: '<svg class="icon icon-twitter"><use xlink:href="#icon-twitter"></use></svg>'} }></span>
											twitter
										</button>
									</li>
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