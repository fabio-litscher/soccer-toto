// navigation template helpers
Template.navigation.helpers({
  'userIsAdmin': function() {
    if (Meteor.user()) {
      var shortname = Meteor.user().profile.shortname;
      var admins = ["stjo", "bret", "lfab"];                          // vorläufig einfach alle Admins in einem Array gespeichert, später in DB

      if(admins.indexOf(shortname) > -1) {
        return true;
      } else {
        return false;
      }
    }
  }
});
