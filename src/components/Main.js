require('styles/App.scss');

require("!script!../scripts/jquery-2.1.4.js");
require("!script!../scripts/twitch.js");
require("!script!../scripts/modernizr.js");

import React from 'react';

import TwitchVideo from './TwitchVideoComponent';


class AppComponent extends React.Component {
  render() {
    return (
    <div>
      <TwitchVideo/>
      <div className="not-available">
      	<div>
      		<span dangerouslySetInnerHTML={{ __html: '<svg class="icon icon-spazzy"><use xlink:href="#icon-spazzy"></use></svg>' }}></span>
      		<p>Sorry about this, but <a href="http://twitch.tv">Twitch’s</a> API doesn’t expose access to streams that work on your device.</p>
      		<p>Be sure to visit again on your desktop to experience Spazzy.</p>
      	</div>
      </div>
    </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;