import axios from 'axios';

import apiKeys from '../../db/apiKeys.json';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getAllPlayersFromDb = () => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/players.json`)
    .then((result) => {
      const allPlayersObject = result.data;
      const allPlayersArray = [];
      if (allPlayersObject != null) {
        Object.keys(allPlayersObject).forEach((playerId) => {
          const newPlayer = allPlayersObject[playerId];
          newPlayer.id = playerId;
          allPlayersArray.push(newPlayer);
        });
      }
      resolve(allPlayersArray);
    })
    .catch((error) => {
      reject(error);
    });
});

const getPlayersByTeam = teamId => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/players.json?orderBy="teamId"&equalTo="${teamId}"`)
    .then((result) => {
      // problem:  result is an object and I need it to be an array
      const allPlayerssObject = result.data;
      const allPlayersArray = [];
      if (allPlayerssObject != null) {
        Object.keys(allPlayerssObject).forEach((playersId) => {
          const newPlayer = allPlayerssObject[playersId];
          newPlayer.id = playersId;
          allPlayersArray.push(newPlayer);
        });
      }
      resolve(allPlayersArray);
    })
    .catch((err) => {
      reject(err);
    });
});

const getAllTeamsFromDb = () => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/teams.json`)
    .then((result) => {
      // problem:  result is an object and I need it to be an array
      const allTeamsObject = result.data;
      const allTeamsArray = [];
      if (allTeamsObject != null) {
        Object.keys(allTeamsObject).forEach((teamId) => {
          const newTeam = allTeamsObject[teamId];
          newTeam.id = teamId;
          allTeamsArray.push(newTeam);
        });
      }
      resolve(allTeamsArray);
    })
    .catch((err) => {
      reject(err);
    });
});

const getAllPositionsFromDb = () => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/positions.json`)
    .then((result) => {
      // problem:  result is an object and I need it to be an array
      const allPositionsObject = result.data;
      const allPositionsArray = [];
      if (allPositionsObject != null) {
        Object.keys(allPositionsObject).forEach((positionsId) => {
          const newPosition = allPositionsObject[positionsId];
          newPosition.id = positionsId;
          allPositionsArray.push(newPosition);
        });
      }
      resolve(allPositionsArray);
    })
    .catch((err) => {
      reject(err);
    });
});

const getFullPlayerInfo = players => Promise.all([getAllTeamsFromDb(), getAllPositionsFromDb()])
  .then((dataArray) => {
    const playersFromDb = players;
    const teamsFromDb = dataArray[0];
    const positionsFromDb = dataArray[1];
    const newPlayers = [];
    playersFromDb.forEach((player) => {
      const newPlayer = player;
      teamsFromDb.forEach((team) => {
        if (player.teamId === team.id) {
          newPlayer.team = team.name;
        }
      });
      positionsFromDb.forEach((position) => {
        if (player.positionId === position.id) {
          newPlayer.position = position.name;
        }
      });
      newPlayers.push(newPlayer);
    });
    return Promise.resolve(newPlayers);
  })
  .catch((error) => {
    console.error({ error });
  });

export default {
  getAllPlayersFromDb,
  getPlayersByTeam,
  getAllTeamsFromDb,
  getFullPlayerInfo,
};
