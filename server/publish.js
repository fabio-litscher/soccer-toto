// Collections für client freigeben
Meteor.publish('theTeams', function(){
  return TeamList.find();
});
Meteor.publish('theGroups', function(){
  return GroupList.find();
});
Meteor.publish('theGames', function(){
  return GameList.find();
});
Meteor.publish('theBet', function(){
  return BetList.find();
});
Meteor.publish('thePots', function(){
  return PotList.find();
});
Meteor.publish("users", function(){
  return Meteor.users.find({});
});
Meteor.publish("messages", function(){
  return MessageList.find();
});
Meteor.publish("topScorer", function(){
  return TopScorerList.find();
});
