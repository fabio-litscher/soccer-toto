// Methods, called from the client side
Meteor.methods({
  'addBetResult': function(gameId, result1, result2) {
    BetList.insert({
      game: gameId,
      user: Meteor.userId(),
      result1: result1,
      result2: result2
    });
  },
  'removeBet': function(betId) {
    BetList.remove({ _id: betId });
  }
});
