// Methods, called from the client side
Meteor.methods({
  'addWinner': function(userId, winnerTeamId) {
    Meteor.users.update(userId, { $set: {"profile.winnerTeam": winnerTeamId} });
  },
  'addTopScorer': function(userId, topScorer) {
    Meteor.users.update(userId, { $set: {"profile.topScorer": topScorer} });
  }
});
