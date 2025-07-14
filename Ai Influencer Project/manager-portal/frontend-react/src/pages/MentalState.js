import React, { useState, useEffect } from 'react';
import { Brain, Activity, Target, Zap, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { mentalStateAPI } from '../services/api';
import './MentalState.css';

const MentalState = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    current_mood: '',
    focus_area: '',
    energy_level: '',
    confidence_level: '',
    current_activity: '',
    notes: ''
  });

  useEffect(() => {
    fetchMentalStateData();
  }, []);

  const fetchMentalStateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [latestRes, historyRes] = await Promise.all([
        mentalStateAPI.getLatest(),
        mentalStateAPI.getLastWeek()
      ]);

      setCurrentState(latestRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError('Failed to load mental state data');
      console.error('Mental state fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mentalStateAPI.create(formData);
      setShowForm(false);
      setFormData({
        current_mood: '',
        focus_area: '',
        energy_level: '',
        confidence_level: '',
        current_activity: '',
        notes: ''
      });
      fetchMentalStateData(); // Refresh data
    } catch (err) {
      setError('Failed to create mental state entry');
      console.error('Create mental state error:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getMoodIcon = (mood) => {
    const moodIcons = {
      'Happy': '😊',
      'Curious': '🤔',
      'Focused': '🎯',
      'Calm': '😌',
      'Energetic': '⚡',
      'Thoughtful': '🧠'
    };
    return moodIcons[mood] || '🤖';
  };

  if (loading) {
    return <div className="loading">Loading mental state...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>AI Mental State</h1>
        <p>Monitor and manage the AI's current mental state and mood</p>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Current Mental State Card */}
      <div className="mental-state-card">
        <div className="card-header">
          <h2>Current Mental State</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn">
            {showForm ? 'Cancel' : 'Add New Entry'}
          </button>
        </div>

        {currentState ? (
          <div className="current-state-grid">
            <div className="state-item">
              <div className="state-icon">
                <Brain size={24} />
              </div>
              <div className="state-info">
                <label>Mood</label>
                <div className="state-value">
                  {getMoodIcon(currentState.current_mood)} {currentState.current_mood}
                </div>
              </div>
            </div>

            <div className="state-item">
              <div className="state-icon">
                <Target size={24} />
              </div>
              <div className="state-info">
                <label>Focus Area</label>
                <div className="state-value">{currentState.focus_area}</div>
              </div>
            </div>

            <div className="state-item">
              <div className="state-icon">
                <Zap size={24} />
              </div>
              <div className="state-info">
                <label>Energy Level</label>
                <div className="state-value">{currentState.energy_level}/10</div>
              </div>
            </div>

            <div className="state-item">
              <div className="state-icon">
                <TrendingUp size={24} />
              </div>
              <div className="state-info">
                <label>Confidence Level</label>
                <div className="state-value">{currentState.confidence_level}%</div>
              </div>
            </div>

            <div className="state-item">
              <div className="state-icon">
                <Activity size={24} />
              </div>
              <div className="state-info">
                <label>Current Activity</label>
                <div className="state-value">{currentState.current_activity}</div>
              </div>
            </div>

            <div className="state-item">
              <div className="state-icon">
                <Clock size={24} />
              </div>
              <div className="state-info">
                <label>Last Updated</label>
                <div className="state-value">
                  {currentState.timestamp && format(new Date(currentState.timestamp), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <Brain size={48} />
            <h3>No mental state data available</h3>
            <p>Add the first mental state entry to get started</p>
          </div>
        )}
      </div>

      {/* Add New Entry Form */}
      {showForm && (
        <div className="form-card">
          <h3>Add New Mental State Entry</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Mood</label>
                <input
                  type="text"
                  name="current_mood"
                  value={formData.current_mood}
                  onChange={handleInputChange}
                  placeholder="e.g., Happy, Curious, Focused"
                  required
                />
              </div>

              <div className="form-group">
                <label>Focus Area</label>
                <input
                  type="text"
                  name="focus_area"
                  value={formData.focus_area}
                  onChange={handleInputChange}
                  placeholder="e.g., User Engagement, Content Creation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Energy Level (1-10)</label>
                <input
                  type="number"
                  name="energy_level"
                  value={formData.energy_level}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confidence Level (%)</label>
                <input
                  type="number"
                  name="confidence_level"
                  value={formData.confidence_level}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Activity</label>
                <input
                  type="text"
                  name="current_activity"
                  value={formData.current_activity}
                  onChange={handleInputChange}
                  placeholder="e.g., Analyzing messages, Creating content"
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes or observations..."
                  rows={3}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">Save Entry</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mental State History */}
      <div className="table-container">
        <div className="table-header">
          <h3>Mental State History (Last 7 Days)</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Mood</th>
              <th>Focus Area</th>
              <th>Energy</th>
              <th>Confidence</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>
                  {entry.timestamp && format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                </td>
                <td>
                  <span className="mood-display">
                    {getMoodIcon(entry.current_mood)} {entry.current_mood}
                  </span>
                </td>
                <td>{entry.focus_area}</td>
                <td>{entry.energy_level}/10</td>
                <td>{entry.confidence_level}%</td>
                <td>{entry.current_activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentalState; 