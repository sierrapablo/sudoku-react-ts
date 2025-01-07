import React, { useState, useEffect } from 'react'
import SudokuBoard from './components/SudokuBoard'
import './styles/SudokuBoard.css'
import { generateSudokuPuzzle, solveSudoku } from './utils/sudoku'

const App: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  )

  // Generate a Sudoku puzzle when the app loads
  useEffect(() => {
    const initializeSudoku = () => {
      const newBoard = generateSudokuPuzzle()
      setBoard(newBoard)
    }
    initializeSudoku()
  }, []) // Empty dependency array ensures this runs only once on mount

  const handleGenerateSudoku = () => {
    setBoard(generateSudokuPuzzle())
  }

  const handleSolveSudoku = async () => {
    const boardCopy = board.map(row => [...row]) // Create a copy to work on
    await solveSudoku(boardCopy, setBoard, 100) // Solve with visualization (100ms delay)
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
