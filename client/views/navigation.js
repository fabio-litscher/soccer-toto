// navigation template events
Template.navigation.events({
  '': function(){

  }
});

// navigation template helpers
Template.navigation.helpers({
  'noAdminHidden': function() {
    if (Meteor.user()) {
      var shortname = Meteor.user().profile.shortname;
      var admins = ["stjo", "bret", "lfab", ""];              // vorläufig einfach alle Admins in einem Array gespeichert, später evtl in collection

      if(admins.indexOf(shortname) > -1) {
        return true;
      } else {
        return "hidden";
      }
    }
  },
  'noUserHidden': function() {
    if(!Meteor.user()) {
      return "hidden";
    }
  }
});
