import React, { useState, useEffect, useRef } from 'react';
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
const currentUserSample = {
  ID: 1,
  Liked_materials: "1, 3",
};
export default function MaterialsPage({
  materials = [],
  currentUser = { Liked_materials: '' },
  onMaterialClick = () => {},
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);
  const [pendingSortBy, setPendingSortBy] = useState('');
  const [appliedSortBy, setAppliedSortBy] = useState('');
  const [likedMaterials, setLikedMaterials] = useState(
    (currentUser.Liked_materials || '').split(', ').filter(Boolean)
  );

  const pageRef = useRef(null);
  const tabsRef = useRef(null);
  const [searchOffset, setSearchOffset] = useState(0);

  // Оновлюємо список лайків при зміні користувача
  useEffect(() => {
    setLikedMaterials(
      (currentUser.Liked_materials || '').split(', ').filter(Boolean)
    );
  }, [currentUser.Liked_materials]);

  // Вираховуємо зсув для пошуку по позиції активної вкладки
  useEffect(() => {
    if (!tabsRef.current || !pageRef.current) return;
    const label = tabsRef.current.querySelector('.tab.active .tab-label');
    if (label) {
      const pageRect = pageRef.current.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      setSearchOffset(labelRect.left - pageRect.left);
    }
  }, [activeTab]);

  const handleLike = id => {
    const sid = id.toString();
    setLikedMaterials(prev =>
      prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]
    );
  };
  const handleSearch = () => {
    if (searchText.trim() && !searchTerms.includes(searchText.trim())) {
      setSearchTerms(prev => [...prev, searchText.trim()]);
      setSearchText('');
    }
  };
  const handleKeyPress = e => e.key === 'Enter' && handleSearch();
  const handleReset = () => {
    setSearchText('');
    setPendingSortBy('');
    setAppliedSortBy('');
    setSearchTerms([]);
  };
  
  const removeSearchTerm = (termToRemove) => {
    setSearchTerms(prev => prev.filter(term => term !== termToRemove));
  };
  
  const clearAllSearchTerms = () => {
    setSearchTerms([]);
    setSearchText('');
  };
  const applyFilters = () => setAppliedSortBy(pendingSortBy);

  // Фільтрація + сортування
  const allMaterials = Array.isArray(materials) ? materials : [];
  const byTab =
    activeTab === 'all'
      ? allMaterials
      : allMaterials.filter(m => likedMaterials.includes(m.ID.toString()));
  const bySearch = byTab.filter(m => {
    if (searchTerms.length === 0) return true;
    return searchTerms.some(term => 
      m.Title.toLowerCase().includes(term.toLowerCase())
    );
  });
  const sorted = [...bySearch].sort((a, b) => {
    if (appliedSortBy === 'views') return b.Views - a.Views;
    if (appliedSortBy === 'date')
      return new Date(b.Date).getTime() - new Date(a.Date).getTime();
    return 0;
  });

  return (
    <section className="materials-page" ref={pageRef}>
      {/* === Таби === */}
      <div className="tabs" ref={tabsRef}>
        <button
          className={`tab${activeTab === 'all' ? ' active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span className="tab-label">Усі статті</span>
        </button>
        <button
          className={`tab${activeTab === 'saved' ? ' active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <span className="tab-label">Збережені статті</span>
        </button>
      </div>

      {/* === Пошук (завжди під активною вкладкою) === */}
      <div className="materials-search-block">
        <h2 className="search-title">
          {activeTab === 'all' ? 'Шукати вакансії' : 'Шукати серед збережених статтей'}
        </h2>
        <div className="materials-search">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="#888" strokeWidth="2" fill="none" />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="#888"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Пошук"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {searchTerms.length > 0 && (
              <div className="search-tags">
                {searchTerms.map((term, index) => (
                  <div className="search-tag" key={index}>
                    {term}
                    <button 
                      className="tag-remove" 
                      onClick={() => removeSearchTerm(term)}
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
                {searchTerms.length > 1 && (
                  <button 
                    className="clear-all-tags" 
                    onClick={clearAllSearchTerms}
                  >
                    Очистити все
                  </button>
                )}
              </div>
            )}
          </div>
          <button className="btn-search" onClick={handleSearch}>
            Пошук
          </button>
        </div>
      </div>

      {/* === Сайдбар + Контент === */}
      <div className="materials-content">
        <aside className="materials-sidebar">
          <div className="sidebar-group">
            <label htmlFor="sort-select">Сортувати за</label>
            <select
              id="sort-select"
              className="sort-select"
              value={pendingSortBy}
              onChange={e => setPendingSortBy(e.target.value)}
            >
              <option value="">Вибрати</option>
              <option value="date">Дата</option>
              <option value="views">Перегляди</option>
            </select>
          </div>
          <div className="sidebar-group actions">
            <button className="btn-reset" onClick={handleReset}>
              Скинути
            </button>
            <button className="btn-apply" onClick={applyFilters}>
              Застосувати
            </button>
          </div>
        </aside>

        <main className="materials-main">
          <div className="materials-list">
            {sorted.map(m => (
              <MaterialBox
                key={m.ID}
                material={m}
                currentUser={{
                  ...currentUser,
                  Liked_materials: likedMaterials.join(', ')
                }}
                searchTerms={searchTerms}
                onMaterialClick={onMaterialClick}
                onLike={handleLike}
              />
            ))}
            {sorted.length === 0 && (
              <div className="no-results">
                {searchTerms.length > 0
                  ? 'За вашим запитом нічого не знайдено'
                  : activeTab === 'saved'
                  ? 'У вас поки немає збережених статей'
                  : 'Статті відсутні'}
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}