// Methods, called from the client side
Meteor.methods({
  'addBetResult': function(gameId, result1, result2) {
    result1=parseInt(result1); if (isNaN(result1)) result1=0;
    result2=parseInt(result2); if (isNaN(result2)) result2=0;

    // check if entry just exist
    var exist=BetList.findOne({
      game: gameId,
      user: Meteor.userId(),
      result1: result1,
      result2: result2
    });
    if (exist) return false; // still exist, no need to enter

    var newBetId=BetList.insert({
      game: gameId,
      user: Meteor.userId(),
      result1: result1,
      result2: result2
    });

    Meteor.users.update(Meteor.userId(), { $push: {bets: newBetId} });
    return true;
  },
  'removeBet': function(betId) {
    BetList.remove({ _id: betId });
    Meteor.users.update(Meteor.userId(), { $pull: {bets: betId} });
  }
});
