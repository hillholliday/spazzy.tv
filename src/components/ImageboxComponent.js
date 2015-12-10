'use strict';

import React from 'react';

require('styles//Imagebox.scss');

class ImageboxComponent extends React.Component {
  render() {
    return (
      <div className="imagebox-component">
        <img src={this.props.imageURL} />
      </div>
    );
  }
}

ImageboxComponent.displayName = 'ImageboxComponent';

// Uncomment properties you need
// ImageboxComponent.propTypes = {};
// ImageboxComponent.defaultProps = {};

export default ImageboxComponent;
