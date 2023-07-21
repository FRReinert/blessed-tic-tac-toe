# Tic Tac Toe Terminal Game
This is a simple Tic Tac Toe game implemented in TypeScript that runs in the terminal. Challenge your friends to a classic game of Tic Tac Toe right in your command line!

## Installation
You can install the game globally using npm with the following command:
```npm install -G https://github.com/FRReinert/tic-tac-toe```

## Usage
Once the game is installed, you can run it using the following command:
```npx tictactoe```

## How to Play
The game is played on a 3x3 grid. Players take turns to place their symbol ('X' or 'O') in an empty cell. The first player to get three of their symbols in a row (horizontally, vertically, or diagonally) wins the game. If all cells are filled and no player has three symbols in a row, the game ends in a draw.

To make a move, simply enter the corresponding cell number when prompted using the arrow keys or vim motions \<h, j , k, l>

For example, if you want to place your symbol in the center cell, you would enter 5 and press `Space`.

# Dependencies
This project relies on the following dependencies:

* Node.js: Make sure you have Node.js installed on your system.
* Typescript: A javascript transpiler
* BlessedJS: A javascript library to handle terminal Curses API

# License
This project is licensed under the MIT License.

Enjoy the game! Happy Tic Tac Toe-ing! 🎮