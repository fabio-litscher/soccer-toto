Template.pots.helpers({
  'userWithWinner': function() {
    var exists = Meteor.users.find({ "profile.winner": { $exists: true } }, {});
    if(exists) {
      return Meteor.users.find({ "profile.winner": { $exists: true } }, {});
    }
  },
  'userWithTopScorer': function() {
    var exists = Meteor.users.find({ "profile.topScorer": { $exists: true } }, {});
    if(exists) {
      return Meteor.users.find({ "profile.topScorer": { $exists: true } }, {});
    }
  },
  'winnerTeam': function() {
    return TeamList.findOne({ _id: this.profile.winner }).name;

  },
  'winnerPot': function() {
    var exists = PotList.findOne({ name: "winner" }, {});
    if(exists) {
      return PotList.findOne({ name: "winner"}, {}).credits;
    } else {
      return 0;
    }
  },
  'topScorerPot': function() {
    var exists = PotList.findOne({ name: "topScorer" }, {});
    if(exists) {
      return PotList.findOne({ name: "topScorer"}, {}).credits;
    } else {
      return 0;
    }
  }
});

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
