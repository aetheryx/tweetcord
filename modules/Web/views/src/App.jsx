const React = require('react');
const ReactDOM = require('react-dom');
const Navbar = require('./components/Navbar');
const Hero = require('./components/Hero');

class App extends React.Component {
  constructor () {
    super();

    this.state = {
      page: 'welcome'
    };
  }
  render () {
    return (
      <div>
        <Navbar />
        <Hero
          title="ass"
          subtitle="ass"
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
