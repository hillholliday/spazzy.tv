'use strict';

import React from 'react';

require('styles//NavHeader.scss');

class NavHeaderComponent extends React.Component {
  render() {
    return (
      <header className="navheader-component">
        <div className="block">
        	<a href="/">
        		<span dangerouslySetInnertHTML={{ __html: '<svg class="icon icon-spazzy"><use xlink:href="#icon-spazzy"></use></svg>' }}></span>
        	</a>
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