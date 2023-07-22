import type { Widgets } from 'blessed'
import { MarkContainer, Player, Position, SquareState, getMarkFromPlayer, getPlayerFromMark } from './definitions'

export class Game {
  scoreA = 0
  scoreB = 0
  totalMatches = 0
  squareStates: Array<Array<SquareState>> = [
    [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
    [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
    [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked]
  ]
  cursorPosition: Position = { x: 0, y: 0 }
  lastWinner = Player.A
  currentPlayer = Player.A

  bindKeys(
    screen: Widgets.Screen,
    scoreBoard: Widgets.BoxElement,
    markContainer: MarkContainer,
    selectionSquare: Widgets.BoxElement
  ) {
    screen.key('q', () => {
      this.onQuitGame()
    })

    screen.key(['up', 'k'], () => {
      this.onCursorUp(selectionSquare)
    })

    screen.key(['down', 'j'], () => {
      this.onCursorDown(selectionSquare)
    })

    screen.key(['left', 'h'], () => {
      this.onCursorLeft(selectionSquare)
    })

    screen.key(['right', 'l'], () => {
      this.onCursorRight(selectionSquare)
    })

    screen.key('space', () => {
      this.onSelectSquare(selectionSquare, scoreBoard, markContainer)
    })
  }

  onQuitGame() {
    process.exit(0)
  }

  makeScoreString() {
    return `Total Matches: ${this.totalMatches}\nPlayer A (X)\tPlayer B (O)\n${this.scoreA}\t${this.scoreB}`
  }
  addScoreToBoard(line: string, scoreBoard: Widgets.BoxElement) {
    scoreBoard.insertLine(1, line)
  }

  finishMatchWinner(
    winner: Player,
    markContainer: MarkContainer,
    selectionSquare: Widgets.BoxElement,
    scoreBoard: Widgets.BoxElement
  ) {
    this.setCurrentPlayer(this.currentPlayer === Player.A ? Player.B : Player.A, selectionSquare)
    this.clearBoard(markContainer)
    if (winner === Player.A) {
      this.lastWinner = Player.A
      this.scoreA += 1
    } else {
      this.lastWinner = Player.B
      this.scoreB += 1
    }
    this.totalMatches += 1
    ;(scoreBoard.parent as Widgets.BoxElement).setContent(this.makeScoreString())
    scoreBoard.insertLine(1, `Player ${this.lastWinner} won!`)
  }

  finishMatchWithdraw(markContainer: MarkContainer, scoreBoard: Widgets.BoxElement) {
    this.clearBoard(markContainer)
    this.totalMatches += 1
    ;(scoreBoard.parent as Widgets.BoxElement).setContent(this.makeScoreString())
  }

  onSelectSquare(selectionSquare: Widgets.BoxElement, scoreBoard: Widgets.BoxElement, markContainer: MarkContainer) {
    const squareVal = this.getStateOfSquare(this.cursorPosition.x, this.cursorPosition.y)

    if (squareVal !== SquareState.Unmarked) {
      return
    }

    const playerMark = getMarkFromPlayer(this.currentPlayer)
    this.setStateOfSquare(this.cursorPosition.x, this.cursorPosition.y, playerMark)
    markContainer[`${this.cursorPosition.x}${this.cursorPosition.y}`].hidden = false
    markContainer[`${this.cursorPosition.x}${this.cursorPosition.y}`].setContent(playerMark)
    const winner = this.checkGameStatus()

    if (winner === undefined && this.boardHaveUnmarkedSquares()) {
      this.setCurrentPlayer(this.currentPlayer === Player.A ? Player.B : Player.A, selectionSquare)
    } else if (winner !== undefined) {
      this.finishMatchWinner(winner, markContainer, selectionSquare, scoreBoard)
    } else {
      this.finishMatchWithdraw(markContainer, scoreBoard)
    }
  }

  calculateRelativePosition(size: number) {
    return 1 + Math.floor((size / 3) * this.cursorPosition.y)
  }

  onCursorUp(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.y === 0) {
      return
    }
    this.cursorPosition.y -= 1
    selectionSquare.top = this.calculateRelativePosition(
      (selectionSquare.parent as Widgets.BoxElement).height as number
    )
  }

  onCursorDown(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.y === 2) {
      return
    }
    this.cursorPosition.y += 1
    selectionSquare.top = this.calculateRelativePosition(
      (selectionSquare.parent as Widgets.BoxElement).height as number
    )
  }

  onCursorLeft(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.x === 0) {
      return
    }
    this.cursorPosition.x -= 1
    selectionSquare.left = this.calculateRelativePosition(
      (selectionSquare.parent as Widgets.BoxElement).width as number
    )
  }

  onCursorRight(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.x === 2) {
      return
    }
    this.cursorPosition.x += 1
    selectionSquare.left = this.calculateRelativePosition(
      (selectionSquare.parent as Widgets.BoxElement).width as number
    )
  }

  getStateOfSquare(x: number, y: number): SquareState {
    return this.squareStates[x][y]
  }

  setStateOfSquare(x: number, y: number, value: SquareState) {
    this.squareStates[x][y] = value
  }

  setCurrentPlayer(player: Player, selectionSquare: Widgets.BoxElement) {
    this.currentPlayer = player
    selectionSquare.setContent(getMarkFromPlayer(player))
  }

  boardHaveUnmarkedSquares() {
    for (let x = 0; x < this.squareStates.length; x++) {
      for (let y = 0; y < this.squareStates[x].length; y++) {
        if (this.getStateOfSquare(x, y) === SquareState.Unmarked) {
          return true
        }
      }
    }
    return false
  }

  clearBoard(markContainer: MarkContainer) {
    this.squareStates = [
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked]
    ]
    for (const marker in markContainer) {
      markContainer[marker].hidden = true
      markContainer[marker].content = SquareState.Unmarked
    }
  }
  checkGameStatus(): Player | undefined {
    const winningPatterns = [
      // Rows
      [
        [0, 0],
        [0, 1],
        [0, 2]
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2]
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2]
      ],
      // Columns
      [
        [0, 0],
        [1, 0],
        [2, 0]
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1]
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2]
      ],
      // Diagonals
      [
        [0, 0],
        [1, 1],
        [2, 2]
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0]
      ]
    ]

    for (const pattern of winningPatterns) {
      const [x1, y1] = pattern[0]
      const [x2, y2] = pattern[1]
      const [x3, y3] = pattern[2]

      if (
        this.squareStates[x1][y1] !== SquareState.Unmarked &&
        this.squareStates[x1][y1] === this.squareStates[x2][y2] &&
        this.squareStates[x2][y2] === this.squareStates[x3][y3]
      ) {
        return getPlayerFromMark(this.squareStates[x1][y1])
      }
    }

    return undefined
  }
}
