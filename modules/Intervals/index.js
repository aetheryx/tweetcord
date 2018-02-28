const jobs = require(`${__dirname}/jobs`);

module.exports = {
  order: 7,
  func: async function startIntervals () {
    this.jobs = [];

    for (const job in jobs) {
      jobs[job].func.call(this);
      const interval = setInterval(jobs[job].func.bind(this), jobs[job].interval);
      this.jobs.push(interval);
    }
  }
};
