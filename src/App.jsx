import { useState } from 'react'
import './App.css'
import Board from './Square'
import Square from './Square'
import Game from './Square'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <Board></Board>
    </>
  )
}

export default App
