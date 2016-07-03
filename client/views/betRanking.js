
Template.betRanking.helpers({
  'rankingUsers': function() {
    var wonBets = [];
    BetList.find({}, { sort: {user: 1} }).forEach( function(doc) {
      if(GameList.findOne({ _id: doc.game })) {
        var result1 = GameList.findOne({ _id: doc.game }).result1;
        var result2 = GameList.findOne({ _id: doc.game }).result2;
        if(result1 != undefined && (doc.result1 == result1 && doc.result2 == result2)) {
          wonBets.push(doc);
        }
      }
    });

    var users = [];
    var i = 0;
    var k = 0;
    wonBets.forEach( function(doc) {
      if(k == 0) {
        var countTotalBets = BetList.find({ game: doc.game }).count();
        console.log(countTotalBets);
        users[i] = {
          user: doc.user,
          wonBets: 1,
          totalBets: parseInt(countTotalBets)
        };
        k = 1;
      }
      else {
        if(doc.user == users[i].user) {
          users[i].wonBets += 1;
          if(doc.game != gameBefore) {
            var countTotalBets = BetList.find({ game: doc.game }).count();
            users[i].totalBets += parseInt(countTotalBets);
          }
        }
        else {
          i++;
          var countTotalBets = BetList.find({ game: doc.game }).count();
          users[i] = {
            user: doc.user,
            wonBets: 1,
            totalBets: parseInt(countTotalBets)
          }
        }
      }
      var gameBefore = doc.game;
    });

    users.sort(function(a,b) {return (a.wonBets > b.wonBets) ? -1 : ((b.wonBets > a.wonBets) ? 1 : 0);} );

    return users;
  },
  'username': function() {
    return Meteor.users.findOne(this.user).profile.shortname;
  },
  'userBalance': function() {
    var totalWonCredits = 0;
    var totalLostCredits = 0;
    BetList.find({ user: this.user }, { sort: {date: 1, time: 1} }).forEach( function(doc) {
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
        else if(result1 != undefined && (doc.result1 != result1 || doc.result2 != result2)) {
          totalLostCredits = totalLostCredits + 2;
        }
      }
    });
    return totalWonCredits - totalLostCredits;
  }
});
