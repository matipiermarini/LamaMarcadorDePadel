import React, { useState } from 'react';
import type { ThirdSetMode, ScoreState } from '../types';
import ControlButton from './ControlButton';
import ResetIcon from './icons/ResetIcon';

interface SettingsPanelProps {
  state: ScoreState;
  onSetPlayerName: (team: 'A' | 'B', player: 1 | 2, name: string) => void;
  onSetMatchTitle: (title: string) => void;
  onSetThirdSetMode: (mode: ThirdSetMode) => void;
  onReset: () => void;
}

const SettingsInput: React.FC<{label: string, value: string, onChange: (value: string) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
    </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  state,
  onSetPlayerName,
  onSetMatchTitle,
  onSetThirdSetMode,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-2 right-0 z-30 translate-x-full ml-2">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="bg-gray-700 text-white rounded-full p-2 shadow-lg hover:bg-gray-600 transition"
        aria-label="Toggle Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isExpanded && (
        <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-2xl w-72 z-10 border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-3 text-lg">Opciones</h3>
          <div className="space-y-4">
            <SettingsInput label="Título del Partido" value={state.matchTitle} onChange={onSetMatchTitle} />
            <hr/>
            <SettingsInput label="Pareja A - Jugador 1" value={state.teamA.player1.name} onChange={(name) => onSetPlayerName('A', 1, name)} />
            <SettingsInput label="Pareja A - Jugador 2" value={state.teamA.player2.name} onChange={(name) => onSetPlayerName('A', 2, name)} />
            <hr/>
            <SettingsInput label="Pareja B - Jugador 1" value={state.teamB.player1.name} onChange={(name) => onSetPlayerName('B', 1, name)} />
            <SettingsInput label="Pareja B - Jugador 2" value={state.teamB.player2.name} onChange={(name) => onSetPlayerName('B', 2, name)} />
            <hr/>
            <div>
              <label className="block text-sm font-medium text-gray-600">Modo 3er Set</label>
              <div className="flex gap-2 mt-1">
                <button onClick={() => onSetThirdSetMode('superTiebreak')} className={`flex-1 py-1 text-sm rounded ${state.thirdSetMode === 'superTiebreak' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>Super Tiebreak</button>
                <button onClick={() => onSetThirdSetMode('normal')} className={`flex-1 py-1 text-sm rounded ${state.thirdSetMode === 'normal' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>Normal</button>
              </div>
            </div>
            <ControlButton onClick={onReset} variant="secondary" className="w-full flex items-center justify-center gap-2">
              <ResetIcon /> Reiniciar Partido
            </ControlButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;