import React from 'react';
import './VacancyBox.css';

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

// Exchange rate USD to UAH (approximate)
const USD_TO_UAH = 38;

const VacancyBox = ({ vacancy, companyData }) => {
  // Helper function to format the date (e.g., "25 жовтня")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Ukrainian month names in genitive case
    const ukrainianMonths = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    
    const day = date.getDate();
    const month = ukrainianMonths[date.getMonth()];
    
    return `${day} ${month}`;
  };

  // Helper function to get the correct form of "перегляд" based on the number
  const getViewsText = (views) => {
    const lastDigit = views % 10;
    const lastTwoDigits = views % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'переглядів';
    }
    
    if (lastDigit === 1) {
      return 'перегляд';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'перегляди';
    }
    
    return 'переглядів';
  };

  if (!vacancy || !companyData) {
    return null;
  }
  
  // Helper function to check employment type equivalence
  const checkEmploymentTypeMatch = (userTypes, vacancyType) => {
    // Handle equivalence between "Неповна зайнятість" and "Часткова зайнятість"
    if (vacancyType === 'Неповна зайнятість' && 
        userTypes.includes('Часткова зайнятість')) {
      return true;
    }
    
    // For debugging
    console.log('Checking employment type:', vacancyType, 'in', userTypes);
    
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
  
  // Check if attributes match user preferences
  const matchesUserPreferences = {
    // Salary check - convert user's desired pay from USD to UAH
    salary: vacancy.Payrate >= (currentUser.Desired_pay * USD_TO_UAH),
    
    // Position check
    position: vacancy.Position === currentUser.Position,
    
    // Qualification check
    qualification: vacancy.Qualification === currentUser.Qualification,
    
    // Work format check
    workFormat: currentUser.Work_format.includes(vacancy.Work_format),
    
    // Employment type check
    workType: checkEmploymentTypeMatch(currentUser.Employment_type, vacancy.Work_type),
    
    // Location check - "Світ" matches with everything
    // If vacancy location is a country and user's city is in that country, it's a match
    workPlace: vacancy.Work_place === 'Світ' || 
               currentUser.City === vacancy.Work_place || 
               (currentUser.City === 'Львів' && vacancy.Work_place === 'Україна') || 
               (currentUser.Moving_posibility && vacancy.Work_place !== 'Світ'),
    
    // English level check
    englishLevel: vacancy.English_lvl === currentUser.English_lvl
  };
  
  // Get matching skills
  const matchingSkills = checkSkillsMatch(currentUser.Skills, vacancy.Skills);
  
  // For debugging
  console.log('Vacancy:', vacancy.Title);
  console.log('Salary match:', matchesUserPreferences.salary, vacancy.Payrate, currentUser.Desired_pay * USD_TO_UAH);
  console.log('Position match:', matchesUserPreferences.position, vacancy.Position, currentUser.Position);
  console.log('Work type match:', matchesUserPreferences.workType, vacancy.Work_type, currentUser.Employment_type);
  console.log('Skills match:', matchingSkills);
  
  // Calculate compatibility percentage
  const calculateCompatibilityPercentage = () => {
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
  
  // Get compatibility percentage
  const compatibilityPercentage = calculateCompatibilityPercentage();
  
  // Helper function to get class name based on match
  const getMatchClass = (field) => {
    return matchesUserPreferences[field] ? 'highlight-match' : 'no-match';
  };

  return (
    <div className="vacancy-box">
      <div className="vacancy-inner-box">
        {/* Company Logo */}
        <div className="company-logo">
          {companyData.Photo ? (
            <img src={`/public/${companyData.Photo}`} alt={`${companyData.Name} logo`} width="64" height="64" />
          ) : (
            <div className="placeholder-logo">{companyData.Name.charAt(0)}</div>
          )}
        </div>
        
        {/* Content Box */}
        <div className="vacancy-content">
          {/* Title and Company */}
          <div className="vacancy-header">
            <div className="vacancy-header-content">
              <h2 className="vacancy-title">{vacancy.Title}</h2>
              <p className="company-name">{companyData.Name}</p>
            </div>
          </div>
          
          {/* Description and Metadata */}
          <div className="vacancy-details">
            {/* Metadata row with salary, qualification, etc. */}
            <div className="vacancy-metadata-details">
              {/* Salary */}
              <span className={getMatchClass('salary')}>{vacancy.Payrate.toLocaleString()}₴</span>
              
              <span className="metadata-separator">•</span>
              
              {/* Qualification */}
              <span className={getMatchClass('qualification')}>{vacancy.Qualification}</span>
              
              <span className="metadata-separator">•</span>
              
              {/* Work format */}
              <span className={getMatchClass('workFormat')}>{vacancy.Work_format}</span>
              
              <span className="metadata-separator">•</span>
              
              {/* Work type */}
              <span className={getMatchClass('workType')}>{vacancy.Work_type}</span>
              
              <span className="metadata-separator">•</span>
              
              {/* Work place */}
              <span className={getMatchClass('workPlace')}>{vacancy.Work_place}</span>
              
              <span className="metadata-separator">•</span>
              
              {/* English level */}
              <span className={getMatchClass('englishLevel')}>{vacancy.English_lvl}</span>
            </div>
            
            <div className="vacancy-description">
              {/* Short description - limit to 2 lines with ellipsis */}
              <p>{vacancy.Description.length > 200 ? `${vacancy.Description.substring(0, 200)}...` : vacancy.Description}</p>
            </div>
            
            {/* Views and Date */}
            <div className="vacancy-metadata">
              <div className="views-count">
                <svg className="eye-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3C4.36364 3 1.25818 5.28364 0 8.5C1.25818 11.7164 4.36364 14 8 14C11.6364 14 14.7418 11.7164 16 8.5C14.7418 5.28364 11.6364 3 8 3ZM8 12.1667C5.99273 12.1667 4.36364 10.5376 4.36364 8.5C4.36364 6.46243 5.99273 4.83333 8 4.83333C10.0073 4.83333 11.6364 6.46243 11.6364 8.5C11.6364 10.5376 10.0073 12.1667 8 12.1667ZM8 6.33333C6.81818 6.33333 5.81818 7.33333 5.81818 8.5C5.81818 9.66667 6.81818 10.6667 8 10.6667C9.18182 10.6667 10.1818 9.66667 10.1818 8.5C10.1818 7.33333 9.18182 6.33333 8 6.33333Z" fill="#888888"/>
                </svg>
                <span className="views-text">{vacancy.Wieved} {getViewsText(vacancy.Wieved)}</span>
              </div>
              
              <span className="separator">•</span>
              
              <div className="posting-date">
                {formatDate(vacancy.Created_at)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Compatibility percentage box */}
        <div className="compatibility-box">
          <div className="compatibility-percentage">
            <span style={{ opacity: compatibilityPercentage / 100 }}>{compatibilityPercentage}%</span>
          </div>
          <div className="compatibility-label">
            <span>сумісність</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyBox;
