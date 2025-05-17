import { useState } from 'react';
import companyLogo from '/company_logo.svg';
import companyLogoText from '/company_logo_text.svg';

const Navbar = ({ userType = 'employee', onPageChange }) => {
  const [activeTab, setActiveTab] = useState('Вакансії');

  // Define navigation items based on user type
  const navItems = userType === 'employee' 
    ? [
        { id: 'vacancies', label: 'Вакансії', path: '/vacancies' },
        { id: 'history', label: 'Історія відгуків', path: '/history' },
        { id: 'materials', label: 'Корисні матеріали', path: '/materials' },
        { id: 'profile', label: 'Мій профіль', hasChevron: true, path: '/profile' },
      ]
    : [
        { id: 'vacancies', label: 'Вакансії', path: '/vacancies' },
        { id: 'candidates', label: 'Кандидати', path: '/candidates' },
        { id: 'responses', label: 'Відгуки кандидатів', path: '/responses' },
        { id: 'profile', label: 'Мій профіль', hasChevron: true, path: '/profile' },
      ];

  const handleNavigation = (item) => {
    setActiveTab(item.label);
    // Call the parent component's navigation handler
    if (onPageChange) {
      onPageChange(item.label);
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-logo">
          <img src={companyLogo} alt="Company Logo" />
          <img src={companyLogoText} alt="Company Name" className="logo-text" />
        </div>
        <div className="navbar-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activeTab === item.label ? 'active' : ''} ${item.id === 'profile' ? 'profile' : ''}`}
              onClick={() => handleNavigation(item)}
            >
              <span className="nav-button-text">{item.label}</span>
              {item.hasChevron && (
                <svg
                  width="12.8"
                  height="6.4"
                  viewBox="0 0 12.8 6.4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="chevron-down"
                >
                  <path
                    d="M1 1L6.4 5.4L11.8 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
