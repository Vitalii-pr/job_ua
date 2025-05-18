import React, { useState, useMemo } from 'react';
import './VacanciesPage.css';
import VacancyBox from '../components/VacancyBox';

// Default user data (ID: 1)
const currentUser = {
  ID: 1,
  Position: 'UI UX Designer',
  Qualification: 'Junior',
  Employment_type: 'Часткова зайнятість, Проектна робота, Стажування',
  Work_format: 'Віддалена, Віддалена/офіс',
  City: 'Львів',
  Moving_posibility: false,
  Desired_pay: 600, // in USD
  English_lvl: 'Intermediate',
  Skills: 'Figma 4, UI/UX 3, Prototyping 3, Product design 3, Wireframing 4, Тестування 2, Дослідження користувачів 2, Responsive design 2, Інформаційна архітектура 3, Adobe Photoshop 4, Adobe Illustrator 4'
};


const USD_TO_UAH = 40;

// Helper function to check employment type equivalence
const checkEmploymentTypeMatch = (userTypes, vacancyType) => {
  // Handle equivalence between "Неповна зайнятість" and "Часткова зайнятість"
  if (vacancyType === 'Неповна зайнятість' && 
      userTypes.includes('Часткова зайнятість')) {
    return true;
  }
  return userTypes.includes(vacancyType);
};

// Helper function to check skills match
const checkSkillsMatch = (userSkills, vacancySkills) => {
  if (!userSkills || !vacancySkills) return [];
  
  // Extract skill names from user skills (ignore numbers)
  const userSkillNames = userSkills.split(', ')
    .map(skill => skill.split(' ')[0].trim().toLowerCase());
  
  // Parse vacancy skills with their priorities
  const vacancySkillsWithPriority = vacancySkills.split(', ')
    .map(skill => {
      const parts = skill.split(' ');
      return {
        name: parts[0].trim().toLowerCase(),
        priority: parseInt(parts[1] || '0', 10)
      };
    })
    .filter(skill => skill.priority > 0); // Only include skills with priority > 0
  
  // Find matching skills - only check for skills required by the vacancy
  return vacancySkillsWithPriority
    .filter(skill => userSkillNames.includes(skill.name))
    .map(skill => skill.name);
};

// Calculate compatibility percentage between user and vacancy
const calculateCompatibilityPercentage = (user, vacancy) => {
  // Check if attributes match user preferences
  const matchesUserPreferences = {
    // Salary check - convert user's desired pay from USD to UAH
    // If vacancy salary is greater than user's desired pay, it's a match
    salary: vacancy.Payrate >= (user.Desired_pay * USD_TO_UAH),
    
    // Position check
    position: vacancy.Position === user.Position,
    
    // Qualification check
    qualification: vacancy.Qualification === user.Qualification,
    
    // Work format check
    workFormat: user.Work_format.includes(vacancy.Work_format),
    
    // Employment type check
    workType: checkEmploymentTypeMatch(user.Employment_type, vacancy.Work_type),
    
    // Location check - "Світ" matches with everything
    // If vacancy location is a country and user's city is in that country, it's a match
    workPlace: vacancy.Work_place === 'Світ' || 
              user.City === vacancy.Work_place || 
              (user.City === 'Львів' && vacancy.Work_place === 'Україна') || 
              (user.Moving_posibility && vacancy.Work_place !== 'Світ'),
    
    // English level check
    englishLevel: vacancy.English_lvl === user.English_lvl
  };
  
  // Get matching skills
  const matchingSkills = checkSkillsMatch(user.Skills, vacancy.Skills);
  
  // Parse vacancy skills with their priorities to count only skills with priority > 0
  const relevantVacancySkills = vacancy.Skills ? 
    vacancy.Skills.split(', ')
      .map(skill => {
        const parts = skill.split(' ');
        return {
          name: parts[0].trim().toLowerCase(),
          priority: parseInt(parts[1] || '0', 10)
        };
      })
      .filter(skill => skill.priority > 0) : [];
  
  // Count all fields to check (7 basic fields + relevant skills)
  const totalFields = 7 + relevantVacancySkills.length; // 7 basic fields + skills with priority > 0
  
  // Count matches
  let matches = 0;
  if (matchesUserPreferences.salary) matches++;
  if (matchesUserPreferences.position) matches++;
  if (matchesUserPreferences.qualification) matches++;
  if (matchesUserPreferences.workFormat) matches++;
  if (matchesUserPreferences.workType) matches++;
  if (matchesUserPreferences.workPlace) matches++;
  if (matchesUserPreferences.englishLevel) matches++;
  
  // Add matching skills
  matches += matchingSkills.length;
  
  // Calculate percentage
  return Math.round((matches / totalFields) * 100);
};

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
  // Current filter state
  const [currentFilters, setCurrentFilters] = useState({
    searchQuery: '',
    specialization: '',
    sortBy: 'matching',
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
  const [sortBy, setSortBy] = useState('matching');
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
    setSortBy('matching');
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
      sortBy: 'matching',
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

  const handleVacancyClick = (vacancyId) => {
    // For now, just log the click since navigation isn't set up
    console.log(`Navigating to vacancy details for ID: ${vacancyId}`);
    // In a real application, you would navigate to the vacancy details page
    // navigate(`/vacancy/${vacancyId}`);
    
    // You could also show a modal with vacancy details
    alert(`Clicked on vacancy ${vacancyId}. This would navigate to the vacancy details page.`);
  };

  const filteredVacancies = useMemo(() => {
    return testVacancies.filter(vacancy => {
      // Search query filter
      if (currentFilters.searchQuery && !vacancy.Title.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())) {
        return false;
      }

      // Specialization filter
      if (currentFilters.specialization && vacancy.Position !== currentFilters.specialization) {
        return false;
      }

      // Employment type filter
      if (Object.values(currentFilters.employmentTypes).some(v => v)) {
        // Map the employment types to match the Work_type field
        const employmentTypeMap = {
          full: 'Повна зайнятість',
          part: 'Неповна зайнятість',
          project: 'Проектна робота',
          intern: 'Стажування'
        };
        
        // Check if any of the selected employment types match the vacancy's Work_type
        const matchesType = Object.keys(currentFilters.employmentTypes)
          .some(key => currentFilters.employmentTypes[key] && vacancy.Work_type === employmentTypeMap[key]);
        
        if (!matchesType && Object.values(currentFilters.employmentTypes).some(v => v)) {
          return false;
        }
      }

      // Format filter
      if (Object.values(currentFilters.formats).some(v => v)) {
        // Map the format types to match the Work_format field
        const formatMap = {
          remote: 'Віддалена',
          hybrid: 'Віддалена/офіс',
          office: 'Офіс'
        };
        
        // Check if any of the selected formats match the vacancy's Work_format
        const matchesFormat = Object.keys(currentFilters.formats)
          .some(key => currentFilters.formats[key] && vacancy.Work_format === formatMap[key]);
        
        if (!matchesFormat && Object.values(currentFilters.formats).some(v => v)) {
          return false;
        }
      }

      // Level filter
      if (currentFilters.level && vacancy.Qualification.toLowerCase() !== currentFilters.level.toLowerCase()) {
        return false;
      }

      // Location filter
      if (currentFilters.countryCity && 
          !vacancy.Work_place.toLowerCase().includes(currentFilters.countryCity.toLowerCase())) {
        return false;
      }

      // Salary filter
      if (currentFilters.salaryMin > 0 && vacancy.Payrate < currentFilters.salaryMin) {
        return false;
      }

      // English level filter
      if (currentFilters.englishLevel && 
          vacancy.English_lvl.toLowerCase() !== currentFilters.englishLevel.toLowerCase()) {
        return false;
      }

      return true;
    }).map(vacancy => ({
      ...vacancy,
      compatibilityPercentage: calculateCompatibilityPercentage(currentUser, vacancy)
    })).sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'matching':
          return b.compatibilityPercentage - a.compatibilityPercentage;
        case 'salary':
          return b.Payrate - a.Payrate;
        case 'date':
          return new Date(b.Created_at) - new Date(a.Created_at);
        case 'views':
          return b.Wieved - a.Wieved;
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
          <form className="search-form" onSubmit={e => {
            e.preventDefault();
            handleApply();
          }}>
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
                  <option value="UI UX Designer">UI/UX Дизайн</option>
                  <option value="Motion Designer">Motion Дизайн</option>
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
              <button type="submit" className="search-button">Пошук</button>
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
                  onVacancyClick={handleVacancyClick}
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