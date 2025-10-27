import React, { useEffect, useMemo, useState } from 'react';
import { useScore } from './hooks/useScore.ts';
import ControlButton from './components/ControlButton';
import UndoIcon from './components/icons/UndoIcon';
import SettingsPanel from './components/SettingsPanel';
import type { TeamState, ThirdSetMode } from './types';
import ResetIcon from './components/icons/ResetIcon.tsx';

// --- SUB-COMPONENTS ---

const TeamRow: React.FC<{ team: TeamState; isServing: boolean; }> = ({ team, isServing }) => (
  <div className="h-full flex items-center px-0">
    <div className="text-left pl-2 relative flex-1 min-w-0">
      {isServing && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400 pointer-events-none" />
      )}
      <div>
        <p className="font-bold text-sm sm:text-sm md:text-lg uppercase truncate leading-tight">{team.player1.name}</p>
        <p className="font-bold text-sm sm:text-sm md:text-lg uppercase truncate leading-tight">{team.player2.name}</p>
      </div>
    </div>
  </div>
);



const ScoreCell: React.FC<{ score: string | number; className?: string, animate?: boolean }> = ({ score, className = '', animate = false }) => (
  <div className={`flex items-center justify-center h-full text-2xl sm:text-3xl md:text-4xl font-extrabold ${className} ${animate ? 'animate-flash' : ''}`}>
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
                <strong>Configuración:</strong> Completa los nombres y el título del partido para empezar. Puedes cambiarlo después haciendo clic en el botón <strong>“Editar”</strong> debajo del marcador.
            </li>
            <li>
                <strong>Formato de tercer set:</strong> Debes seleccionar uno de los dos formatos para el tercer set que hay "tercer set normal" o "super Tiebreak a 11 por diferencia de 2".
            </li>
            <li>
                <strong>Elegir sacador:</strong> Luego de presionar "Comenzar partido", debes seleccionar cual sera la pareja que saca primero.
            </li>
            <li>
                <strong>Sumar Puntos:</strong> Haz clic en el botón con fondo naranja con los nombres de las parejas quiera sumar un punto.
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
        <div className="font-sans w-full max-w-xl mx-auto text-gray-800 relative overflow-x-hidden">
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7L8 12" />
  </svg>
);
/// GRID COMPACTO: primera columna flexible para nombres, luego sets y game con ancho fijo (px)
const gridLayout = "grid grid-cols-[1fr_56px_56px_56px_64px_0px] gap-0 items-center text-center";
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
          <div className="font-sans w-full max-w-xl mx-auto text-gray-800">
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
    
    <div className="font-sans w-full max-w-[450px] mx-auto text-gray-800">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-orange-600 mb-4 mt-6">
        Marcador de Pádel
      </h1>
      <div className="relative">
        
        
        <div className="bg-orange-900 text-white border-2 border-orange-400 rounded-lg shadow-2xl overflow-hidden w-full max-w-full">
            {/* Header */}
            <div className={`${gridLayout} bg-orange-400 text-orange-950 font-bold text-[10px] sm:text-xs h-7 sm:h-8`}>
              <div className="text-left w-0 pl-3 sm:pl-4 px-0 uppercase text-xl sm:text-xl font-bold">{matchTitle}</div>
              <div>SET 1</div>
              <div>SET 2</div>
              <div>SET 3</div>
              <div>GAME</div>
              <div></div>
            </div>
            
            {/* Team A - Solo puntajes, sin botón + */}
            <div className={`${gridLayout} h-16 sm:h-20 border-b-2 border-orange-400`}>
              <TeamRow team={teamA} isServing={server === 'A'} />
              {[0, 1, 2].map(i => <ScoreCell key={i} score={getSetScore('A', i)} />)}
              <ScoreCell score={isTiebreak ? teamA.points : teamA.points} className={gameScoreClass} animate={pointAnimation === 'A'} />
              <div className="flex items-center justify-center w-0 h-full"> {/* Espacio vacío donde estaba el botón */}</div>
            </div>

            {/* Team B - Solo puntajes, sin botón + */}
            <div className={`${gridLayout} h-16 sm:h-20`}>
              <TeamRow team={teamB} isServing={server === 'B'} />
              {[0, 1, 2].map(i => <ScoreCell key={i} score={getSetScore('B', i)} />)}
              <ScoreCell score={isTiebreak ? teamB.points : teamB.points} className={gameScoreClass} animate={pointAnimation === 'B'} />
              <div className="flex items-center justify-center w-0 h-full"> {/* Espacio vacío donde estaba el botón */}</div>
            </div>
        </div>
        
      {/* Botones para sumar puntos, debajo del marcador */}
      <div className="mt-4 flex justify-center gap-4">
        <button 
          onClick={() => addPoint('A')} 
          disabled={!!winner}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-bold transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-30 flex-1 disabled:cursor-not-allowed"
          aria-label={`Sumar punto a ${teamA.player1.name} / ${teamA.player2.name}`}
        >
          {teamA.player1.name} / {teamA.player2.name}
        </button>
        <button 
          onClick={() => addPoint('B')} 
          disabled={!!winner}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-bold transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-30 flex-1 disabled:cursor-not-allowed"
          aria-label={`Sumar punto a ${teamB.player1.name} / ${teamB.player2.name}`}
        >
          {teamB.player1.name} / {teamB.player2.name}
        </button>
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

            {/* Botón Editar */}
            {/* Botón Editar con ControlButton */}
      <div className="mt-2 max-w-3xl mx-auto">
        <ControlButton 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
          variant="secondary" 
          className="w-full flex items-center justify-center gap-2"
        >
          <EditIcon /> Editar
        </ControlButton>
      </div>
      
            {/* Panel de configuración que se despliega hacia abajo */}
      {isSettingsOpen && (
        <div className="mt-2 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-200 w-full max-w-3xl mx-auto">
          <h3 className="font-bold text-gray-700 mb-3 text-lg">Opciones</h3>
          
          <div className="space-y-4">
            {/* Título del Partido */}
            <SettingsInput label="Título del Partido" value={state.matchTitle} onChange={setMatchTitle} />
            
            <hr className="my-3" />
            
            {/* Pareja A - Jugadores en fila */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Pareja A - Jugador 1</label>
                <input 
                  type="text" 
                  value={state.teamA.player1.name} 
                  onChange={(e) => setPlayerName('A', 1, e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Pareja A - Jugador 2</label>
                <input 
                  type="text" 
                  value={state.teamA.player2.name} 
                  onChange={(e) => setPlayerName('A', 2, e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <hr className="my-3" />
            
            {/* Pareja B - Jugadores en fila */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Pareja B - Jugador 1</label>
                <input 
                  type="text" 
                  value={state.teamB.player1.name} 
                  onChange={(e) => setPlayerName('B', 1, e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Pareja B - Jugador 2</label>
                <input 
                  type="text" 
                  value={state.teamB.player2.name} 
                  onChange={(e) => setPlayerName('B', 2, e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <hr className="my-3" />
            
            {/* Modo 3er Set */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Modo 3er Set</label>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setThirdSetMode('superTiebreak')} className={`flex-1 py-1 text-sm rounded ${state.thirdSetMode === 'superTiebreak' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>Super Tiebreak</button>
                <button onClick={() => setThirdSetMode('normal')} className={`flex-1 py-1 text-sm rounded ${state.thirdSetMode === 'normal' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>Normal</button>
              </div>
            </div>

            {/* Botones: Aceptar y Reiniciar */}
            <div className="flex gap-2 pt-2">
              <ControlButton 
                onClick={() => setIsSettingsOpen(false)} 
                variant="secondary" 
                className="flex-1 flex items-center justify-center gap-2"
              >
                ✔️ Aceptar
              </ControlButton>
              <ControlButton 
                onClick={handleReset} 
                variant="secondary" 
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ResetIcon /> Reiniciar
              </ControlButton>
            </div>
          </div>
        </div>
      )}

      <Instructions />
    </div>
  );
};

export default App;