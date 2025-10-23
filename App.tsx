import React, { useEffect, useMemo, useState } from 'react';
import { useScore } from './hooks/useScore.ts';
import ControlButton from './components/ControlButton';
import UndoIcon from './components/icons/UndoIcon';
import SettingsPanel from './components/SettingsPanel';
import type { TeamState, ThirdSetMode } from './types';

// --- SUB-COMPONENTS ---

const TeamRow: React.FC<{ team: TeamState; isServing: boolean; }> = ({ team, isServing }) => (
  <div className="pl-2 sm:pl-4 pr-2 py-2 h-full flex items-center gap-2">
    <div className="flex flex-col justify-center flex-grow overflow-hidden">
      <p className="font-bold text-sm sm:text-base md:text-lg uppercase truncate">{team.player1.name}</p>
      <p className="font-bold text-sm sm:text-base md:text-lg uppercase truncate">{team.player2.name}</p>
    </div>
    {/* Placeholder for alignment */}
    <div className="w-2 h-2 md:w-3 md:h-3 flex-shrink-0">
      {isServing && 
        <div className="w-full h-full bg-yellow-400 rounded-full"></div>
      }
    </div>
  </div>
);

const ScoreCell: React.FC<{ score: string | number; className?: string, animate?: boolean }> = ({ score, className = '', animate = false }) => (
  <div className={`flex items-center justify-center h-full text-2xl sm:text-3xl md:text-4xl font-bold ${className} ${animate ? 'animate-flash' : ''}`}>
    {score}
  </div>
);

const AddPointButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
    <div className="flex items-center justify-center h-full px-1 md:px-2">
        <button 
            onClick={onClick} 
            disabled={disabled}
            className="w-10 h-10 text-2xl md:w-12 md:h-12 md:text-3xl bg-white/20 hover:bg-white/40 rounded-full text-white font-bold transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            aria-label="Añadir punto"
        >
            +
        </button>
    </div>
);

const Instructions: React.FC = () => (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg text-gray-800 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Cómo Usar el Marcador</h2>
        <ul className="list-disc list-inside space-y-3">
            <li>
                <strong>Configuración:</strong> Completa los nombres y el título del partido para empezar. Puedes cambiarlo después con el ícono de engranaje (⚙️).
            </li>
            <li>
                <strong>Sumar Puntos:</strong> Haz clic en el botón <strong>+</strong> al lado de la pareja que ganó el punto.
            </li>
            <li>
                <strong>Punto de Oro:</strong> En 40-40, la casilla de "GAME" se ilumina en dorado. Quien gane el siguiente punto, gana el juego.
            </li>
            <li>
                <strong>Deshacer y Reiniciar:</strong> Usa "Deshacer" para corregir errores o reinicia desde el panel de opciones.
            </li>
        </ul>
    </div>
);

const SettingsInput: React.FC<{label: string, value: string, onChange: (value: string) => void, placeholder: string}> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
    </div>
);


// --- APP PHASES ---

const SetupScreen: React.FC<{
  state: ReturnType<typeof useScore>['state'],
  setPlayerName: (team: 'A' | 'B', player: 1 | 2, name: string) => void,
  setMatchTitle: (title: string) => void,
  setThirdSetMode: (mode: ThirdSetMode) => void,
  onComplete: () => void,
}> = ({ state, setPlayerName, setMatchTitle, setThirdSetMode, onComplete }) => {
    
    const isSetupComplete = useMemo(() => {
        return state.teamA.player1.name && state.teamA.player2.name &&
               state.teamB.player1.name && state.teamB.player2.name &&
               state.matchTitle;
    }, [state]);

    return (
        <div className="font-sans w-full max-w-lg mx-auto text-gray-800">
            <div className="bg-white rounded-lg shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Configurar Partido</h1>
                <div className="space-y-4">
                    <SettingsInput label="Título del Partido" value={state.matchTitle} onChange={setMatchTitle} placeholder="Ej: Final Torneo" />
                    <hr />
                    <h2 className="text-lg font-semibold text-gray-700">Pareja A</h2>
                    <SettingsInput label="Jugador 1" value={state.teamA.player1.name} onChange={(name) => setPlayerName('A', 1, name)} placeholder="Apellido 1" />
                    <SettingsInput label="Jugador 2" value={state.teamA.player2.name} onChange={(name) => setPlayerName('A', 2, name)} placeholder="Apellido 2" />
                    <hr />
                    <h2 className="text-lg font-semibold text-gray-700">Pareja B</h2>
                    <SettingsInput label="Jugador 1" value={state.teamB.player1.name} onChange={(name) => setPlayerName('B', 1, name)} placeholder="Apellido 3" />
                    <SettingsInput label="Jugador 2" value={state.teamB.player2.name} onChange={(name) => setPlayerName('B', 2, name)} placeholder="Apellido 4" />
                    <hr />
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Modo 3er Set</label>
                        <div className="flex gap-2 mt-1">
                            <button onClick={() => setThirdSetMode('superTiebreak')} className={`flex-1 py-2 text-sm rounded ${state.thirdSetMode === 'superTiebreak' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>Super Tiebreak</button>
                            <button onClick={() => setThirdSetMode('normal')} className={`flex-1 py-2 text-sm rounded ${state.thirdSetMode === 'normal' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>Set Normal</button>
                        </div>
                    </div>
                    <ControlButton onClick={onComplete} disabled={!isSetupComplete}>
                        Comenzar Partido
                    </ControlButton>
                </div>
            </div>
            <Instructions />
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const {
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
  } = useScore();

  const [appPhase, setAppPhase] = useState<'setup' | 'serverSelection' | 'match'>('setup');
  const { teamA, teamB, winner, server, matchTitle, setScores, currentSet } = state;
  
  const handleReset = () => {
    reset();
    setAppPhase('setup');
  }

  useEffect(() => {
    if (pointAnimation) {
      const timer = setTimeout(() => clearPointAnimation(), 400);
      return () => clearTimeout(timer);
    }
  }, [pointAnimation, clearPointAnimation]);

  const isTiebreak = useMemo(() => {
     const isSuperTiebreak = state.currentSet === 3 && state.thirdSetMode === 'superTiebreak';
     if (isSuperTiebreak) return true;
     const currentSetGamesA = state.teamA.games;
     const currentSetGamesB = state.teamB.games;
     return currentSetGamesA === 6 && currentSetGamesB === 6;
  }, [state]);

  const isPuntoDeOro = teamA.points === '40' && teamB.points === '40' && !isTiebreak;
  const gameScoreClass = isPuntoDeOro ? 'bg-gradient-to-b from-yellow-400 to-amber-600 text-black' : '';
  
  const gridLayout = "grid grid-cols-[minmax(0,_3fr)_repeat(3,_minmax(0,_1fr))_minmax(0,_1.2fr)_auto] text-center";

  const getSetScore = (team: 'A' | 'B', setIndex: number): string | number => {
    const teamGames = team === 'A' ? teamA.games : teamB.games;
    if (setIndex < setScores.length) {
      const set = setScores[setIndex];
      if (set.isSuperTiebreak) {
        return team === 'A' ? (set.pointsA ?? 0) : (set.pointsB ?? 0);
      }
      return team === 'A' ? set.gamesA : set.gamesB;
    }
    if (setIndex === currentSet - 1) {
      return teamGames;
    }
    return '';
  }

  if (appPhase === 'setup') {
    return (
        <SetupScreen
            state={state}
            setPlayerName={setPlayerName}
            setMatchTitle={setMatchTitle}
            setThirdSetMode={setThirdSetMode}
            onComplete={() => setAppPhase('serverSelection')}
        />
    );
  }

  if (appPhase === 'serverSelection') {
      return (
          <div className="font-sans w-full max-w-md mx-auto text-gray-800">
             <div className="relative bg-orange-800 text-white border-2 border-orange-400 rounded-lg shadow-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">¿Quién saca primero?</h2>
                <div className="grid grid-cols-1 gap-4">
                    <ControlButton onClick={() => { setInitialServer('A'); setAppPhase('match'); }}>
                        {`${teamA.player1.name} / ${teamA.player2.name}`}
                    </ControlButton>
                    <ControlButton onClick={() => { setInitialServer('B'); setAppPhase('match'); }}>
                        {`${teamB.player1.name} / ${teamB.player2.name}`}
                    </ControlButton>
                </div>
             </div>
             <Instructions />
          </div>
      )
  }

  return (
    
    <div className="font-sans w-full max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-orange-600 mb-4 mt-6">
        Marcador de Pádel
      </h1>
      <div className="relative">
        <SettingsPanel
          state={state}
          onSetPlayerName={setPlayerName}
          onSetMatchTitle={setMatchTitle}
          onSetThirdSetMode={setThirdSetMode}
          onReset={handleReset}
        />
        
        <div className="bg-orange-900 text-white border-2 border-orange-400 rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`${gridLayout} bg-orange-400 text-orange-950 font-bold text-xs sm:text-sm h-8 sm:h-10 items-center`}>
              <div className="text-left pl-2 sm:pl-4 uppercase">{matchTitle}</div>
              <div>SET 1</div>
              <div>SET 2</div>
              <div>SET 3</div>
              <div>GAME</div>
              <div></div>
            </div>
            
            {/* Team A */}
            <div className={`${gridLayout} h-16 sm:h-20 border-b-2 border-orange-400`}>
              <TeamRow team={teamA} isServing={server === 'A'} />
              {[0, 1, 2].map(i => <ScoreCell key={i} score={getSetScore('A', i)} />)}
              <ScoreCell score={isTiebreak ? teamA.points : teamA.points} className={gameScoreClass} animate={pointAnimation === 'A'} />
              <AddPointButton onClick={() => addPoint('A')} disabled={!!winner} />
            </div>

            {/* Team B */}
            <div className={`${gridLayout} h-16 sm:h-20`}>
              <TeamRow team={teamB} isServing={server === 'B'} />
              {[0, 1, 2].map(i => <ScoreCell key={i} score={getSetScore('B', i)} />)}
              <ScoreCell score={isTiebreak ? teamB.points : teamB.points} className={gameScoreClass} animate={pointAnimation === 'B'} />
              <AddPointButton onClick={() => addPoint('B')} disabled={!!winner} />
            </div>
        </div>

      </div>
      
      {winner && (
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-20 text-white">
        <h2 className="text-2xl md:text-4xl font-black mb-2">GANADOR</h2>
        <p className="text-xl md:text-3xl font-bold text-orange-400 text-center px-4">
          {winner === 'A' ? `${teamA.player1.name} / ${teamA.player2.name}` : `${teamB.player1.name} / ${teamB.player2.name}`}
        </p>
        <div className="mt-6">
          <ControlButton onClick={handleReset} variant="primary">
              Nuevo Partido
          </ControlButton>
        </div>
      </div>
    )}

      <div className="mt-3 max-w-3xl mx-auto">
          <ControlButton onClick={undo} variant="secondary" className="flex items-center justify-center gap-2 w-full">
              <UndoIcon /> Deshacer
          </ControlButton>
      </div>
      
      <Instructions />
    </div>
  );
};

export default App;