#!/usr/bin/env node

import * as graphics from './graphics'
import { Game } from './game'

function main() {
  /*
   *  Create GUI Elements
   */
  const screen = graphics.createMainScreen()
  const container = graphics.createContainer(screen)
  const gameBoard = graphics.createGameBoard(container)
  const scoreBoard = graphics.createScoreBoard(container)
  const selectionSquare = graphics.createSelectionSquare(gameBoard)
  const markContainer = graphics.createMarkers(gameBoard)
  graphics.createCommandboard(container)

  /*
   * Create Game
   */
  const game = new Game()
  game.bindKeys(screen, scoreBoard, markContainer, selectionSquare)

  /*
   * Create Game Loop
   */
  setInterval(() => {
    screen.render()
  }, 16)
}

main()
