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
    </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;