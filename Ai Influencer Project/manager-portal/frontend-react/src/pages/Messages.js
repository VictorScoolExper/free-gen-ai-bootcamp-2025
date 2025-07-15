import React, { useState, useEffect } from 'react';
import { Send, Search, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { messagesAPI, subscribersAPI } from '../services/api';
import './Messages.css';

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (selectedSubscriber) {
      fetchMessages(selectedSubscriber.id_sub);
    }
  }, [selectedSubscriber]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await subscribersAPI.getAll();
      setSubscribers(response.data);
    } catch (err) {
      setError('Failed to load subscribers');
      console.error('Subscribers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (subscriberId) => {
    try {
      const response = await messagesAPI.getMessagesBySubscriber(subscriberId);
      setMessages(response.data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Messages fetch error:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSubscriber) return;

    try {
      const messageData = {
        sender_id: 'admin', // Assuming admin is sending
        sender_type: 'Admin',
        receiver_id: selectedSubscriber.id_sub,
        receiver_type: 'Subscriber',
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      await messagesAPI.sendMessage(messageData);
      setNewMessage('');
      // Refresh messages
      fetchMessages(selectedSubscriber.id_sub);
    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="messages-container">
      <div className="page-header">
        <h1>Messages</h1>
        <p>Manage conversations with subscribers</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="messages-layout">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="sidebar-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="subscribers-list">
            {filteredSubscribers.map((subscriber) => (
              <div
                key={subscriber.id_sub}
                className={`subscriber-item ${selectedSubscriber?.id_sub === subscriber.id_sub ? 'active' : ''}`}
                onClick={() => setSelectedSubscriber(subscriber)}
              >
                <div className="subscriber-avatar">
                  <User size={20} />
                </div>
                <div className="subscriber-info">
                  <div className="subscriber-name">
                    {subscriber.name} {subscriber.lastname}
                  </div>
                  <div className="subscriber-username">@{subscriber.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Panel */}
        <div className="conversation-panel">
          {selectedSubscriber ? (
            <>
              <div className="conversation-header">
                <div className="conversation-subscriber">
                  <User size={20} />
                  <div>
                    <h3>{selectedSubscriber.name} {selectedSubscriber.lastname}</h3>
                    <p>@{selectedSubscriber.username}</p>
                  </div>
                </div>
              </div>

              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender_type === 'Admin' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-timestamp">
                      {message.timestamp && format(new Date(message.timestamp), 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={3}
                />
                <button onClick={sendMessage} className="send-button">
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <MessageSquare size={48} />
              <h3>Select a subscriber to start chatting</h3>
              <p>Choose a subscriber from the sidebar to view and send messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 