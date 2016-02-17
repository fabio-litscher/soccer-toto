// groupOverview template events
Template.groupOverview.events({

});

// groupOverview template helpers
Template.groupOverview.helpers({
  'groups': function() {
    return GroupList.find({}, {sort: {name: 1} });
  },
  'teams': function() {
    return TeamList.find({group: this._id}, {sort: {points: -1} }).map(function(document, index) {
      document.index = index + 1;
      return document;
    });
  }
});
