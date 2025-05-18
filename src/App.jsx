import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import Login from './components/Login';
import ProfilePage from './pages/ProfilePage';
import VacanciesPage from './pages/VacanciesPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import HistoryPage from './pages/HistoryPage';
import CandidatesPage from './pages/CandidatesPage';
import ResponsesPage from './pages/ResponsesPage';
import VacancyViewPage from './pages/VacancyViewPage';
import { useState, useEffect } from 'react';

function App() {
  const { currentUser, loading, logout } = useAuth();
  const [user, setUser] = useState(null);
  
  // Додаємо глобальний стан для збережених статей
  const [likedMaterials, setLikedMaterials] = useState([]);
  
  // Завантажуємо збережені статті з localStorage при завантаженні
  useEffect(() => {
    if (window.localStorage) {
      const storedLiked = window.localStorage.getItem('likedMaterials');
      if (storedLiked) {
        try {
          const parsedLiked = JSON.parse(storedLiked);
          setLikedMaterials(parsedLiked);
        } catch (error) {
          console.error('Error parsing liked materials:', error);
        }
      }
    }
  }, []);
  
  // Функція для оновлення списку збережених статей
  const handleLikeMaterial = (materialId) => {
    const id = materialId.toString();
    let updatedLiked;
    
    if (likedMaterials.includes(id)) {
      updatedLiked = likedMaterials.filter(item => item !== id);
    } else {
      updatedLiked = [...likedMaterials, id];
    }
    
    setLikedMaterials(updatedLiked);
    
    // Зберігаємо в localStorage
    if (window.localStorage) {
      window.localStorage.setItem('likedMaterials', JSON.stringify(updatedLiked));
    }
  };
  

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const handleLogin = (userData) => {
  //   setUser(userData);
  // };

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     setUser(null);
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const userType = currentUser?.role || 'employee';

  return (
    <Router>
      <div className="app">
        <Navbar 
          userType={userType} 
          user={currentUser}
          onLogout={logout}
        />
        <main className="main-content">
          <Routes>
            {userType === 'employee' ? (
              <>
                <Route path="/vacancies" element={<VacanciesPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/materials" element={<MaterialsPage 
                materials={[
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
                ]} 
                currentUser={user} 
                likedMaterials={likedMaterials}
                onLike={handleLikeMaterial}
                onMaterialClick={(id) => navigate(`/materials/${id}`)} />} />
                <Route path="/materials/:id" element={<MaterialDetailPage 
                materials={[
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
                ]} currentUser={user} />} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="*" element={<Navigate to="/vacancies" />} />
                <Route path="/vacancies/:id" element={<VacancyViewPage />} />
              </>
            ) : (
              <>
                <Route path="/vacancies" element={<VacanciesPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/responses" element={<ResponsesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/vacancies/:id" element={<VacancyViewPage />} />
                <Route path="*" element={<Navigate to="/vacancies" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;