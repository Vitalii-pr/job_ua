import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('employee');
  const [activePage, setActivePage] = useState('Вакансії');

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

  const handlePageChange = (pageName) => {
    setActivePage(pageName);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActivePage('Вакансії');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'Мій профіль':
        return <ProfilePage user={user} />;
      default:
        return <div>{activePage}</div>;
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
    <div className="app">
      <Navbar 
        userType={userType} 
        onPageChange={handlePageChange} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderActivePage()}
      </main>
    </div>
  );
}

export default App;
