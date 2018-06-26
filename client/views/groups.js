// groups template helpers
Template.groups.helpers({
  'knockoutCount': function() {
    var knockoutCount = GameList.find({ knockoutRound: { $ne: "" } }, { sort: {date: -1, time: -1 } }).count();
    if(knockoutCount > 0) {
      return true;
    }
  }
});

// groupOverview template events
Template.groupOverview.events({

});

// groupOverview template helpers
Template.groupOverview.helpers({
  'groups': function() {
    return GroupList.find({}, {sort: {name: 1} });
  },
  'teams': function() {
    return TeamList.find({group: this._id}, {sort: {points: -1, goalsMade : -1, goalsGot : 1} }).map(function(document, index) {
      document.index = index + 1;
      return document;
    });
  }
});

// knockoutOverview template helpers
Template.knockoutOverview.helpers({
  'knockoutEighthCount': function() {
    var counter = GameList.find({ knockoutRound: "Achtelfinale", result1: { $exists: true } }, {}).count();
    if(counter > 0) {
      return true;
    }
  },
  'knockoutEighth': function() {
    return GameList.find({ knockoutRound: "Achtelfinale", result1: { $exists: true } }, { sort: {date: -1, time: -1 } });
  },
  'knockoutQuarterCount': function() {
    var counter = GameList.find({ knockoutRound: "Viertelfinale", result1: { $exists: true } }, {}).count();
    if(counter > 0) {
      return true;
    }
  },
  'knockoutQuarter': function() {
    return GameList.find({ knockoutRound: "Viertelfinale", result1: { $exists: true } }, { sort: {date: -1, time: -1 } });
  },
  'knockoutSemiCount': function() {
    var counter = GameList.find({ knockoutRound: "Halbfinale", result1: { $exists: true } }, {}).count();
    if(counter > 0) {
      return true;
    }
  },
  'knockoutSemi': function() {
    return GameList.find({ knockoutRound: "Halbfinale", result1: { $exists: true } }, { sort: {date: -1, time: -1 } });
  },
  'knockoutFinalCount': function() {
    var counter = GameList.find({ knockoutRound: "Finale", result1: { $exists: true } }, {}).count();
    if(counter > 0) {
      return true;
    }
  },
  'knockoutFinal': function() {
    return GameList.find({ knockoutRound: "Finale", result1: { $exists: true } }, { sort: {date: -1, time: -1 } });
  },
  'team1': function() {
    var team1 = TeamList.findOne({_id: this.team1});
    return team1;
  },
  'team2': function() {
    var team2 = TeamList.findOne({_id: this.team2});
    return team2;
  },
  'winnerTeam': function() {
    return TeamList.findOne({ _id: this.knockoutWinner }, {});
  },
  'groupName1': function() {
    var team = TeamList.findOne({ _id: this.team1 }, {});
    return GroupList.findOne({ _id: team.group }, {}).name;
  },
  'groupName2': function() {
    var team = TeamList.findOne({ _id: this.team2 }, {});
    return GroupList.findOne({ _id: team.group }, {}).name;
  }
});
