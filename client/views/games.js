// openGames template events
Template.openGames.events({
  'submit form#addBetResult': function(){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var result1 = event.target.resultTeam1.value;
    var result2 = event.target.resultTeam2.value;
    var gameId = this._id;
    var creditsNeeded = 2;

    Meteor.call('checkCredits', Meteor.userId(), creditsNeeded, function(error, enoughCredits) {
      if(enoughCredits == true) {
        Meteor.call('addBetResult', gameId, result1, result2);
        Meteor.call('debitCredits', Meteor.userId(), creditsNeeded);
      } else {
        alert("Sie haben zu wenig Guthaben um die Aktion durchzuführen!");
      }
    });
    event.target.resultTeam1.value = "";
    event.target.resultTeam2.value = "";
  }
});

// openGames template helpers
Template.openGames.helpers({
  'openGames': function() {
    return GameList.find({result1: { $exists: false } }, {sort: {date: 1, time: 1} });
  },
  'groupName': function() {
    if(this.group == "noGroupGame") {
      return "-";
    } else {
      var groupName = GroupList.findOne({_id: this.group}).name;
      return groupName;
    }
  },
  'team1': function() {
    var team1 = TeamList.findOne({_id: this.team1});
    return team1;
  },
  'team2': function() {
    var team2 = TeamList.findOne({_id: this.team2});
    return team2;
  },
  'madeBet': function() {
    return BetList.find({ game: this._id }, {sort: {date_created: -1} });
  },
  'canBet': function() {
    var numberOfBets = BetList.find({ game: this._id }, {}).count();
    if(numberOfBets < 5) {
      return true;
    } else {
      return false;
    }
  }
});


// closedGames template helpers
Template.finishedGames.helpers({
  'closedGames': function() {
    return GameList.find({result1: { $exists: true } }, {sort: {date: 1, time: 1} });
  },
  'groupName': function() {
    if(this.group == "noGroupGame") {
      return "-";
    } else {
      var groupName = GroupList.findOne({_id: this.group}).name;
      return groupName;
    }
  },
  'team1': function() {
    var team1 = TeamList.findOne({_id: this.team1});
    return team1;
  },
  'team2': function() {
    var team2 = TeamList.findOne({_id: this.team2});
    return team2;
  }
});
