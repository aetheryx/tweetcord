/* global fetch */

const React = require('react');

module.exports = class Stats extends React.Component {
  constructor () {
    super();

    this.state = {
      stats: [
        [ 'Guilds',       'Loading...' ],
        [ 'Linked users', 'Loading...' ],
        [ 'Streams',      'Loading...' ]
      ]
    };
  }

  updateStats () {
    fetch('/stats')
      .then(res => res.json())
      .then(res =>
        this.setState({
          stats: Object.entries(res)
        })
      )
      .catch(err =>
        this.setState({
          stats: [ [ 'Something went wrong:', err.message || err ] ]
        })
      );
  }

  componentDidMount () {
    this.updateStats();
    setInterval(() => this.updateStats(), 30000);
  }

  render () {
    return (
      <div id="card">
        <table>
          <tbody>
            {this.state.stats.map(([key, value], index) => (
              <tr key={index}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};
