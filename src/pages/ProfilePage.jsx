import React from 'react';
import './ProfilePage.css';

const ProfilePage = ({ userType, toggleUserType }) => {
  return (
    <div className="profile-container">
      <h1>Мій профіль</h1>
      <div className="profile-content">
        <p>Тут буде розміщена інформація про ваш профіль</p>
        
        <div className="user-type-section">
          <h2>Тип користувача</h2>
          <p>Поточний тип користувача: <strong>{userType === 'employee' ? 'Шукач роботи' : 'Роботодавець'}</strong></p>
          <button onClick={toggleUserType} className="toggle-button">
            Змінити на {userType === 'employee' ? 'Роботодавець' : 'Шукач роботи'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
