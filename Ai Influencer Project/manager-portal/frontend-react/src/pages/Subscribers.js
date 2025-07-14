import React, { useState, useEffect } from 'react';
import { User, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { subscribersAPI } from '../services/api';
import './Subscribers.css';

const Subscribers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    lastname: '',
    phone_number: '',
    country: '',
    primary_language: '',
    notes: ''
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscribersAPI.getAll();
      setSubscribers(response.data);
    } catch (err) {
      setError('Failed to load subscribers');
      console.error('Subscribers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubscriber) {
        await subscribersAPI.update(editingSubscriber.id_sub, formData);
      } else {
        await subscribersAPI.create(formData);
      }
      setShowForm(false);
      setEditingSubscriber(null);
      setFormData({
        username: '',
        name: '',
        lastname: '',
        phone_number: '',
        country: '',
        primary_language: '',
        notes: ''
      });
      fetchSubscribers();
    } catch (err) {
      setError(`Failed to ${editingSubscriber ? 'update' : 'create'} subscriber`);
      console.error('Subscriber save error:', err);
    }
  };

  const handleEdit = (subscriber) => {
    setEditingSubscriber(subscriber);
    setFormData({
      username: subscriber.username || '',
      name: subscriber.name || '',
      lastname: subscriber.lastname || '',
      phone_number: subscriber.phone_number || '',
      country: subscriber.country || '',
      primary_language: subscriber.primary_language || '',
      notes: subscriber.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (subscriberId) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await subscribersAPI.delete(subscriberId);
        fetchSubscribers();
      } catch (err) {
        setError('Failed to delete subscriber');
        console.error('Delete subscriber error:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading subscribers...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Subscribers</h1>
        <p>Manage and view subscriber information</p>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Search and Add Button */}
      <div className="subscribers-header">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setShowForm(true)} className="btn">
          <Plus size={16} />
          Add Subscriber
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h3>{editingSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Primary Language</label>
                <input
                  type="text"
                  name="primary_language"
                  value={formData.primary_language}
                  onChange={handleInputChange}
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
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">
                {editingSubscriber ? 'Update' : 'Create'} Subscriber
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingSubscriber(null);
                  setFormData({
                    username: '',
                    name: '',
                    lastname: '',
                    phone_number: '',
                    country: '',
                    primary_language: '',
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

      {/* Subscribers Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Subscribers ({filteredSubscribers.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Country</th>
              <th>Language</th>
              <th>Phone</th>
              <th>Subscription Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id_sub}>
                <td>
                  <strong>@{subscriber.username}</strong>
                </td>
                <td>{`${subscriber.name} ${subscriber.lastname}`}</td>
                <td>{subscriber.country}</td>
                <td>{subscriber.primary_language}</td>
                <td>{subscriber.phone_number || '-'}</td>
                <td>
                  {subscriber.subscription_date && 
                    format(new Date(subscriber.subscription_date), 'MMM dd, yyyy')}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => setSelectedSubscriber(subscriber)}
                      className="btn-icon"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(subscriber)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(subscriber.id_sub)}
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

      {/* Subscriber Details Modal */}
      {selectedSubscriber && (
        <div className="modal-overlay" onClick={() => setSelectedSubscriber(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subscriber Details</h3>
              <button 
                onClick={() => setSelectedSubscriber(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Username</label>
                  <span>@{selectedSubscriber.username}</span>
                </div>
                <div className="detail-item">
                  <label>Full Name</label>
                  <span>{selectedSubscriber.name} {selectedSubscriber.lastname}</span>
                </div>
                <div className="detail-item">
                  <label>Country</label>
                  <span>{selectedSubscriber.country}</span>
                </div>
                <div className="detail-item">
                  <label>Primary Language</label>
                  <span>{selectedSubscriber.primary_language}</span>
                </div>
                <div className="detail-item">
                  <label>Phone Number</label>
                  <span>{selectedSubscriber.phone_number || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Subscription Date</label>
                  <span>
                    {selectedSubscriber.subscription_date && 
                      format(new Date(selectedSubscriber.subscription_date), 'MMMM dd, yyyy')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Created</label>
                  <span>
                    {selectedSubscriber.date_created && 
                      format(new Date(selectedSubscriber.date_created), 'MMMM dd, yyyy HH:mm')}
                  </span>
                </div>
                {selectedSubscriber.notes && (
                  <div className="detail-item full-width">
                    <label>Notes</label>
                    <span>{selectedSubscriber.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribers; 