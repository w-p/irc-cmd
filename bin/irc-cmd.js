#! /usr/bin/env node

var cmd = require('commander');
var irccmd = require('irc-cmd');


cmd.version('0.1.4')
    .option('-s --server [server]')
    .option('-c --channel [channel]')
    .option('-n --nickname [nick]')
    .option('-m --message [message]', 'a single message or comma-separated list of messages')
    .parse(process.argv);

var messages = cmd.message
    .split(',')
    .map(function (e) { return e.trim() });

var client = new irccmd.Client(cmd.server, cmd.channel, cmd.nickname)

cmd.message
    .split(',')
    .forEach(function (msg) {
        client.send(msg.trim());
    });

client.on('drained', function() {
    client.disconnect();
    process.exit(0);
});
