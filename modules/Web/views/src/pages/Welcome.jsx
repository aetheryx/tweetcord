const React = require('react');
const Hero = require('../components/Hero.jsx');
const stats = [
  [ 'Guild count   ', 300 ],
  [ 'Channel count ', 500 ],
  [ 'Linked users  ', 120 ],
  [ 'Streams count ', 90  ]
];

module.exports = class Welcome extends React.Component {
  render () {
    return (
      <div>
        <Hero
          title="Welcome to Tweetcord's website."
          subtitle="More coming soon™. Meanwhile, have some statistics."
          style={this.props.style}
        />
        <div id="card">
          <table>
            <tbody>
              {stats.map(([k, v], i) => (
                <tr key={i}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};
