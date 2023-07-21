import * as blessed from 'blessed'
import type { Widgets } from 'blessed'
import { MarkContainer, Player, getMarkFromPlayer } from './definitions'

export function createContainer(parent: Widgets.Screen) {
  return blessed.box({
    parent: parent,
    width: '100%',
    height: '100%',
    tags: true
  })
}

export function createCommandboard(parent: Widgets.Node) {
  const content = 'h, j, k, l, Arrows: Move Cursor\nspace: Select\nq: Quit'
  return blessed.box({
    parent: parent,
    content: content,
    width: '100%-1',
    height: '10%',
    top: '90%',
    left: '0%',
    tags: true
  })
}

export function createGameBoard(parent: Widgets.BoxElement): Widgets.BoxElement {
  const board = blessed.box({
    parent: parent,
    width: '70%-4',
    height: '90%-4',
    top: 0,
    left: 0
  })

  blessed.line({
    parent: board,
    orientation: 'horizontal',
    left: 0,
    top: `66%`
  })

  blessed.line({
    parent: board,
    orientation: 'horizontal',
    left: 0,
    top: `33%`
  })

  blessed.line({
    parent: board,
    orientation: 'vertical',
    top: 0,
    left: `66%`
  })

  blessed.line({
    parent: board,
    orientation: 'vertical',
    top: 0,
    left: `33%`
  })
  return board
}

export function createMainScreen() {
  return blessed.screen({ smartCSR: true, title: 'Tic Tac Toe', autoPadding: true })
}

export function createScoreBoard(parent: Widgets.Node) {
  const scoreBoard = blessed.box({
    parent: parent,
    content: `Total Matches:o\nPlayer A (X)\tPlayer B (O)`,
    align: 'center',
    width: '30%',
    height: '80%',
    top: '0%',
    left: '70%',
    border: {
      type: 'line'
    }
  })
  return blessed.box({
    parent: scoreBoard,
    align: 'center',
    top: '10%'
  })
}

export function createSelectionSquare(parent: Widgets.BoxElement) {
  return blessed.box({
    parent: parent,
    width: '33%-1',
    height: '33%-1',
    content: getMarkFromPlayer(Player.A),
    align: 'center',
    valign: 'middle'
  })
}

export function createMarkers(parent: Widgets.BoxElement): MarkContainer {
  const markContainer: MarkContainer = {}

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const top = 1 + Math.floor(((parent.height as number) / 3) * y)
      const left = 1 + Math.floor(((parent.width as number) / 3) * x)
      markContainer[`${x}${y}`] = blessed.box({
        parent: parent,
        top: top,
        left: left,
        hidden: true,
        width: '33%-1',
        height: '33%-1',
        align: 'center',
        valign: 'middle'
      })
    }
  }
  return markContainer
}
