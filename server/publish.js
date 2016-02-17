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
  var currentUserId = this.userId;
  return BetList.find({user: currentUserId});
});
Meteor.publish('thePots', function(){
  return PotList.find();
});
Meteor.publish("users", function(){
  return Meteor.users.find({});
})
