const React = require('react');
// display: flex;
// height: 50vh;
// overflow: hidden;
// align-items: center;


class Hero extends React.Component {
  render () {
    const hero = (
      <div className="fadeIn" style={{ display: 'flex', height: '50vh', overflow: 'hidden', alignItems: 'center' }}>
        <section className={`hero ${this.props.class || 'is-primary'}`} style={{ display: 'flex', width: '100%' }}>
          <div className="hero-body" style={{ padding: '40px;' }}>
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
