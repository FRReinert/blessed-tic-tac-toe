import { Game } from '../game'
import { Player, SquareState } from '../definitions'
import { createMarkers } from '../graphics'
import { box, screen } from 'blessed'

describe('test game methods', () => {
  it('test method onQuit', () => {
    const spyQuit = jest.spyOn(process, 'exit').mockImplementation()
    const game = new Game()
    game.onQuitGame()
    expect(spyQuit).toHaveBeenLastCalledWith(0)
  })

  it('test makeScoreString', () => {
    const game = new Game()
    const result = game.makeScoreString()
    expect(result).toEqual(`Total Matches: 0\nPlayer A (X)\tPlayer B (O)\n0\t0`)
  })

  it('test addScoreToBoard', () => {
    const game = new Game()
    const bScreen = screen({})
    const scoreBoard = box({ parent: bScreen })
    game.addScoreToBoard('random text', scoreBoard)
    expect(scoreBoard.content).toEqual('\nrandom text')
    bScreen.destroy()
    scoreBoard.destroy()
  })

  it('test method finishMatchWithdraw', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const scoreBoard = box({ parent: bContainer })
    const markContainer = createMarkers(bContainer)
    game.finishMatchWithdraw(markContainer, scoreBoard)
    expect(game.squareStates).toEqual([
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked]
    ])
    expect(game.totalMatches).toEqual(1)
    expect(bContainer.content).toEqual('Total Matches: 1\nPlayer A (X)\tPlayer B (O)\n0\t0')
    scoreBoard.destroy()
    bContainer.destroy()
    for (const mark in markContainer) {
      markContainer[mark].destroy()
    }
  })

  it('test method calculateRelativePosition', () => {
    const game = new Game()
    game.cursorPosition = { x: 1, y: 1 }
    const integerResult = game.calculateRelativePosition(100)
    const floatResult = game.calculateRelativePosition(100.0)
    expect(integerResult).toEqual(34)
    expect(floatResult).toEqual(34)
  })

  it('test method getStateOfSquare', () => {
    const game = new Game()
    game.squareStates[0][0] = SquareState.PlayerMarkA
    expect(game.getStateOfSquare(0, 0)).toEqual(SquareState.PlayerMarkA)
  })

  it('test method setSquareState', () => {
    const game = new Game()
    game.setStateOfSquare(1, 1, SquareState.PlayerMarkB)
    expect(game.squareStates[1][1]).toEqual(SquareState.PlayerMarkB)
  })

  it('test method setCurrentPlayer', () => {
    const game = new Game()
    const bScreen = screen()
    const selectionSquare = box({ parent: bScreen })
    expect(game.currentPlayer).toEqual(Player.A)
    game.setCurrentPlayer(Player.B, selectionSquare)
    expect(game.currentPlayer).toEqual(Player.B)
  })

  it('test method boardHaveUnmarkedSquare', () => {
    const game = new Game()
    const initialResult = game.boardHaveUnmarkedSquares()
    expect(initialResult).toBeTruthy()
    game.squareStates = [
      [SquareState.PlayerMarkA, SquareState.PlayerMarkA, SquareState.PlayerMarkA],
      [SquareState.PlayerMarkA, SquareState.PlayerMarkA, SquareState.PlayerMarkA],
      [SquareState.PlayerMarkA, SquareState.PlayerMarkA, SquareState.PlayerMarkA]
    ]
    const afterChangeResult = game.boardHaveUnmarkedSquares()
    expect(afterChangeResult).toBeFalsy()
  })

  it('test gameStatus', () => {
    const game = new Game()
    game.squareStates = [
      [SquareState.PlayerMarkA, SquareState.PlayerMarkA, SquareState.PlayerMarkA],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.PlayerMarkA, SquareState.PlayerMarkA, SquareState.PlayerMarkA],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.PlayerMarkA, SquareState.PlayerMarkA, SquareState.PlayerMarkA]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.PlayerMarkA, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.PlayerMarkA, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.PlayerMarkA, SquareState.Unmarked, SquareState.Unmarked]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.Unmarked, SquareState.PlayerMarkA, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.PlayerMarkA, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.PlayerMarkA, SquareState.Unmarked]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.PlayerMarkA],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.PlayerMarkA],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.PlayerMarkA]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.PlayerMarkA, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.PlayerMarkA, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.PlayerMarkA]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)

    game.squareStates = [
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.PlayerMarkA],
      [SquareState.Unmarked, SquareState.PlayerMarkA, SquareState.Unmarked],
      [SquareState.PlayerMarkA, SquareState.Unmarked, SquareState.Unmarked]
    ]
    expect(game.checkGameStatus()).toEqual(Player.A)
  })

  it('test method onCursorDown with on the middle of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 1, y: 1 }
    game.onCursorDown(bBox)
    expect(game.cursorPosition).toEqual({ x: 1, y: 2 })
    expect(bBox.top).toEqual(27)
  })

  it('test method onCursorDown with on the upper part of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 1 }
    game.onCursorDown(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 2 })
    expect(bBox.top).toEqual(27)
  })

  it('test method onCursorDown but it should not move', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 2 }
    game.onCursorDown(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 2 })
    expect(bBox.top).toEqual(0)
  })
  it('test method onCursorUp with on the middle of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 1, y: 1 }
    game.onCursorUp(bBox)
    expect(game.cursorPosition).toEqual({ x: 1, y: 0 })
    expect(bBox.top).toEqual(1)
  })

  it('test method onCursorUp with on the upper part of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 1 }
    game.onCursorUp(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(bBox.top).toEqual(1)
  })

  it('test method onCursorUp but it should not move', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 0 }
    game.onCursorUp(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(bBox.top).toEqual(0)
  })

  it('test method onCursorLeft with on the middle of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 1, y: 1 }
    game.onCursorLeft(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 1 })
    expect(bBox.top).toEqual(0)
  })

  it('test method onCursorLeft with on the upper part of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 1 }
    game.onCursorLeft(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 1 })
    expect(bBox.top).toEqual(0)
  })

  it('test method onCursorLeft but it should not move', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 0 }
    game.onCursorLeft(bBox)
    expect(game.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(bBox.top).toEqual(0)
  })

  it('test method onCursorRight with on the middle of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 1, y: 1 }
    game.onCursorRight(bBox)
    expect(game.cursorPosition).toEqual({ x: 2, y: 1 })
    expect(bBox.top).toEqual(0)
  })

  it('test method onCursorRight with on the upper part of screen', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 0, y: 1 }
    game.onCursorRight(bBox)
    expect(game.cursorPosition).toEqual({ x: 1, y: 1 })
    expect(bBox.top).toEqual(0)
  })

  it('test method onCursorRight but it should not move', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const bBox = box({ parent: bContainer, height: 100 })
    game.cursorPosition = { x: 2, y: 0 }
    game.onCursorRight(bBox)
    expect(game.cursorPosition).toEqual({ x: 2, y: 0 })
    expect(bBox.top).toEqual(0)
  })

  it('test method finishMatchWinner with Player B winner', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const selectionSquare = box({ parent: bContainer })
    const scoreBoard = box({ parent: bContainer })
    const marks = createMarkers(bContainer)
    game.finishMatchWinner(Player.B, marks, selectionSquare, scoreBoard)
    expect(game.lastWinner).toEqual(Player.B)
    expect(game.scoreB).toEqual(1)
    expect(game.totalMatches).toEqual(1)
  })
  it('test method finishMatchWinner with Player A winner', () => {
    const game = new Game()
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const selectionSquare = box({ parent: bContainer })
    const scoreBoard = box({ parent: bContainer })
    const marks = createMarkers(bContainer)
    game.finishMatchWinner(Player.A, marks, selectionSquare, scoreBoard)
    expect(game.lastWinner).toEqual(Player.A)
    expect(game.scoreA).toEqual(1)
    expect(game.totalMatches).toEqual(1)
  })

  it('test method onSelectSquare', () => {
    const game = new Game()
    game.cursorPosition = { x: 1, y: 1 }
    const bScreen = screen()
    const bContainer = box({ parent: bScreen })
    const selectionSquare = box({ parent: bContainer })
    const scoreBoard = box({ parent: bContainer })
    const markContainer = createMarkers(bContainer)

    // play middle with Player A
    game.onSelectSquare(selectionSquare, scoreBoard, markContainer)
    expect(game.squareStates[1][1]).toEqual(SquareState.PlayerMarkA)

    // try to select the same square with Player B
    game.onSelectSquare(selectionSquare, scoreBoard, markContainer)
    expect(game.squareStates[1][1]).toEqual(SquareState.PlayerMarkA)

    // select othere square of the third row
    game.cursorPosition = { x: 2, y: 2 }
    game.onSelectSquare(selectionSquare, scoreBoard, markContainer)

    // update square with X
    game.squareStates[1][0] = SquareState.PlayerMarkA

    // play with PlayerA to win the game
    game.cursorPosition = { x: 1, y: 2 }
    game.onSelectSquare(selectionSquare, scoreBoard, markContainer)
    expect(game.squareStates).toEqual([
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked],
      [SquareState.Unmarked, SquareState.Unmarked, SquareState.Unmarked]
    ])
    expect(game.lastWinner).toEqual(Player.A)
    expect(game.scoreA).toEqual(1)
  })
})
