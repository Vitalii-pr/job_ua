import React, { useState, useEffect } from 'react';
import './MaterialBox.css';

const MaterialBox = ({ material, onMaterialClick, currentUser }) => {
  // State to track if material is liked
  const [isLiked, setIsLiked] = useState(false);
  
  // Check if material is in user's liked materials
  useEffect(() => {
    if (currentUser && currentUser.Liked_materials) {
      const likedMaterials = currentUser.Liked_materials.split(', ').map(id => parseInt(id.trim()));
      setIsLiked(likedMaterials.includes(material.ID));
    }
  }, [currentUser, material.ID]);
  
  // Handle click on material box
  const handleMaterialClick = () => {
    if (onMaterialClick) {
      onMaterialClick(material.ID);
    }
    console.log(`Clicked on material ${material.ID}`);
  };
  
  // Handle like button click
  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    setIsLiked(!isLiked);
    
    // Here you would update the user's liked materials in a real application
    console.log(`${isLiked ? 'Unliked' : 'Liked'} material ${material.ID}`);
  };
  
  // Format tags with "+" indicator for overflow
  const formatTags = (tags) => {
    if (!tags) return [];
    
    const tagArray = tags.split(', ').map(tag => tag.trim());
    
    // For display purposes, we'll show a limited number and indicate overflow
    // In a real implementation, you would calculate this based on container width
    const visibleTags = tagArray.slice(0, 5);
    const hiddenCount = tagArray.length - visibleTags.length;
    
    return {
      visible: visibleTags,
      hiddenCount: hiddenCount > 0 ? hiddenCount : 0
    };
  };
  
  const formattedTags = formatTags(material.Tags);
  
  return (
    <div className="material-box" onClick={handleMaterialClick} role="button" tabIndex={0}>
      <div className="material-inner-box">
        {/* Content Box */}
        <div className="material-content">
          {/* Title */}
          <div className="material-header">
            <h2 className="material-title">{material.Title}</h2>
            
            {/* Like Button */}
            <div 
              className={`like-button ${isLiked ? 'liked' : ''}`} 
              onClick={handleLikeClick}
              role="button"
              tabIndex={0}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              <svg width="18" height="26" viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3.9" y="2" width="14.2" height="22" stroke={isLiked ? "#84112D" : "black"} strokeWidth="2" fill={isLiked ? "#84112D" : "none"} />
              </svg>
            </div>
          </div>
          
          {/* Description and Tags */}
          <div className="material-details">
            {/* Tags row */}
            <div className="material-tags">
              {formattedTags.visible.map((tag, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="tag-separator">•</span>}
                  <span className="tag">{tag}</span>
                </React.Fragment>
              ))}
              
              {formattedTags.hiddenCount > 0 && (
                <>
                  <span className="tag-separator">•</span>
                  <span className="tag-more">+{formattedTags.hiddenCount}</span>
                </>
              )}
            </div>
            
            <div className="material-description">
              {/* Description - limit to 3 lines with ellipsis */}
              <p>{material.Description.length > 300 ? `${material.Description.substring(0, 300)}...` : material.Description}</p>
            </div>
            
            {/* Views and Date */}
            <div className="material-metadata">
              <div className="views-count">
                <svg className="eye-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3C4.36364 3 1.25818 5.28364 0 8.5C1.25818 11.7164 4.36364 14 8 14C11.6364 14 14.7418 11.7164 16 8.5C14.7418 5.28364 11.6364 3 8 3ZM8 12.1667C5.99273 12.1667 4.36364 10.5376 4.36364 8.5C4.36364 6.46243 5.99273 4.83333 8 4.83333C10.0073 4.83333 11.6364 6.46243 11.6364 8.5C11.6364 10.5376 10.0073 12.1667 8 12.1667ZM8 6.33333C6.81818 6.33333 5.81818 7.33333 5.81818 8.5C5.81818 9.66667 6.81818 10.6667 8 10.6667C9.18182 10.6667 10.1818 9.66667 10.1818 8.5C10.1818 7.33333 9.18182 6.33333 8 6.33333Z" fill="#888888"/>
                </svg>
                <span className="views-text">{material.Views}</span>
              </div>
              
              <span className="separator">•</span>
              
              <div className="posting-date">
                {material.Date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialBox;
