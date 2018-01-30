Template.openGames.onRendered(function() {
  $('.modal-trigger').leanModal();
});

// openGames template events
Template.openGames.events({
  'submit form#addBetResult': function(event){
    event.preventDefault();   // submit unterbinden, damit Seite nicht neu geladen wird
    var result1 = event.target.resultTeam1.value;
    var result2 = event.target.resultTeam2.value;
    var gameId = this._id;
    var creditsNeeded = 2;

    Meteor.call('checkCredits', Meteor.userId(), creditsNeeded, function(error, enoughCredits) {
      if(enoughCredits) {
        Meteor.call('addBetResult', gameId, result1, result2, function(error, addedOk) {
            if (addedOk) Meteor.call('debitCredits', Meteor.userId(), creditsNeeded);
        });
      } else {
        alert("Sie haben zu wenig Guthaben um die Aktion durchzuführen!");
      }
    });
    event.target.resultTeam1.value = "";
    event.target.resultTeam2.value = "";
    event.target.resultTeam1.focus();
  },
  'click .showAllGameBets': function(event) {
    var game = event.currentTarget.getAttribute("gameId");
    $('#bets_'+game).removeClass('hidden');
    $('#hideBets_'+game).removeClass('hidden');
    $('#showBets_'+game).addClass('hidden');
  },
  'click .hideAllGameBets': function(event) {
    var game = event.currentTarget.getAttribute("gameId");
    $('#bets_'+game).addClass('hidden');
    $('#hideBets_'+game).addClass('hidden');
    $('#showBets_'+game).removeClass('hidden');
  },
  'click .delBet': function(event) {
    var betId = event.currentTarget.getAttribute("betId");
    Meteor.call('removeBet', betId);
    Meteor.call('addCredits', Meteor.userId(), 2);
  }
});

// openGames template helpers
Template.openGames.helpers({
  'openGames': function() {
    return GameList.find({result1: { $exists: false } }, {sort: {datetime: 1} });
  },
  'groupName': function() {
    if(this.group == "noGroupGame") {
      return false;
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
    return BetList.find({ user: Meteor.userId(), game: this._id }, {sort: {date_created: -1} });
  },
  'canBet': function() {
    var numberOfBets = BetList.find({ user: Meteor.userId(), game: this._id }, {}).count();
    if(numberOfBets < 5) {
      return true;
    } else {
      return false;
    }
  },
  'datetimeOk': function() {
    // Timer erstellen, so wird die reaktive Funktion (dieser Helper) alle X-Sekunden ausgeführt
    var myTimer = new ReactiveTimer(30);
    myTimer.tick();

    // überprüfung ob noch gewettet werden kann, wenn spiel schon angefangen false, sonst true zurückgeben
    var now = new Date();
    if(now > this.datetime) {
      return false;
    } else {
      return true;
    }
  },
  'hasBetsForGame': function() {
    if(BetList.find({ game: this._id }, {}).count() != 0) return true;
    else return false;
  },
  'gameBets': function() {
    var betsForGame = BetList.find({ game: this._id }, { sort: {user: -1} });
    var lastuser;
    var betString = "";
    betsForGame.forEach(function (row) {
      if(lastuser == row.user) {
        betString = betString + ", " + row.result1 + ":" + row.result2;
      }
      else if(userExists(row.user)) {
        betString = betString + "<br /><b>" + getUsername(row.user) + "</b>: " + row.result1 + ":" + row.result2;
      }
      lastuser = row.user;
    });

    betString = betString + "<br />";

    return Spacebars.SafeString(betString);
  },
  'gamePot': function() {
    var totalBets = BetList.find({ game: this._id }, {}).count();
    var totalGamePot = totalBets * 2;
    return totalGamePot;
  }
});

function userExists(userId) {
  if(Meteor.users.findOne(userId)) return true;
  else return false;
}
function getUsername(userId) {
  return Meteor.users.findOne(userId).profile.shortname;
}

// closedGames template events
Template.finishedGames.events({
  'click .showAllGameBets': function(event) {
    var game = event.currentTarget.getAttribute("gameId");
    $('#bets_'+game).removeClass('hidden');
    $('#hideBets_'+game).removeClass('hidden');
    $('#showBets_'+game).addClass('hidden');
  },
  'click .hideAllGameBets': function(event) {
    var game = event.currentTarget.getAttribute("gameId");
    $('#bets_'+game).addClass('hidden');
    $('#hideBets_'+game).addClass('hidden');
    $('#showBets_'+game).removeClass('hidden');
  }
});

// closedGames template helpers
Template.finishedGames.helpers({
  'closedGames': function() {
    return GameList.find({result1: { $exists: true } }, {sort: {datetime: -1} });
  },
  'groupName': function() {
    if(this.group == "noGroupGame") {
      return false;
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
  'winnerTeam': function() {
    return TeamList.findOne({ _id: this.knockoutWinner }, {});
  },
  'hasBetsForGame': function() {
    if(BetList.find({ game: this._id }, {}).count() != 0) return true;
    else return false;
  },
  'gameBets': function() {
    var betsForGame = BetList.find({ game: this._id }, { sort: {user: -1} });
    var game = GameList.findOne({ _id: this._id });
    var result1 = game.result1;
    var result2 = game.result2;
    var lastuser;
    var betString = "";
    betsForGame.forEach(function (row) {
      if(lastuser == row.user) {
        if(parseInt(row.result1) == parseInt(result1) && parseInt(row.result2) == parseInt(result2)) {
          betString = betString + ", " + "<b style='background-color: yellow; color: green;'>" + row.result1 + ":" + row.result2 + "</b>";
        } else {
          betString = betString + ", " + row.result1 + ":" + row.result2;
        }
      }
      else if(userExists(row.user)) {
        if(parseInt(row.result1) == parseInt(result1) && parseInt(row.result2) == parseInt(result2)) {
          betString = betString + "<br /><b>" + getUsername(row.user) + "</b>: " + "<b style='background-color: yellow; color: green;'>" + row.result1 + ":" + row.result2 + "</b>";
        } else {
          betString = betString + "<br /><b>" + getUsername(row.user) + "</b>: " + row.result1 + ":" + row.result2;
        }
      }
      lastuser = row.user;
    });

    betString = betString + "<br />";

    return Spacebars.SafeString(betString);
  },
  'gamePot': function() {
    var totalBets = BetList.find({ game: this._id }, {}).count();
    var totalGamePot = totalBets * 2;
    return totalGamePot;
  }
});
