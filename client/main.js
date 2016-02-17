// Collections von Server entgegennehmen
Meteor.subscribe('theTeams');
Meteor.subscribe('theGroups');
Meteor.subscribe('theGames');
Meteor.subscribe('theBet');
Meteor.subscribe('ThePots');
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
