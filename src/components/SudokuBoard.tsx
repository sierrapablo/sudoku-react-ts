import React from 'react'

interface SudokuBoardProps {
  board: (number | null)[][]
}

/**
 * Renders a Sudoku board as a grid.
 * @param board A 9x9 matrix representing the Sudoku board.
 */
const SudokuBoard: React.FC<SudokuBoardProps> = ({ board }) => {
  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="sudoku-cell">
              {cell !== null ? cell : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default SudokuBoard
