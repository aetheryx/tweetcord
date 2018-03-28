const React = require('react');

module.exports = class Navbar extends React.Component {
  render () {
    return (
      <div className="navbar is-mobile is-fixed-top has-text-white-bis">
        <div className="navbar-brand">
          <a className="navbar-item" href="/" >
            <img src="https://cdn.discordapp.com/avatars/302864271383986176/dcf91fa624871c66ea779210fb6fce2f.png?size=2048" width="28px" height="28px" />
          </a>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item" href="/contact">
              Contact
            </a>

            <a className="navbar-item" href="/contact">
              page 1
            </a>


            <a className="navbar-item" href="/contact">
              page 2
            </a>


            <a className="navbar-item" href="/contact">
              page 3
            </a>



          </div>
        </div>
      </div>
    );
  }
};
