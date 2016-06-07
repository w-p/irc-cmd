#! /usr/bin/env node

var cmd = require('commander');
var irccmd = require('irc-cmd');


cmd.version('0.1.4')
    .option('-s --server [server]')
    .option('-c --channel [channel]')
    .option('-n --nickname [nick]')
    .option('-m --message [message]')
    .parse(process.argv);

var client = new irccmd.Client(cmd.server, cmd.channel, cmd.nickname)
client.send(cmd.message);
client.on('drained', function() {
    client.disconnect();
    process.exit(0);
});
