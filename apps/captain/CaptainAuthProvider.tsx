import React from 'react';
import { AuthProvider } from '../../src/auth/AuthContext.tsx';

export const CaptainAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider role="CAPTAIN">{children}</AuthProvider>
);
