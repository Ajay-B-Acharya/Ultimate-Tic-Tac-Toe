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
        
    ai_player = game.current_player
    opp_player = Player.X if ai_player == Player.O else Player.O
    
    if difficulty == Difficulty.EASY:
        return random.choice(legal_moves)
        
    elif difficulty == Difficulty.MEDIUM:
        # 1. Win the game if possible
        for move in legal_moves:
            if move_wins_game(game, move, ai_player):
                return move
        # 2. Block the opponent from winning the game
        for move in legal_moves:
            if move_wins_game(game, move, opp_player):
                return move
        # 3. Win the local board if possible
        for move in legal_moves:
            if move_wins_local_board(game, move, ai_player):
                return move
        # 4. Otherwise random
        return random.choice(legal_moves)
        
    else:  # HARD
        best_score = float('-inf')
        best_moves = []
        
        for move in legal_moves:
            score = evaluate_move_hard(game, move, ai_player, opp_player)
            if score > best_score:
                best_score = score
                best_moves = [move]
            elif score == best_score:
                best_moves.append(move)
                
        return random.choice(best_moves) if best_moves else random.choice(legal_moves)

def move_wins_game(game: MetaBoard, move: Tuple[int, int], player: Player) -> bool:
    test_game = game.clone()
    test_game.current_player = player
    test_game.apply_move(move[0], move[1])
    return test_game.winner == player

def move_wins_local_board(game: MetaBoard, move: Tuple[int, int], player: Player) -> bool:
    board_idx, cell_idx = move
    test_game = game.clone()
    test_game.current_player = player
    
    if test_game.boards[board_idx].winner != Player.EMPTY:
        return False
        
    test_game.apply_move(board_idx, cell_idx)
    return test_game.boards[board_idx].winner == player

def evaluate_move_hard(game: MetaBoard, move: Tuple[int, int], ai_player: Player, opp_player: Player) -> float:
    # 1. Immediate Win is the best possible move
    if move_wins_game(game, move, ai_player):
        return 10000.0
        
    # 2. Block Opponent's Immediate Win
    is_blocking_game_win = move_wins_game(game, move, opp_player)
    
    board_idx, cell_idx = move
    test_game = game.clone()
    test_game.apply_move(board_idx, cell_idx)
    
    score = 0.0
    if is_blocking_game_win:
        score += 5000.0
        
    # 3. Local board win
    if game.boards[board_idx].winner == Player.EMPTY and test_game.boards[board_idx].winner == ai_player:
        score += 200.0
        
    # 4. Block local board win
    if move_wins_local_board(game, move, opp_player):
        score += 100.0
        
    # 5. Position preferences (Center > Corner > Edge)
    if cell_idx == 4:
        score += 5.0
    elif cell_idx in [0, 2, 6, 8]:
        score += 2.0
        
    if board_idx == 4:
        score += 5.0
        
    # 6. Evaluate consequence of sending opponent to target board
    next_board_idx = cell_idx
    next_board = test_game.boards[next_board_idx]
    
    if next_board.is_full() or next_board.winner != Player.EMPTY:
        # Giving opponent a free move (anywhere) is very dangerous
        score -= 150.0
        # Check if this free move allows them to win the game immediately
        for opp_move in test_game.legal_moves():
            if move_wins_game(test_game, opp_move, opp_player):
                return -10000.0  # Fatal move, avoid at all costs
    else:
        # Opponent is restricted to next_board_idx. What can they do?
        opp_can_win_board = False
        
        for opp_move in test_game.legal_moves():
            if move_wins_game(test_game, opp_move, opp_player):
                return -10000.0  # Fatal move, they win next turn
                
            if move_wins_local_board(test_game, opp_move, opp_player):
                opp_can_win_board = True
                
        if opp_can_win_board:
            score -= 75.0  # They can win that local board, which is bad
            
    return score
