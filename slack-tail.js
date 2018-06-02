var dateformat = require('dateformat');
var RtmClient = require('@slack/client').RtmClient;

var MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var token = process.env.SLACK_API_TOKEN;

var rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoMark: true
});

rtm.start();

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  var user = rtm.dataStore.getUserById(rtm.activeUserId);
  var team = rtm.dataStore.getTeamById(rtm.activeTeamId);
  console.log('Connected to ' + team.name + ' as ' + user.name);
});

rtm.on('message', (event) => {
  //var channel = rtm.dataStore.getGroupById(event.team);
  var channel = rtm.dataStore.getChannelById(event.channel) || rtm.dataStore.getGroupById(event.channel) || rtm.dataStore.getDMById(event.channel);
  var channelName = "";
  if (channel.name) {
    channelName = "#" + channel.name;
  } else {
    channelName = "@" + rtm.dataStore.getUserById(channel.user).name;
  }
  channelName = (channelName + "              ").slice(0, 17);

  var userName = 'system';
  if (rtm.dataStore.getUserById(event.user)) {
    userName = rtm.dataStore.getUserById(event.user).name;
  }
  userName = ("@" + userName + "              ").slice(0, 17);

  var message = 'system operation';
  if (event.text) {
    message = event.text;
  }

  var date = new Date(Math.floor(event.ts * 1000));
  var dispDate = dateformat(date,'mm/dd HH:MM:ss');

  console.log(dispDate + ' - ' + channelName + ' ' + userName + ': ' + message);
})
