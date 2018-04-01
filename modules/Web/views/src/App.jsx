const React = require('react');
const ReactDOM = require('react-dom');

const { Transition } = require('react-transition-group');

const transitionStyles = {
  entering: { opacity: 0, transition: 'opacity 1s' },
  entered: { opacity: 1, transition: 'opacity 1s' },
  exiting: { opacity: 0, transition: 'opacity 1s' },
  exited: { opacity: 0, transition: 'opacity 1s' }
};

const Navbar = require('./components/Navbar.jsx');
const pages = require('./pages');

class App extends React.Component {
  constructor () {
    super();

    this.state = {
      page: 0
    };
  }

  goto (page) {
    return () => this.setState({ page });
  }

  render () {
    return (
      <div className="fadeIn">
        <Navbar goto={this.goto.bind(this)} />
        {pages.map((Page, index) => (
          <Transition in={this.state.page === index} timeout={500} mountOnEnter unmountOnExit key={index} className="page">
            {state => {
              return (
                <div className="page">
                  <Page style={transitionStyles[state]} />
                </div>
              );
            }}
          </Transition>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
