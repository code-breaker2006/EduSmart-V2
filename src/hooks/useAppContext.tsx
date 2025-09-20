import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User } from '../types';

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedBatch: (batch: string) => void;
  setLoading: (loading: boolean) => void;
  setTimetableData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'SET_BATCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TIMETABLE_DATA'; payload: any };

const initialState: AppState = {
  currentUser: null,
  isLoggedIn: false,
  isLoading: false,
  currentView: 'login',
  selectedBatch: '',
  timetableData: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.payload,
        isLoggedIn: true,
        currentView: 'dashboard',
      };
    case 'LOGOUT':
      return {
        ...initialState,
        currentView: 'login',
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
    case 'SET_BATCH':
      return {
        ...state,
        selectedBatch: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_TIMETABLE_DATA':
      return {
        ...state,
        timetableData: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const setCurrentView = (view: AppState['currentView']) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const setSelectedBatch = (batch: string) => {
    dispatch({ type: 'SET_BATCH', payload: batch });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setTimetableData = (data: any) => {
    dispatch({ type: 'SET_TIMETABLE_DATA', payload: data });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        setCurrentView,
        setSelectedBatch,
        setLoading,
        setTimetableData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}