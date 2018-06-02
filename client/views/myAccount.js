Template.profileData.helpers({
  'wonUserBets': function() {
    var wonBets = [];
    Meteor.user().wonBets.forEach( function(bid) {
      var game=false;
      var doc=BetList.findOne({_id:bid});
      if (doc) game=GameList.findOne({ _id: doc.game });
      if (game) wonBets.push(doc);
    });
    return wonBets;
  },
  'lostUserBets': function() {
    var lostBets = [];
    Meteor.user().lostBets.forEach( function(bid) {
      var game=false;
      var doc=BetList.findOne({_id:bid});
      if (doc) game=GameList.findOne({ _id: doc.game });
      if (game) lostBets.push(doc);
    });
    return lostBets;
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
  'wonCredits': function() {
    var game=GameList.findOne({ _id: this.game });
    var result1 = game.result1;
    var result2 = game.result2;
    var creditsPerBet = game.creditsPerBet;
    return creditsPerBet;
  },
  'totalWonCredits': function() {
    // Adjustment fungus75: use cache if is valid (don't forget to call myRecalcAll to invalid all)
    var totalWonCredits = Meteor.user().profile.totalWonCredits||-1;
    if (totalWonCredits>=0) return totalWonCredits;

    Meteor.call('myTotalWonCredits');
    return Meteor.user().profile.totalWonCredits;
  },
  'totalLostCredits': function() {
    // Adjustment fungus75: use cache if is valid (don't forget to call myRecalcAll to invalid all)
    var totalLostCredits=Meteor.user().profile.totalLostCredits||-1;
    if (totalLostCredits>=0) return totalLostCredits;

    Meteor.call('myTotalLostCredits');
    return Meteor.user().profile.totalLostCredits;
  }
});

// groupOverview template events
Template.userBets.events({
  'submit form#addWinner': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var winnerTeam = Session.get('winnerTeam');
    winnerTeam=winnerTeam.trim();
    if (winnerTeam=="") return;
    var creditsNeeded = 5;

    Meteor.call('checkCredits', Meteor.userId(), creditsNeeded, function(error, enoughCredits) {
      if(enoughCredits == true) {
        Meteor.call('addWinner', Meteor.userId(), winnerTeam);
        Meteor.call('debitCredits', Meteor.userId(), creditsNeeded);
        Meteor.call('creditsToPot', "winner", creditsNeeded);
      } else {
        alert("Sie haben zu wenig Guthaben um die Aktion durchzuführen!");
      }
    });
  },
  'submit form#addTopScorer': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var topScorer = event.target.topScorer.value;
    var creditsNeeded = 5;

    Meteor.call('checkCredits', Meteor.userId(), creditsNeeded, function(error, enoughCredits) {
      if(enoughCredits == true) {
        Meteor.call('addTopScorer', Meteor.userId(), topScorer);
        Meteor.call('debitCredits', Meteor.userId(), creditsNeeded);
        Meteor.call('creditsToPot', "topScorer", creditsNeeded);
      } else {
        alert("Sie haben zu wenig Guthaben um die Aktion durchzuführen!");
      }
    });
    event.target.topScorer.value = "";
  },
  'change #winnerTeam': function(event){
    var teamId = $(event.target).val();
    Session.set('winnerTeam', teamId);
  }
});

// groupOverview template helpers
Template.userBets.helpers({
  'team':function() {
    return TeamList.find({}, {sort: {name: 1} });
  },
  'winnerTeam':function() {
    // if-Abfrage drum herum, weil am Anfang der Benutzer noch nicht geladen ist und dann undefined exception kommt,
    // erst beim re-render ist er dann geladen und dann klappt es
    if (Meteor.user()) {
      var winnerTeamId = Meteor.user().profile.winner;
      return TeamList.findOne({ _id: winnerTeamId }, {});
    }
  },
  'topScorer':function() {
    // if-Abfrage drum herum, weil am Anfang der Benutzer noch nicht geladen ist und dann undefined exception kommt,
    // erst beim re-render ist er dann geladen und dann klappt es
    if (Meteor.user()) {
      return Meteor.user().profile.topScorer;
    }
  },
  'beforeFirstGame': function() {
    // Timer erstellen, so wird die reaktive Funktion (dieser Helper) alle X-Sekunden ausgeführt
    var myTimer = new ReactiveTimer(30);
    myTimer.tick();

    var firstGame = GameList.findOne({}, {sort: {date: 1, time: 1} }).datetime;
    var now = new Date();
    if(now > firstGame) {
      return false;
    } else {
      return true;
    }
  }
});

// userCredits template helpers
Template.userCredits.helpers({
  'userCredits':function() {
    if (Meteor.user()) {
      if(Meteor.user().profile.credits > 0) {
        return Meteor.user().profile.credits;
      } else {
        return 0;
      }
    }
  }
});
