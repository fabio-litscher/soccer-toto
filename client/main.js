// Routing mit iron:router
Router.configure({
  layoutTemplate: 'main'
});
Router.route('/', {
  name: 'start',
  template: 'groups'
});
Router.route('/logout', {
  name: 'logout',
  template: 'login'
});
Router.route('/login');
Router.route('/games');
Router.route('/myAccount');
Router.route('/admin');


// Collections von Server entgegennehmen
Meteor.subscribe('theTeams');
Meteor.subscribe('theGroups');
Meteor.subscribe('theGames');
Meteor.subscribe('theBet');
Meteor.subscribe('thePots');
Meteor.subscribe("users");

Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'shortname',
        fieldLabel: 'Kurzzeichen',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Bitte Kurzzeichen angeben!");
            return false;
          } else {
            return true;
          }
        }
    }]
});

// Sprache auf Deutsch setzen
accountsUIBootstrap3.setLanguage('de');
