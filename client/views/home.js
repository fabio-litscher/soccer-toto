Template.betRanking.helpers({
  'rankingUsers': function() {
    var wonBets = [];
    BetList.find({}, { sort: {user: 1} }).forEach( function(doc) {
      if(GameList.findOne({ _id: doc.game })) {
        var result1 = GameList.findOne({ _id: doc.game }).result1;
        var result2 = GameList.findOne({ _id: doc.game }).result2;
        if(result1 != undefined && (doc.result1 == result1 && doc.result2 == result2)) {
          wonBets.push(doc);
        }
      }
    });

    var users = [];
    var i = 0;
    var k = 0;
    wonBets.forEach( function(doc) {
      if(k == 0) {
        var countTotalBets = BetList.find({ game: doc.game }).count();
        console.log(countTotalBets);
        users[i] = {
          user: doc.user,
          wonBets: 1,
          totalBets: parseInt(countTotalBets)
        };
        k = 1;
      }
      else {
        if(doc.user == users[i].user) {
          users[i].wonBets += 1;
          if(doc.game != gameBefore) {
            var countTotalBets = BetList.find({ game: doc.game }).count();
            users[i].totalBets += parseInt(countTotalBets);
          }
        }
        else {
          i++;
          var countTotalBets = BetList.find({ game: doc.game }).count();
          users[i] = {
            user: doc.user,
            wonBets: 1,
            totalBets: parseInt(countTotalBets)
          }
        }
      }
      var gameBefore = doc.game;
    });

    users.sort(function(a,b) {return (a.wonBets > b.wonBets) ? -1 : ((b.wonBets > a.wonBets) ? 1 : 0);} );

    return users;
  },
  'username': function() {
    return Meteor.users.findOne(this.user).profile.shortname;
  }
});

Template.pots.helpers({
  'userWithWinner': function() {
    var exists = Meteor.users.find({ "profile.winner": { $exists: true } }, {});
    if(exists) {
      return Meteor.users.find({ "profile.winner": { $exists: true } }, { sort: {"profile.winner": 1 } });
    }
  },
  'userWithTopScorer': function() {
    var exists = Meteor.users.find({ "profile.topScorer": { $exists: true } }, {});
    if(exists) {
      return Meteor.users.find({ "profile.topScorer": { $exists: true } }, { sort: {"profile.topScorer": 1 } });
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
