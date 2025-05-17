import React, { useState, useMemo } from 'react';
import './VacanciesPage.css';

const testVacancies = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCo',
    salary: 120000,
    level: 'senior',
    format: 'remote',
    employmentType: 'full',
    specialization: 'it',
    location: 'kyiv',
    englishLevel: 'advanced',
    views: 245,
    datePosted: '2025-05-15T10:00:00',
    match: 95
  },
  {
    id: 2,
    title: 'Junior Marketing Manager',
    company: 'StartupsUA',
    salary: 25000,
    level: 'junior',
    format: 'office',
    employmentType: 'full',
    specialization: 'marketing',
    location: 'lviv',
    englishLevel: 'intermediate',
    views: 180,
    datePosted: '2025-05-16T15:30:00',
    match: 85
  },
  {
    id: 3,
    title: 'Middle Sales Representative',
    company: 'SalesForce',
    salary: 45000,
    level: 'middle',
    format: 'hybrid',
    employmentType: 'part',
    specialization: 'sales',
    location: 'kyiv',
    englishLevel: 'upper',
    views: 120,
    datePosted: '2025-05-17T09:00:00',
    match: 75
  },
  {
    id: 4,
    title: 'Finance Intern',
    company: 'BigBank',
    salary: 15000,
    level: 'junior',
    format: 'office',
    employmentType: 'intern',
    specialization: 'finance',
    location: 'kyiv',
    englishLevel: 'basic',
    views: 90,
    datePosted: '2025-05-17T11:00:00',
    match: 65
  },
  {
    id: 5,
    title: 'HR Business Partner',
    company: 'GlobalHR',
    salary: 70000,
    level: 'middle',
    format: 'hybrid',
    employmentType: 'full',
    specialization: 'hr',
    location: 'lviv',
    englishLevel: 'advanced',
    views: 150,
    datePosted: '2025-05-16T12:00:00',
    match: 88
  }
];

const VacanciesPage = () => {
  // Current filter state
  const [currentFilters, setCurrentFilters] = useState({
    searchQuery: '',
    specialization: '',
    sortBy: '',
    employmentTypes: { full: false, part: false, project: false, intern: false },
    formats: { remote: false, hybrid: false, office: false },
    level: '',
    countryCity: '',
    salaryMin: 0,
    englishLevel: ''
  });

  // Temporary filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [employmentTypes, setEmploymentTypes] = useState({ full: false, part: false, project: false, intern: false });
  const [formats, setFormats] = useState({ remote: false, hybrid: false, office: false });
  const [level, setLevel] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [salaryMin, setSalaryMin] = useState(0);
  const [englishLevel, setEnglishLevel] = useState('');

  const handleCheckbox = (setter, field) => e => {
    setter(prev => ({ ...prev, [field]: e.target.checked }));
  };

  const handleReset = () => {
    // Reset temporary state
    setSearchQuery('');
    setSpecialization('');
    setSortBy('');
    setEmploymentTypes({ full: false, part: false, project: false, intern: false });
    setFormats({ remote: false, hybrid: false, office: false });
    setLevel('');
    setCountryCity('');
    setSalaryMin(0);
    setEnglishLevel('');
    
    // Reset current filters
    setCurrentFilters({
      searchQuery: '',
      specialization: '',
      sortBy: '',
      employmentTypes: { full: false, part: false, project: false, intern: false },
      formats: { remote: false, hybrid: false, office: false },
      level: '',
      countryCity: '',
      salaryMin: 0,
      englishLevel: ''
    });
  };

  const handleApply = () => {
    // Apply current filters
    setCurrentFilters({
      searchQuery,
      specialization,
      sortBy,
      employmentTypes,
      formats,
      level,
      countryCity,
      salaryMin,
      englishLevel
    });
  };

  const filteredVacancies = useMemo(() => {
    return testVacancies.filter(vacancy => {
      // Search query filter
      if (currentFilters.searchQuery && !vacancy.title.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())) {
        return false;
      }

      // Specialization filter
      if (currentFilters.specialization && vacancy.specialization !== currentFilters.specialization) {
        return false;
      }

      // Employment type filter
      if (Object.values(currentFilters.employmentTypes).some(v => v)) {
        const matchesType = currentFilters.employmentTypes[vacancy.employmentType];
        if (!matchesType) return false;
      }

      // Format filter
      if (Object.values(currentFilters.formats).some(v => v)) {
        const matchesFormat = currentFilters.formats[vacancy.format];
        if (!matchesFormat) return false;
      }

      // Level filter
      if (currentFilters.level && vacancy.level !== currentFilters.level) {
        return false;
      }

      // Location filter
      if (currentFilters.countryCity && vacancy.location !== currentFilters.countryCity) {
        return false;
      }

      // Salary filter
      if (currentFilters.salaryMin > 0 && vacancy.salary < currentFilters.salaryMin) {
        return false;
      }

      // English level filter
      if (currentFilters.englishLevel && vacancy.englishLevel !== currentFilters.englishLevel) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'salary':
          return b.salary - a.salary;
        case 'date':
          return new Date(b.datePosted) - new Date(a.datePosted);
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });
  }, [currentFilters]);

  return (
    <div className="vacancies-container">
      {/* Search header */}
      <div className="search-header-box">
        <div className="search-box">
          <h2 className="search-title">Шукати вакансії</h2>
          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <div className="search-input-container">
              {/* Search input */}
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

              {/* Specialization select */}
              <div className="specialization-field">
                <select
                  className="specialization-select"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                >
                  <option value="" disabled>Спеціалізація</option>
                  <option value="it">IT</option>
                  <option value="marketing">Маркетинг</option>
                  <option value="sales">Продажі</option>
                  <option value="finance">Фінанси</option>
                  <option value="hr">HR</option>
                </select>
                <svg className="chevron-down" width="19.2" height="9.6" viewBox="0 0 19.2 9.6" fill="none">
                  <path d="M1 1L9.6 8L18.2 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Search button */}
              <button className="search-button">Пошук</button>
            </div>
          </form>
        </div>
      </div>

      {/* Content: Sidebar + Results */}
      <div className="page-content">
        {/* Sidebar filters */}
        <aside className="filters-sidebar">
          {/* Sort dropdown */}
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

          {/* Filters */}
          <div className="filter-section">
            <h3 className="filter-heading">Фільтри</h3>

            {/* Employment types */}
            <p className="subheading">Тип зайнятості</p>
            <label><input type="checkbox" checked={employmentTypes.full} onChange={handleCheckbox(setEmploymentTypes,'full')} /> Повна зайнятість</label>
            <label><input type="checkbox" checked={employmentTypes.part} onChange={handleCheckbox(setEmploymentTypes,'part')} /> Часткова зайнятість</label>
            <label><input type="checkbox" checked={employmentTypes.project} onChange={handleCheckbox(setEmploymentTypes,'project')} /> Проектна робота</label>
            <label><input type="checkbox" checked={employmentTypes.intern} onChange={handleCheckbox(setEmploymentTypes,'intern')} /> Стажування</label>

            {/* Format */}
            <p className="subheading">Формат роботи</p>
            <label><input type="checkbox" checked={formats.remote} onChange={handleCheckbox(setFormats,'remote')} /> Віддалена</label>
            <label><input type="checkbox" checked={formats.hybrid} onChange={handleCheckbox(setFormats,'hybrid')} /> Віддалена/офіс</label>
            <label><input type="checkbox" checked={formats.office} onChange={handleCheckbox(setFormats,'office')} /> Офіс</label>

            {/* Qualification Level */}
            <p className="subheading">Рівень кваліфікації</p>
            <div className="select-wrapper small">
              <select value={level} onChange={e => setLevel(e.target.value)}>
                <option value="">Вибрати</option>
                <option value="junior">Junior</option>
                <option value="middle">Middle</option>
                <option value="senior">Senior</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>

            {/* Country, City */}
            <p className="subheading">Країна, місто</p>
            <div className="search-field small">
              <svg className="search-icon red" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#84112D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Введіть місто"
                value={countryCity}
                onChange={e => setCountryCity(e.target.value)}
              />
            </div>

            {/* Salary expectations */}
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

            {/* English level */}
            <p className="subheading">Рівень англійської</p>
            <div className="select-wrapper small">
              <select value={englishLevel} onChange={e => setEnglishLevel(e.target.value)}>
                <option value="">Вибрати</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="upper">Upper-Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>

            {/* Actions */}
            <div className="filter-actions">
              <button type="button" className="reset-button" onClick={handleReset}>Скинути</button>
              <button type="button" className="apply-button" onClick={handleApply}>Застосувати</button>
            </div>
          </div>
        </aside>

        {/* Main vacancy results (empty for now) */}
        <main className="vacancies-list">
        {filteredVacancies.length > 0
          ? filteredVacancies.map(v => (
              <div key={v.id} className="vacancy-card">
                {/* тут ваш JSX-код для картки вакансії */}
                <div className="vacancy-info">
                  <h3>{v.title}</h3>
                  <p>{v.company}</p>
                  <p>{v.salary?.toLocaleString()}₴ · {v.level} · {v.format}</p>
                  <p>{v.views} переглядів · {new Date(v.datePosted).toLocaleDateString('uk')}</p>
                </div>
                <div className="vacancy-match">{v.match}%</div>
              </div>
            ))
          : <p className="no-vacancies">Вакансій не знайдено</p>
        }
      </main>
      </div>
    </div>
  );
};

export default VacanciesPage;