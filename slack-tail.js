function convertId2Name(messages, rtm) {
  for (i = 0; i < messages.length; i++) {
    messages[i] = convertUser(messages[i], rtm);
    messages[i] = converChannel(messages[i]);
  }
  return messages;
}

function convertUser(message, rtm) {
  var res = message;
  while (true) {
    var match = res.match(/<@[a-zA-Z0-9]*>/);
    if (match != null) {
      var userId = match[0].replace('<@', '').replace('>', '');
      var userName = '@' + rtm.dataStore.getUserById(userId).name;
      if (userName == loginUserName) {
        res = res.replace(match[0], userName.red);
      } else {
        res = res.replace(match[0], userName);
      }
    } else {
      return res;
    }
  }
}

function converChannel(message) {
  var res = message;
  while (true) {
    var match = res.match(/<#[^<]*>/);
    if (match != null) {
      var channelName = '#' + match[0].split('|')[1].replace('>', '');
      res = res.replace(match[0], channelName);
    } else {
      return res;
    }
  }
}

var dateformat = require('dateformat');
var colors = require('colors');
var RtmClient = require('@slack/client').RtmClient;

var MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var token = process.env.SLACK_API_TOKEN;
var loginUserName = "";

var rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoMark: true
});

rtm.start();

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  var user = rtm.dataStore.getUserById(rtm.activeUserId);
  loginUserName = '@' + user.name;
  var team = rtm.dataStore.getTeamById(rtm.activeTeamId);
  console.log('Connected to ' + team.name + ' as ' + user.name);
});

rtm.on('message', (event) => {
  try {
    var channel = rtm.dataStore.getChannelById(event.channel) || rtm.dataStore.getGroupById(event.channel) || rtm.dataStore.getDMById(event.channel);
    var channelName = "";
    if (channel.name) {
      channelName = "#" + channel.name;
    } else {
      channelName = "@" + rtm.dataStore.getUserById(channel.user).name;
    }
    channelName = (channelName + " ".repeat(14)).slice(0, 17);

    var userName = 'system';
    if (event.bot_id) {
      // can't get user info
      //userName = rtm.dataStore.getUserByBotId(event.bot_id).name;
      userName = 'bot';
    } else {
      if (rtm.dataStore.getUserById(event.user)) {
        userName = rtm.dataStore.getUserById(event.user).name;
      }
    }
    userName = ("@" + userName + " ".repeat(14)).slice(0, 13);

    var message = 'system operation';
    if (event.text) {
      message = event.text;
    } else if (event.attachments) {
      message = event.attachments[0].fallback;
    } else if (event.previous_message) {
      if (event.message) {
        message = "[EDIT]\n" + event.message.text;
      } else {
        message = "[DELETE]\n" + event.previous_message.text;
      }
    }

    var date = new Date(Math.floor(event.ts * 1000));
    var dispDate = dateformat(date, 'mm/dd HH:MM:ss');

    var messages = message.split('\n');
    messages = convertId2Name(messages, rtm);
    console.log(dispDate + ' - ' + channelName.blue + ' ' + userName.cyan + ': ' + messages[0]);
    if (messages.length > 1) {
      for (i = 1; i < messages.length; i++) {
        console.log(" ".repeat(50) + messages[i]);
      }
    }
  } catch (e) {
    console.log(event);
    console.log(e);
  }
})
