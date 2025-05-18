import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MaterialBox from '../components/MaterialBox';
import './MaterialDetailPage.css';

export default function MaterialDetailPage({ materials = [], currentUser = {}, likedMaterials = [], onLike }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const material = materials.find(m => m.ID.toString() === id);

  // derive liked state
  const isGloballyLiked = material ? likedMaterials.includes(material.ID.toString()) : false;
  const [isLiked, setIsLiked] = useState(isGloballyLiked);
  useEffect(() => setIsLiked(isGloballyLiked), [isGloballyLiked]);

  // Search/filter state
  const [searchText, setSearchText] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!searchTerms.length) {
      setFiltered([]);
      return;
    }
    const results = materials
      .filter(m => m.ID.toString() !== id)
      .filter(m =>
        searchTerms.some(term => {
          const t = term.toLowerCase();
          return (
            m.Title.toLowerCase().includes(t) ||
            m.Tags.toLowerCase().split(',').some(tag => tag.trim().toLowerCase().includes(t))
          );
        })
      );
    const unique = Array.from(new Set(results.map(r => r.ID))).map(key => results.find(r => r.ID === key));
    setFiltered(unique);
  }, [materials, searchTerms, id]);

  const doSearch = () => {
    const term = searchText.trim();
    if (term && !searchTerms.includes(term)) {
      setSearchTerms(prev => [...prev, term]);
    }
    setSearchText('');
  };
  const onKey = e => { if (e.key === 'Enter') doSearch(); };
  const removeTerm = term => setSearchTerms(prev => prev.filter(t => t !== term));
  const toggleTerm = tag => searchTerms.includes(tag) ? removeTerm(tag) : setSearchTerms(prev => [...prev, tag]);
  const clearAll = () => setSearchTerms([]);

  const handleLikeClick = e => {
    e.preventDefault();
    e.stopPropagation();
    // Use numeric ID to match parent handler expectations
    const treeId = material.ID;
    // Optimistically update UI
    setIsLiked(prev => !prev);
    // Notify parent to persist bookmark
    onLike(treeId);
    // Show toast notification
    const msg = !isLiked ? 'Матеріал збережено' : 'Матеріал видалено із збережених';
    const toast = document.createElement('div');
    toast.className = 'save-notification';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (!material) {
    return (
      <div className="not-found">
        Статтю не знайдено. <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  return (
    <section className="material-detail-page">
      <div className="page-container">
        <div className="tabs">
          <button className="tab active" onClick={() => navigate('/materials')}>Усі статті</button>
        </div>

        <div className="detail-container">
          <aside className="materials-sidebar">
            <div className="materials-search-block">
              <div className="search-input-wrapper">
                {/* Icon placed inside input field */}
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="#888" strokeWidth="2" fill="none" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  className="search-input with-icon"
                  placeholder="Пошук"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={onKey}
                />
              </div>

              {searchTerms.length > 0 && (
                <div className="search-tags">
                  {searchTerms.map((term, idx) => (
                    <div key={idx} className="search-tag">
                      {term}
                      <button className="tag-remove" onClick={() => removeTerm(term)}>×</button>
                    </div>
                  ))}
                  <button className="clear-all" onClick={clearAll}>Очистити все</button>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="search-results">
                  {filtered.map(m => (
                    <div key={m.ID} className="material-box-wrapper" onClick={() => navigate(`/materials/${m.ID}`)}>
                      <MaterialBox
                        material={m}
                        currentUser={currentUser}
                        searchTerms={searchTerms}
                        onLike={onLike}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className="materials-main-detail">
            <article className="material-detail">
              <div className="detail-header">
                <h1>{material.Title}</h1>
                <button
                  className={`bookmark-button ${isLiked ? 'bookmarked' : ''}`}
                  onClick={handleLikeClick}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"
                      stroke={isLiked ? '#84112D' : 'currentColor'}
                      strokeWidth="2"
                      fill={isLiked ? '#84112D' : 'none'}
                    />
                  </svg>
                </button>
              </div>

              <div className="detail-tags">
                {material.Tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className={`tag ${searchTerms.includes(tag.trim()) ? 'highlighted-tag' : ''}`}
                    onClick={() => toggleTerm(tag.trim())}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="detail-meta">
                <span>{material.Views} переглядів</span>
                <span className="meta-separator">·</span>
                <span>{material.Date}</span>
              </div>

              <div className="detail-body">{material.Description}</div>
            </article>
          </main>
        </div>
      </div>
    </section>
  );
}
