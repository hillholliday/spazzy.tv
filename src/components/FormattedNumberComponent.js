'use strict';

import React from 'react';

require('styles//FormattedNumber.scss');

class FormattedNumberComponent extends React.Component {
  addCommas(){
  	var original = this.props.number;
    var formatted = original.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  	return { __html: formatted };
  }
  render() {
    return (
      <span className="formattednumber-component" dangerouslySetInnerHTML={this.addCommas()}></span>
    );
  }
}

FormattedNumberComponent.displayName = 'FormattedNumberComponent';

// Uncomment properties you need
// FormattedNumberComponent.propTypes = {};
// FormattedNumberComponent.defaultProps = {};

export default FormattedNumberComponent;
