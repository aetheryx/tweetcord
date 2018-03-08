function GenericCommand (props, { requiresLink, requiresTimeline, requiredArgs, commandFn }) {
  return Object.assign(props, {
    command: async function run (msg, args) {
      if (requiredArgs && !args[0]) {
        return requiredArgs;
      }

      const link = await this.db.getLink(msg.author.id);
      if (requiresLink && !link) {
        return `You haven't linked your Twitter account yet. Please do here: ${this.config.web.domain}/link`;
      }

      if (requiresLink && !requiresTimeline) {
        return commandFn.call(this, msg, args, link);
      }

      const timeline = await this.db.getTimeline(msg.author.id);
      if (requiresTimeline && !timeline) {
        return 'You currently do not have a stream.';
      }

      return commandFn.call(this, msg, args, link, timeline);
    }
  });
}

module.exports = GenericCommand;
