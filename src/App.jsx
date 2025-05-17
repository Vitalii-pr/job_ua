import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import './components/Navbar.css'

// Import all pages
import VacanciesPage from './pages/VacanciesPage'
import HistoryPage from './pages/HistoryPage'
import MaterialsPage from './pages/MaterialsPage'
import ProfilePage from './pages/ProfilePage'
import CandidatesPage from './pages/CandidatesPage'
import ResponsesPage from './pages/ResponsesPage'

function App() {
  const [userType, setUserType] = useState('employee')
  const [activePage, setActivePage] = useState('Вакансії')

  const toggleUserType = () => {
    setUserType(userType === 'employee' ? 'employer' : 'employee')
  }

  // Function to handle navigation between pages
  const handlePageChange = (pageName) => {
    setActivePage(pageName)
  }

  // Render the active page based on the selected tab
  const renderActivePage = () => {
    switch (activePage) {
      case 'Вакансії':
        return <VacanciesPage />
      case 'Історія відгуків':
        return <HistoryPage />
      case 'Корисні матеріали':
        return <MaterialsPage />
      case 'Мій профіль':
        return <ProfilePage userType={userType} toggleUserType={toggleUserType} />
      case 'Кандидати':
        return <CandidatesPage />
      case 'Відгуки кандидатів':
        return <ResponsesPage />
      default:
        return <VacanciesPage />
    }
  }

  return (
    <div className="app">
      <Navbar userType={userType} onPageChange={handlePageChange} />
      {renderActivePage()}
    </div>
  )
}

export default App
