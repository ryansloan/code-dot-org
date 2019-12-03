import PropTypes from 'prop-types';
import React from 'react';
import Dialog, {Body} from '@cdo/apps/templates/Dialog';

export default class NameFailureDialog extends React.Component {
  static propTypes = {
    flaggedText: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
  };

  render() {
    return (
      <Dialog
        title="Unable to rename project"
        isOpen={this.props.isOpen}
        handleClose={this.props.handleClose}
      >
        <Body>
          <p>
            It appears that your project name contains inappropriate language or
            personally identifiable information like your address, email, or
            phone number. Please pick a new name that doesn't contain "
            {this.props.flaggedText}."
          </p>
        </Body>
      </Dialog>
    );
  }
}
