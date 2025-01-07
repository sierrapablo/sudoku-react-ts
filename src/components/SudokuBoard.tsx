import React from 'react'

interface SudokuBoardProps {
  board: (number | null)[][]
}

/**
 * Renderiza un tablero de sudoku como una cuadrícula.
 * @param board una matriz 9x9 que representa el tablero del sudoku.
 */
const SudokuBoard: React.FC<SudokuBoardProps> = ({ board }) => {
  return (
    <div className='sudoku-board'>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='sudoku-row'>
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className='sudoku-cell'>
              {cell !== null ? cell : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default SudokuBoard
