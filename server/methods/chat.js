Meteor.methods({
  'addChatMessage': function(userId, messageText) {
    var datetime = new Date();
    var date = moment().format('DD.MM.YYYY');
    var time = moment().format('HH:mm:ss');

    console.log("ok");
    MessageList.insert({
      user: userId,
      messageText: messageText,
      timestamp: datetime,
      date: date,
      time: time
    });
  }
});
