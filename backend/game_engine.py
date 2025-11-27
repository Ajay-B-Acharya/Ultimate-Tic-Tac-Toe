from enum import Enum
from typing import List, Optional, Tuple, Set
import copy

class Player(Enum):
    EMPTY = 0
    X = 1
    O = 2

class Board:
    def __init__(self):
        self.cells = [Player.EMPTY] * 9
        self.winner = Player.EMPTY
    
    def is_full(self) -> bool:
        return all(cell != Player.EMPTY for cell in self.cells)
    
    def check_winner(self) -> Player:
        winning_lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
            [0, 4, 8], [2, 4, 6]              # diagonals
        ]
        
        for line in winning_lines:
            a, b, c = line
            if (self.cells[a] != Player.EMPTY and 
                self.cells[a] == self.cells[b] == self.cells[c]):
                self.winner = self.cells[a]
                return self.winner
        
        return Player.EMPTY

class MetaBoard:
    def __init__(self):
        self.boards = [Board() for _ in range(9)]
        self.current_player = Player.X
        self.winner = Player.EMPTY
        self.next_meta = None
        self.is_draw = False
    
    def legal_moves(self) -> List[Tuple[int, int]]:
        moves = []
        if self.winner != Player.EMPTY or self.is_draw:
            return moves
            
        if self.next_meta is None:
            # Can play in any non-full, non-won board
            for i, board in enumerate(self.boards):
                if board.winner == Player.EMPTY and not board.is_full():
                    for j, cell in enumerate(board.cells):
                        if cell == Player.EMPTY:
                            moves.append((i, j))
        else:
            # Must play in the specified board
            board = self.boards[self.next_meta]
            if board.winner == Player.EMPTY and not board.is_full():
                for j, cell in enumerate(board.cells):
                    if cell == Player.EMPTY:
                        moves.append((self.next_meta, j))
            else:
                # Target board is full/won, fallback to any valid board
                for i, b in enumerate(self.boards):
                    if b.winner == Player.EMPTY and not b.is_full():
                        for j, cell in enumerate(b.cells):
                            if cell == Player.EMPTY:
                                moves.append((i, j))
        
        return moves
    
    def apply_move(self, board_idx: int, cell_idx: int) -> bool:
        if self.winner != Player.EMPTY or self.is_draw:
            return False
            
        # Validate move is legal
        legal = False
        for move in self.legal_moves():
            if move == (board_idx, cell_idx):
                legal = True
                break
        
        if not legal:
            return False
            
        board = self.boards[board_idx]
        board.cells[cell_idx] = self.current_player
        
        # Check if this board is now won
        board.check_winner()
        
        # Determine next meta board
        target_board = self.boards[cell_idx]
        if target_board.winner == Player.EMPTY and not target_board.is_full():
            self.next_meta = cell_idx
        else:
            self.next_meta = None
        
        # Check for meta win
        self.check_meta_winner()
        
        # Switch players
        self.current_player = Player.O if self.current_player == Player.X else Player.X
        
        # Check for draw
        if not self.winner and all(b.is_full() or b.winner != Player.EMPTY for b in self.boards):
            self.is_draw = True
            
        return True
    
    def check_meta_winner(self):
        winning_lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
            [0, 4, 8], [2, 4, 6]              # diagonals
        ]
        
        for line in winning_lines:
            a, b, c = line
            board_a, board_b, board_c = self.boards[a], self.boards[b], self.boards[c]
            if (board_a.winner != Player.EMPTY and 
                board_a.winner == board_b.winner == board_c.winner):
                self.winner = board_a.winner
                return
    
    def clone(self) -> 'MetaBoard':
        return copy.deepcopy(self)
