import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar';
import Login from './components/Login';
import ProfilePage from './pages/ProfilePage';
import VacanciesPage from './pages/VacanciesPage';
import MaterialsPage from './pages/MaterialsPage';
import HistoryPage from './pages/HistoryPage';
import CandidatesPage from './pages/CandidatesPage';
import ResponsesPage from './pages/ResponsesPage';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('employee');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <Navbar 
          userType={userType} 
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            {userType === 'employee' ? (
              <>
                <Route path="/vacancies" element={<VacanciesPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/vacancies" />} />
              </>
            ) : (
              <>
                <Route path="/vacancies" element={<VacanciesPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/responses" element={<ResponsesPage />} />
                <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/vacancies" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;