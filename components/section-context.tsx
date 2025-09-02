"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Section = 'accountability-check' | 'extract-with-proposals' | 'general-chat';

interface SectionContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>('general-chat');

  return (
    <SectionContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}
