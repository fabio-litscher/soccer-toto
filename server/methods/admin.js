// Methods, called from the client side
Meteor.methods({
  'resetUsersPassword': function(userId, newPassword) {
    Accounts.setPassword(userId, newPassword);
  },
  'changeUsersEmail': function(userId, newEmail) {
    Meteor.users.update({ _id: userId }, { $set: {'emails.0.address': newEmail } });
  },
  'changeUsersShortname': function(userId, newShortname) {
    Meteor.users.update({ _id: userId }, { $set: {'profile.shortname': newShortname } });
  },
  'changeUsersTopScorer': function(userId, newTopScorer) {
    Meteor.users.update({ _id: userId }, { $set: {'profile.topScorer': newTopScorer } });
  },
  'insertTopScorerPlayer': function(playerName, goals) {
    TopScorerList.insert({
      name: playerName,
      countGoals: goals
    });
  },
  'insertNewTeam': function(teamName, teamShortname) {
    TeamList.insert({
      name: teamName,
      shortname: teamShortname,
      gamesCount: 0,
      wins: 0,
      draws: 0,
      lost: 0,
      goalsMade: 0,
      goalsGot: 0,
      points: 0
    });
  },
  'removeTopScorerPlayer': function(topScorerId) {
    TopScorerList.remove({ _id: topScorerId });
  },
  'removeTeam': function(selectedTeam) {
    // Alle Spiele löschen in der die Mannschaft vorkommt
    GameList.find({ $or: [ { team1: selectedTeam }, { team2: selectedTeam } ] }, {}).forEach( function(doc) {
      GameList.remove({ _id: doc._id });
    });
    TeamList.remove({_id: selectedTeam});
  },
  'insertNewGroup': function(groupName) {
    GroupList.insert({
      name: groupName
    });
  },
  'removeGroup': function(selectedGroup) {
    // Gruppe aus allen Teams löschen, die diese Gruppe hinterlegt haben
    TeamList.find({ group: selectedGroup }, {}).forEach( function(doc) {
      TeamList.update({_id: doc._id}, { $unset: {group: ""} });
    });
    // Alle Gruppenspiele der zu löschenden Gruppe löschen
    GameList.find({ group: selectedGroup }, {}).forEach( function(doc) {
      GameList.remove({ _id: doc._id });
    });
    // Gruppe aus collection löschen
    GroupList.remove({_id: selectedGroup});
  },
  'addTeamToGroup': function(selectedTeam, selectedTeamGroup) {
    TeamList.update({_id: selectedTeam}, { $set: {group: selectedTeamGroup} });
  },
  'insertNewGame': function(gameDate, gameTime, gameDateTime, gameGroup, gameTeam1, gameTeam2, knockoutRound) {
    GameList.insert({
      date: gameDate,
      time: gameTime,
      datetime: gameDateTime,
      group: gameGroup,
      team1: gameTeam1,
      team2: gameTeam2,
      knockoutRound: knockoutRound,
      knockoutWinner: null
    });
  },
  'insertGameResult': function(gameId, resultTeam1, resultTeam2, bet, knockoutWinner) {

    // Punkte, Sieg/Niederlage/Unentschieden, Tore an Teams verteilen, wenn Gruppenspiel
    var game = GameList.findOne({_id: gameId}, {});
    if (game.group != "noGroupGame") {
      GameList.update(
        { _id: gameId },
        { $set:
          {
            result1: resultTeam1,
            result2: resultTeam2
          }
        }
      );
      if (resultTeam1 > resultTeam2) {                                                                    // Team1 hat gewonnen
        var pointsTeam1 = TeamList.findOne({_id: game.team1}, {}).points + 3;
        var winsTeam1 = TeamList.findOne({_id: game.team1}, {}).wins + 1;
        var lostTeam2 = TeamList.findOne({_id: game.team2}, {}).lost + 1;

        TeamList.update({_id: game.team1}, { $set: {points: pointsTeam1, wins: winsTeam1} });
        TeamList.update({_id: game.team2}, { $set: {lost: lostTeam2} });
      }
      else if (resultTeam1 < resultTeam2) {                                                               // Team2 hat gewonnen
        var pointsTeam2 = TeamList.findOne({_id: game.team2}, {}).points + 3;
        var winsTeam2 = TeamList.findOne({_id: game.team2}, {}).wins + 1;
        var lostTeam1 = TeamList.findOne({_id: game.team1}, {}).lost + 1;

        TeamList.update({_id: game.team2}, { $set: {points: pointsTeam2, wins: winsTeam2} });
        TeamList.update({_id: game.team1}, { $set: {lost: lostTeam1} });
      }
      else {                                                                                              // Unentschieden
        var pointsTeam1 = TeamList.findOne({_id: game.team1}, {}).points + 1;
        var pointsTeam2 = TeamList.findOne({_id: game.team2}, {}).points + 1;
        var drawsTeam1 = TeamList.findOne({_id: game.team1}, {}).draws + 1;
        var drawsTeam2 = TeamList.findOne({_id: game.team2}, {}).draws + 1;

        TeamList.update({_id: game.team1}, { $set: {points: pointsTeam1, draws: drawsTeam1} });
        TeamList.update({_id: game.team2}, { $set: {points: pointsTeam2, draws: drawsTeam2} });
      }

      // Tore an Teams verteilen
      var gamesCountTeam1 = TeamList.findOne({_id: game.team1}, {}).gamesCount + 1;
      var gamesCountTeam2 = TeamList.findOne({_id: game.team2}, {}).gamesCount + 1;
      var goalsMadeTeam1 = parseInt(TeamList.findOne({_id: game.team1}, {}).goalsMade) + parseInt(resultTeam1);
      var goalsMadeTeam2 = parseInt(TeamList.findOne({_id: game.team2}, {}).goalsMade) + parseInt(resultTeam2);
      var goalsGotTeam1 = parseInt(TeamList.findOne({_id: game.team1}, {}).goalsGot) + parseInt(resultTeam2);
      var goalsGotTeam2 = parseInt(TeamList.findOne({_id: game.team2}, {}).goalsGot) + parseInt(resultTeam1);

      TeamList.update({_id: game.team1}, { $set: {gamesCount: gamesCountTeam1, goalsMade: goalsMadeTeam1, goalsGot: goalsGotTeam1} });
      TeamList.update({_id: game.team2}, { $set: {gamesCount: gamesCountTeam2, goalsMade: goalsMadeTeam2, goalsGot: goalsGotTeam2} });
    }
    else {
      // wenn kein gruppenspiel
      GameList.update(
        { _id: gameId },
        { $set:
          {
            result1: resultTeam1,
            result2: resultTeam2,
            knockoutWinner: knockoutWinner
          }
        }
      );
    }

    // Credits neu verteilen
    // Pot ausrechnen, anhand von anzahl wetten & wetteinsatz
    var totalBets = BetList.find({ game: gameId }, {}).count();
    var totalGamePot = totalBets * bet;

    // Pot auf alle richtigen Ergebnisse aufteilen
    var countCorrectBets = BetList.find({ game: gameId, result1: resultTeam1, result2: resultTeam2 }, {}).count();
    if(countCorrectBets == 0) {
      var creditsPerBet = 0;
    } else {
      var creditsPerBet = totalGamePot / countCorrectBets;
      creditsPerBet = Math.floor(creditsPerBet);
    }

    // Credits an entsprechende User übertragen
    var countUsers = 0;
    BetList.find({ game: gameId, result1: resultTeam1, result2: resultTeam2 }, {}).forEach( function(doc) {
      Meteor.call('addCredits', doc.user, creditsPerBet);
      countUsers = countUsers + 1;
    });

    console.log(totalGamePot);
    console.log(countUsers);
    console.log(creditsPerBet);

    // Rundungsdifferenz in Sieger-Pott übertragen
    var roundingDifference = totalGamePot - countUsers * creditsPerBet;

    console.log("in insertGameResult function (rounding):");
    console.log(roundingDifference);

    Meteor.call('creditsToPot', "winner", roundingDifference);
  },
  'clearTeamStatistics': function() {
    TeamList.find({}, {}).forEach( function(doc) {
      TeamList.update({ _id: doc._id }, { $set: {points: 0, wins: 0, draws: 0, lost: 0, gamesCount: 0, goalsMade: 0, goalsGot: 0} });
    });
  },
  'clearGames': function() {
    GameList.remove({});
  },
  'removeGame': function(gameId) {
    GameList.remove({ _id: gameId });
  },
  'removePot': function(potName) {
    PotList.remove({ name: potName });
  }
});

Accounts.onCreateUser(function(options, user) {
    //user is not an admin
    user.isAdmin=false;
    var shortname="";
    if (options.profile) {
      user.profile=options.profile;
      shortname=user.profile.shortname;
    }

    var admins = ["stjo", "bret", "pire"];
    if(admins.indexOf(shortname) > -1) user.isAdmin=true;

    return user;
});
