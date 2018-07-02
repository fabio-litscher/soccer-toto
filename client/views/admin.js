Template.adminTopScorer.events({
  'submit form': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var playerName = event.target.playerName.value;
    var goals = event.target.countGoals.value;

    event.target.playerName.value = "";
    event.target.countGoals.value = "";

    Meteor.call('insertTopScorerPlayer', playerName, goals);
  },
  'click .topScorer': function(event){
    var topScorerId = this._id;
    Session.set('selectedTopScorer', topScorerId);
  },
  'click #delTopScorer': function(event) {
    event.preventDefault();
    var topScorerId = event.target.getAttribute('playerId');

    Meteor.call('removeTopScorerPlayer', topScorerId);
  }
});

Template.adminTopScorer.helpers({
  'topScorerPlayer': function() {
    return TopScorerList.find({}, { sort: {countGoals: -1} });
  },
  'selectedTopScorerClass': function(event) {
    var topScorerId = this._id;
    var selectedTopScorer = Session.get('selectedTopScorer');
    if(topScorerId == selectedTopScorer) {
      return "selected";
    }
  },
  'selectedTopScorer': function() {
    var topScorerId = Session.get('selectedTopScorer');
    return TopScorerList.findOne(topScorerId);
  },
});

Template.useradministration.events({
  'click .user': function(event){
    var userId = this._id;
    Session.set('selectedUser', userId);
  },
  'click #resetPassword': function(event) {
    var userId = event.target.getAttribute('userId');
    $('#resetPasswordButtonTd').addClass('hidden');
    $('#resetPasswordTd').removeClass('hidden');
  },
  'click #saveNewPasswordButton': function(event) {
    var user = $('#saveNewPasswordButton').attr('userId');
    var newPassword = $('#newPassword').val();

    if(newPassword == "") alert("Passwort darf nicht leer sein!");
    else {
      Meteor.call('resetUsersPassword', user, newPassword);
      $('#newPassword').val("");
      $('#resetPasswordTd').addClass('hidden');
      $('#resetPasswordButtonTd').removeClass('hidden');
    }
  },
  'click #cancelPasswordReset': function() {
    $('#resetPasswordTd').addClass('hidden');
    $('#resetPasswordButtonTd').removeClass('hidden');
  },
  'click #editEmailButton': function(event) {
    var userId = event.target.getAttribute('userId');
    $('#usersEmail').addClass('hidden');
    $('#newEmailTd').removeClass('hidden');
  },
  'click #saveNewEmailButton': function(event) {
    var user = $('#saveNewEmailButton').attr('userId');
    var newEmail = $('#newEmailAddress').val();

    Meteor.call('changeUsersEmail', user, newEmail, function (error, result) {
      if(error && error.error == 500) alert("Email-Adresse ist bereits einem anderen User zugewiesen!");
    });
    $('#newEmailAddress').val("");
    $('#newEmailTd').addClass('hidden');
    $('#usersEmail').removeClass('hidden');
  },
  'click #cancelNewEmail': function() {
    $('#newEmailTd').addClass('hidden');
    $('#usersEmail').removeClass('hidden');
  },
  'click #editShortnameButton': function(event) {
    var userId = event.target.getAttribute('userId');
    $('#usersShortname').addClass('hidden');
    $('#newShortnameTd').removeClass('hidden');
  },
  'click #saveNewShortnameButton': function(event) {
    var user = $('#saveNewShortnameButton').attr('userId');
    var newShortname = $('#newShortname').val();

    if(newShortname == "") alert("Kurzzeichen darf nicht leer sein!");
    else {
      Meteor.call('changeUsersShortname', user, newShortname);
      $('#newShortname').val("");
      $('#newShortnameTd').addClass('hidden');
      $('#usersShortname').removeClass('hidden');
    }
  },
  'click #cancelNewShortname': function() {
    $('#newShortnameTd').addClass('hidden');
    $('#usersShortname').removeClass('hidden');
  },
  'click #editTopScorerButton': function(event) {
    var userId = event.target.getAttribute('userId');
    $('#usersTopScorer').addClass('hidden');
    $('#newTopScorerTd').removeClass('hidden');
  },
  'click #saveNewTopScorerButton': function(event) {
    var user = $('#saveNewTopScorerButton').attr('userId');
    var newTopScorer = $('#newTopScorer').val();

    if(newTopScorer == "") alert("Torschützenkönig darf nicht leer sein!");
    else {
      Meteor.call('changeUsersTopScorer', user, newTopScorer);
      $('#newTopScorer').val("");
      $('#newTopScorerTd').addClass('hidden');
      $('#usersTopScorer').removeClass('hidden');
    }
  },
  'click #cancelNewTopScorer': function() {
    $('#newTopScorerTd').addClass('hidden');
    $('#usersTopScorer').removeClass('hidden');
  }
});

Template.useradministration.helpers({
  'users': function() {
    return Meteor.users.find({}, { sort: {"profile.shortname": 1} });
  },
  'selectedUserClass': function(event) {
    var userId = this._id;
    var selectedUser = Session.get('selectedUser');
    if(userId == selectedUser) {
      return "selected";
    }
  },
  'selectedUser': function() {
    var userId = Session.get('selectedUser');
    return Meteor.users.findOne(userId);
  },
  'userBets': function() {
    var userId = Session.get('selectedUser');
    return BetList.find({ user: userId }, {});
  },
  'betGame': function() {
    return GameList.findOne({ _id: this.game });
  },
  'groupName': function() {
    var gameGroup = GameList.findOne({ _id: this.game }).group;
    if(gameGroup == "noGroupGame") {
      return false;
    } else {
      return GroupList.findOne({ _id: gameGroup }).name;
    }
  },
  'team1': function() {
    var teamId = GameList.findOne({ _id: this.game }).team1;
    var team1 = TeamList.findOne({_id: teamId});
    return team1;
  },
  'team2': function() {
    var teamId = GameList.findOne({ _id: this.game }).team2;
    var team2 = TeamList.findOne({_id: teamId});
    return team2;
  },
  'credits': function() {
    var result1 = GameList.findOne({ _id: this.game }).result1;
    var result2 = GameList.findOne({ _id: this.game }).result2;
    var tipp1 = this.result1;
    var tipp2 = this.result2;

    if(!result1) return "";
    else if(tipp1 == result1 && tipp2 == result2) {
      var totalBets = BetList.find({ game: this.game }, {}).count();
      var totalGamePot = totalBets * 2;
      var countCorrectBets = BetList.find({ game: this.game, result1: result1, result2: result2 }, {}).count();
      var creditsPerBet = totalGamePot / countCorrectBets;
      creditsPerBet = Math.floor(creditsPerBet);
      return creditsPerBet + ".-";
    }
    else return "-2.-";
  },
  'userWinner': function(teamId) {
    return TeamList.findOne(teamId).name;
  }
});

Template.admin.helpers({
  'authorizedAdmin': function() {
    if (Meteor.user() && Meteor.user().isAdmin) {
        return true;
      } else {
        return false;
      }
  }
});

// teams template events
Template.adminTeams.events({
  'submit form': function(event){
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
  'submit form': function(event){
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


// adminResults when template rendered
Template.adminResults.onRendered(function() {
  $('#gameDate').pickadate({
    selectMonths: true,
    selectYears: 10,
    labelMonthNext: 'Nächster Monat',
    labelMonthPrev: 'Vorheriger Monat',
    labelMonthSelect: 'Auswahl Monat',
    labelYearSelect: 'Auswahl Jahr',
    monthsFull: [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
    monthsShort: [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ],
    weekdaysFull: [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],
    weekdaysShort: [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
    weekdaysLetter: [ 'S', 'M', 'D', 'M', 'D', 'F', 'S' ],
    today: 'Heute',
    clear: 'Clear',
    close: 'Ok',
    format: 'dd.mm.yyyy',
    firstDay: 1
  });

  $('#gameTime').timeEntry({
    show24Hours: true,
    spinnerImage: ''
  });
});

// adminResults template events
Template.adminResults.events({
  'change #gameGroup': function(event){
    var groupId = $(event.target).val();
    Session.set('gameGroup', groupId);
  },
  'submit form#addGame': function(event){
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
    var day = gameDate.substring(0,2);
    var month = gameDate.substring(3,5)-1;
    var year = gameDate.substring(6,10);
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
    var team1 = $('#team1').html();
    var team2 = $('#team2').html();
    var resultTeam1 = event.target.resultTeam1.value;
    var resultTeam2 = event.target.resultTeam2.value;
    var bet = 2;
    if(GameList.findOne({_id: gameId}).group == "noGroupGame") {
      var knockoutWinner = event.target.knockoutWinner.value;
    }

    if(confirm("Sind Sie sicher, dass Sie das Resultat korrekt eingegeben haben?")) {
      Meteor.call('insertGameResult', gameId, resultTeam1, resultTeam2, bet, knockoutWinner);
    }

    event.target.resultTeam1.value = "";
    event.target.resultTeam2.value = "";
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
    return GameList.find({ result1: { $exists: true } }, {sort: {datetime: 1} });
  },
  'openGames': function() {
    return GameList.find({ result1: { $exists: false } }, {sort: {datetime: 1} });
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
  'click .eliminatedTeamCheckbox': function(event) {
    var selectedTeam = event.target.getAttribute('teamId');
    if(TeamList.findOne({ _id: selectedTeam }).eliminated) {
      Meteor.call('setTeamUnEliminated', selectedTeam);
    } else {
      Meteor.call('setTeamEliminated', selectedTeam);
    }
  },
  'submit form#sendCredits': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var selectedUser = Session.get('selectedUserSend');
    var creditsToLoad = event.target.numberOfCreditsSend.value;
    event.target.numberOfCreditsSend.value = "";
    $('#usersListSend').prop('selectedIndex',0);

    Meteor.call('addCredits', selectedUser, creditsToLoad);
  },
  'change #usersListSend': function(event){
    var userId = $(event.target).val();
    Session.set('selectedUserSend', userId);
  },
  'submit form#takeCredits': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var selectedUser = Session.get('selectedUserTake');
    $('#usersListTake').prop('selectedIndex',0);

    Meteor.call('deleteCredits', selectedUser);
  },
  'change #usersListTake': function(event){
    var userId = $(event.target).val();
    Session.set('selectedUserTake', userId);
  },
  'change #teamList': function(event){
    var teamId = $(event.target).val();
    Session.set('selectedWinnerTeam', teamId);
  },
  'click #splitWinnerPot': function(){
    var selectedWinnerTeam = Session.get('selectedWinnerTeam');
    var winnerTeamName = TeamList.findOne({ _id: selectedWinnerTeam }).name;
    $('#teamList').prop('selectedIndex',0);
    if(confirm("Sind Sie sicher, dass sie folgende Mannschaft zum Sieger ernennen und den Pot entsprechend aufteilen möchten?\n" + winnerTeamName)) {
      Meteor.call('splitWinnerPot', selectedWinnerTeam);
    }
  },
  'click #splitTopScorerPot': function() {
    var correctUsers = new Array();
    $("ul#topScorerUserList li").each(function( index ) {
      var userId = $(this).attr('userId');

      if( $('#filled-in-box_' + userId).prop('checked') ) {
        correctUsers.push(userId);
      }
    });

    if(confirm("Sind Sie sicher, dass sie alle richtigen Einträge ausgewählt haben?")) {
      Meteor.call('splitTopScorerPot', correctUsers);
    }
  },
  'click #delWinnerPot': function(){
    Meteor.call('removePot', "winner");
  },
  'click #delTopScorerPot': function(){
    Meteor.call('removePot', "topScorer");
  }
});

// adminCredits template helpers
Template.adminCredits.helpers({
  'user': function() {
    return Meteor.users.find({});
  },
  'team': function() {
    return TeamList.find({}, {sort: {eliminated: 1, name: 1} });
  },
  'userWithTopScorer': function() {
    var exists = Meteor.users.find({ "profile.topScorer": { $exists: true } }, {});
    if(exists) {
      return Meteor.users.find({ "profile.topScorer": { $exists: true } }, {});
    }
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
  },
  'restOfWinnerPot': function() {
    var exists = PotList.findOne({ name: "winner" }, {});
    if(exists) {
      if(PotList.findOne({ name: "winner" }, {}).rest > 0) {
        return PotList.findOne({ name: "winner" }, {}).rest;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },
  'restOfTopScorerPot': function() {
    var exists = PotList.findOne({ name: "topScorer" }, {});
    if(exists) {
      if(PotList.findOne({ name: "topScorer" }, {}).rest > 0) {
        return PotList.findOne({ name: "topScorer" }, {}).rest;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
});
