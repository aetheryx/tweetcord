const React = require('react');
const ReactDOM = require('react-dom');
const Navbar = require('./components/Navbar');
const Hero = require('./components/Hero');

const pages = require('./pages');

class App extends React.Component {
  constructor () {
    super();

    this.state = {
      page: 'contact',
      unloading: false
    };
  }

  componentDidUnmount () {
    this.setState({
      unloading: true
    });

    setTimeout(() => {
      this.setState({
        unloading: false
      });
    }, 1000);
  }

  goto (page) {
    return () => this.setState({ page });
  }

  render () {
    const Page = pages[this.state.page];

    return (
      <div style={this.state.unloading ? { backgroundColor: 'red' } : {}}>
        <Navbar
          goto={this.goto.bind(this)}
        />
        <Page />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
