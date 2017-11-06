/**
 * Table displaying a summary of application statuses
 */
import React, {PropTypes} from 'react';
import {Table, Button} from 'react-bootstrap';
import {StatusColor, StatusTextColor} from './constants';
import _ from 'lodash';

const styles = {
  table: {
    paddingLeft: '15px',
    paddingRight: '15px'
  },
  tableWrapper: {
    width: '33.3%',
    paddingBottom: '30px'
  }
};

export default class SummaryTable extends React.Component {
  static propTypes = {
    caption: PropTypes.string.isRequired,
    data: PropTypes.object,
    path: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  tableBody() {
    return Object.keys(StatusColor).map((status, i) => {
      if (this.props.data.hasOwnProperty(status)) {
        return (
          <tr key={i}>
            <td style={{backgroundColor: StatusColor[status], color: StatusTextColor[status]}}>
              {_.upperFirst(status)}
            </td>
            <td>{this.props.data[status]}</td>
          </tr>
        );
      }
    });
  }

  handleViewClick = (event) => {
    event.preventDefault();
    this.context.router.push(`/${this.props.path}`);
  };

  render() {
    return (
      <div className="col-xs-4" style={styles.tableWrapper}>
        <Table striped condensed style={styles.table}>
          <caption>{this.props.caption}</caption>
          <thead>
            <tr>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.tableBody()}
          </tbody>
        </Table>
        <Button
          href={this.context.router.createHref(`/${this.props.path}`)}
          onClick={this.handleViewClick}
        >
          View all applications
        </Button>
      </div>
    );
  }
}
