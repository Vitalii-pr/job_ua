import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import companyLogo from '/public/company_logo.svg';
import companyLogoText from '/public/company_logo_text.svg';

const Navbar = ({ userType = 'employee' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');

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

  useEffect(() => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) setActiveTab(current.label);
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setActiveTab(item.label);
    navigate(item.path);
  };

  return (
    <div className="w-full bg-black flex justify-center h-[60px]" style={{ fontFamily: "'Fira Sans', sans-serif" }}>
      <div className="w-[90%] flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex items-center h-full">
          <img src={companyLogo} alt="Company Logo" className="h-full object-contain" />
          <img src={companyLogoText} alt="Company Name" className="ml-[5px] h-full object-contain" />
        </div>

        {/* Navigation Links */}
        <div className="flex h-full gap-[2px]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                bg-transparent text-white border-none font-bold cursor-pointer
                flex items-center justify-center h-full px-[20px] relative box-border m-0
                select-none border-l border-l-[rgba(255,255,255,0.1)]
                ${activeTab === item.label ? 'bg-[#84112D]' : ''}
                ${item.id === 'profile' ? 'justify-start' : ''}
              `}
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              <span className={`
                whitespace-nowrap pointer-events-none text-[15px] p-0 text-center
                ${item.id === 'profile' ? 'mr-[32px]' : ''}
              `}>
                {item.label}
              </span>
              {item.hasChevron && (
                <svg
                  width="12.8"
                  height="6.4"
                  viewBox="0 0 12.8 6.4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-[20px] top-1/2 -translate-y-1/2"
                  stroke="white"
                >
                  <path
                    d="M1 1L6.4 5.4L11.8 1"
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
