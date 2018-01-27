// const jobs = require(`${__dirname}/jobs`);

async function init () {

  // The only thing we needed intervals for were getting tweets over REST
  // now we're going to be streaming them, so intervals aren't needed anymore,
  // but the code will sit here until streaming is fully implemented

  // this.jobs = [];

  // for (const job in jobs) {
  //   jobs[job].func.call(this);
  //   const interval = setInterval(jobs[job].func.bind(this), jobs[job].interval);
  //   this.jobs.push(interval);
  // }
}

module.exports = init;