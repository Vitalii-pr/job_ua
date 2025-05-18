import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MaterialsPage.css';
import MaterialBox from '../components/MaterialBox';

/**
 * MaterialsPage now syncs saved state from parent via likedMaterials prop,
 * allowing bookmarking multiple articles without resetting.
 */
export default function MaterialsPage({ materials = [], currentUser = {}, likedMaterials = [], onLike }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);
  const [pendingSort, setPendingSort] = useState('');
  const [appliedSort, setAppliedSort] = useState('');

  // Local liked state derived from parent likedMaterials
  const [liked, setLiked] = useState(likedMaterials.map(id => id.toString()));

  // Sync local liked when parent prop changes
  useEffect(() => {
    setLiked(likedMaterials.map(id => id.toString()));
  }, [likedMaterials]);

  const handleLike = id => {
    const sid = id.toString();
    // Toggle locally for immediate UI feedback
    const next = liked.includes(sid)
      ? liked.filter(x => x !== sid)
      : [...liked, sid];
    setLiked(next);
    // Notify parent to persist
    onLike(id);
  };

  // Filter by tab
  const byTab = activeTab === 'all'
    ? materials
    : materials.filter(m => liked.includes(m.ID.toString()));

  // Filter by search terms
  const bySearch = searchTerms.length === 0
    ? byTab
    : byTab.filter(m =>
        searchTerms.some(t => {
          const low = t.toLowerCase();
          return (
            m.Title.toLowerCase().includes(low) ||
            m.Tags.toLowerCase().split(', ').some(tag => tag.includes(low))
          );
        })
      );

  // Sort
  const sorted = [...bySearch].sort((a, b) => {
    if (appliedSort === 'date') return new Date(b.Date) - new Date(a.Date);
    if (appliedSort === 'views') return b.Views - a.Views;
    return 0;
  });

  const doSearch = () => {
    const t = searchText.trim();
    if (t && !searchTerms.includes(t)) {
      setSearchTerms(ts => [...ts, t]);
      setSearchText('');
    }
  };
  const onKey = e => e.key === 'Enter' && doSearch();

  const clearAll = () => {
    setSearchTerms([]);
    setSearchText('');
    setPendingSort('');
    setAppliedSort('');
  };
  const applySort = () => setAppliedSort(pendingSort);

  return (
    <section className="materials-page">
      <div className="page-container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab${activeTab === 'all' ? ' active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Усі статті
          </button>
          <button
            className={`tab${activeTab === 'saved' ? ' active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Збережені статті
          </button>
        </div>

        {/* Search */}
        <div className="materials-search">
          <div className="search-row">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" stroke="#888" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#888" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="search-input"
              placeholder="Пошук"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={onKey}
            />
            <button className="btn-search" onClick={doSearch}>
              Пошук
            </button>
          </div>
          {searchTerms.length > 0 && (
            <div className="search-tags">
              {searchTerms.map((t, i) => (
                <span key={i} className="tag highlight">
                  {t}{' '}
                  <button
                    className="tag-remove"
                    onClick={() => setSearchTerms(ts => ts.filter(x => x !== t))}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button className="clear-all" onClick={clearAll}>
                Скинути все
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="materials-content">
          <aside className="materials-sidebar">
            <div className="sidebar-group">
              <select
                value={pendingSort}
                onChange={e => setPendingSort(e.target.value)}
              >
                <option value="" disabled>
                  Вибрати
                </option>
                <option value="date">Дата</option>
                <option value="views">Перегляди</option>
              </select>
            </div>
            <div className="sidebar-actions">
              <button className="btn-reset" onClick={clearAll}>
                Скинути
              </button>
              <button className="btn-apply" onClick={applySort}>
                Застосувати
              </button>
            </div>
          </aside>

          <main className="materials-main">
            {sorted.length > 0 ? (
              sorted.map(m => (
                <Link to={m.Link} key={m.ID} className="link-reset">
                  <MaterialBox
                    material={m}
                    currentUser={{ ...currentUser, Liked_materials: liked.join(',') }}
                    searchTerms={searchTerms}
                    onLike={handleLike}
                  />
                </Link>
              ))
            ) : (
              <div className="no-results">За вашим запитом нічого не знайдено</div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
