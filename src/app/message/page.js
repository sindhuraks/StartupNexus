'use client';
import { useState } from 'react';
import styles from './message.module.css';

const DUMMY_USERS = [
  { id: 1, name: 'John Doe', title: 'Product Manager' },
  { id: 2, name: 'Jane Smith', title: 'Tech Lead' },
  { id: 3, name: 'Alice Johnson', title: 'UI/UX Designer' }
];

// Example initial messages per user
const INITIAL_MESSAGES = {
  1: [
    { id: 1, text: 'Hey John, ready for our meeting?', sent: true, time: '2h' },
    { id: 2, text: 'Absolutely! See you then.', sent: false, time: '1h' },
  ],
  2: [
    { id: 1, text: 'Hi Jane, did you review the PR?', sent: true, time: '3h' },
    { id: 2, text: 'Yes, looks good to me!', sent: false, time: '2h' },
  ],
  3: [
    { id: 1, text: 'Alice, can you share the new designs?', sent: true, time: '4h' },
    { id: 2, text: 'Sure, sending them now!', sent: false, time: '3h' },
  ]
};

export default function Message() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedUserId, setSelectedUserId] = useState(DUMMY_USERS[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  // Filter users for the search bar
  const filteredUsers = DUMMY_USERS.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (newMessage.trim() && selectedUserId) {
      setMessages(prev => ({
        ...prev,
        [selectedUserId]: [
          ...(prev[selectedUserId] || []),
          {
            id: Date.now(),
            text: newMessage,
            sent: true,
            time: 'now'
          }
        ]
      }));
      setNewMessage('');
    }
  };

  const handleSelectConversation = (userId) => {
    setSelectedUserId(userId);
    setShowComposeModal(false);
    setSelectedRecipient(null);
    setSearchQuery('');
    setNewMessage('');
  };

  const handleCompose = () => {
    setShowComposeModal(true);
    setSelectedRecipient(null);
    setSearchQuery('');
    setNewMessage('');
  };

  const handleSelectRecipient = (user) => {
    setSelectedRecipient(user);
    setSearchQuery('');
  };

  // Messages for the currently selected chat
  const currentMessages = messages[selectedUserId] || [];

  return (
    <div className={styles.messagingContainer}>
      {/* Conversation List */}
      <div className={styles.conversationList}>
        <div className={styles.conversationHeader}>
          <h2>Messages</h2>
          <button className={styles.composeButton} onClick={handleCompose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#072239" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Compose
          </button>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search people and messages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#00DC82" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          {searchQuery && (
            <div className={styles.searchResults}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={styles.searchResultItem}
                    onClick={() => handleSelectConversation(user.id)}
                  >
                    <div className={styles.conversationAvatar}>
                      {user.name[0]}
                    </div>
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.title}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.searchResultItem}>No results found</div>
              )}
            </div>
          )}
        </div>
        {/* Conversation items */}
        {DUMMY_USERS.map(user => (
          <div
            key={user.id}
            className={`${styles.conversationItem} ${user.id === selectedUserId ? styles.activeConversation : ''}`}
            onClick={() => handleSelectConversation(user.id)}
          >
            <div className={styles.conversationAvatar}>{user.name[0]}</div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        <div className={styles.messageContainer}>
          {currentMessages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}
            >
              <p>{msg.text}</p>
              <span className={styles.time}>{msg.time}</span>
            </div>
          ))}
        </div>
        <div className={styles.messageInput}>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className={styles.composeModalOverlay}>
          <div className={styles.composeModal}>
            <div className={styles.composeModalHeader}>
              <h3>New Message</h3>
              <button className={styles.closeButton} onClick={() => setShowComposeModal(false)} aria-label="Close">&times;</button>
            </div>
            <input
              className={styles.composeRecipientInput}
              placeholder="Search connections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className={styles.composeSearchResults}>
              {searchQuery &&
                (filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={styles.composeSearchResultItem}
                      onClick={() => handleSelectRecipient(user)}
                    >
                      <div className={styles.conversationAvatar}>{user.name[0]}</div>
                      <div>
                        <h4>{user.name}</h4>
                        <p>{user.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.composeSearchResultItem}>No results found</div>
                ))}
            </div>
            {selectedRecipient && (
              <div className={styles.selectedRecipient}>
                <div className={styles.conversationAvatar}>{selectedRecipient.name[0]}</div>
                <span>{selectedRecipient.name} - {selectedRecipient.title}</span>
              </div>
            )}
            <textarea
              className={styles.composeMessageInput}
              placeholder="Write your message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
            />
            <div className={styles.composeModalFooter}>
              <button
                className={styles.sendButton}
                onClick={() => {
                  if (selectedRecipient && newMessage.trim()) {
                    setShowComposeModal(false);
                    setMessages(prev => ({
                      ...prev,
                      [selectedRecipient.id]: [
                        ...(prev[selectedRecipient.id] || []),
                        {
                          id: Date.now(),
                          text: newMessage,
                          sent: true,
                          time: 'now'
                        }
                      ]
                    }));
                    setSelectedUserId(selectedRecipient.id);
                    setNewMessage('');
                    setSelectedRecipient(null);
                  }
                }}
                disabled={!selectedRecipient || !newMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}