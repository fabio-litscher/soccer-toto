// teams template events
Template.adminTeams.events({
  'submit form': function(){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var teamName = event.target.teamName.value;
    var teamShortname = event.target.teamShortname.value;

    event.target.teamName.value = "";
    event.target.teamShortname.value = "";

    Meteor.call('insertNewTeam', teamName, teamShortname);
  },
  'click .team': function(){
    var teamId = this._id;
    var teamGroup = TeamList.findOne(teamId).group;
    Session.set('selectedTeam', teamId);
    Session.set('selectedTeamGroup', teamGroup);
  },
  'click .teamGroup': function(){
    var groupId = this._id;
    Session.set('selectedTeamGroup', groupId);
  },
  'click #removeTeam': function() {
    var selectedTeam = Session.get('selectedTeam');
    var selectedTeamName = TeamList.findOne(selectedTeam).name;
    if(confirm("Sind Sie sicher dass Sie folgende Mannschaft löschen möchten: " + selectedTeamName)) {
      Meteor.call('removeTeam', selectedTeam);
    }
  },
  'click #addTeamToGroup': function() {
    var selectedTeam = Session.get('selectedTeam');
    var selectedTeamGroup = Session.get('selectedTeamGroup');
    Meteor.call('addTeamToGroup', selectedTeam, selectedTeamGroup);
  },
  'click #clearTeamStatistics': function() {
    Meteor.call('clearTeamStatistics');
  }
});

// teams template helpers
Template.adminTeams.helpers({
  'team': function() {
    return TeamList.find({}, {sort: {name: 1} });
  },
  'selectedTeamClass': function() {
    var teamId = this._id;
    var selectedTeam = Session.get('selectedTeam');
    if(teamId == selectedTeam) {
      return "selected";
    }
  },
  'selectedTeamGroupClass': function() {
    var groupId = this._id;
    var selectedTeamGroup = Session.get('selectedTeamGroup');
    if(groupId == selectedTeamGroup) {
      return "selected";
    }
  },
  'teamSelected': function(){
    var selectedTeam = Session.get('selectedTeam');
    return TeamList.findOne(selectedTeam);
  },
  'group': function() {
    return GroupList.find({}, {sort: {name: 1} });
  }
});


// groups template events
Template.adminGroups.events({
  'submit form': function(){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var groupName = event.target.groupName.value;

    event.target.groupName.value = "";

    Meteor.call('insertNewGroup', groupName);
  },
  'click .group': function(){
    var groupId = this._id;
    Session.set('selectedGroup', groupId);
  },
  'click #removeGroup': function() {
    var selectedGroup = Session.get('selectedGroup');
    var selectedGroupName = GroupList.findOne(selectedGroup).name;
    if(confirm("Sind Sie sicher dass Sie folgende Gruppe löschen möchten: " + selectedGroupName)) {
      Meteor.call('removeGroup', selectedGroup);
    }
  }
});

// groups template helpers
Template.adminGroups.helpers({
  'group': function() {
    return GroupList.find({}, {sort: {name: 1} });
  },
  'selectedClass': function() {
    var groupId = this._id;
    var selectedGroup = Session.get('selectedGroup');
    if(groupId == selectedGroup) {
      return "selected";
    }
  },
  'groupSelected': function(){
    var selectedGroup = Session.get('selectedGroup');
    return GroupList.findOne(selectedGroup);
  },
  'groupTeams': function() {
    var selectedGroup = Session.get('selectedGroup');
    return TeamList.find({group: selectedGroup}, {sort: {name: 1} });
  }
});


// adminResults template events
Template.adminResults.events({
  'change #gameGroup': function(event){
    var groupId = $(event.target).val();
    Session.set('gameGroup', groupId);
  },
  'submit form#addGame': function(){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var gameDate = event.target.gameDate.value;
    var gameTime = event.target.gameTime.value;
    var gameGroup = event.target.gameGroup.value;
    var gameTeam1 = event.target.gameTeam1.value;
    var gameTeam2 = event.target.gameTeam2.value;
    if(gameGroup === "noGroupGame") {
      var knockoutRound = event.target.knockoutRound.value;
    } else {
      var knockoutRound = "";
    }

    // Date object erstellen
    var year = gameDate.substring(0,4);
    var month = gameDate.substring(5,7)-1;
    var day = gameDate.substring(8,10);
    var hour = gameTime.substring(0,2);
    var minute = gameTime.substring(3,5);
    var gameDateTime = new Date(year, month, day, hour, minute);

    event.target.gameDate.value = "";
    event.target.gameTime.value = "";
    event.target.gameGroup.value = "default";
    event.target.gameTeam1.value = "default";
    event.target.gameTeam2.value = "default";
    if(gameGroup === "noGroupGame") {
      event.target.knockoutRound.value = "default";
    }

    Meteor.call('insertNewGame', gameDate, gameTime, gameDateTime, gameGroup, gameTeam1, gameTeam2, knockoutRound);
  },
  'submit form#addGameResult': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird

    var gameId = this._id;
    var resultTeam1 = event.target.resultTeam1.value;
    var resultTeam2 = event.target.resultTeam2.value;
    var bet = 2;
    if(GameList.findOne({_id: gameId}).group == "noGroupGame") {
      var knockoutWinner = event.target.knockoutWinner.value;
      console.log(knockoutWinner);
    }

    event.target.resultTeam1.value = "";
    event.target.resultTeam2.value = "";

    Meteor.call('insertGameResult', gameId, resultTeam1, resultTeam2, bet, knockoutWinner);
  },
  'click #clearGames': function(){
    Meteor.call('clearGames');
  },
  'click .delGame': function(event){
    event.preventDefault();

    var gameId = event.currentTarget.getAttribute("gameId");              // jQuery Variante: $(event.currentTarget).attr("gameId");
    if(confirm("Sind Sie sicher dass Sie das Spiel löschen möchten?")) {
      Meteor.call('removeGame', gameId);
    }
  }
});

// adminResults template helpers
Template.adminResults.helpers({
  'group': function() {
    return GroupList.find({}, {sort: {name: 1} });
  },
  'groupSelected': function() {
    return GroupList.find({}, {sort: {name: 1} });
  },
  'team': function() {
    var gameGroup = Session.get('gameGroup');
    if(gameGroup === 'noGroupGame') {
      return TeamList.find({}, {sort: {name: 1} });
    } else {
      return TeamList.find({group: gameGroup}, {sort: {name: 1} });
    }
  },
  'doneGames': function() {
    return GameList.find({ result1: { $exists: true } }, {sort: {date: 1, time: 1} });
  },
  'openGames': function() {
    return GameList.find({ result1: { $exists: false } }, {sort: {date: 1, time: 1} });
  },
  'team1': function() {
    var team1 = TeamList.findOne({_id: this.team1});
    return team1;
  },
  'team2': function() {
    var team2 = TeamList.findOne({_id: this.team2});
    return team2;
  },
  'groupName': function() {
    if(this.group == "noGroupGame") {
      return false;
    } else {
      var groupName = GroupList.findOne({_id: this.group}).name;
      return groupName;
    }
  },
  'hasResult': function() {
    if(this.result1 == null || this.result2 == null) {
      return false;
    } else {
      return true;
    }
  },
  'noGroupGame': function() {
    var gameGroup = Session.get('gameGroup');
    if(gameGroup === 'noGroupGame') {
      return true;
    }
  },
  'winnerTeam': function() {
    return TeamList.findOne({ _id: this.knockoutWinner }, {});
  }
});

// adminCredits template events
Template.adminCredits.events({
  'submit form#sendCredits': function(){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var selectedUser = Session.get('selectedUser');
    var creditsToLoad = event.target.numberOfCredits.value;
    event.target.numberOfCredits.value = "";

    Meteor.call('addCredits', selectedUser, creditsToLoad);
  },
  'change #usersList': function(event){
    var userId = $(event.target).val();
    Session.set('selectedUser', userId);
  },
  'click #delWinnerPot': function(){
    Meteor.call('deletePot', "winner");
  },
  'click #delTopScorerPot': function(){
    Meteor.call('deletePot', "topScorer");
  }
});

// adminCredits template helpers
Template.adminCredits.helpers({
  'user': function() {
    return Meteor.users.find({});
  },
  'winnerPot': function() {
    var exists = PotList.findOne({ name: "winner" }, {});
    if(exists) {
      return PotList.findOne({ name: "winner"}, {}).credits;
    }
  },
  'topScorerPot': function() {
    var exists = PotList.findOne({ name: "topScorer" }, {});
    if(exists) {
      return PotList.findOne({ name: "topScorer"}, {}).credits;
    }
  }
});
