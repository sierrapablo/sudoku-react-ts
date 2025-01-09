import React, { useState, useEffect } from 'react'
import SudokuBoard from './components/SudokuBoard'
import './styles/SudokuBoard.css'
import { generateSudokuPuzzle, solveSudoku } from './utils/sudoku'

const App: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  )
  const [message, setMessage] = useState<string>('')

  // Generar un puzzle cuando la app se recarga
  useEffect(() => {
    const initializeSudoku = () => {
      handleGenerateSudoku()
    }
    initializeSudoku()
  }, []) // Asegura que solo se ejecuta una vez

  const handleGenerateSudoku = () => {
    setMessage('Generando puzzle...')
    setTimeout(() => {
      const newBoard = generateSudokuPuzzle()
      setBoard(newBoard)
      setMessage('Puzzle listo!')
    }, 100) // Simulación de tiempo para generar el puzzle, como mínimo 100ms
  }

  const handleSolveSudoku = async () => {
    setMessage('Resolviendo...')
    let steps = 0

    // Contador de pasos dentro de una función de envoltura para actualizar el estado
    const countSteps = (updatedBoard: (number | null)[][]) => {
      steps++
      setBoard(updatedBoard)
    }

    const solved = await solveSudoku(board, countSteps) // Resolución con visualización
    if (solved) {
      setMessage(`¡Puzzle resuelto! ${steps} iteraciones`)
    } else {
      setMessage('No se pudo resolver el puzzle.')
    }
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
      <p className='status-message'>{message}</p>
    </div>
  )
}

export default App
