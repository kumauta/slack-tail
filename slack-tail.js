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

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
  var user = rtm.dataStore.getUserById(rtm.activeUserId);
  var team = rtm.dataStore.getTeamById(rtm.activeTeamId);
  console.log('Connected to ' + team.name + ' as ' + user.name);
});

rtm.on('message', (event) => {
  var channel = rtm.dataStore.getChannelById(event.channel);

  var userName = 'system';
  if ( rtm.dataStore.getUserById(event.user) ){
    userName = rtm.dataStore.getUserById(event.user).name;
  }

  var message = 'system operation';
  if ( event.text ) {
    message = event.text;
  }

  var date = new Date(Math.floor(event.ts * 1000));
  var dispDate = date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();

  console.log(dispDate + ' - #' + channel.name + ' @' + userName + ': ' + message);
})
