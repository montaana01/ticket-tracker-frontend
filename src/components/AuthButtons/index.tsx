import { useState } from 'react';
import { NavLink } from 'react-router';
import { PATHS } from '../../constants/PATHS.ts';

export const AuthButtons = () => {
  const [isLoggedIn, setIsLOggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={() => setIsLOggedIn(false)}>Log out</button>
      ) : (
        <>
          <NavLink to={PATHS.SIGN_IN}>Sign In</NavLink>
          <NavLink to={PATHS.SIGN_UP}>Sign Up</NavLink>
        </>
      )}
    </div>
  );
};
