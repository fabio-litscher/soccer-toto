// groupOverview template events
Template.userBets.events({
  'submit form#addWinner': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var winnerTeam = Session.get('winnerTeam');
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
