import React, { useState, useEffect, useMemo } from 'react';
import './HistoryPage.css';
import VacancyBox from '../components/VacancyBox';

// Sample vacancies data (in a real app, this would come from an API or database)
const testVacancies = [
  {
    ID: 1,
    Title: "UI / UX Designer",
    Payrate: 25000,
    Position: "UI UX Designer",
    Qualification: "Junior",
    Work_format: "Віддалена",
    Work_type: "Повна зайнятість",
    Work_place: "Світ",
    English_lvl: "Intermediate",
    Description: "PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових продуктів. На цій посаді ви будете працювати над розробкою вебсайтів, мобільних додатків та інших цифрових платформ у співпраці з командою розробників, дизайнерів і маркетологів.",
    Skills: "UI/UX 1, Wireframes 1, Інтерактивніпрототипи 1, Продуктовий дизайн 1, Мокапи 0, Тестування 0",
    Benefits: "Гнучкий графік, Бюджет на професійний розвиток, Комфортний офіс",
    Host_id: 2,
    Is_active: true,
    Created_at: "2025-10-30",
    Wieved: 40
  },
  {
    ID: 2,
    Title: "Моушин дизайнер",
    Payrate: 15000,
    Position: "Motion Designer",
    Qualification: "Junior",
    Work_format: "Віддалена",
    Work_type: "Неповна зайнятість",
    Work_place: "Україна",
    English_lvl: "Intermediate",
    Description: "MoveWorks шукає талановитого motion-дизайнера для створення інноваційного та якісного візуального контенту. Ви будете працювати над анімацією для соціальних мереж, рекламних кампаній та веб-проектів.",
    Skills: "After Effects 1, Cinema 4D 1, Premiere Pro 1, Illustrator 1, Photoshop 1",
    Benefits: "Гнучкий графік, Молода команда, Можливість віддаленої роботи",
    Host_id: 3,
    Is_active: true,
    Created_at: "2025-09-15",
    Wieved: 28
  },
  {
    ID: 3,
    Title: "Графічний дизайнер",
    Payrate: 20000,
    Position: "Графічний дизайнер",
    Qualification: "Middle",
    Work_format: "Офіс",
    Work_type: "Повна зайнятість",
    Work_place: "Львів",
    English_lvl: "Upper-Intermediate",
    Description: "DesignHub шукає талановитого графічного дизайнера для створення візуальних матеріалів для різних платформ. Ви будете розробляти брендинг, друковані матеріали, веб-графіку та інші візуальні елементи.",
    Skills: "Adobe Photoshop 1, Adobe Illustrator 1, Adobe InDesign 1, Брендинг 1, Типографіка 1",
    Benefits: "Медичне страхування, Спортзал, Корпоративні події",
    Host_id: 4,
    Is_active: true,
    Created_at: "2025-08-23",
    Wieved: 35
  }
];

// Sample companies data
const testCompanies = [
  {
    ID: 1,
    Name: "КГД ПР",
    Photo: "company_logo.svg",
    Description: "Провідна українська IT-компанія"
  },
  {
    ID: 2,
    Name: "PixelPath Studios",
    Photo: "company_logo.svg",
    Description: "Інноваційна дизайн-студія"
  },
  {
    ID: 3,
    Name: "MoveWorks",
    Photo: "company_logo.svg",
    Description: "Студія анімації та motion-дизайну"
  },
  {
    ID: 4,
    Name: "DesignHub",
    Photo: "company_logo.svg",
    Description: "Креативне агентство повного циклу"
  }
];

// Default user data (ID: 1)
const currentUser = {
  ID: 1,
  Name: "Test",
  Surname: "Test",
  Skills: "Figma 4, UI/UX 3, Prototyping 3, Product design 3, Wireframing 4, Тестування 2, Дослідження користувачів 2, Responsive design 2, Інформаційна архітектура 3, Adobe Photoshop 4, Adobe Illustrator 4",
  Position: "UI UX Designer",
  Qualification: "Junior",
  English_lvl: "Intermediate",
  Employment_type: "Часткова зайнятість, Проектна робота, Стажування",
  Work_format: "Віддалена, Віддалена/офіс",
  City: "Львів",
  Moving_posibility: false,
  Desired_pay: 600,
  Desired_hour_pay: 10,
  Disliked_vacancies: "1",
  Wieved_vacancies: "1, 2"
};

const HistoryPage = () => {
  // State for disliked vacancies
  const [dislikedVacancyIds, setDislikedVacancyIds] = useState([]);
  
  // Parse user's disliked vacancies on component mount
  useEffect(() => {
    if (currentUser && currentUser.Disliked_vacancies) {
      const disliked = currentUser.Disliked_vacancies.split(', ').map(id => parseInt(id.trim()));
      setDislikedVacancyIds(disliked);
    }
  }, []);
  
  // Filter vacancies to show only disliked ones
  const dislikedVacancies = useMemo(() => {
    return testVacancies.filter(vacancy => 
      dislikedVacancyIds.includes(vacancy.ID)
    );
  }, [dislikedVacancyIds]);
  
  // Handle vacancy click
  const handleVacancyClick = (vacancyId) => {
    console.log(`Clicked on disliked vacancy ${vacancyId}`);
    // In a real app, you would navigate to the vacancy details
    alert(`Clicked on vacancy ${vacancyId}. This would navigate to the vacancy details page.`);
  };
  
  return (
    <div className="history-page">
      <div className="history-content">
        <div className="disliked-vacancies-container">
          {dislikedVacancies.length > 0 ? (
            <>
              <div className="vacancies-list">
                {dislikedVacancies.map(vacancy => {
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
                })}
              </div>
            </>
          ) : (
            <div className="no-vacancies">
              <p>У вас немає відхилених вакансій.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
