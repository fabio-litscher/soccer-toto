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
      }, function(error){
        if(error){
            console.log(error.reason); // Output error if registration fails
            $("#registerError").removeClass('hidden');
        } else {
            Router.go("home"); // Redirect user if registration succeeds
        }
      });
  }
});

Template.login.events({
  'submit form.login': function(event){
    event.preventDefault();
    var email = $('[name=loginEmail]').val();
    var password = $('[name=loginPassword]').val();
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
        console.log(error.reason);
        $("#loginError").removeClass('hidden');
      } else {
        Router.go("home");
      }
    });
  }
});
