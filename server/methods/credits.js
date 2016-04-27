// general methods, needed from different pages
Meteor.methods({
  'checkCredits': function(userId, creditsNeeded) {
    var userCredits = Meteor.users.findOne({ _id: userId }, {}).profile.credits;
    if(userCredits >= creditsNeeded) {
      return true;
    } else {
      return false;
    }
  },
  'debitCredits': function(userId, creditsToDebit) {
    var creditsBefore = Meteor.users.findOne({ _id: userId }, {}).profile.credits;
    var credits = creditsBefore - creditsToDebit;

    Meteor.users.update(userId, { $set: {"profile.credits": credits} });
  },
  'addCredits': function(userId, creditsToLoad) {
    creditsToLoad = parseInt(creditsToLoad);
    var creditsBefore = Meteor.users.findOne({ _id: userId }, {}).profile.credits;

    if(creditsBefore) {
      var credits = creditsBefore + creditsToLoad;
    } else {
      var credits = creditsToLoad;
    }
    Meteor.users.update(userId, { $set: {"profile.credits": credits} });
  },
  'deleteCredits': function(userId) {
    Meteor.users.update(userId, { $set: {"profile.credits": 0} });
  },
  'creditsToPot': function(potName, creditsToAdd) {
    creditsToAdd = parseInt(creditsToAdd);
    var exists = PotList.findOne({ name: potName }, {});

    if(exists) {
      var potBefore = PotList.findOne({ name: potName }, {}).credits;
      var newPot = potBefore + creditsToAdd;
      PotList.update({name: potName}, { $set: {credits: newPot} });
    } else {
      PotList.insert({
        name: potName,
        credits: creditsToAdd,
        rest: 0
      });
    }
  },
  'splitWinnerPot': function(winnerTeam) {
    // Pot auf User aufteilen
    var totalBets = Meteor.users.find({ "profile.winner": { $exists: true } }, {}).count();
    var countCorrectBets = Meteor.users.find({ "profile.winner":  winnerTeam}, {}).count();

    if(countCorrectBets != 0) {
      var creditsPerCorrectBet = totalBets * 5 / countCorrectBets;
      creditsPerCorrectBet = Math.floor(creditsPerCorrectBet);
      var roundingDifference = totalBets * 5 - countCorrectBets * creditsPerCorrectBet;

      // Credits den Usern zuweisen
      Meteor.users.find({ "profile.winner": winnerTeam }, {}).forEach( function(doc) {
        var creditsBefore = Meteor.users.findOne({ _id: doc._id }, {}).profile.credits;
        Meteor.users.update({_id: doc._id}, { $set: { "profile.credits": creditsBefore + creditsPerCorrectBet } });
      });
    } else {
      var roundingDifference = totalBets * 5;
    }

    // Bei allen Usern Wette für Pot löschen
    Meteor.users.find({ "profile.winner": { $exists: true } }, {}).forEach( function(doc) {
      Meteor.users.update({ _id: doc._id }, { $unset: { "profile.winner": "" } });
    });

    // Pot aus PotList löschen
    PotList.update({ name: "winner" }, { $set: { "credits": 0 } });
    PotList.update({ name: "winner" }, { $set: { "rest": roundingDifference } });
  },
  'splitTopScorerPot': function(correctUsers) {
    var countCorrectBets = correctUsers.length;
    var totalBets = Meteor.users.find({ "profile.topScorer": { $exists: true } }, {}).count();

    if(countCorrectBets != 0) {
      var creditsPerCorrectBet = totalBets * 5 / countCorrectBets;
      creditsPerCorrectBet = Math.floor(creditsPerCorrectBet);
      var roundingDifference = totalBets * 5 - countCorrectBets * creditsPerCorrectBet;

      // Credits den usern zuweisen
      correctUsers.forEach(function(userId) {
        var creditsBefore = Meteor.users.findOne({ _id: userId }, {}).profile.credits;
        Meteor.users.update({ _id: userId }, { $set: { "profile.credits": creditsBefore + creditsPerCorrectBet } });
      });
    } else {
      var roundingDifference = totalBets * 5;
    }

    // Bei allen Usern Wette für Pot löschen
    Meteor.users.find({ "profile.topScorer": { $exists: true } }, {}).forEach( function(doc) {
      Meteor.users.update({ _id: doc._id }, { $unset: { "profile.topScorer": "" } });
    });

    // Pot aus PotList löschen
    PotList.update({ name: "topScorer" }, { $set: { "credits": 0 } });
    PotList.update({ name: "topScorer" }, { $set: { "rest": roundingDifference } });
  }
});
