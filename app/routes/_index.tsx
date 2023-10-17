import { useState } from "react"

const PLAYER = "O"
const COMPUTER = "X"

export default function Index() {
  const [board, setBoard] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [playerHasWon, setPlayerHasWon] = useState<boolean>(false)
  const [computerHasWon, setComputerHasWon] = useState<boolean>(false)

  function isBoardCellEmpty(cell: number) {
    return board[cell] === null
  }

  function displayCell(cell: number) {
    return board[cell]
  }

  function play(cell: number, symbol: string) {
    board[cell] = symbol
    setBoard([...board])
    if (hasWon(symbol)) {
      setPlayerHasWon(true)
    } else {
      playComputer()
    }
  }

  function playComputer() {
    // If there's a winning move, take it.
    const computerEventualWinningMove = getWinningMove(COMPUTER, PLAYER)
    if (computerEventualWinningMove !== null) {
      board[computerEventualWinningMove] = COMPUTER
      setBoard([...board])
      if (hasWon(COMPUTER)) {
        setComputerHasWon(true)
      }
      return
    }

    // If the opponent has a winning move, block it.
    const playerEventualWinningMove = getWinningMove(PLAYER, COMPUTER)
    if (playerEventualWinningMove !== null) {
      board[playerEventualWinningMove] = COMPUTER
      setBoard([...board])
      if (hasWon(COMPUTER)) {
        setComputerHasWon(true)
      }
      return
    }

    // If the center is open, take it.
    if (board[4] === null) {
      board[4] = COMPUTER
      setBoard([...board])
      if (hasWon(COMPUTER)) {
        setComputerHasWon(true)
      }
      return
    }

    // Take any available move
    const availableMoves = getAvailableMoves()
    const cell =
      availableMoves[Math.round(Math.random() * (availableMoves.length - 1))]
    board[cell] = COMPUTER
    setBoard([...board])
    if (hasWon(COMPUTER)) {
      setComputerHasWon(true)
    }
  }

  function getWinningMove(symbol: string, opponentSymbol: string) {
    for (let i = 0; i < 3; i++) {
      if (
        board[i * 3] !== opponentSymbol &&
        board[i * 3 + 1] !== opponentSymbol &&
        board[i * 3 + 2] !== opponentSymbol
      ) {
        const marks = [board[i * 3], board[i * 3 + 1], board[i * 3 + 2]].filter(
          (cellMark) => cellMark === symbol,
        )
        if (marks.length == 2) {
          if (board[i * 3] === null) {
            return i * 3
          }
          if (board[i * 3 + 1] === null) {
            return i * 3 + 1
          }
          if (board[i * 3 + 2] === null) {
            return i * 3 + 2
          }
        }
      }
      if (
        board[i] !== opponentSymbol &&
        board[i + 3] !== opponentSymbol &&
        board[i + 6] !== opponentSymbol
      ) {
        const marks = [board[i], board[i + 3], board[i + 6]].filter(
          (cellMark) => cellMark === symbol,
        )
        if (marks.length == 2) {
          if (board[i] === null) {
            return i
          }
          if (board[i + 3] === null) {
            return i + 3
          }
          if (board[i + 6] === null) {
            return i + 6
          }
        }
      }
    }

    if (
      board[0] !== opponentSymbol &&
      board[4] !== opponentSymbol &&
      board[8] !== opponentSymbol
    ) {
      const marks = [board[0], board[4], board[8]].filter(
        (cellMark) => cellMark === symbol,
      )
      if (marks.length == 2) {
        if (board[0] === null) {
          return 0
        }
        if (board[4] === null) {
          return 4
        }
        if (board[8] === null) {
          return 8
        }
      }
    }

    if (
      board[2] !== opponentSymbol &&
      board[4] !== opponentSymbol &&
      board[6] !== opponentSymbol
    ) {
      const marks = [board[2], board[4], board[6]].filter(
        (cellMark) => cellMark === symbol,
      )
      if (marks.length == 2) {
        if (board[2] === null) {
          return 2
        }
        if (board[4] === null) {
          return 4
        }
        if (board[6] === null) {
          return 6
        }
      }
    }

    return null
  }

  function getAvailableMoves() {
    const moves = []
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        moves.push(i)
      }
    }
    return moves
  }

  function hasWon(symbol: string): boolean {
    return getWinningCells(symbol).length === 3
  }

  function getWinningCells(symbol: string) {
    for (let i = 0; i < 3; i++) {
      // Check rows
      if (
        board[i * 3] === symbol &&
        board[i * 3 + 1] === symbol &&
        board[i * 3 + 2] === symbol
      )
        return [i * 3, i * 3 + 1, i * 3 + 2]
      // Check cols
      if (
        board[i] === symbol &&
        board[i + 3] === symbol &&
        board[i + 6] === symbol
      )
        return [i, i + 3, i + 6]
    }

    // Check diagonals
    if (board[0] === symbol && board[4] === symbol && board[8] === symbol)
      return [0, 4, 8]
    if (board[2] === symbol && board[4] === symbol && board[6] === symbol)
      return [2, 4, 6]

    return []
  }

  return (
    <div className="flex h-screen bg-blue-500 text-5xl text-blue-900">
      <div className="flex w-full items-center justify-center space-x-1">
        {[0, 1, 2].map((row) => {
          return (
            <div className="flex flex-col space-y-1">
              {[0, 3, 6].map((col, index) => {
                return isBoardCellEmpty(col + row) &&
                  !playerHasWon &&
                  !computerHasWon ? (
                  <button
                    onClick={() => {
                      play(col + row, PLAYER)
                    }}
                    name="cell"
                    value={col + row}
                    className="flex h-20 w-20 items-center  justify-center bg-pink-300 bg-white font-bold"
                  >
                    {displayCell(col + row)}
                  </button>
                ) : (
                  <span
                    className={`flex h-20 w-20  items-center justify-center bg-white font-bold ${
                      playerHasWon &&
                      getWinningCells(PLAYER).includes(col + row) &&
                      "bg-yellow-400"
                    } ${
                      computerHasWon &&
                      getWinningCells(COMPUTER).includes(col + row) &&
                      "bg-red-400"
                    }`}
                  >
                    {displayCell(col + row)}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
