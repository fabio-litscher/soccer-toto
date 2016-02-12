// openGames template events
Template.openGames.events({
  'submit form#addBetResult': function(){

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
