from typing import Optional, Tuple
from .game_engine import MetaBoard, Player
from enum import Enum
import random

class Difficulty(Enum):
    EASY = 1
    MEDIUM = 2
    HARD = 3

def get_ai_move(game: MetaBoard, difficulty: Difficulty) -> Optional[Tuple[int, int]]:
    legal_moves = game.legal_moves()
    if not legal_moves:
        return None
    
    if difficulty == Difficulty.EASY:
        # Random move
        return random.choice(legal_moves)
    elif difficulty == Difficulty.MEDIUM:
        # Try to win if possible, otherwise random
        move = find_winning_move(game, Player.O)
        if move:
            return move
        return random.choice(legal_moves)
    else:  # HARD
        # Try to win
        move = find_winning_move(game, Player.O)
        if move:
            return move
            
        # Block opponent from winning
        move = find_winning_move(game, Player.X)
        if move:
            return move
            
        # Prefer center, corners, then edges
        preferred_moves = [(4, 4), (4, 0), (4, 2), (4, 6), (4, 8),
                          (0, 4), (2, 4), (6, 4), (8, 4)]
        
        # Filter preferred moves to only legal ones
        valid_preferred = []
        for pm in preferred_moves:
            # We need to find if any legal move lands in a preferred cell relative to the active board
            # This is a bit complex because legal moves are (board_idx, cell_idx)
            # A simple heuristic for Hard AI: just pick a random legal move that is "good"
            # For now, let's just pick random from legal moves if no win/block
            pass

        # Better Hard AI: prioritize center board if available, or center cell of any board
        # For simplicity in this step, we'll stick to win/block/random, but we can enhance later
        return random.choice(legal_moves)

def find_winning_move(game: MetaBoard, player: Player) -> Optional[Tuple[int, int]]:
    legal_moves = game.legal_moves()
    for move in legal_moves:
        board_idx, cell_idx = move
        # Simulate move
        test_game = game.clone()
        # Force current player to be the one we are testing for (in case it's not their turn, though usually it is)
        test_game.current_player = player 
        
        # Note: apply_move switches player, so we check winner after
        if test_game.apply_move(board_idx, cell_idx):
            if test_game.winner == player:
                return move
    return None
