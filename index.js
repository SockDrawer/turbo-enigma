//var config = require('./turbo.json');
var fs = require('mz/fs');

var turbo = {
    git:  require("git-promise"),
    shell: require("execute-shell-promise"),
    run: function (config) {
        function parseOutput(configItem, stdOut) {
            if (stdOut.indexOf("Already up-to-date") === -1) {
                bots = bots.concat(configItem.bots);
            }
        }
        
        if (config && config.repositories) {
            var bots = [];
            return Promise.all(config.repositories.map((item) => turbo.git("pull", (output) => parseOutput(item, output), {cwd: item.folder}))).then(() => {
                return Promise.all(bots.map((bot) => turbo.shell(`pm2 restart ${bot}`)));
            });
        }
        return Promise.resolve();
    }
};

module.exports = turbo;

/* istanbul ignore if */
if (require.main === module) {
    turbo.run(process.argv[2])
}