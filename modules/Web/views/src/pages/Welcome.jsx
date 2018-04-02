const React = require('react');
const Hero = require('../components/Hero.jsx');
const Stats = require('../components/Stats.jsx');

module.exports = class Welcome extends React.Component {
  render () {
    return (
      <div>
        <Hero
          title="Welcome to Tweetcord's website."
          subtitle="More coming soon™. Meanwhile, have some statistics."
        />
        <Stats />
      </div>
    );
  }
};
