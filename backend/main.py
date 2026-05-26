from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Tuple
import time
import uuid
from game_engine import MetaBoard, Player
from ai import get_ai_move, Difficulty
from score_history import ScoreHistory, GameResult, GameMode

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global game state (in production, use proper session management)
game_state = MetaBoard()
score_history = ScoreHistory()

class MoveRequest(BaseModel):
    board_idx: int
    cell_idx: int

class GameConfig(BaseModel):
    mode: str  # "PvP" or "PvAI"
    difficulty: Optional[int] = None  # 1, 2, or 3

class GameStateResponse(BaseModel):
    boards: List[List[int]]  # 9 boards, each with 9 cells
    boardWinners: List[int]  # Winner of each mini-board
    currentPlayer: int
    winner: int
    nextMeta: Optional[int]
    isDraw: bool
    legalMoves: List[Tuple[int, int]]

class GameResultRequest(BaseModel):
    mode: str
    difficulty: Optional[int] = None
    winner: str

def board_to_response(game: MetaBoard) -> GameStateResponse:
    boards = []
    board_winners = []
    for board in game.boards:
        boards.append([cell.value for cell in board.cells])
        board_winners.append(board.winner.value)
    
    return GameStateResponse(
        boards=boards,
        boardWinners=board_winners,
        currentPlayer=game.current_player.value,
        winner=game.winner.value,
        nextMeta=game.next_meta,
        isDraw=game.is_draw,
        legalMoves=game.legal_moves()
    )

@app.get("/")
async def root():
    return {"message": "Ultimate Tic Tac Toe Backend"}

@app.get("/game/state")
async def get_game_state():
    return board_to_response(game_state)

@app.post("/game/move")
async def make_move(move: MoveRequest):
    global game_state
    
    success = game_state.apply_move(move.board_idx, move.cell_idx)
    
    return board_to_response(game_state)

@app.post("/game/reset")
async def reset_game():
    global game_state
    game_state = MetaBoard()
    return board_to_response(game_state)

@app.get("/game/history")
async def get_history():
    return score_history.get_history()

@app.post("/game/history")
async def save_result(result: GameResultRequest):
    game_result = GameResult(
        id=str(uuid.uuid4()),
        timestamp=int(time.time()),
        mode=GameMode(result.mode),
        difficulty=Difficulty(result.difficulty) if result.difficulty else None,
        winner=result.winner
    )
    score_history.save_result(game_result)
    return {"status": "success"}

@app.delete("/game/history")
async def clear_history():
    score_history.results = []
    score_history._save_to_file()
    return {"status": "success"}

@app.post("/ai/move")
async def get_ai_move_endpoint(config: GameConfig):
    if config.mode != "PvAI":
        return {"error": "AI move only available in PvAI mode"}
    
    difficulty = Difficulty(config.difficulty) if config.difficulty else Difficulty.MEDIUM
    move = get_ai_move(game_state, difficulty)
    
    if move:
        board_idx, cell_idx = move
        success = game_state.apply_move(board_idx, cell_idx)
        if success:
            return {
                "move": move,
                "gameState": board_to_response(game_state)
            }
    
    return {"move": None, "gameState": board_to_response(game_state)}
