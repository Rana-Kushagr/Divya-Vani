'use client';

import React, { useEffect, useState } from 'react';
import LoginPage from './login/page';
import LearnWorkspaceClient from './learn/[class]/[subject]/LearnWorkspaceClient';

export default function RootHomePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('class-9');
  const [selectedSubject, setSelectedSubject] = useState<string>('science');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setUserName(state.userName);
        if (state.selectedClass) setSelectedClass(state.selectedClass);
        if (state.selectedSubject) setSelectedSubject(state.selectedSubject.replaceAll('_', '-'));
      } else {
        const legacyUser = localStorage.getItem('divyavani_user');
        if (legacyUser) {
          const u = JSON.parse(legacyUser);
          if (u.fullName) setUserName(u.fullName);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen bg-white" />;
  }

  // First time visitors without stored name see Screen 1: Login Page (Pitch black, Divya Vani logo, Welcome card)
  if (!userName) {
    return <LoginPage />;
  }

  // Returning / logged-in students see Screen 3: Main Hub (Chapter View) with full navigation
  return (
    <LearnWorkspaceClient
      routeParams={{ class: selectedClass, subject: selectedSubject }}
      initialModule="HUB"
    />
  );
}
