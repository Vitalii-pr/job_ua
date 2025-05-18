import React from 'react';
import './VacancyBox.css';
import { useAuth } from '../contexts/AuthContext'; // Import your auth context

const USD_TO_UAH = 42;

const VacancyBox = ({ vacancy, companyData = {}, onVacancyClick }) => {

  const { currentUser } = useAuth();
  

  const cleanVacancy = {
    ...vacancy,
    Title: vacancy.Title || "Назва не вказана",
    Position: vacancy.Position || "Посада не вказана",
    Work_format: normalizeWorkFormat(vacancy.Work_format),
    Work_type: normalizeWorkType(vacancy.Work_type),
    Work_place: vacancy.Work_place || "Локація не вказана",
    Payrate: vacancy.Payrate || 0,
    Description: vacancy.Description || "Опис відсутній",
    Created_at: vacancy.Created_at || vacancy.createdAt || new Date().toISOString(),
    Wieved: vacancy.Wieved || vacancy.views || 0
  };

  // Normalize work format values
  function normalizeWorkFormat(format) {
    const formatMap = {
      'biänaneha': 'Віддалена',
      'remote': 'Віддалена',
      'hybrid': 'Гібридна',
      'office': 'Офіс'
    };
    return formatMap[format?.toLowerCase()] || format || 'Формат не вказано';
  }

  // Normalize work type values
  function normalizeWorkType(type) {
    const typeMap = {
      'craxyвання': 'Стажування',
      'full': 'Повна зайнятість',
      'part': 'Часткова зайнятість',
      'project': 'Проектна робота',
      'intern': 'Стажування'
    };
    return typeMap[type?.toLowerCase()] || type || 'Тип не вказано';
  }

  const handleVacancyClick = () => {
    onVacancyClick?.(vacancy.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const ukrainianMonths = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    const day = date.getDate();
    const month = ukrainianMonths[date.getMonth()];
    return `${day} ${month}`;
  };

  const getViewsText = (views) => {
    views = views || 0;
    const lastDigit = views % 10;
    const lastTwoDigits = views % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'переглядів';
    if (lastDigit === 1) return 'перегляд';
    if (lastDigit >= 2 && lastDigit <= 4) return 'перегляди';
    return 'переглядів';
  };

  if (!vacancy) return null;

  const compatibilityPercentage = currentUser?.role === 'employee' 
    ? calculateCompatibility(currentUser, cleanVacancy)
    : 0;

  function calculateCompatibility(user, vacancy) {
    const userProfile = {
      position: user.position || '',
      qualification: user.qualification || '',
      employmentType: user.employmentType || user.Employment_type || '',
      workFormat: user.workFormat || user.Work_format || '',
      city: user.city || user.City || '',
      movingPossibility: user.movingPossibility || user.Moving_posibility || false,
      desiredPay: user.desiredPay || user.Desired_pay || 0,
      englishLevel: user.englishLevel || user.English_lvl || '',
      skills: user.skills || user.Skills || ''
    };

    const matches = {
      salary: vacancy.Payrate >= ((userProfile.desiredPay || 0) * USD_TO_UAH),
      position: vacancy.Position === userProfile.position,
      qualification: vacancy.Qualification === userProfile.qualification,
      workFormat: userProfile.workFormat.includes(vacancy.Work_format),
      workType: checkEmploymentTypeMatch(userProfile.employmentType, vacancy.Work_type),
      workPlace: vacancy.Work_place === 'Світ' || 
                userProfile.city === vacancy.Work_place || 
                (userProfile.movingPossibility && vacancy.Work_place !== 'Світ'),
      englishLevel: vacancy.English_lvl === userProfile.englishLevel
    };

    const matchingSkills = checkSkillsMatch(userProfile.skills, vacancy.Skills);
    const totalFields = 7 + (vacancy.Skills ? vacancy.Skills.split(',').length : 0);
    const matchCount = Object.values(matches).filter(Boolean).length + matchingSkills.length;
    
    return Math.round((matchCount / totalFields) * 100);
  }

  function checkEmploymentTypeMatch(userTypes, vacancyType) {
    if (!userTypes || !vacancyType) return false;
    return userTypes.includes(vacancyType);
  }

  function checkSkillsMatch(userSkills, vacancySkills) {
    if (!userSkills || !vacancySkills) return [];
    
    const userSkillNames = userSkills.split(',')
      .map(skill => skill.trim().split(' ')[0].toLowerCase());
    
    return vacancySkills.split(',')
      .map(skill => {
        const parts = skill.trim().split(' ');
        return {
          name: parts[0].toLowerCase(),
          priority: parseInt(parts[1] || '0', 10)
        };
      })
      .filter(skill => skill.priority > 0 && userSkillNames.includes(skill.name));
  }

  return (
    <div className="vacancy-box" onClick={handleVacancyClick} role="button" tabIndex={0}>
      <div className="vacancy-inner-box">
        <div className="company-logo">
          {companyData.Photo ? (
            <img src={`/${companyData.Photo}`} alt={`${companyData.Name} logo`} width="64" height="64" />
          ) : (
            <div className="placeholder-logo">{companyData.Name?.charAt(0) || '?'}</div>
          )}
        </div>
        
        <div className="vacancy-content">
          <div className="vacancy-header">
            <div className="vacancy-header-content">
              <h2 className="vacancy-title">{cleanVacancy.Title}</h2>
              <p className="company-name">{companyData.Name || 'Компанія не вказана'}</p>
            </div>
          </div>
          
          <div className="vacancy-details">
            <div className="vacancy-metadata-details">
              <span>{cleanVacancy.Payrate.toLocaleString()}₴</span>
              <span className="metadata-separator">•</span>
              <span>{cleanVacancy.Qualification}</span>
              <span className="metadata-separator">•</span>
              <span>{cleanVacancy.Work_format}</span>
              <span className="metadata-separator">•</span>
              <span>{cleanVacancy.Work_type}</span>
              <span className="metadata-separator">•</span>
              <span>{cleanVacancy.Work_place}</span>
              <span className="metadata-separator">•</span>
              <span>{cleanVacancy.English_lvl}</span>
            </div>
            
            <div className="vacancy-description">
              <p>
                {cleanVacancy.Description.length > 200 
                  ? `${cleanVacancy.Description.substring(0, 200)}...` 
                  : cleanVacancy.Description}
              </p>
            </div>
            
            <div className="vacancy-metadata">
              <div className="views-count">
                <svg className="eye-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3C4.36364 3 1.25818 5.28364 0 8.5C1.25818 11.7164 4.36364 14 8 14C11.6364 14 14.7418 11.7164 16 8.5C14.7418 5.28364 11.6364 3 8 3ZM8 12.1667C5.99273 12.1667 4.36364 10.5376 4.36364 8.5C4.36364 6.46243 5.99273 4.83333 8 4.83333C10.0073 4.83333 11.6364 6.46243 11.6364 8.5C11.6364 10.5376 10.0073 12.1667 8 12.1667ZM8 6.33333C6.81818 6.33333 5.81818 7.33333 5.81818 8.5C5.81818 9.66667 6.81818 10.6667 8 10.6667C9.18182 10.6667 10.1818 9.66667 10.1818 8.5C10.1818 7.33333 9.18182 6.33333 8 6.33333Z" fill="#888888"/>
                </svg>
                <span className="views-text">
                  {cleanVacancy.Wieved} {getViewsText(cleanVacancy.Wieved)}
                </span>
              </div>
              
              <span className="separator">•</span>
              
              <div className="posting-date">
                {formatDate(cleanVacancy.Created_at)}
              </div>
            </div>
          </div>
        </div>
        
        {currentUser?.role === 'employee' && (
          <div className="compatibility-box">
            <div className="compatibility-percentage">
              <span style={{ opacity: compatibilityPercentage / 100 }}>
                {compatibilityPercentage}%
              </span>
            </div>
            <div className="compatibility-label">
              <span>сумісність</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyBox;