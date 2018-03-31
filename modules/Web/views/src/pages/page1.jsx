const React = require('react');
const Hero = require('../components/Hero.jsx');

module.exports = class page1 extends React.Component {
  render () {
    console.log(this.props, this.constructor.name);

    return (
      <Hero title="page1" style={this.props.style}/>
    );
  }
};
