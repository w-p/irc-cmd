

var irc = require('irc');
var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;


var irccmd = module.exports = {};

var colors = {
    norm: chalk.bold.white,
    ok: chalk.bold.cyan,
    warn: chalk.bold.yellow,
    error: chalk.bold.red
}

function log (category, subject, message) {
    var color = colors[category];
    var msg = color(`[${ subject }] `) + colors.norm(message);
    console.log(msg);
}

(function () {

    this.Client = function (server_name, channel_name, nickname, password) {
        var self = this;
        var evt = new EventEmitter();
        var client = null;
        var joined = false;
        var _server = server_name;
        var _channel = channel_name;
        var _nick = nickname;
        var _pass = password;
        this.queue = [];

        this.debug = function () {
            return {
                client: client,
                joined: joined,
                server: _server,
                channel: _channel,
                nick: _nick,
                queue: this.queue
            }
        };

        this.on = evt.on;
        this.emit = evt.emit;

        this.server = function (value) {
            if (!value) return _server;
            _server = value;
            this.connect();
            return this;
        };

        this.channel = function (value) {
            if (!value) return _channel;
            _channel = value;
            this.connect();
            return this;
        };

        this.nick = function (value) {
            if (!value) return _nick;
            _nick = value;
            this.connect();
            return this;
        };

        this.send = function (message) {
            if (client) {
                if (client.conn !== null && joined) {
                    client.say(_channel, message);
                    log('ok', 'message', 'message sent');
                } else {
                    log('warn', 'message', 'not connected, queueing');
                    this.queue.push(message);
                }
            }
        };

        this.drain = function () {
            if (this.queue.length) {
                log('ok', 'queue', `sending ${ this.queue.length } messages`);
                while (this.queue.length) {
                    self.send(this.queue.splice(0, 1));
                }
                log('ok', 'queue', 'message queue empty');
                this.emit('drained');
            }
        };

        this.connect = function () {
            if (_server && _nick && _channel) {
                log('ok', 'connect', 'trying to connect');
                client = new irc.Client(
                    _server,
                    _nick,
                    {
                        userName: _nick,
                        realName: _nick,
                        password: _pass,
                        channels: [_channel],
                    }
                );
                client.on('join', function () {
                    log('ok', 'connect', `joined ${ _channel } on ${ _server }`);
                    joined = true;
                    self.drain();
                });
            }
        };

        this.disconnect = function () {
            log('ok', 'connect', `leaving ${ _channel }`);
            log('ok', 'connect', `disconnecting from ${ _server }`);
            joined = false;
            this.queue = [];
            if (client) client.disconnect();
        };

        this.connect();
    };

}).apply( irccmd );
