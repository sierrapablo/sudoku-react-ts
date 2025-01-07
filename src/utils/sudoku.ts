/**
 * Checks if placing a number in a specific cell is valid according to Sudoku rules.
 */
const isValid = (
  board: (number | null)[][],
  row: number,
  col: number,
  num: number
): boolean => {
  // Check if num is in the current row or column
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false
  }

  // Check if num is in the 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false
    }
  }

  return true
}

/**
 * Generates a full valid Sudoku board using backtracking.
 */
export const generateFullSudoku = (): number[][] => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0))

  const fillBoard = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num
              if (fillBoard()) return true
              board[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  fillBoard()
  return board
}

/**
 * Generates a Sudoku puzzle starting with 11 random numbers placed in the board.
 * Ensures the puzzle has a unique solution.
 */
export const generateSudokuPuzzle = (): (number | null)[][] => {
  const emptyBoard: (number | null)[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(null)
  )

  const getRandomNumber = (): number => Math.floor(Math.random() * 9) + 1
  const getRandomPosition = (): [number, number] => [
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9)
  ]

  // Step 1: Place 11 random numbers in random positions
  let count = 0
  while (count < 11) {
    const [row, col] = getRandomPosition()
    const num = getRandomNumber()

    if (emptyBoard[row][col] === null && isValid(emptyBoard, row, col, num)) {
      emptyBoard[row][col] = num
      count++
    }
  }

  // Step 2: Complete the board from this initial state
  const solvedBoard = emptyBoard.map(row => row.slice()) as (number | null)[][]
  const success = solveSudoku(solvedBoard, () => {}, 0) // Solve without visualization
  if (!success) {
    // If the initial setup doesn't lead to a solvable board, regenerate
    return generateSudokuPuzzle()
  }

  // Step 3: Remove numbers to create the puzzle
  const puzzle = solvedBoard.map(row => row.slice()) as (number | null)[][]
  const isUniqueSolution = (board: (number | null)[][]): boolean => {
    let solutionCount = 0

    const solve = (board: (number | null)[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === null) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num
                if (solve(board)) solutionCount++
                board[row][col] = null
                if (solutionCount > 1) return false // Early exit if >1 solution
              }
            }
            return false
          }
        }
      }
      return true
    }

    solve(board.map(row => row.slice()))
    return solutionCount === 1
  }

  while (true) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)

    const removed = puzzle[row][col]
    if (removed !== null) {
      puzzle[row][col] = null

      if (!isUniqueSolution(puzzle)) {
        puzzle[row][col] = removed // Revert if solution is no longer unique
      }
    }

    if (puzzle.flat().filter(cell => cell === null).length >= 45) break
  }

  return puzzle
}

/**
 * Solves a Sudoku board using backtracking with visualization support.
 * Updates the board on each step via the provided callback.
 */
export const solveSudoku = async (
  board: (number | null)[][],
  updateBoard: (board: (number | null)[][]) => void,
  delay: number = 50
): Promise<boolean> => {
  const findEmptyCell = (): [number, number] | null => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) return [row, col]
      }
    }
    return null
  }

  const isValid = (
    board: (number | null)[][],
    row: number,
    col: number,
    num: number
  ): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false
    }
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false
      }
    }
    return true
  }

  const emptyCell = findEmptyCell()
  if (!emptyCell) return true // No empty cells, puzzle solved

  const [row, col] = emptyCell
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num
      updateBoard([...board.map(row => [...row])]) // Update the board state
      await new Promise(resolve => setTimeout(resolve, delay)) // Add delay for visualization

      if (await solveSudoku(board, updateBoard, delay)) return true
      board[row][col] = null
      updateBoard([...board.map(row => [...row])]) // Reset state
    }
  }

  return false // Trigger backtracking
}
