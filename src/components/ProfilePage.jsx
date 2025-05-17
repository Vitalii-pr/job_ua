import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import RecommendationDialog from './RecommendationModal';

const ProfilePage = ({ user }) => {
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    description: '',
    position: '',
    qualificationLevel: '',
    skills: [],
    englishLevel: '',
    projectExperience: [],
    resume: {
      url: '',
      uploaded: false,
      uploadDate: null
    },
    portfolio: {
      url: '',
      uploaded: false,
      uploadDate: null
    },
    workFormat: [],
    location: '',
    salaryExpectations: '',
    hourlyRate: '',
    certificates: [],
    recommendations: []
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({
    projectType: '',
    description: '',
    role: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        const userRef = doc(db, 'user_table', user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setProfile(prevProfile => ({
            ...prevProfile,
            ...docSnap.data()
          }));
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'user_table', user.uid);
      await updateDoc(userRef, {
        ...profile,
        updated_at: new Date()
      });
      alert('Профіль успішно оновлено!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Помилка при оновленні профілю');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const handleAddProject = () => {
    if (newProject.projectType && newProject.description) {
      setProfile(prev => ({
        ...prev,
        projectExperience: [...prev.projectExperience, newProject]
      }));
      setNewProject({
        projectType: '',
        description: '',
        role: ''
      });
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkFormatChange = (format) => {
    setProfile(prev => {
      const formats = [...prev.workFormat];
      if (formats.includes(format)) {
        return {
          ...prev,
          workFormat: formats.filter(item => item !== format)
        };
      } else {
        return {
          ...prev,
          workFormat: [...formats, format]
        };
      }
    });
  };

  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        [type]: {
          url: URL.createObjectURL(file),
          uploaded: true,
          uploadDate: new Date().toLocaleDateString('uk-UA'),
          fileName: file.name
        }
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="p-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 cursor-pointer mb-1 bg-gray-100 text-purple-800 border-l-4 border-purple-800">
          Мій профіль
        </div>
        <div className="p-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 cursor-pointer mb-1">
          Контакти
        </div>
        <div className="p-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 cursor-pointer">
          Оповіщення
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          {/* About Me Section */}
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-6">Про мене</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ім'я*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Прізвище*</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={profile.surname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Розширена розповідь про вас</label>
              <textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <span className="absolute top-0 right-0 text-xs text-gray-500">+15%</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-6">Навички</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Посада*</label>
                <select
                  id="position"
                  name="position"
                  value={profile.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                >
                  <option value="">Оберіть посаду</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="fullstack">Fullstack Developer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="pm">Project Manager</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="qualificationLevel" className="block text-sm font-medium text-gray-700 mb-1">Рівень кваліфікації на цій посаді*</label>
                <select
                  id="qualificationLevel"
                  name="qualificationLevel"
                  value={profile.qualificationLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                >
                  <option value="">Оберіть рівень</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              
              <button type="button" className="self-end text-purple-700 hover:text-purple-800 font-medium text-sm flex items-center">
                + Додати посаду
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Навички</label>
                <span className="ml-1 w-4 h-4 bg-gray-200 text-gray-600 text-xs rounded-full flex items-center justify-center cursor-pointer">ⓘ</span>
              </div>
              
              <div className="relative">
                <div className="flex flex-wrap gap-3 mb-3">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{skill}</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        defaultValue="3" 
                        className="w-24 h-1 accent-purple-600"
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Додати навичку"
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddSkill} 
                      className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="absolute top-0 right-0 text-xs text-gray-500">+15%</span>
              </div>
            </div>
            
            <div className="mb-6 relative">
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Цілі</label>
                <span className="ml-1 w-4 h-4 bg-gray-200 text-gray-600 text-xs rounded-full flex items-center justify-center cursor-pointer">ⓘ</span>
              </div>
              <div className="space-y-2">
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Додайте ціль" />
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Додайте ціль" />
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Додайте ціль" />
              </div>
              <button type="button" className="mt-2 text-purple-700 hover:text-purple-800 font-medium text-sm flex items-center">
                + Додати цілі
              </button>
              <span className="absolute top-0 right-0 text-xs text-gray-500">+15%</span>
            </div>
            
            <div className="relative">
              <label htmlFor="englishLevel" className="block text-sm font-medium text-gray-700 mb-1">Рівень англійської</label>
              <div className="flex items-center gap-3">
                <select
                  id="englishLevel"
                  name="englishLevel"
                  value={profile.englishLevel}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Оберіть рівень</option>
                  <option value="beginner">Beginner (A1)</option>
                  <option value="elementary">Elementary (A2)</option>
                  <option value="intermediate">Intermediate (B1)</option>
                  <option value="upperIntermediate">Upper-Intermediate (B2)</option>
                  <option value="advanced">Advanced (C1)</option>
                  <option value="proficient">Proficient (C2)</option>
                </select>
                <button type="button" className="text-purple-700 hover:text-purple-800 font-medium text-sm flex items-center">
                  + Додати мову
                </button>
              </div>
              <span className="absolute top-0 right-0 text-xs text-gray-500">+5%</span>
            </div>
          </div>

          {/* Project Experience Section */}
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-6">Досвід у проектах</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип проекту, в якому ви брали участь</label>
                  <select
                    name="projectType"
                    value={newProject.projectType}
                    onChange={handleProjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Оберіть тип проекту</option>
                    <option value="commercial">Комерційний</option>
                    <option value="open-source">Open Source</option>
                    <option value="pet-project">Pet Project</option>
                    <option value="education">Навчальний</option>
                  </select>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Короткий опис проекту</label>
                  <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleProjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    rows={3}
                  />
                  <span className="absolute top-0 right-0 text-xs text-gray-500">+5%</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ваша роль у цьому проекті</label>
                <input
                  type="text"
                  name="role"
                  value={newProject.role}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <button 
                type="button" 
                onClick={handleAddProject} 
                className="text-purple-700 hover:text-purple-800 font-medium text-sm flex items-center"
              >
                + Додати досвід
              </button>
            </div>
            
            {profile.projectExperience.length > 0 && (
              <div className="space-y-4">
                {profile.projectExperience.map((project, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="font-medium text-purple-700 mb-2">{project.projectType}</div>
                    <div className="text-sm mb-2">{project.description}</div>
                    <div className="text-xs italic text-gray-500">{project.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resume and Portfolio Section */}
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-6">Резюме та портфоліо</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Ваше резюме</label>
                <span className="text-xs text-gray-500">+10%</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium">CV.pdf</p>
                  <p className="text-xs text-gray-500 mt-1">Завантажено: {profile.resume.uploadDate || '15.10'}</p>
                  <div className="h-24 bg-gray-100 rounded mt-2"></div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium">CV.pdf</p>
                  <p className="text-xs text-gray-500 mt-1">Завантажено: {profile.resume.uploadDate || '15.08'}</p>
                  <div className="h-24 bg-gray-100 rounded mt-2"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm cursor-pointer hover:bg-gray-200">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('resume', e)}
                    className="hidden"
                  />
                  Шаблон резюме.pdf
                </label>
                <span className="text-gray-500 cursor-pointer">↓</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Ваше портфоліо</label>
                <span className="text-xs text-gray-500">+20%</span>
              </div>
              
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                placeholder="Посилання на ваше портфоліо" 
              />
              
              <div className="p-4 border border-gray-200 rounded-lg mb-4">
                <p className="font-medium">Portfolio.pdf</p>
                <p className="text-xs text-gray-500 mt-1">Завантажено: {profile.portfolio.uploadDate || '15.10'}</p>
                <div className="h-24 bg-gray-100 rounded mt-2"></div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm cursor-pointer hover:bg-gray-200">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={(e) => handleFileUpload('portfolio', e)}
                    className="hidden"
                  />
                  Шаблон портфоліо.pdf
                </label>
                <span className="text-gray-500 cursor-pointer">↓</span>
              </div>
            </div>
          </div>

          {/* Work Conditions Section */}
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-6">Бажані умови роботи</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Тип зайнятості</label>
                <span className="text-xs text-gray-500">+5%</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fulltime"
                    checked={profile.workFormat.includes('fulltime')}
                    onChange={() => handleWorkFormatChange('fulltime')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fulltime" className="ml-2 text-sm text-gray-700">Повна зайнятість</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parttime"
                    checked={profile.workFormat.includes('parttime')}
                    onChange={() => handleWorkFormatChange('parttime')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="parttime" className="ml-2 text-sm text-gray-700">Часткова зайнятість</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="project"
                    checked={profile.workFormat.includes('project')}
                    onChange={() => handleWorkFormatChange('project')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="project" className="ml-2 text-sm text-gray-700">Проектна робота</label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Місто та країна перебування</label>
                <span className="text-xs text-gray-500">+5%</span>
              </div>
              
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="office"
                    checked={profile.workFormat.includes('office')}
                    onChange={() => handleWorkFormatChange('office')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="office" className="ml-2 text-sm text-gray-700">Офіс</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={profile.workFormat.includes('remote')}
                    onChange={() => handleWorkFormatChange('remote')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm text-gray-700">Віддалено</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hybrid"
                    checked={profile.workFormat.includes('hybrid')}
                    onChange={() => handleWorkFormatChange('hybrid')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hybrid" className="ml-2 text-sm text-gray-700">Гібрид</label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Зарплатні очікування</label>
                  <span className="text-xs text-gray-500">+5%</span>
                </div>
                <input
                  type="text"
                  name="salaryExpectations"
                  value={profile.salaryExpectations}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Наприклад: 2000-3000 USD"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Погодинна ставка</label>
                  <span className="text-xs text-gray-500">+5%</span>
                </div>
                <input
                  type="text"
                  name="hourlyRate"
                  value={profile.hourlyRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Наприклад: 25-35 USD/год"
                />
              </div>
            </div>
          </div>

          {/* Certificates and Recommendations Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-6">Сертифікати та рекомендації</h2>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Сертифікати про закінчення навчання</label>
                <span className="text-xs text-gray-500">+10%</span>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">Сертифікат.pdf</p>
                  <p className="text-xs text-gray-500 mt-1">Завантажено: 01.11</p>
                </div>
                <span className="text-gray-500 cursor-pointer hover:text-gray-700">×</span>
              </div>
              
              <label className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm cursor-pointer hover:bg-gray-700 inline-flex items-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('certificate', e)}
                  className="hidden"
                />
                Завантажити сертифікат
              </label>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Рекомендації</label>
                <span className="text-xs text-gray-500">+10%</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-4">
                    <p className="font-semibold">Роман Петренко</p>
                    <p className="text-xs text-gray-500">10+ досвідчен, технічний Дизайнер взаємодії / ПВАМ</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Підтверджені навички</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-700 text-white text-xs rounded-full">UX Design</span>
                      <input type="range" min="1" max="5" defaultValue="4" disabled className="w-24 accent-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac pellentesque odio et gravida porttum. Dui feugiat sed commodo morbi malesuada est elit. Vitae feugiat tristique feugiat convallis cum convallis vulputate quam mattue. Sit cursus sapien facilisi morbi pellentesque ipsum molestie sed ac in. Sit blandit urna feugiat sed facilisis. Laoret non ut gravida sit diam turpis.
                  </p>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-4">
                    <p className="font-semibold">Петро Романко</p>
                    <p className="text-xs text-gray-500">10+ досвідчен, технічний Дизайнер взаємодії / ПВАМ</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Підтверджені навички</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-700 text-white text-xs rounded-full">UI Design</span>
                      <input type="range" min="1" max="5" defaultValue="5" disabled className="w-24 accent-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac pellentesque odio et gravida porttum. Dui feugiat sed commodo morbi malesuada est elit. Vitae feugiat tristique feugiat convallis cum convallis vulputate quam mattue. Sit cursus sapien facilisi morbi pellentesque ipsum molestie sed ac in. Sit blandit urna feugiat sed facilisis. Laoret non ut gravida sit diam turpis.
                  </p>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => setIsOpen(true)}
                  className="rounded-md bg-purple-700 px-6 py-2 text-white hover:bg-purple-800 text-sm font-medium"
                >
                  Запросити рекомендацію
                </button>

                <RecommendationDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-100">
            <button 
              type="button" 
              className="flex items-center px-4 py-2 border border-purple-700 text-purple-700 rounded-md hover:bg-purple-50 mb-4 md:mb-0"
            >
              <span className="mr-2">⟳</span> Переглянути мій профіль
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 font-medium"
            >
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;