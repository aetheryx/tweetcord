const React = require('react');

class Hero extends React.Component {
  render () {
    const hero = (
      <div style={this.props.style}>
        <section className="hero" style={{ display: 'flex', width: '100%', backgroundColor: '#5aa7d1', color: 'white' }}>

          <div className="hero-body" style={{ padding: '24px' }}>
            <div className="container">
              <h1 className="title is-primary">
                {this.props.title}
              </h1>
              {this.props.subtitle &&
                <h2 className="subtitle">
                  {this.props.subtitle}
                </h2>
              }
            </div>
          </div>
        </section>
      </div>
    );

    if (this.props.href) {
      return (
        <a href={this.props.href}>
          <hero />
        </a>
      );
    } else {
      return hero;
    }
  }
}

module.exports = Hero;
