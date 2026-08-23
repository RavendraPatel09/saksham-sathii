import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CandidateProfile {
  id: string;
  name: string;
  skills: string[];
  accommodations: string[];
  [key: string]: any; // Allow extensibility for mock data
}

export interface AssessmentScores {
  [category: string]: number | string;
}

type WorkspaceMode = 'candidate' | 'employer' | 'accessibility' | null;

type AppContextType = {
  workspaceMode: WorkspaceMode;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  candidateProfile: CandidateProfile | null;
  setCandidateProfile: (data: CandidateProfile | null) => void;
  assessmentScores: AssessmentScores | null;
  setAssessmentScores: (scores: AssessmentScores | null) => void;
  isRegistered: boolean;
  logout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    return (localStorage.getItem('workspaceMode') as WorkspaceMode) || null;
  });

  const [candidateProfile, setCandidateProfile] = useState<any>(() => {
    const saved = localStorage.getItem('candidateProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [assessmentScores, setAssessmentScores] = useState<any>(() => {
    const saved = localStorage.getItem('assessmentScores');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (workspaceMode) localStorage.setItem('workspaceMode', workspaceMode);
    else localStorage.removeItem('workspaceMode');
  }, [workspaceMode]);

  useEffect(() => {
    if (candidateProfile) localStorage.setItem('candidateProfile', JSON.stringify(candidateProfile));
    else localStorage.removeItem('candidateProfile');
  }, [candidateProfile]);

  useEffect(() => {
    if (assessmentScores) localStorage.setItem('assessmentScores', JSON.stringify(assessmentScores));
    else localStorage.removeItem('assessmentScores');
  }, [assessmentScores]);

  const isRegistered = !!candidateProfile;

  const logout = React.useCallback(() => {
    setWorkspaceMode(null);
    setCandidateProfile(null);
    setAssessmentScores(null);
  }, []);

  const value = React.useMemo(() => ({
    workspaceMode,
    setWorkspaceMode,
    candidateProfile,
    setCandidateProfile,
    assessmentScores,
    setAssessmentScores,
    isRegistered,
    logout,
  }), [workspaceMode, candidateProfile, assessmentScores, isRegistered, logout]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
