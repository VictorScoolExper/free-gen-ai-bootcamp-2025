import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Brain, TrendingUp, Clock, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    unreadMessages: 0,
    newSubscribers: 0,
    currentMood: 'Unknown',
    totalSubscribers: 0,
  });
  const [recentChats, setRecentChats] = useState([]);
  const [newestSubscribers, setNewestSubscribers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        unreadMessagesRes,
        newSubscribersRes,
        currentMoodRes,
        totalSubscribersRes,
        recentChatsRes,
        newestSubscribersRes,
      ] = await Promise.all([
        dashboardAPI.getRecentUnreadMessages(),
        dashboardAPI.getNewSubscribersToday(),
        dashboardAPI.getCurrentMood(),
        dashboardAPI.getTotalSubscribers(),
        dashboardAPI.getRecentChats(),
        dashboardAPI.getNewestSubscribers(),
      ]);

      setMetrics({
        unreadMessages: unreadMessagesRes.data.length,
        newSubscribers: newSubscribersRes.data.new_subscribers_last_24hrs,
        currentMood: currentMoodRes.data.current_mood || 'Unknown',
        totalSubscribers: totalSubscribersRes.data.total_subscribers,
      });

      setRecentChats(recentChatsRes.data);
      setNewestSubscribers(newestSubscribersRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of key metrics and recent activity</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid">
        <div className="metric-card">
          <h3>Unread Messages</h3>
          <div className="metric-value">{metrics.unreadMessages}</div>
          <MessageSquare className="metric-icon" size={24} />
          <Link to="/messages" className="btn">View Messages</Link>
        </div>

        <div className="metric-card">
          <h3>New Subscribers (24h)</h3>
          <div className="metric-value">{metrics.newSubscribers}</div>
          <UserPlus className="metric-icon" size={24} />
          <Link to="/subscribers" className="btn">View Subscribers</Link>
        </div>

        <div className="metric-card">
          <h3>Current AI Mood</h3>
          <div className="metric-value">{metrics.currentMood}</div>
          <Brain className="metric-icon" size={24} />
          <Link to="/mental-state" className="btn">View Details</Link>
        </div>

        <div className="metric-card">
          <h3>Total Subscribers</h3>
          <div className="metric-value">{metrics.totalSubscribers}</div>
          <Users className="metric-icon" size={24} />
          <Link to="/subscribers" className="btn">View All</Link>
        </div>
      </div>

      {/* Recent Chats Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Recent Chats</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Last Message</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentChats.map((chat) => (
              <tr key={chat.id}>
                <td>
                  <strong>{chat.sender_name || chat.sender_id}</strong>
                </td>
                <td>
                  {chat.content && chat.content.length > 50
                    ? `${chat.content.substring(0, 50)}...`
                    : chat.content}
                </td>
                <td>
                  {chat.timestamp && format(new Date(chat.timestamp), 'MMM dd, HH:mm')}
                </td>
                <td>
                  <Link to={`/messages?subscriber=${chat.sender_id}`} className="btn btn-secondary">
                    View Chat
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Newest Subscribers Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Newest Subscribers</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Country</th>
              <th>Language</th>
              <th>Subscription Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newestSubscribers.map((subscriber) => (
              <tr key={subscriber.id_sub}>
                <td>
                  <strong>{subscriber.username}</strong>
                </td>
                <td>{`${subscriber.name} ${subscriber.lastname}`}</td>
                <td>{subscriber.country}</td>
                <td>{subscriber.primary_language}</td>
                <td>
                  {subscriber.subscription_date && 
                    format(new Date(subscriber.subscription_date), 'MMM dd, yyyy')}
                </td>
                <td>
                  <Link to={`/subscribers/${subscriber.id_sub}`} className="btn btn-secondary">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard; 