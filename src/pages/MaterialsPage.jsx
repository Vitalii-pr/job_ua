import React, { useState, useMemo, useEffect } from 'react';
import './MaterialsPage.css';
import MaterialBox from '../components/MaterialBox';

// Sample materials data (in a real app, this would come from an API or database)
const testMaterials = [
  {
    ID: 1,
    Title: "Як написати резюме, яке приверне увагу рекрутера",
    Description: "Резюме — це ваша візитна картка на ринку праці. У цій статті ми розглянемо ключові елементи ефективного резюме, поширені помилки та практичні поради щодо структурування вашого досвіду. Ви дізнаєтесь, як виділитися серед інших кандидатів та зробити ваше резюме таким, що запам'ятовується рекрутерам.",
    Tags: "Резюме, Пошук роботи, Кар'єра, Поради",
    Date: "15 травня 2025",
    Views: 1245,
    Link: "/materials/1"
  },
  {
    ID: 2,
    Title: "10 порад для успішної співбесіди",
    Description: "Співбесіда — це ваш шанс показати, чому саме ви ідеально підходите для цієї посади. У цій статті ми розглянемо, як підготуватися до співбесіди, які питання очікувати та як на них відповідати, а також як справити хороше враження на потенційного роботодавця.",
    Tags: "Співбесіда, Пошук роботи, Кар'єра, Поради, HR",
    Date: "10 травня 2025",
    Views: 987,
    Link: "/materials/2"
  },
  {
    ID: 3,
    Title: "Як розвивати soft skills для успішної кар'єри",
    Description: "Soft skills, або м'які навички, стають все більш важливими для роботодавців. У цій статті ми розглянемо, які soft skills найбільш цінуються на ринку праці, як їх розвивати та демонструвати під час співбесіди та на робочому місці.",
    Tags: "Soft skills, Кар'єра, Розвиток, Навички, Комунікація",
    Date: "5 травня 2025",
    Views: 756,
    Link: "/materials/3"
  },
  {
    ID: 4,
    Title: "Як знайти роботу своєї мрії: покрокова інструкція",
    Description: "Знайти роботу, яка приноситиме не лише гроші, але й задоволення, — мрія багатьох. У цій статті ми розглянемо, як визначити, яка робота вам підходить, де шукати вакансії та як підготуватися до процесу працевлаштування.",
    Tags: "Пошук роботи, Кар'єра, Мотивація, Цілі, Планування",
    Date: "1 травня 2025",
    Views: 1102,
    Link: "/materials/4"
  },
  {
    ID: 5,
    Title: "Як ефективно вести переговори про зарплату",
    Description: "Обговорення зарплати — один з найскладніших аспектів пошуку роботи. У цій статті ми розглянемо, як підготуватися до переговорів, як визначити свою ринкову вартість та як впевнено вести діалог з роботодавцем про компенсацію.",
    Tags: "Зарплата, Переговори, Кар'єра, Фінанси, HR",
    Date: "25 квітня 2025",
    Views: 843,
    Link: "/materials/5"
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
  Liked_materials: "1, 3",
  Wieved_materials: "1, 2, 3, 4"
};

const MaterialsPage = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [likedMaterials, setLikedMaterials] = useState([]);
  
  // Parse user's liked materials
  useEffect(() => {
    if (currentUser && currentUser.Liked_materials) {
      const liked = currentUser.Liked_materials.split(', ').map(id => parseInt(id.trim()));
      setLikedMaterials(liked);
    }
  }, []);
  
  // Handle material click
  const handleMaterialClick = (materialId) => {
    console.log(`Navigating to material details for ID: ${materialId}`);
    // In a real application, you would navigate to the material details page
    // navigate(`/materials/${materialId}`);
    
    // You could also show a modal with material details
    alert(`Clicked on material ${materialId}. This would navigate to the material details page.`);
  };
  
  // Handle like/unlike
  const handleLikeToggle = (materialId) => {
    // Toggle like status
    if (likedMaterials.includes(materialId)) {
      // Remove from liked materials
      setLikedMaterials(likedMaterials.filter(id => id !== materialId));
      // In a real app, update the user's liked materials in the database
    } else {
      // Add to liked materials
      setLikedMaterials([...likedMaterials, materialId]);
      // In a real app, update the user's liked materials in the database
    }
  };
  
  // Sort and filter materials
  const sortedMaterials = useMemo(() => {
    // First filter by search query if any
    let filtered = testMaterials;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = testMaterials.filter(material => 
        material.Title.toLowerCase().includes(query) || 
        material.Description.toLowerCase().includes(query) ||
        material.Tags.toLowerCase().includes(query)
      );
    }
    
    // Then sort: liked materials first, then by date (newest first)
    return [...filtered].sort((a, b) => {
      // First sort by liked status
      const aLiked = likedMaterials.includes(a.ID);
      const bLiked = likedMaterials.includes(b.ID);
      
      if (aLiked && !bLiked) return -1;
      if (!aLiked && bLiked) return 1;
      
      // Then sort by date (assuming date strings can be compared directly)
      // In a real app, you'd parse these into actual Date objects
      return b.Date.localeCompare(a.Date);
    });
  }, [testMaterials, searchQuery, likedMaterials]);
  
  return (
    <div className="materials-page">
      {/* Search section */}
      <div className="search-section">
        <div className="search-container">
          <h1 className="search-title">Корисні матеріали</h1>
          <div className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Пошук за ключовими словами"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#666666"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Materials list section */}
      <div className="content-section">
        <div className="materials-container">
          {/* Materials list */}
          <div className="materials-list">
            {sortedMaterials.length > 0 ? (
              sortedMaterials.map(material => (
                <MaterialBox
                  key={material.ID}
                  material={material}
                  onMaterialClick={handleMaterialClick}
                  currentUser={currentUser}
                />
              ))
            ) : (
              <div className="no-results">
                <p>Не знайдено матеріалів за вашим запитом.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
