Template.register.events({
  'submit form.register': function(event){
      event.preventDefault();
      var email = $('[name=registerEmail]').val();
      var shortname = $('[name=registerShortname]').val();
      var password = $('[name=registerPassword]').val();

      Accounts.createUser({
          email: email,
          password: password,
          profile: {
            shortname: shortname
          }
      });
      Router.go('home');
  }
});

Template.login.events({
  'submit form.login': function(event){
    event.preventDefault();
    var email = $('[name=loginEmail]').val();
    var password = $('[name=loginPassword]').val();
    Meteor.loginWithPassword(email, password);
    Router.go('home');
  }
});
