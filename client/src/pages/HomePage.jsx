import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const HomePage = () => {
  const { logout } = useAuthStore();
  return (
    <div>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};
