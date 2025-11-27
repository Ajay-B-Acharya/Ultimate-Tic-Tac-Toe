from typing import List, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import json
import os
import uuid
from datetime import datetime

class GameMode(str, Enum):
    PVP = "PvP"
    PVAI = "PvAI"

class Difficulty(int, Enum):
    EASY = 1
    MEDIUM = 2
    HARD = 3

@dataclass
class GameResult:
    id: str
    timestamp: int
    mode: GameMode
    difficulty: Optional[Difficulty]
    winner: str  # "Player 1", "Player 2", "AI", "Draw"

class ScoreHistory:
    def __init__(self, file_path: str = "score_history.json"):
        self.file_path = file_path
        self.results: List[GameResult] = self.load_history()
    
    def load_history(self) -> List[GameResult]:
        if not os.path.exists(self.file_path):
            return []
        
        try:
            with open(self.file_path, 'r') as f:
                data = json.load(f)
                results = []
                for item in data:
                    # Convert dict to GameResult
                    if 'difficulty' in item and item['difficulty'] is not None:
                        item['difficulty'] = Difficulty(item['difficulty'])
                    item['mode'] = GameMode(item['mode'])
                    results.append(GameResult(**item))
                return results
        except (json.JSONDecodeError, KeyError):
            return []
    
    def save_result(self, result: GameResult) -> None:
        self.results.append(result)
        self._save_to_file()
    
    def get_history(self) -> List[GameResult]:
        # Return most recent 50 games
        return sorted(self.results, key=lambda x: x.timestamp, reverse=True)[:50]
    
    def _save_to_file(self) -> None:
        # Convert GameResult objects to dicts for JSON serialization
        data = []
        for result in self.results:
            result_dict = asdict(result)
            if result_dict['difficulty'] is not None:
                result_dict['difficulty'] = result_dict['difficulty'].value
            result_dict['mode'] = result_dict['mode'].value
            data.append(result_dict)
        
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2)
