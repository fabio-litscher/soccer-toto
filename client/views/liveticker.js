Template.liveticker.helpers({
  'lastMessages': function() {
    return MessageList.find({}, { sort: { timestamp: -1 }, limit: 3 });
  },
  'username': function() {
    return Meteor.users.findOne({ _id: this.user }).profile.shortname;
  }
});
