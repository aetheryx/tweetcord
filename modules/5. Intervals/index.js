const jobs = require(`${__dirname}/jobs`);

async function init () {
  for (const job in jobs) {
    jobs[job].func.call(this);
    setInterval(jobs[job].func.bind(this), jobs[job].interval);
  }
}

module.exports = init;