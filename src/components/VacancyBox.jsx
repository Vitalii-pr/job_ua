import React from 'react';
import './VacancyBox.css';

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

  return (
    <div className="vacancy-box">
      <div className="vacancy-inner-box">
        {/* Company Logo */}
        <div className="company-logo">
          <img 
            src={`/public/${companyData.Photo}`} 
            alt={`${companyData.Name} logo`} 
            width="64" 
            height="64" 
          />
        </div>
        
        {/* Content Box */}
        <div className="vacancy-content">
          {/* Title and Company */}
          <div className="vacancy-header">
            <h2 className="vacancy-title">{vacancy.Title}</h2>
            <p className="company-name">{companyData.Name}</p>
          </div>
          
          {/* Description and Metadata */}
          <div className="vacancy-details">
            <div className="vacancy-description">
              {/* Short description */}
              <p>{vacancy.Description.substring(0, 150)}...</p>
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
      </div>
    </div>
  );
};

export default VacancyBox;
