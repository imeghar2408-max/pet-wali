import React from 'react';
import { AuthProvider } from '../../src/auth/AuthContext.tsx';

export const UserAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider role="USER">{children}</AuthProvider>
);
