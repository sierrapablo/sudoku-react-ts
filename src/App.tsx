import React from 'react'
import SudokuBoard from './components/SudokuBoard'
import './styles/SudokuBoard.css'

const initialBoard: (number | null)[][] = Array.from({ length: 9 }, () =>
  Array(9).fill(null)
);

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Sudoku</h1>
      <div className="controls">
        <button className="control-button">Generar Sudoku</button>
        <button className="control-button">Resolver Sudoku</button>
      </div>
      <SudokuBoard board={initialBoard} />
    </div>
  )
}

export default App
