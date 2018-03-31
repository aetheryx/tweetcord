const React = require('react');
const Hero = require('../components/Hero.jsx');

module.exports = class page2 extends React.Component {
  render () {
    console.log(this.props, this.constructor.name);

    return (
      <Hero title="page2" style={this.props.style}/>
    );
  }
};
