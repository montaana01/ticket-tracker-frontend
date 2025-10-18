import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="card">
        <h1>Vite + React</h1>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
  )
}

export default App
