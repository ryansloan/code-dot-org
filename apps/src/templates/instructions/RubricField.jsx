import React, {Component} from 'react';
import PropTypes from 'prop-types';
import color from '@cdo/apps/util/color';
import Radium from 'radium';
import {CheckRadioButton} from '../../lib/ui/CheckedRadioButton';

const styles = {
  detailsArea: {
    width: '100%'
  },
  rubricHeader: {
    fontSize: 13,
    marginLeft: 10,
    color: color.black,
    fontFamily: '"Gotham 5r", sans-serif'
  },
  performanceLevelHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: '4px 10px',
    ':hover': {
      //hover doesn't work when you inject string instead of concat
      border: 'solid 1px' + color.light_cyan,
      borderRadius: 10
    }
  },
  performanceLevelHeaderSelected: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: color.lightest_cyan,
    borderRadius: 10,
    padding: '4px 10px',
    ':hover': {
      //hover doesn't work when you inject string instead of concat
      border: 'solid 1px' + color.light_cyan,
      borderRadius: 10
    }
  }
};

const rubricLevelHeaders = {
  exceeds: 'Exceeds',
  meets: 'Meets',
  approaches: 'Approaches',
  noEvidence: 'No Evidence'
};

class RubricField extends Component {
  static propTypes = {
    showFeedbackInputAreas: PropTypes.bool,
    rubricLevel: PropTypes.oneOf(Object.keys(rubricLevelHeaders)).isRequired,
    rubricValue: PropTypes.string.isRequired,
    disabledMode: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    currentlyChecked: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.handleRubricChange = this.handleRubricChange.bind(this);
  }

  handleRubricChange = value => {
    this.props.onChange(value);
  };

  render() {
    const performanceHeaderStyle = this.props.currentlyChecked
      ? styles.performanceLevelHeaderSelected
      : styles.performanceLevelHeader;
    return (
      <div style={performanceHeaderStyle}>
        {this.props.showFeedbackInputAreas && (
          <CheckRadioButton
            //Concatenate because injecting the string seems to result in all of
            //the input elements having the same id
            id={'rubric-input-' + this.props.rubricLevel}
            value={this.props.rubricLevel}
            checked={this.props.currentlyChecked}
            onRadioButtonChange={this.handleRubricChange}
            disabledMode={this.props.disabledMode}
          />
        )}
        <details style={styles.detailsArea}>
          <summary style={styles.rubricHeader}>
            {rubricLevelHeaders[this.props.rubricLevel]}
          </summary>
          <p>{this.props.rubricValue}</p>
        </details>
      </div>
    );
  }
}

export default Radium(RubricField);
