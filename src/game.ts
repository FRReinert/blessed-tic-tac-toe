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

  calculateTopPosition(boardHeight: number) {
    return 1 + Math.floor((boardHeight / 3) * this.cursorPosition.y)
  }

  calculateLeftPosition(boardWidth: number) {
    return 1 + Math.floor((boardWidth / 3) * this.cursorPosition.x)
  }

  onCursorUp(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.y === 0) {
      return
    }
    this.cursorPosition.y -= 1
    selectionSquare.top = this.calculateTopPosition((selectionSquare.parent as Widgets.BoxElement).height as number)
  }

  onCursorDown(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.y === 2) {
      return
    }
    this.cursorPosition.y += 1
    selectionSquare.top = this.calculateTopPosition((selectionSquare.parent as Widgets.BoxElement).height as number)
  }

  onCursorLeft(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.x === 0) {
      return
    }
    this.cursorPosition.x -= 1
    selectionSquare.left = this.calculateLeftPosition((selectionSquare.parent as Widgets.BoxElement).width as number)
  }

  onCursorRight(selectionSquare: Widgets.BoxElement) {
    if (this.cursorPosition.x === 2) {
      return
    }
    this.cursorPosition.x += 1
    selectionSquare.left = this.calculateLeftPosition((selectionSquare.parent as Widgets.BoxElement).width as number)
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
    // first column match
    if (
      this.squareStates[0][0] !== SquareState.Unmarked &&
      this.squareStates[0][0] === this.squareStates[0][1] &&
      this.squareStates[0][1] === this.squareStates[0][2]
    ) {
      return getPlayerFromMark(this.squareStates[0][0])
    }

    // second column match
    if (
      this.squareStates[1][0] !== SquareState.Unmarked &&
      this.squareStates[1][0] === this.squareStates[1][1] &&
      this.squareStates[1][1] === this.squareStates[1][2]
    ) {
      return getPlayerFromMark(this.squareStates[1][0])
    }

    // third column match
    if (
      this.squareStates[2][0] !== SquareState.Unmarked &&
      this.squareStates[2][0] === this.squareStates[2][1] &&
      this.squareStates[2][1] === this.squareStates[2][2]
    ) {
      return getPlayerFromMark(this.squareStates[2][0])
    }

    // firs row match
    if (
      this.squareStates[0][0] !== SquareState.Unmarked &&
      this.squareStates[0][0] === this.squareStates[1][0] &&
      this.squareStates[1][0] === this.squareStates[2][0]
    ) {
      return getPlayerFromMark(this.squareStates[0][0])
    }

    // second row match
    if (
      this.squareStates[0][1] !== SquareState.Unmarked &&
      this.squareStates[0][1] === this.squareStates[1][1] &&
      this.squareStates[1][1] === this.squareStates[2][1]
    ) {
      return getPlayerFromMark(this.squareStates[0][1])
    }

    // third row match
    if (
      this.squareStates[0][2] !== SquareState.Unmarked &&
      this.squareStates[0][2] === this.squareStates[1][2] &&
      this.squareStates[1][2] === this.squareStates[2][2]
    ) {
      return getPlayerFromMark(this.squareStates[0][2])
    }

    // cross Left Upper to Right Bottom
    if (
      this.squareStates[0][0] !== SquareState.Unmarked &&
      this.squareStates[0][0] === this.squareStates[1][1] &&
      this.squareStates[1][1] === this.squareStates[2][2]
    ) {
      return getPlayerFromMark(this.squareStates[0][0])
    }

    // cross Left bottom to Right upper
    if (
      this.squareStates[0][2] !== SquareState.Unmarked &&
      this.squareStates[0][2] === this.squareStates[1][1] &&
      this.squareStates[1][1] === this.squareStates[2][0]
    ) {
      return getPlayerFromMark(this.squareStates[0][2])
    }
  }
}
