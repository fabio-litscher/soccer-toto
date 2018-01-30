// Methods, called from the client side
Meteor.methods({
  'myTotalWonCredits': function() {
    // we have to refresh, start with 0
    totalWonCredits=0;
    BetList.find({ user: Meteor.userId() }, { sort: {date: 1, time: 1} }).forEach( function(doc) {
      if(GameList.findOne({ _id: doc.game })) {
        var result1 = GameList.findOne({ _id: doc.game }).result1;
        var result2 = GameList.findOne({ _id: doc.game }).result2;
        if(result1 != undefined && (doc.result1 == result1 && doc.result2 == result2)) {
          var totalBets = BetList.find({ game: doc.game }, {}).count();
          var totalGamePot = totalBets * 2;
          var countCorrectBets = BetList.find({ game: doc.game, result1: result1, result2: result2 }, {}).count();
          var creditsPerBet = totalGamePot / countCorrectBets;
          creditsPerBet = Math.floor(creditsPerBet);

          totalWonCredits = totalWonCredits + creditsPerBet;
        }
      }
    });
    console.log("myTotalWonCredits="+totalWonCredits);
    Meteor.users.update(Meteor.userId(), { $set: {"profile.totalWonCredits": totalWonCredits} });
  },
  'myRecalcAll': function() {
    Meteor.call('thisRecalcAll',Meteor.userId())
    console.log("myRecalcAll");
  },
  'thisRecalcAll': function(userid){
    // set all cached data invalid!
    Meteor.users.update(userid, { $set: {
        "profile.totalWonCredits": -1,
        "profile.totalLostCredits": -1
      } });
    console.log("thisRecalcAll: "+userid);
  },
  'myTotalLostCredits': function() {
    var totalLostCredits = 0;
    BetList.find({ user: Meteor.userId() }, { sort: {date: 1, time: 1} }).forEach( function(doc) {
      if(GameList.findOne({ _id: doc.game })) {
        var result1 = GameList.findOne({ _id: doc.game }).result1;
        var result2 = GameList.findOne({ _id: doc.game }).result2;
        if(result1 != undefined && (doc.result1 != result1 || doc.result2 != result2)) {
          totalLostCredits = totalLostCredits + 2;
        }
      }
    });

    console.log("myTotalLostCredits="+totalLostCredits);
    Meteor.users.update(Meteor.userId(), { $set: {"profile.totalLostCredits": totalLostCredits} });
  }

});
