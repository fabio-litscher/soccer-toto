Template.chat.helpers({
  'messages': function() {
    return MessageList.find({}, { sort: { timestamp: -1 }, limit: 200 });
  },
  'username': function() {
    return Meteor.users.findOne({ _id: this.user }).profile.shortname;
  }
});

Template.chat.events({
  "submit form#sendMessage": function(event, template) {
    event.preventDefault();

    var messageText = event.target.messageText.value;
    event.target.messageText.value = "";
    event.target.messageText.focus();

    Meteor.call("addChatMessage", Meteor.userId(), messageText);
  }
});
