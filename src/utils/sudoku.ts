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
 * Obtiene una lista de números válidos para una celda específica.
 * @param board El tablero de Sudoku.
 * @param row Fila de la celda.
 * @param col Columna de la celda.
 * @returns Lista de números válidos para la celda.
 */
const getValidOptions = (
  board: (number | null)[][],
  row: number,
  col: number
): number[] => {
  const invalid = new Set<number>()

  for (let i = 0; i < 9; i++) {
    if (board[row][i] !== null) invalid.add(board[row][i] as number) // Verificar fila
    if (board[i][col] !== null) invalid.add(board[i][col] as number) // Verificar columna
  }

  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] !== null) invalid.add(board[i][j] as number) // Verificar subcuadro 3x3
    }
  }

  // Retornar todos los números posibles excepto los inválidos
  return Array.from({ length: 9 }, (_, i) => i + 1).filter(
    num => !invalid.has(num)
  )
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
  // Verifica si el tablero tiene una solución única
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
                if (solutionCount > 1) return false // Si hay más de una solución, es inválido
              }
            }
            return false
          }
        }
      }
      return true
    }

    solve(board.map(row => row.slice()))
    return solutionCount === 1 // Asegura que haya solo una solución
  }

  const puzzle = board.map(row => row.slice()) as (number | null)[][]

  let canRemoveMore = true // Flag para saber si se pueden eliminar más números

  while (canRemoveMore) {
    let removedCell = false // Flag para indicar si se ha eliminado alguna celda en la iteración actual
    let cellsToCheck = []

    // Recopilar las celdas que tienen números para intentar eliminar
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== null) {
          cellsToCheck.push([row, col])
        }
      }
    }

    // Aleatoriamente mezclar las celdas para eliminar de manera aleatoria
    cellsToCheck = shuffle(cellsToCheck) // Función shuffle para mezclar el array

    // Intentar eliminar números de las celdas seleccionadas
    for (const [row, col] of cellsToCheck) {
      const removed = puzzle[row][col]
      puzzle[row][col] = null

      if (isUniqueSolution(puzzle)) {
        removedCell = true // Se ha eliminado un número
      } else {
        puzzle[row][col] = removed // Restaurar si la solución ya no es única
      }
    }

    // Verificar si hemos llegado al punto de no poder eliminar más números
    canRemoveMore = removedCell // Si no se ha eliminado ninguna celda en esta iteración, detenemos

    // Parar si hemos eliminado suficientes celdas
    if (puzzle.flat().filter(cell => cell === null).length >= 45) {
      break
    }
  }

  return puzzle
}

/**
 * Función para mezclar aleatoriamente un array (utilizado para desordenar las celdas a comprobar)
 * @param array El array a mezclar.
 * @returns El array mezclado.
 */
const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]] // Intercambiar elementos
  }
  return array
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
 * Resuelve un tablero de Sudoku utilizando backtracking mejorado con heurística MRV.
 * @param board El tablero de Sudoku.
 * @param updateBoard Función para actualizar el estado del tablero en tiempo real.
 * @param delay Tiempo en milisegundos entre cada actualización (opcional).
 * @returns Promesa que se resuelve con verdadero si el Sudoku se resolvió, falso en caso contrario.
 */
export const solveSudoku = async (
  board: (number | null)[][],
  updateBoard: (board: (number | null)[][]) => void,
  delay: number = 50
): Promise<boolean> => {
  /**
   * Encuentra la celda vacía con el menor número de valores posibles (heurística MRV).
   * @returns Las coordenadas [fila, columna] de la celda seleccionada, o null si no hay celdas vacías.
   */
  const findBestCell = (): [number, number] | null => {
    let bestCell: [number, number] | null = null
    let minOptions = 10 // Más opciones posibles son 9, por lo que 10 es un valor seguro inicial

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          const options = getValidOptions(board, row, col)
          if (options.length < minOptions) {
            minOptions = options.length
            bestCell = [row, col]
            if (minOptions === 1) return bestCell // Optimización: parar si encontramos la mejor opción posible
          }
        }
      }
    }
    return bestCell
  }

  const bestCell = findBestCell()
  if (!bestCell) return true // No hay celdas vacías, puzzle resuelto

  const [row, col] = bestCell
  const options = getValidOptions(board, row, col)

  for (const num of options) {
    board[row][col] = num
    updateBoard([...board.map(row => [...row])]) // Actualizar tablero
    await new Promise(resolve => setTimeout(resolve, delay)) // Retrasar para visualización

    if (await solveSudoku(board, updateBoard, delay)) return true
    board[row][col] = null // Backtrack
    updateBoard([...board.map(row => [...row])]) // Actualizar tablero tras retroceder
  }

  return false // Retroceder si ninguna opción funciona
}

export const evaluateDifficulty = (
  puzzle: (number | null)[][]
): { difficulty: string; score: number } => {
  let score = 0

  // Puntuar con base en las opciones válidas de las celdas vacías
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] === null) {
        const options = getValidOptions(puzzle, row, col) // Usar la función auxiliar
        score += 10 - options.length // Más difícil si hay menos opciones válidas
      }
    }
  }

  // Resolver el puzzle para contar iteraciones
  let steps = 0
  const countSteps = () => {
    steps++
  }
  solveSudoku(
    puzzle.map(row => row.slice()),
    countSteps,
    0
  ) // Resolver sin visualización
  score += steps

  // Clasificar dificultad
  let difficulty = 'Fácil'
  if (score > 100) difficulty = 'Medio'
  if (score > 200) difficulty = 'Difícil'
  if (score > 300) difficulty = 'Experto'

  return { difficulty, score }
}
