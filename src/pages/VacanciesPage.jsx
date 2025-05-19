import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import VacancyBox from '../components/VacancyBox';
import { useAuth } from '../contexts/AuthContext';
import './VacanciesPage.css'; 
import { useNavigate } from 'react-router-dom';

const VacanciesPage = () => {
  const { currentUser } = useAuth();
  const [vacancies, setVacancies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);


  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [employmentTypes, setEmploymentTypes] = useState({
    full: false,
    part: false,
    project: false,
    intern: false
  });
  const [workFormats, setWorkFormats] = useState({
    remote: false,
    hybrid: false,
    office: false
  });
  const [qualificationLevel, setQualificationLevel] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState(0);
  const [englishLevel, setEnglishLevel] = useState('');

  const navigate = useNavigate();
  const handleVacancyClick = (vacancyId) => {
    navigate(`/vacancies/${vacancyId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const vacanciesQuery = query(
          collection(db, 'vacancies'),
          where('isActive', '==', true)
        );
        const vacanciesSnapshot = await getDocs(vacanciesQuery);
        const vacanciesData = vacanciesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || doc.data().Created_at
        }));
        
        const companiesQuery = query(
          collection(db, 'users'),
          where('role', '==', 'employer')
        );
        const companiesSnapshot = await getDocs(companiesQuery);
        const companiesData = companiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setVacancies(vacanciesData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckbox = (setter, field) => (e) => {
    setter(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setSpecialization('');
    setSortBy('');
    setEmploymentTypes({
      full: false,
      part: false,
      project: false,
      intern: false
    });
    setWorkFormats({
      remote: false,
      hybrid: false,
      office: false
    });
    setQualificationLevel('');
    setLocation('');
    setSalaryMin(0);
    setEnglishLevel('');
  };

  const filteredVacancies = useMemo(() => {
    let result = [...vacancies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.Title.toLowerCase().includes(query) || 
        v.Description.toLowerCase().includes(query)
      );
    }

    if (specialization) {
      result = result.filter(v => v.Position === specialization);
    }

    if (Object.values(employmentTypes).some(v => v)) {
      const typeMap = {
        full: 'Повна зайнятість',
        part: 'Часткова зайнятість',
        project: 'Проектна робота',
        intern: 'Стажування'
      };
      
      result = result.filter(v => 
        Object.entries(employmentTypes)
          .some(([key, checked]) => 
            checked && v.Work_type === typeMap[key]
          )
      );
    }

    if (Object.values(workFormats).some(v => v)) {
      const formatMap = {
        remote: 'Віддалена',
        hybrid: 'Віддалена/офіс',
        office: 'Офіс'
      };
      
      result = result.filter(v => 
        Object.entries(workFormats)
          .some(([key, checked]) => 
            checked && v.Work_format === formatMap[key]
          )
      );
    }

    if (qualificationLevel) {
      result = result.filter(v => v.Qualification === qualificationLevel);
    }

    if (location) {
      result = result.filter(v => 
        v.Work_place.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (salaryMin > 0) {
      result = result.filter(v => v.Payrate >= salaryMin);
    }

    if (englishLevel) {
      result = result.filter(v => v.English_lvl === englishLevel);
    }

    switch (sortBy) {
      case 'date':
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'salary':
        return result.sort((a, b) => b.Payrate - a.Payrate);
      case 'views':
        return result.sort((a, b) => (b.views || b.Wieved || 0) - (a.views || a.Wieved || 0));
      default:
        return result;
    }
  }, [
    vacancies,
    searchQuery,
    specialization,
    employmentTypes,
    workFormats,
    qualificationLevel,
    location,
    salaryMin,
    englishLevel,
    sortBy
  ]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="vacancies-container">
      <div className="search-header-box">
        <div className="search-box">
          <h2 className="search-title">Шукати вакансії</h2>
          <form className="search-form" onSubmit={e => {
            e.preventDefault();
          }}>
            <div className="search-input-container">
              <div className="search-field">
                <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Пошук"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="specialization-field">
                <select
                  className="specialization-select"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                >
                  <option value="">Спеціалізація</option>
                  <option value="UI UX Designer">UI/UX Дизайн</option>
                  <option value="Motion Designer">Motion Дизайн</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                </select>
                <svg className="chevron-down" width="19.2" height="9.6" viewBox="0 0 19.2 9.6" fill="none">
                  <path d="M1 1L9.6 8L18.2 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <button type="submit" className="search-button">Пошук</button>
            </div>
          </form>
        </div>
      </div>

      <div className="page-content">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <label className="filter-label">Сортувати за</label>
            <div className="select-wrapper">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="">Вибрати</option>
                <option value="date">За датою</option>
                <option value="salary">За зарплатою</option>
                <option value="views">За переглядами</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-heading">Фільтри</h3>

            <p className="subheading">Тип зайнятості</p>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={employmentTypes.full} 
                onChange={handleCheckbox(setEmploymentTypes, 'full')} 
              />
              <span>Повна зайнятість</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={employmentTypes.part} 
                onChange={handleCheckbox(setEmploymentTypes, 'part')} 
              />
              <span>Часткова зайнятість</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={employmentTypes.project} 
                onChange={handleCheckbox(setEmploymentTypes, 'project')} 
              />
              <span>Проектна робота</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={employmentTypes.intern} 
                onChange={handleCheckbox(setEmploymentTypes, 'intern')} 
              />
              <span>Стажування</span>
            </label>

            <p className="subheading">Формат роботи</p>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={workFormats.remote} 
                onChange={handleCheckbox(setWorkFormats, 'remote')} 
              />
              <span>Віддалена</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={workFormats.hybrid} 
                onChange={handleCheckbox(setWorkFormats, 'hybrid')} 
              />
              <span>Віддалена/офіс</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={workFormats.office} 
                onChange={handleCheckbox(setWorkFormats, 'office')} 
              />
              <span>Офіс</span>
            </label>

            <p className="subheading">Рівень кваліфікації</p>
            <div className="select-wrapper small">
              <select 
                value={qualificationLevel} 
                onChange={e => setQualificationLevel(e.target.value)}
              >
                <option value="">Вибрати</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <p className="subheading">Країна, місто</p>
            <div className="search-field small">
              <svg className="search-icon red" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#84112D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Введіть місто"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <p className="subheading">Зарплатні очікування</p>
            <input
              type="range"
              className="salary-slider"
              min="0"
              max="100000"
              step="5000"
              value={salaryMin}
              onChange={e => setSalaryMin(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, #84112D 0%, #84112D ${(salaryMin/100000)*100}%, #e0e0e0 ${(salaryMin/100000)*100}%, #e0e0e0 100%)`
              }}
            />
            <div className="salary-values">від {salaryMin.toLocaleString()}₴</div>


            <p className="subheading">Рівень англійської</p>
            <div className="select-wrapper small">
              <select 
                value={englishLevel} 
                onChange={e => setEnglishLevel(e.target.value)}
              >
                <option value="">Вибрати</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Upper-Intermediate">Upper-Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>


            <div className="filter-actions">
              <button 
                type="button" 
                className="reset-button" 
                onClick={handleReset}
              >
                Скинути
              </button>
              <button 
                type="button" 
                className="apply-button" 
              >
                Застосувати
              </button>
            </div>
          </div>
        </aside>


        <main className="vacancies-results">
          {filteredVacancies.length > 0 ? (
            filteredVacancies.map(vacancy => {
              const company = companies.find(c => c.id === vacancy.hostId) || {};
              return (
                <VacancyBox
                  key={vacancy.id}
                  vacancy={vacancy}
                  companyData={company}
                  currentUser={currentUser}
                  onVacancyClick={handleVacancyClick}
                />
              );
            })
          ) : (
            <div className="no-results">
              <p>Вакансій не знайдено</p>
              {vacancies.length > 0 && (
                <button 
                  className="reset-filters-link" 
                  onClick={handleReset}
                >
                  Скинути фільтри
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VacanciesPage;