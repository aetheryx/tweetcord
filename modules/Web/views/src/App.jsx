const React = require('react');
const ReactDOM = require('react-dom');

const { Transition, TransitionGroup } = require('react-transition-group');

const duration = 200;
const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
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
          <Transition in={this.state.page === index} timeout={500} mountOnEnter unmountOnExit key={index}>
            {state => {
              return (
                <Page style={transitionStyles[state]} />
              );
            }}
          </Transition>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
