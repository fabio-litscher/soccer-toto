// Methods, called from the client side
Meteor.methods({
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
  'removeTeam': function(selectedTeam) {
    TeamList.remove({_id: selectedTeam});
  },
  'insertNewGroup': function(groupName) {
    GroupList.insert({
      name: groupName
    });
  },
  'removeGroup': function(selectedGroup) {
    GroupList.remove({_id: selectedGroup});
  },
  'addTeamToGroup': function(selectedTeam, selectedTeamGroup) {
    TeamList.update({_id: selectedTeam}, { $set: {group: selectedTeamGroup} });
  },
  'insertNewGame': function(gameDate, gameTime, gameGroup, gameTeam1, gameTeam2) {
    GameList.insert({
      date: gameDate,
      time: gameTime,
      group: gameGroup,
      team1: gameTeam1,
      team2: gameTeam2
    });
  },
  'insertGameResult': function(gameId, resultTeam1, resultTeam2, bet) {
    GameList.update(
      { _id: gameId },
      { $set:
        {
          result1: resultTeam1,
          result2: resultTeam2
        }
      }
    );

    // Punkte, Sieg/Niederlage/Unentschieden, Tore an Teams verteilen, wenn Gruppenspiel
    var game = GameList.findOne({_id: gameId}, {});
    if (game.group != "noGroupGame") {
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
      TeamList.update({_id: game.team1}, { $set: {goalsMade: resultTeam1, goalsGot: resultTeam2} });
      TeamList.update({_id: game.team2}, { $set: {goalsMade: resultTeam2, goalsGot: resultTeam1} });
    }
    else {
      // wenn kein gruppenspiel
    }

    // Credits neu verteilen
    // Pot ausrechnen, anhand von anzahl wetten & wetteinsatz
    var totalBets = BetList.find({ game: gameId }, {}).count();
    var totalGamePot = totalBets * bet;

    // Pot auf alle richtigen Ergebnisse aufteilen
    var countCorrectBets = BetList.find({ game: gameId, result1: resultTeam1, result2: resultTeam2 }, {}).count();
    var creditsPerBet = totalGamePot / countCorrectBets;

    BetList.find({ game: gameId, result1: resultTeam1, result2: resultTeam2 }, {}).forEach( function(doc) {
      Meteor.call('addCredits', doc.user, creditsPerBet);
    });
  },
  'clearTeamStatistics': function() {
    TeamList.find({}, {}).forEach( function(doc) {
      TeamList.update({ _id: doc._id }, { $set: {points: 0, wins: 0, draws: 0, lost: 0, gamesCount: 0, goalsMade: 0, goalsGot: 0} });
    });
  },
  'clearGames': function() {
    GameList.remove({});
  }
});
