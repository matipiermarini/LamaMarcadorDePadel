import { useState, useCallback } from 'react';
import type { ScoreState, TeamState, ThirdSetMode, Player, SetScore } from '../types';

const PADEL_POINTS = ['0', '15', '30', '40'];

const initialTeamState: Omit<TeamState, 'player1' | 'player2'> = {
  points: '0',
  games: 0,
  sets: 0,
};

const getInitialState = (): ScoreState => ({
  teamA: {
    ...initialTeamState,
    player1: { name: '' },
    player2: { name: '' },
  },
  teamB: {
    ...initialTeamState,
    player1: { name: '' },
    player2: { name: '' },
  },
  currentSet: 1,
  thirdSetMode: 'superTiebreak',
  winner: null,
  server: null, // Start with no server selected
  matchTitle: '',
  setScores: [],
});

export const useScore = () => {
  const [state, setState] = useState<ScoreState>(getInitialState());
  const [history, setHistory] = useState<ScoreState[]>([]);
  const [pointAnimation, setPointAnimation] = useState<'A' | 'B' | null>(null);

  const clearPointAnimation = useCallback(() => {
    setPointAnimation(null);
  }, []);

  const updateState = (newState: ScoreState) => {
    setHistory(prev => [...prev, state]);
    setState(newState);
  };

  const setInitialServer = useCallback((team: 'A' | 'B') => {
    updateState({ ...state, server: team });
  }, [state]);

  const addPoint = (team: 'A' | 'B') => {
    if (state.winner || !state.server) return;

    setPointAnimation(team);

    let newState = JSON.parse(JSON.stringify(state));
    const scoringTeamKey = team === 'A' ? 'teamA' : 'teamB';
    const otherTeamKey = team === 'A' ? 'teamB' : 'teamA';

    const scoringTeam = newState[scoringTeamKey];
    const otherTeam = newState[otherTeamKey];
    
    const currentGamesScoring = scoringTeam.games;
    const currentGamesOther = otherTeam.games;

    const isSuperTiebreak = newState.currentSet === 3 && newState.thirdSetMode === 'superTiebreak';
    const isTiebreak = !isSuperTiebreak && currentGamesScoring === 6 && currentGamesOther === 6;

    if (isSuperTiebreak || isTiebreak) {
      const currentPoints = parseInt(scoringTeam.points, 10) + 1;
      scoringTeam.points = currentPoints.toString();

      const otherPoints = parseInt(otherTeam.points, 10);
      const totalPointsInTiebreak = currentPoints + otherPoints;

      // Official tiebreak serving rule: switch server after the 1st point, then every 2 points.
      if ((totalPointsInTiebreak - 1) % 2 === 0 && totalPointsInTiebreak > 0) {
        newState.server = newState.server === 'A' ? 'B' : 'A';
      }

      const pointLimit = isSuperTiebreak ? 10 : 6;
      if (currentPoints > pointLimit && currentPoints >= otherPoints + 2) {
        scoringTeam.games += 1;
        awardSet(newState, team);
      }
    } else { // Regular game
      if (scoringTeam.points === '40' && otherTeam.points === '40') { // Punto de Oro
        awardGame(newState, team);
      } else if (scoringTeam.points === '40') {
        awardGame(newState, team);
      } else {
        const currentPointIndex = PADEL_POINTS.indexOf(scoringTeam.points);
        scoringTeam.points = PADEL_POINTS[currentPointIndex + 1];
      }
    }

    updateState(newState);
  };

  const awardGame = (state: ScoreState, team: 'A' | 'B') => {
    const scoringTeamKey = team === 'A' ? 'teamA' : 'teamB';
    const otherTeamKey = team === 'A' ? 'teamB' : 'teamA';

    state[scoringTeamKey].games += 1;
    state.teamA.points = '0';
    state.teamB.points = '0';
    state.server = state.server === 'A' ? 'B' : 'A';

    const scoringTeamGames = state[scoringTeamKey].games;
    const otherTeamGames = state[otherTeamKey].games;

    if ((scoringTeamGames >= 6 && scoringTeamGames >= otherTeamGames + 2) || scoringTeamGames === 7) {
      awardSet(state, team);
    }
  };

  const awardSet = (state: ScoreState, team: 'A' | 'B') => {
    const scoringTeamKey = team === 'A' ? 'teamA' : 'teamB';
    const isSuperTiebreak = state.currentSet === 3 && state.thirdSetMode === 'superTiebreak';

    // Finalize set score
    const finalSetScore: SetScore = {
      gamesA: state.teamA.games,
      gamesB: state.teamB.games,
      isSuperTiebreak: isSuperTiebreak,
      pointsA: isSuperTiebreak ? parseInt(state.teamA.points) : undefined,
      pointsB: isSuperTiebreak ? parseInt(state.teamB.points) : undefined,
    };
    state.setScores.push(finalSetScore);
    
    state[scoringTeamKey].sets += 1;
    state.teamA.games = 0;
    state.teamB.games = 0;
    state.teamA.points = '0';
    state.teamB.points = '0';

    if (state[scoringTeamKey].sets === 2) {
      state.winner = team;
    } else {
      state.currentSet += 1;
    }
  };

  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setState(lastState);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  const reset = useCallback(() => {
    const freshState = getInitialState();
    setState(freshState);
    setHistory([]);
  }, []);

  const setPlayerName = useCallback((team: 'A' | 'B', player: 1 | 2, name: string) => {
    setState(prev => {
      const teamKey = team === 'A' ? 'teamA' : 'teamB';
      const playerKey = player === 1 ? 'player1' : 'player2';
      const newState = JSON.parse(JSON.stringify(prev));
      newState[teamKey][playerKey].name = name;
      return newState;
    });
  }, []);
  
  const setMatchTitle = useCallback((title: string) => {
      setState(prev => ({...prev, matchTitle: title}));
  }, []);

  const setThirdSetMode = useCallback((mode: ThirdSetMode) => {
    setState(prev => ({ ...prev, thirdSetMode: mode }));
  }, []);

  return {
    state,
    pointAnimation,
    addPoint,
    undo,
    reset,
    setPlayerName,
    setMatchTitle,
    setThirdSetMode,
    setInitialServer,
    clearPointAnimation,
  };
};