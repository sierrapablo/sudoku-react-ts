import React, { useState, useEffect } from 'react'
import SudokuBoard from './components/SudokuBoard'
import './styles/SudokuBoard.css'
import { generateSudokuPuzzle, solveSudoku } from './utils/sudoku'

const App: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  )

  // Generar un puzzle cuando la app se recarga
  useEffect(() => {
    const initializeSudoku = () => {
      const newBoard = generateSudokuPuzzle()
      setBoard(newBoard)
    }
    initializeSudoku()
  }, []) // Asegura que solo se ejecuta una vez

  const handleGenerateSudoku = () => {
    setBoard(generateSudokuPuzzle())
  }

  const handleSolveSudoku = async () => {
    const boardCopy = board.map(row => [...row]) // Crea una copia para trabajar con ella
    await solveSudoku(boardCopy, setBoard, 100) // Resuelve con una visualización de 100ms por iteración
  }

  return (
    <div className='App'>
      <h1>Sudoku</h1>
      <div className='controls'>
        <button className='control-button' onClick={handleGenerateSudoku}>
          Generar Sudoku
        </button>
        <button className='control-button' onClick={handleSolveSudoku}>
          Resolver Sudoku
        </button>
      </div>
      <SudokuBoard board={board} />
    </div>
  )
}

export default App
