/**
 * Verifica si es válido colocar un número en una celda dada.
 * @param board El tablero de Sudoku.
 * @param row Fila de la celda.
 * @param col Columna de la celda.
 * @param num Número a colocar.
 * @returns Verdadero si es válido, falso en caso contrario.
 */
const isValid = (
  board: (number | null)[][],
  row: number,
  col: number,
  num: number
): boolean => {
  // Verificar fila y columna
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false
  }

  // Verificar 3x3 subcuadro
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
 * Genera una solución completa de Sudoku utilizando backtracking.
 * @param board El tablero de Sudoku.
 * @returns Verdadero si se generó una solución, falso en caso contrario.
 */
const generateFullSudoku = (board: (number | null)[][]): boolean => {
  const findEmptyCell = (): [number, number] | null => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) return [row, col]
      }
    }
    return null
  }

  const emptyCell = findEmptyCell()
  if (!emptyCell) return true // Puzzle resuelto

  const [row, col] = emptyCell
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num
      if (generateFullSudoku(board)) return true
      board[row][col] = null
    }
  }

  return false // Backtrack
}

/**
 * Elimina números del tablero completo de Sudoku hasta obtener un puzzle con una única solución.
 * @param board El tablero de Sudoku con la solución completa.
 * @returns El tablero de Sudoku con el puzzle generado.
 */
const removeNumbers = (board: (number | null)[][]): (number | null)[][] => {
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
                if (solutionCount > 1) return false
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

  const puzzle = board.map(row => row.slice()) as (number | null)[][]
  let attempts = 0

  while (attempts < 50) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)

    const removed = puzzle[row][col]
    if (removed !== null) {
      puzzle[row][col] = null

      if (!isUniqueSolution(puzzle)) {
        puzzle[row][col] = removed // Restablecer si la solución no es única
      }
    }

    attempts++
    // Parar una vez se han eliminado suficientes celdas
    if (puzzle.flat().filter(cell => cell === null).length >= 45) break
  }

  return puzzle
}

/**
 * Genera un Sudoku con un número fijo de números aleatorios y luego genera el puzzle.
 * @returns El tablero de Sudoku generado.
 */
export const generateSudokuPuzzle = (): (number | null)[][] => {
  const emptyBoard: (number | null)[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(null)
  )

  // Paso 1: Colocar 11 números aleatorios en el tablero
  let count = 0
  while (count < 11) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    const num = Math.floor(Math.random() * 9) + 1

    if (emptyBoard[row][col] === null && isValid(emptyBoard, row, col, num)) {
      emptyBoard[row][col] = num
      count++
    }
  }

  // Paso 2: Generar el tablero completo a partir de la configuración inicial
  generateFullSudoku(emptyBoard)

  // Paso 3: Eliminar números para crear el puzzle
  return removeNumbers(emptyBoard)
}

/**
 * Resuelve un tablero de Sudoku utilizando backtracking con soporte visual.
 * Actualiza el tablero en cada paso con el correspondiente callback
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
  if (!emptyCell) return true // Si no hay celdas vacías, el puzzle queda resuelto

  const [row, col] = emptyCell
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num
      updateBoard([...board.map(row => [...row])]) // Actualizar el estado del tablero
      await new Promise(resolve => setTimeout(resolve, delay)) // Añadir delay para visualizar el progreso

      if (await solveSudoku(board, updateBoard, delay)) return true
      board[row][col] = null
      updateBoard([...board.map(row => [...row])]) // Reiniciar el estado
    }
  }

  return false // Trigger backtracking
}
