//var config = require('./turbo.json');
var fs = require('mz/fs');
var debug = require('debug')('sockbot:turbo-enigma');

var turbo = {
    git:  require("git-promise"),
    shell: require("execute-shell-promise"),
    run: function (config) {
        function parseOutput(configItem, stdOut) {
            if (stdOut.indexOf("Already up-to-date") === -1) {
                debug(`Updating bots for ${configItem.folder}`);
                bots = bots.concat(configItem.bots);
            } else {
                debug(`${configItem.folder} is up to date`);
            }
        }
        
        if (config && config.repositories) {
            var bots = [];
            return Promise.all(config.repositories.map((item) => {
                debug(`pulling ${item.folder}`);
                turbo.git("pull", {cwd: item.folder}, (output) => parseOutput(item, output));
            })).then(() => {
                return Promise.all(bots.map((bot) => {
                    debug(`updating ${bot}`);
                    turbo.shell(`pm2 restart ${bot}`);
                }));
            }).catch((err) => {
                debug('error occurred');
                debug(err);
            });
        } else {
            console.log("no config");
            return Promise.resolve();
        }
       
    }
};

module.exports = turbo;

/* istanbul ignore if */
if (require.main === module) {
    turbo.run(JSON.parse(fs.readFileSync(process.argv[2], 'utf-8')));
}