'use strict';

import React from 'react';

require('styles//NavHeader.scss');

class NavHeaderComponent extends React.Component {
  openAboutModal(){
  	$('body').toggleClass('modal-open');
  }
  render() {
    return (
      <header className="navheader-component">
        <div className="block">
        	<div className="logo">
	        	<a href="/">
	        		<span dangerouslySetInnerHTML={{ __html: '<svg class="icon icon-spazzy"><use xlink:href="#icon-spazzy"></use></svg>' }}></span>
	        	</a>
	        	<p>finding new streamers through rng</p>
	        </div>
	        <nav className="stream-nav">
	        	<ul>
	        		<li>
	        			<button onClick={this.openAboutModal.bind(this)} className="nav-button">
	        				About
	        			</button>
	        		</li>
	        		<li>
	        			<button title="feature coming soon" className="nav-button disabled">
	        				Select Games
	        				<span className="tooltip below">Feature coming soon</span>
	        			</button>
	        		</li>
	        	</ul>
	        </nav>
        </div>
      </header>
    );
  }
}

NavHeaderComponent.displayName = 'NavHeaderComponent';

// Uncomment properties you need
// NavHeaderComponent.propTypes = {};
// NavHeaderComponent.defaultProps = {};

export default NavHeaderComponent;