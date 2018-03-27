const { spawn, exec } = require('child_process');
const { readlink } = require('fs');
function spawnInstance () {
  const bash = spawn(this.config.dev ? 'zsh' : 'bash'); // Spawning `bash` on my dev machine, which runs zsh as default shell, causes issues for some reason
  const identifier = this.utils.randomString(16);

  let PS1;

  const updatePS1 = () => new Promise((resolve, reject) => {
    readlink(`/proc/${bash.pid}/cwd`, (err, cwd) => {
      if (err) {
        reject(err);
      }
      PS1 = `[${cwd.replace(`/home/${process.env.USER}`, '~')}]λ`;
      resolve();
    });
  });

  const runCommand = (command) => {
    return new Promise(async (resolve, reject) => {
      bash.stdout.removeAllListeners('data');
      bash.stderr.removeAllListeners('data');

      let data = Buffer.alloc(0);

      const parseData = (chunk, overrideIdentifier = false) => {
        const args = [ data, chunk ];
        if (overrideIdentifier) {
          args.push(Buffer.from(chunk));
        }

        data = Buffer.concat(args);

        if (data.includes(identifier) || overrideIdentifier) {
          updatePS1().then(() =>
            resolve(`${PS1} ${command}\n${String(data).split('\n').slice(0, -2).join('\n')}`)
          );
        }
      };
      bash.stdout.on('data', parseData);
      bash.stderr.on('data', (c) => parseData(c, true));
      bash.on('close', () => resolve('Successfully exited.'));

      // The reason we echo the identifier afterwards is for commands that don't have stderr or stdout
      // This way, the executed command will have a stdout regardless, which we *can* detect
      bash.stdin.write(`${command} && echo ${identifier}\n`);
    });
  };

  return runCommand;
}

async function execCommand (msg, args) {
  if (args[0]) {
    return exec(args.join(' '), async (e, stdout, stderr) => {
      if (!stderr && !stdout) {
        msg.addReaction('\u2611');
      } else {
        this.bot.sendMessage(msg.channel.id, `${stdout ? `Info: \`\`\`\n${stdout}\n\`\`\`` : ''}\n${stderr ? `Errors: \`\`\`\n${stderr}\`\`\`` : ''}`);
      }
    });
  }

  const run = spawnInstance.call(this);

  const runCommand = async () => {
    const commandMsg = await this.bot.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 120e3);
    if (!commandMsg) {
      return this.bot.sendMessage(msg.channel.id, 'Timed out, automatically exiting instance...');
    }

    let result = await run(commandMsg.content);
    result = this.misc.redact(
      result
        .replace(/`/g, '\u200b`')
        .replace(/\u001b\[.*?m/g, '') // eslint-disable-line no-control-regex
    );
    if (result.length > 1980) {
      // If it's over the 2k char limit, we break off the result, pop the last line and close off
      result = result.slice(0, 1980).split('\n');
      result.pop();
      result = result.join('\n') + '\n\n...';
    }

    this.bot.sendMessage(msg.channel.id, '```\n' + result + '\n```');
    runCommand();
  };

  runCommand();
  return 'Bash instance successfully spawned.';
}

module.exports = {
  command: execCommand,
  name: 'exec',
  usage: '{command} [command]',
  ownerOnly: true,
  description: 'Bot owner only.'
};
