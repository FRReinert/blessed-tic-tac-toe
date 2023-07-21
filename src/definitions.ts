import { Widgets } from 'blessed'

export enum GameState {
  NotStarted = 0,
  Ingame = 1,
  Finished = 2
}

export enum Player {
  A = 0,
  B = 1
}

export enum SquareState {
  PlayerMarkA = 'X',
  PlayerMarkB = 'O',
  Unmarked = ''
}

export function getMarkFromPlayer(player: Player): SquareState {
  if (player === Player.A) {
    return SquareState.PlayerMarkA
  } else {
    return SquareState.PlayerMarkB
  }
}

export function getPlayerFromMark(squareState: SquareState) {
  if (squareState === SquareState.PlayerMarkA) {
    return Player.A
  } else {
    return Player.B
  }
}

export type FlatPosition = 0 | 1 | 2

export type Position = {
  x: FlatPosition
  y: FlatPosition
}

export interface MarkContainer {
  [key: string]: Widgets.BoxElement
}
