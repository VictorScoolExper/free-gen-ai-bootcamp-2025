import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Edit, Trash2, Eye, Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { diariesAPI } from '../services/api';
import './Diaries.css';

const Diaries = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDiary, setEditingDiary] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    adventure_date: '',
    story_content: '',
    summary: '',
    location: '',
    themes: '',
    keywords: '',
    ai_mood_at_time: '',
    ai_model_used: '',
    is_public: false,
    word_count: '',
    notes: ''
  });

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await diariesAPI.getAll();
      setDiaries(response.data);
    } catch (err) {
      setError('Failed to load diaries');
      console.error('Diaries fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDiary) {
        await diariesAPI.update(editingDiary.id, formData);
      } else {
        await diariesAPI.create(formData);
      }
      setShowForm(false);
      setEditingDiary(null);
      setFormData({
        title: '',
        adventure_date: '',
        story_content: '',
        summary: '',
        location: '',
        themes: '',
        keywords: '',
        ai_mood_at_time: '',
        ai_model_used: '',
        is_public: false,
        word_count: '',
        notes: ''
      });
      fetchDiaries();
    } catch (err) {
      setError(`Failed to ${editingDiary ? 'update' : 'create'} diary`);
      console.error('Diary save error:', err);
    }
  };

  const handleEdit = (diary) => {
    setEditingDiary(diary);
    setFormData({
      title: diary.title || '',
      adventure_date: diary.adventure_date || '',
      story_content: diary.story_content || '',
      summary: diary.summary || '',
      location: diary.location || '',
      themes: diary.themes || '',
      keywords: diary.keywords || '',
      ai_mood_at_time: diary.ai_mood_at_time || '',
      ai_model_used: diary.ai_model_used || '',
      is_public: diary.is_public || false,
      word_count: diary.word_count || '',
      notes: diary.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (diaryId) => {
    if (window.confirm('Are you sure you want to delete this diary entry?')) {
      try {
        await diariesAPI.delete(diaryId);
        fetchDiaries();
      } catch (err) {
        setError('Failed to delete diary');
        console.error('Delete diary error:', err);
      }
    }
  };

  const handleSearchByDate = async () => {
    if (!searchDate) {
      fetchDiaries();
      return;
    }
    
    try {
      setLoading(true);
      const response = await diariesAPI.searchByDate(searchDate);
      setDiaries(response.data);
    } catch (err) {
      setError('Failed to search diaries by date');
      console.error('Date search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const filteredDiaries = diaries.filter(diary =>
    diary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diary.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diary.keywords?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading diaries...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>AI Diaries</h1>
        <p>Manage AI diary entries and stories</p>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Search and Add Button */}
      <div className="diaries-header">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search diaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="date-search">
          <Calendar size={16} />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button onClick={handleSearchByDate} className="btn btn-secondary">
            Search
          </button>
        </div>
        <button onClick={() => setShowForm(true)} className="btn">
          <Plus size={16} />
          Add Diary
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h3>{editingDiary ? 'Edit Diary Entry' : 'Add New Diary Entry'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Adventure Date</label>
                <input
                  type="date"
                  name="adventure_date"
                  value={formData.adventure_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>AI Model Used</label>
                <input
                  type="text"
                  name="ai_model_used"
                  value={formData.ai_model_used}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Themes</label>
                <input
                  type="text"
                  name="themes"
                  value={formData.themes}
                  onChange={handleInputChange}
                  placeholder="e.g., Adventure, Mystery, Friendship"
                />
              </div>

              <div className="form-group">
                <label>Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="e.g., AI, technology, future"
                />
              </div>

              <div className="form-group">
                <label>AI Mood at Time</label>
                <input
                  type="text"
                  name="ai_mood_at_time"
                  value={formData.ai_mood_at_time}
                  onChange={handleInputChange}
                  placeholder="e.g., Excited, Contemplative"
                />
              </div>

              <div className="form-group">
                <label>Word Count</label>
                <input
                  type="number"
                  name="word_count"
                  value={formData.word_count}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                  />
                  Public Entry
                </label>
              </div>

              <div className="form-group full-width">
                <label>Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief summary of the story..."
                />
              </div>

              <div className="form-group full-width">
                <label>Story Content</label>
                <textarea
                  name="story_content"
                  value={formData.story_content}
                  onChange={handleInputChange}
                  rows={8}
                  placeholder="The full story content..."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes or observations..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">
                {editingDiary ? 'Update' : 'Create'} Diary
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingDiary(null);
                  setFormData({
                    title: '',
                    adventure_date: '',
                    story_content: '',
                    summary: '',
                    location: '',
                    themes: '',
                    keywords: '',
                    ai_mood_at_time: '',
                    ai_model_used: '',
                    is_public: false,
                    word_count: '',
                    notes: ''
                  });
                }} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Diaries Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Diary Entries ({filteredDiaries.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Adventure Date</th>
              <th>Location</th>
              <th>Summary</th>
              <th>Public</th>
              <th>Word Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiaries.map((diary) => (
              <tr key={diary.id}>
                <td>
                  <strong>{diary.title}</strong>
                </td>
                <td>
                  {diary.adventure_date && 
                    format(new Date(diary.adventure_date), 'MMM dd, yyyy')}
                </td>
                <td>
                  {diary.location && (
                    <span className="location">
                      <MapPin size={12} />
                      {diary.location}
                    </span>
                  )}
                </td>
                <td>
                  {diary.summary && diary.summary.length > 50
                    ? `${diary.summary.substring(0, 50)}...`
                    : diary.summary}
                </td>
                <td>
                  <span className={`public-badge ${diary.is_public ? 'public' : 'private'}`}>
                    {diary.is_public ? 'Public' : 'Private'}
                  </span>
                </td>
                <td>{diary.word_count || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => setSelectedDiary(diary)}
                      className="btn-icon"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(diary)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(diary.id)}
                      className="btn-icon delete"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diary Details Modal */}
      {selectedDiary && (
        <div className="modal-overlay" onClick={() => setSelectedDiary(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDiary.title}</h3>
              <button 
                onClick={() => setSelectedDiary(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="diary-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>
                    {selectedDiary.adventure_date && 
                      format(new Date(selectedDiary.adventure_date), 'MMMM dd, yyyy')}
                  </span>
                </div>
                {selectedDiary.location && (
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{selectedDiary.location}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className={`public-badge ${selectedDiary.is_public ? 'public' : 'private'}`}>
                    {selectedDiary.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>

              {selectedDiary.themes && (
                <div className="diary-section">
                  <h4>Themes</h4>
                  <p>{selectedDiary.themes}</p>
                </div>
              )}

              {selectedDiary.keywords && (
                <div className="diary-section">
                  <h4>Keywords</h4>
                  <div className="keywords">
                    {selectedDiary.keywords.split(',').map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        <Tag size={12} />
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDiary.summary && (
                <div className="diary-section">
                  <h4>Summary</h4>
                  <p>{selectedDiary.summary}</p>
                </div>
              )}

              <div className="diary-section">
                <h4>Story</h4>
                <div className="story-content">
                  {selectedDiary.story_content}
                </div>
              </div>

              {selectedDiary.notes && (
                <div className="diary-section">
                  <h4>Notes</h4>
                  <p>{selectedDiary.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diaries; 