// Routing mit iron:router
Router.configure({
  layoutTemplate: 'main'
});
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/logout', {
  name: 'logout',
  template: 'login_register'
});
Router.route('/loginRegister');
Router.route('/rules');
Router.route('/betRankingPage');
Router.route('/groups');
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
Meteor.subscribe("messages");
