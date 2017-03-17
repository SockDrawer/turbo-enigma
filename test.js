'use strict'
var Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));
var sinon = require('sinon');
require('sinon-as-promised');

describe('Functionality', function() {
    let oot = require('./index.js');
    let sandbox;
    
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    
    afterEach(function () {
        sandbox.restore();
    });
    
    
    it("Should export a run function", () => {
        return oot.run.should.be.a('function');
    });
    
    it("Should return a promise", () => {
        return oot.run().should.be.a('promise');
    });
    
    it("Should do a git update", () => {
        sandbox.stub(oot, "git").resolves();
        return oot.run({
            "repositories": [
                {
                    "folder": "/home/sockbot/sockMafia",
                    bots: []
                }
            ]
        }).then(() => oot.git.should.have.been.calledWith("pull", {cwd: "/home/sockbot/sockMafia"}));
    });
    
    it("Should do a git update for each folder", () => {
        sandbox.stub(oot, "git").resolves();
        return oot.run({
            "repositories": [
                {
                    "folder":"/home/sockbot/sockMafia",
                    "bots": []
                },
                {
                    "folder":"/home/sockbot/sockMafia-autoGM",
                    "bots": []
                }
            ]
        }).then(() => oot.git.should.have.been.calledWith("pull", {cwd: "/home/sockbot/sockMafia-autoGM"}));
    });
    
    it("Should call out to pm2", () => {
        sandbox.stub(oot, "git").yields("Something other than the magic words");
        sandbox.stub(oot, "shell").resolves();
        return oot.run({
            "repositories": [
                {
                    "folder":"/home/sockbot/sockMafia",
                    "bots": ['voteBot']
                }
            ]
        }).then(() => oot.shell.should.have.been.calledWith("pm2 restart voteBot"));
    });
    
    it("Should call out to pm2 for multiple bots", () => {
        sandbox.stub(oot, "git").yields("Something other than the magic words");
        sandbox.stub(oot, "shell").resolves();
        return oot.run({
            "repositories": [
                {
                    "folder":"/home/sockbot/sockMafia",
                    "bots": ['voteBot', 'yamiBot']
                }
            ]
        }).then(() => oot.shell.should.have.been.calledWith("pm2 restart voteBot"))
        .then(() => oot.shell.should.have.been.calledWith("pm2 restart yamiBot"));
    });
    
    it("Should not call out with nothing to do", () => {
        sandbox.stub(oot, "git").yields("Some stuff and then Already up-to-date");
        sandbox.stub(oot, "shell").resolves();
        return oot.run({
            "repositories": [
                {
                    "folder":"/home/sockbot/sockMafia",
                    "bots": ['voteBot']
                }
            ]
        }).then(() => oot.shell.should.not.have.been.calledWith("pm2 restart voteBot"));
    });
});