const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE =
  envApiUrl?.replace(/\/+$/, '') ||
  'https://ultimate-tic-tac-toe-8fp1.onrender.com';

export interface GameConfig {
    mode: string;
    difficulty?: number;
}

export const fetchGameState = async () => {
    const response = await fetch(`${API_BASE}/game/state`);
    return response.json();
};

export const makeMove = async (boardIdx: number, cellIdx: number) => {
    const response = await fetch(`${API_BASE}/game/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_idx: boardIdx, cell_idx: cellIdx })
    });
    return response.json();
};

export const getAIMove = async (config: GameConfig) => {
    const response = await fetch(`${API_BASE}/ai/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    return response.json();
};

export const saveGameResult = async (result: any) => {
    const response = await fetch(`${API_BASE}/game/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    });
    return response.json();
};

export const resetGameAPI = async () => {
    const response = await fetch(`${API_BASE}/game/reset`, {
        method: 'POST'
    });
    return response.json();
};

export const fetchGameHistory = async () => {
    const response = await fetch(`${API_BASE}/game/history`);
    return response.json();
};

export const clearGameHistory = async () => {
    const response = await fetch(`${API_BASE}/game/history`, {
        method: 'DELETE'
    });
    return response.json();
};
