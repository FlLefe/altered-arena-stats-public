'use client';

import { useContext } from 'react';
import { SessionContext } from './UseSessionProvider';

export const useUserSession = () => useContext(SessionContext);
