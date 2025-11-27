# Ultimate Tic Tac Toe

Ultimate Tic Tac Toe is a modern, strategy-focused version of classic Tic Tac Toe. Instead of a single 3×3 grid, the game uses a 9×9 mega-board made up of 9 smaller Tic Tac Toe boards. Each move forces the opponent into a specific board, adding depth, planning, and unpredictability to every match.

The UI follows a simple dark-themed design built with Tailwind CSS, and the project was created with the help of Google AI Studio.

## 🎮 Features

- **9×9 Meta Board** – 9 mini Tic Tac Toe boards combine into one large strategic grid
- **Smart Move Logic** – Your tile placement determines the opponent’s next board
- **AI Mode** – Challenge an AI opponent powered by logic generated using Google AI Studio
- **Local Multiplayer** – Two players can play on the same device
- **Clean Dark UI** – Readable, modern, simple interface
- **Instant Play** – No login or signup required

## 🛠 Tech Stack

### Frontend
- **TypeScript** – main game logic, UI interactions, state handling
- **Tailwind CSS** – styling and layout
- **HTML** – structure
- **Google AI Studio** – assisted UI generation, design, and component logic

### Backend
- **Python** – game state management, backend logic, API endpoints

### Tools / Environment
- **Antigravity IDE** – development environment
- **Node.js & npm** – TypeScript build tools and dependency management
- **Git/GitHub** – version control and deployment

## 📂 Project Structure

```
/assets        -> images, icons
/components    -> mini-board UI, tile UI, controls
/game          -> AI logic, move validation, win detection
/backend       -> Python backend files
/styles        -> Tailwind styles, animations
index.html     -> root file
main.ts        -> frontend logic
main.py        -> backend logic
```

## 🕹 How to Play

1. **Choose AI Mode or Multiplayer**
2. **Select a tile** in any active mini-board
3. **Your chosen tile sends your opponent** to the matching mini-board
4. **Win mini-boards** to capture main tiles
5. **Get 3 main tiles in a row to win**
   - Horizontal
   - Vertical
   - Diagonal

## 🚀 Installation & Running the Game

### 1. Clone the Repository
```bash
git clone https://github.com/Ajay-B-Acharya/Ultimate-Tic-Tac-Toe
```

### 2. Open the Project
```bash
cd Ultimate-Tic-Tac-Toe
```

### ⚙️ Frontend Setup (TypeScript)

**Install Dependencies**
```bash
npm install
```

**Run TypeScript Build / Dev Server**
```bash
npm run dev
```

Or build manually:
```bash
npm run build
```

### 🐍 Backend Setup (Python)

If your backend uses Python (Flask/FastAPI/any framework):

**Install Python Dependencies**
```bash
pip install -r requirements.txt
```

**Run Backend Server**
```bash
python main.py
```
The backend will start on: `http://localhost:8000` (or whatever port you configured)

### 🌐 Open the Game

If using a frontend dev server:
`http://localhost:5173`

If using Live Server:
1. Right-click `index.html`
2. Click **Open with Live Server**

## 📄 License

This project is released under the **MIT License**.

You are free to use, modify, and distribute this project.
This game was built with the help of Google AI Studio, which assisted in UI generation and logic templates.

### MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
