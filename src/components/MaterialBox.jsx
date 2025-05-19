import React, { useState, useEffect } from 'react';
import './MaterialBox.css';

const MaterialBox = ({
  material,
  currentUser,
  searchTerms = [],
  onMaterialClick = () => {},
  onLike = () => {}
}) => {
  // Ensure currentUser is never null
  const user = currentUser || { Liked_materials: '' };
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Якщо Liked_materials вже масив – беремо його, інакше сплітимо по комі
    let likedIds = [];
    if (Array.isArray(user.Liked_materials)) {
      likedIds = user.Liked_materials.map(id => parseInt(id, 10));
    } else {
      likedIds = (user.Liked_materials || '')
        .split(',')               // розділяємо по всіх комах
        .map(x => parseInt(x.trim(), 10))
        .filter(n => !isNaN(n));
    }
    setIsLiked(likedIds.includes(material.ID));
  }, [user.Liked_materials, material.ID, user]);

  const handleLikeClick = e => {
    e.preventDefault();
    e.stopPropagation();
    
    // Зберігаємо в localStorage
    const materialId = material.ID.toString();
    let likedMaterials = [];
    
    // Спочатку отримуємо всі збережені матеріали
    if (window.localStorage) {
      const storedLiked = window.localStorage.getItem('likedMaterials');
      if (storedLiked) {
        likedMaterials = JSON.parse(storedLiked);
      }
    }
    
    let updatedLiked;
    
    // Оновлюємо список збережених
    if (isLiked) {
      updatedLiked = likedMaterials.filter(id => id !== materialId);
    } else {
      updatedLiked = [...likedMaterials, materialId];
    }
    
    // Зберігаємо оновлений список
    if (window.localStorage) {
      window.localStorage.setItem('likedMaterials', JSON.stringify(updatedLiked));
    }
    
    // Змінюємо стан та інформуємо батьківський компонент
    setIsLiked(prev => !prev);
    onLike(material.ID);
    
    // Спливаюче повідомлення
    const message = isLiked ? 'Матеріал видалено із збережених' : 'Матеріал збережено';
    const toast = document.createElement('div');
    toast.className = 'save-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const handleCardClick = () => onMaterialClick(material.ID);

  const formatTags = tags => {
    if (!tags) return { visible: [], hiddenCount: 0 };
    const arr = tags.split(', ').map(t => t.trim());
    const visible = arr.slice(0, 5);
    const hiddenCount = Math.max(0, arr.length - visible.length);
    return { visible, hiddenCount };
  };

  const { visible, hiddenCount } = formatTags(material.Tags);

  return (
    <div className="material-box" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="material-inner-box">
        <div className="material-content">
          <div className="material-header">
            <h2 className="material-title">{material.Title}</h2>
            <div
              className={`bookmark-button ${isLiked ? 'bookmarked' : ''}`}
              onClick={handleLikeClick}
              role="button"
              tabIndex={0}
              aria-label={isLiked ? 'Видалити із закладок' : 'Додати в закладки'}
            >
              <svg width="20" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"
                  stroke={isLiked ? '#84112D' : '#888'}
                  strokeWidth="2"
                  fill={isLiked ? '#84112D' : 'none'}
                />
              </svg>
            </div>
          </div>

          <div className="material-details">
            <div className="material-tags">
              {visible.map((tag, i) => {
                // Check if this tag contains any of the search terms
                const isHighlighted = searchTerms.some(term => 
                  tag.toLowerCase().includes(term.toLowerCase())
                );
                
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="tag-separator">•</span>}
                    <span className={`tag ${isHighlighted ? 'tag-highlighted' : ''}`}>
                      {tag}
                    </span>
                  </React.Fragment>
                );
              })}
              {hiddenCount > 0 && (
                <>
                  <span className="tag-separator">•</span>
                  <span className="tag-more">+{hiddenCount}</span>
                </>
              )}
            </div>

            <div className="material-description">
              <p>
                {material.Description.length > 300
                  ? `${material.Description.slice(0, 300)}…`
                  : material.Description}
              </p>
            </div>

            <div className="material-metadata">
              <div className="views-count">
                <svg className="eye-icon" width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M8 3C4.36 3 1.26 5.28 0 8.5 1.26 11.72 4.36 14 8 14s6.74-2.28 8-5.5C14.74 5.28 11.64 3 8 3zM8 12.17c-2.01 0-3.64-1.63-3.64-3.67S5.99 4.83 8 4.83s3.64 1.63 3.64 3.67S10.01 12.17 8 12.17zM8 6.33c-1.18 0-2.18 1-2.18 2.17S6.82 10.67 8 10.67s2.18-1 2.18-2.17S9.18 6.33 8 6.33z"
                    fill="#888"
                  />
                </svg>
                <span className="views-text">{material.Views}</span>
              </div>
              <span className="separator">•</span>
              <div className="posting-date">{material.Date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialBox;
