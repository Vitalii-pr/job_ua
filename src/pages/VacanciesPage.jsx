import React, { useState } from 'react';
import './VacanciesPage.css';

const VacanciesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality will be implemented later
    console.log('Searching for:', searchQuery, 'with specialization:', specialization);
  };

  return (
    <div className="vacancies-container">
      <div className="search-header-box">
        <div className="search-box">
          <h2 className="search-title">Шукати вакансії</h2>
          
          <div className="search-form">
            <div className="search-input-container">
              <div className="search-field">
                <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Пошук" 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="specialization-field">
                <select 
                  className="specialization-select"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="" disabled>Спеціалізація</option>
                  <option value="it">IT</option>
                  <option value="marketing">Маркетинг</option>
                  <option value="sales">Продажі</option>
                  <option value="finance">Фінанси</option>
                  <option value="hr">HR</option>
                </select>
                <svg className="chevron-down" width="19.2" height="9.6" viewBox="0 0 19.2 9.6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L9.6 8L18.2 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <button className="search-button" onClick={handleSearch}>Пошук</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="vacancies-list">
        {/* Vacancies will be displayed here */}
        <p className="no-vacancies">Використайте пошук для знаходження вакансій</p>
      </div>
    </div>
  );
};

export default VacanciesPage;
