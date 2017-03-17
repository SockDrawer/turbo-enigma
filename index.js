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
            return Promise.all(config.repositories.map((item) => {
                console.log(`pulling ${item.folder}`);
                turbo.git("pull", (output) => parseOutput(item, output), {cwd: item.folder});
            })).then(() => {
                return Promise.all(bots.map((bot) => {
                    console.log(`updating ${bot}`);
                    turbo.shell(`pm2 restart ${bot}`);
                }));
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