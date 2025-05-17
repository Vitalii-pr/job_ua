import React, { useState, useMemo } from 'react';
import './VacanciesPage.css';
import VacancyBox from '../components/VacancyBox';

// Test company data to match the structure in user.txt
const testCompanies = [
  {
    ID: 2,
    Email: 'test2@gmail.com',
    Password: 'password2',
    Photo: 'user2.svg',
    Name: 'PixelPath Studios',
    Type: 'Company',
    Surname: null,
    Bio: 'PixelPath Studios — це компанія, що спеціалізується на розробці цифрових рішень, таких як мобільні додатки, вебсайти та інтерфейси для різних платформ. Ми співпрацюємо з клієнтами зі всього світу, створюючи продукти, які вирізняються своєю функціональністю та естетикою. Ми віримо в командну роботу, інновації та прагнемо створювати найкращі продукти для наших клієнтів.',
    Skills: null,
    Qualification: null,
    Goals: null,
    English_lvl: null,
    Past_projects: null,
    Past_roles: null,
    Resume: null,
    Portfolio: null,
    Employment_type: null,
    Work_format: null,
    City: 'Київ, Україна',
    Moving_posibility: null,
    Desired_pay: null,
    Desired_hour_pay: null,
    Certificates: null,
    Recomendations: null,
    Disliked_vacancies: null,
    Liked_materials: null,
    Wieved_vacancies: null,
    Wieved_materials: null,
    organization_type: 'Компанія',
    cities_with_offices: 'Львів',
    benefits: 'Win condition',
    possibilities: null,
    website: null,
    telegram: null,
    linkedin: null,
    messages: null,
    messages_email: null
  },
  {
    ID: 3,
    Email: 'test3@gmail.com',
    Password: 'password3',
    Photo: 'user3.svg',
    Name: 'MoveWorks',
    Type: 'Company',
    Surname: null,
    Bio: 'MoveWorks — це компанія, що спеціалізується на розробці цифрових рішень, таких як мобільні додатки, вебсайти та інтерфейси для різних платформ. Ми співпрацюємо з клієнтами зі всього світу, створюючи продукти, які вирізняються своєю функціональністю та естетикою. Ми віримо в командну роботу, інновації та прагнемо створювати найкращі продукти для наших клієнтів.',
    Skills: null,
    Qualification: null,
    Goals: null,
    English_lvl: null,
    Past_projects: null,
    Past_roles: null,
    Resume: null,
    Portfolio: null,
    Employment_type: null,
    Work_format: null,
    City: 'Київ, Україна',
    Moving_posibility: null,
    Desired_pay: null,
    Desired_hour_pay: null,
    Certificates: null,
    Recomendations: null,
    Disliked_vacancies: null,
    Liked_materials: null,
    Wieved_vacancies: null,
    Wieved_materials: null,
    organization_type: 'Компанія',
    cities_with_offices: 'Львів',
    benefits: 'Win condition',
    possibilities: null,
    website: null,
    telegram: null,
    linkedin: null,
    messages: null,
    messages_email: null
  },
  {
    ID: 4,
    Email: 'test4@gmail.com',
    Password: 'password4',
    Photo: 'user4.svg',
    Name: 'MedTech Innovations',
    Type: 'Company',
    Surname: null,
    Bio: 'MedTech Innovations — це компанія, що спеціалізується на розробці цифрових рішень, таких як мобільні додатки, вебсайти та інтерфейси для різних платформ. Ми співпрацюємо з клієнтами зі всього світу, створюючи продукти, які вирізняються своєю функціональністю та естетикою. Ми віримо в командну роботу, інновації та прагнемо створювати найкращі продукти для наших клієнтів.',
    Skills: null,
    Qualification: null,
    Goals: null,
    English_lvl: null,
    Past_projects: null,
    Past_roles: null,
    Resume: null,
    Portfolio: null,
    Employment_type: null,
    Work_format: null,
    City: 'Київ, Україна',
    Moving_posibility: null,
    Desired_pay: null,
    Desired_hour_pay: null,
    Certificates: null,
    Recomendations: null,
    Disliked_vacancies: null,
    Liked_materials: null,
    Wieved_vacancies: null,
    Wieved_materials: null,
    organization_type: 'Компанія',
    cities_with_offices: 'Львів',
    benefits: 'Win condition',
    possibilities: null,
    website: null,
    telegram: null,
    linkedin: null,
    messages: null,
    messages_email: null
  }
];

// Test vacancy data to match the structure in vacancy.text
const testVacancies = [
  {
    ID: 1,
    Title: 'UI / UX Designer',
    Payrate: 25000,
    Position: 'UI UX Designer',
    Qualification: 'Junior',
    Work_format: 'Віддалена',
    Work_type: 'Повна зайнятість',
    Work_place: 'Світ',
    English_lvl: 'Intermediate',
    Description: 'PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових продуктів. На цій посаді ви будете працювати над розробкою вебсайтів, мобільних додатків та інших цифрових платформ у співпраці з командою розробників, дизайнерів і маркетологів. Основна мета вашої роботи — забезпечити, щоб наші продукти були простими у використанні, відповідали потребам клієнтів і виглядали професійно. Ця роль передбачає створення wireframes, інтерактивних прототипів і мокапів, тестування інтерфейсів користувачів та впровадження їх у реальні проекти. Ви також братимете участь у мозкових штурмах і творчих сесіях, де зможете презентувати свої ідеї, орієнтуючись на сучасні тренди в UX/UI дизайні. Ми шукаємо людину, яка здатна мислити аналітично та водночас має творчу жилку. Якщо ви прагнете створювати продукти, що відповідають сучасним стандартам дизайну і надають користувачам винятковий досвід, ця вакансія для вас!',
    Work_conditions: 'Повна зайнятість, 40 годин на тиждень. ; Конкурентна зарплата + бонуси за успішно завершені проекти.',
    Skills: 'UI/UX 1, Wireframes 1, Інтерактивніпрототипи 1, Продуктовий дизайн 1, Мокапи 0, Тестування 0',
    Benefits: 'Гнучкий графік, Бюджет на професійний розвиток, Комфортний офіс',
    Host_id: 2,
    Is_active: true,
    Created_at: '2025-10-30',
    Wieved: 40
  },
  {
    ID: 2,
    Title: 'Моушин дизайнер',
    Payrate: 15000,
    Position: 'Motion Designer',
    Qualification: 'Junior',
    Work_format: 'Віддалена',
    Work_type: 'Неповна зайнятість',
    Work_place: 'Україна',
    English_lvl: 'Intermediate',
    Description: 'MoveWorks шукає талановитого motion-дизайнера для створення інноваційного та яскравого візуального контенту. Ви будете розробляти анімації для рекламних кампаній, соціальних медіа, промо-відео та інтерактивних веб-сторінок. Ваша робота включатиме створення візуально привабливих та ефективних анімацій, які допоможуть привлечти та залишити увагу вашій аудиторії.',
    Work_conditions: 'Неповна зайнятість, 20 годин на тиждень. ; Конкурентна зарплата + бонуси за успішно завершені проекти.',
    Skills: 'Motion Designer 1, Wireframes 1, Інтерактивніпрототипи 1, Продуктовий дизайн 1, Мокапи 0, Тестування 0',
    Benefits: 'Гнучкий графік, Бюджет на професійний розвиток, Комфортний офіс',
    Host_id: 3,
    Is_active: true,
    Created_at: '2025-09-19',
    Wieved: 37
  },
  {
    ID: 3,
    Title: 'UI/UX Designer (Healthcare Solutions)',
    Payrate: 30000,
    Position: 'UI UX Designer',
    Qualification: 'Middle',
    Work_format: 'Віддалена',
    Work_type: 'Неповна зайнятість',
    Work_place: 'Україна',
    English_lvl: 'Intermediate',
    Description: 'MedTech Innovations шукає UI/UX дизайнера для розробки інтерфейсів для медичних платформ і додатків. Ви будете працювати над створенням зручного UX для пацієнтів, лікарів і адміністраторів медичних закладів.',
    Work_conditions: 'Неповна зайнятість, 20 годин на тиждень. ; Конкурентна зарплата + бонуси за успішно завершені проекти.',
    Skills: 'UI/UX 1, Wireframes 1, Інтерактивніпрототипи 1, Продуктовий дизайн 1, Мокапи 0, Тестування 0',
    Benefits: 'Гнучкий графік, Бюджет на професійний розвиток, Комфортний офіс',
    Host_id: 4,
    Is_active: true,
    Created_at: '2025-08-23',
    Wieved: 23
  }
];

const VacanciesPage = () => {
  // Search & filter state
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
    setSearchQuery('');
    setSpecialization('');
    setSortBy('');
    setEmploymentTypes({ full: false, part: false, project: false, intern: false });
    setFormats({ remote: false, hybrid: false, office: false });
    setLevel('');
    setCountryCity('');
    setSalaryMin(0);
    setEnglishLevel('');
  };

  const handleApply = () => {
    // Filtering is handled automatically through useMemo
    console.log('Filters applied:', { searchQuery, specialization, sortBy, employmentTypes, formats, level, countryCity, salaryMin, englishLevel });
  };

  const filteredVacancies = useMemo(() => {
    return testVacancies.filter(vacancy => {
      // Search query filter
      if (searchQuery && !vacancy.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Specialization filter
      if (specialization && vacancy.specialization !== specialization) {
        return false;
      }

      // Employment type filter
      if (Object.values(employmentTypes).some(v => v)) {
        const matchesType = employmentTypes[vacancy.employmentType];
        if (!matchesType) return false;
      }

      // Format filter
      if (Object.values(formats).some(v => v)) {
        const matchesFormat = formats[vacancy.format];
        if (!matchesFormat) return false;
      }

      // Level filter
      if (level && vacancy.level !== level) {
        return false;
      }

      // Location filter
      if (countryCity && vacancy.location !== countryCity) {
        return false;
      }

      // Salary filter
      if (salaryMin > 0 && vacancy.salary < salaryMin) {
        return false;
      }

      // English level filter
      if (englishLevel && vacancy.englishLevel !== englishLevel) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
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
  }, [searchQuery, specialization, sortBy, employmentTypes, formats, level, countryCity, salaryMin, englishLevel]);

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
                <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24">
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
                <svg className="chevron-down" width="19.2" height="9.6" viewBox="0 0 19.2 9.6">
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
                <option value="match_desc">Сумісність</option>
                <option value="date_desc">Дата: нові</option>
                <option value="salary_desc">Зарплата: висока</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6">
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
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2"/></svg>
            </div>

            {/* Country, City */}
            <p className="subheading">Країна, місто</p>
            <div className="select-wrapper small">
              <select value={countryCity} onChange={e => setCountryCity(e.target.value)}>
                <option value="">Вибрати</option>
                <option value="lviv">Львів</option>
                <option value="kyiv">Київ</option>
                <option value="online">Україна</option>
              </select>
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2"/></svg>
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
                background: `linear-gradient(to right, #2e7dff 0%, #2e7dff ${(salaryMin/100000)*100}%, #e0e0e0 ${(salaryMin/100000)*100}%, #e0e0e0 100%)`
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
              <svg className="chevron-down" width="12" height="6" viewBox="0 0 12 6">
                <path d="M1 1L6 5L11 1" stroke="#84112D" strokeWidth="2"/></svg>
            </div>

            {/* Actions */}
            <div className="filter-actions">
              <button type="button" className="reset-button" onClick={handleReset}>Скинути</button>
              <button type="button" className="apply-button" onClick={handleApply}>Застосувати</button>
            </div>
          </div>
        </aside>

        {/* Main vacancy results with VacancyBox component */}
        <main className="vacancies-list">
          {filteredVacancies.length > 0 ? (
            filteredVacancies.map(vacancy => {
              // Find the company data for this vacancy
              const companyData = testCompanies.find(company => company.ID === vacancy.Host_id);
              
              return (
                <VacancyBox 
                  key={vacancy.ID} 
                  vacancy={vacancy} 
                  companyData={companyData} 
                />
              );
            })
          ) : (
            <p className="no-vacancies">Вакансій не знайдено</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default VacanciesPage;