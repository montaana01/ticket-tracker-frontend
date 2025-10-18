import { useState } from 'react';

export const HomePage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Home page</h1>
      <p>Here will be tasks</p>
      <div className="card">
        <h1>Vite + React</h1>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
};
