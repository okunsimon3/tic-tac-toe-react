import { useState } from 'react';
import React from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, size }) {
  function handleClick(i) {
    if (calculateWinner(squares, size) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, size);
  let status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {Array.from({ length: size }).map((_, row) => (
          <div key={row} className="board-row">
            {Array.from({ length: size }).map((_, col) => {
              const index = row * size + col;
              return <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />;
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [size, setSize] = useState(3); // Change this to 3, 4, or 5 to adjust the grid
  const [history, setHistory] = React.useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = React.useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSizeChange(event) {
    const newSize = parseInt(event.target.value);
    setSize(newSize);
    setHistory([Array(newSize * newSize).fill(null)]);
    setCurrentMove(0);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <label htmlFor="grid-size">Select Grid Size: </label>
      <select id="grid-size" value={size} onChange={handleSizeChange}>
        <option value="3">3x3</option>
        <option value="4">4x4</option>
        <option value="5">5x5</option>
        <option value="6">6x6</option>
      </select>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} size={size} />
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
    
  );
}

function calculateWinner(squares, size) {
  const lines = [];

  // Rows and Columns
  for (let i = 0; i < size; i++) {
    lines.push([...Array(size)].map((_, j) => i * size + j)); // Rows
    lines.push([...Array(size)].map((_, j) => j * size + i)); // Columns
  }

  // Diagonals
  lines.push([...Array(size)].map((_, i) => i * (size + 1))); // Main diagonal
  lines.push([...Array(size)].map((_, i) => (i + 1) * (size - 1))); // Anti-diagonal

  for (const line of lines) {
    const [first, ...rest] = line;
    if (squares[first] && rest.every(index => squares[index] === squares[first])) {
      return squares[first];
    }
  }
  return null;
}