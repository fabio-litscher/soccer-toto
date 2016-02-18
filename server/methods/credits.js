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
        credits: creditsToAdd
      });
    }
  },
  'deletePot': function(potName) {
    // Pot aus PotList löschen
    console.log(potName);
    PotList.remove({ name: potName }, {});

    // Bei allen Usern Wette für Pot löschen
  }
});
