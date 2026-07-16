import { useState } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, Info, Star, Archive, Trash2, MessageCircle, Users, Bell, BellOff, Image as ImageIcon, User } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: 'instructor' | 'peer' | 'group';
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
};

const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Dr. Andrew Ng',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'Instructor - Machine Learning',
    lastMessage: 'Great question about gradient descent! Let me explain...',
    timestamp: '2 min ago',
    unread: 2,
    online: true,
    type: 'instructor',
  },
  {
    id: '2',
    name: 'Study Group - ML Specialization',
    avatar: 'https://i.pravatar.cc/150?img=25',
    role: '12 members',
    lastMessage: 'Sarah: Who wants to pair on the assignment?',
    timestamp: '15 min ago',
    unread: 5,
    online: false,
    type: 'group',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=45',
    role: 'Peer - Data Science Track',
    lastMessage: 'Thanks for helping with the NumPy problem!',
    timestamp: '1 hour ago',
    unread: 0,
    online: true,
    type: 'peer',
  },
  {
    id: '4',
    name: 'Prof. Sarah Mitchell',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'Instructor - UX Design',
    lastMessage: 'Your portfolio project looks excellent',
    timestamp: '3 hours ago',
    unread: 1,
    online: false,
    type: 'instructor',
  },
  {
    id: '5',
    name: 'React Dev Community',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: '48 members',
    lastMessage: 'Alex: Check out this awesome hooks tutorial',
    timestamp: '5 hours ago',
    unread: 0,
    online: false,
    type: 'group',
  },
  {
    id: '6',
    name: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'Peer - Web Development',
    lastMessage: 'Want to join our weekend hackathon?',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    type: 'peer',
  },
  {
    id: '7',
    name: 'Dr. Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'Instructor - Statistics',
    lastMessage: 'Office hours are this Friday at 3 PM',
    timestamp: 'Yesterday',
    unread: 0,
    online: true,
    type: 'instructor',
  },
  {
    id: '8',
    name: 'Python Study Group',
    avatar: 'https://i.pravatar.cc/150?img=20',
    role: '8 members',
    lastMessage: 'Meeting tonight at 7 PM EST',
    timestamp: '2 days ago',
    unread: 0,
    online: false,
    type: 'group',
  },
];

// Chat messages for each contact
const CHAT_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      senderId: '1',
      text: 'Hi! I noticed you had a question about the gradient descent algorithm in Week 2.',
      timestamp: '10:23 AM',
      isMe: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Yes! I\'m confused about how the learning rate affects convergence.',
      timestamp: '10:24 AM',
      isMe: true,
    },
    {
      id: '3',
      senderId: '1',
      text: 'Great question! The learning rate (alpha) controls how big of a step we take during each iteration.',
      timestamp: '10:25 AM',
      isMe: false,
    },
    {
      id: '4',
      senderId: '1',
      text: 'If alpha is too large, we might overshoot the minimum. If it\'s too small, convergence will be very slow.',
      timestamp: '10:25 AM',
      isMe: false,
    },
    {
      id: '5',
      senderId: 'me',
      text: 'That makes sense! So we need to find a balance?',
      timestamp: '10:26 AM',
      isMe: true,
    },
    {
      id: '6',
      senderId: '1',
      text: 'Exactly! Typical values range from 0.001 to 0.1, but it depends on your specific problem. Try experimenting with different values and plot the cost function to see how it converges.',
      timestamp: '10:27 AM',
      isMe: false,
    },
    {
      id: '7',
      senderId: 'me',
      text: 'Thank you so much! This really helps. I\'ll try plotting it now.',
      timestamp: '10:28 AM',
      isMe: true,
    },
    {
      id: '8',
      senderId: '1',
      text: 'You\'re welcome! Feel free to reach out if you have more questions. That\'s what I\'m here for! 😊',
      timestamp: '10:28 AM',
      isMe: false,
    },
  ],
  '2': [
    {
      id: '1',
      senderId: '2',
      text: 'Hey everyone! Who\'s up for collaborating on this week\'s assignment?',
      timestamp: '9:15 AM',
      isMe: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'I\'m in! When are we meeting?',
      timestamp: '9:20 AM',
      isMe: true,
    },
    {
      id: '3',
      senderId: '2',
      text: 'How about Saturday afternoon? We can use Zoom.',
      timestamp: '9:22 AM',
      isMe: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Perfect! I\'ll be there.',
      timestamp: '9:25 AM',
      isMe: true,
    },
    {
      id: '5',
      senderId: '2',
      text: 'Sarah: Who wants to pair on the assignment?',
      timestamp: '10:45 AM',
      isMe: false,
    },
  ],
  '3': [
    {
      id: '1',
      senderId: 'me',
      text: 'Hey Emma! Do you have a moment to help with a NumPy question?',
      timestamp: '2:30 PM',
      isMe: true,
    },
    {
      id: '2',
      senderId: '3',
      text: 'Sure! What\'s up?',
      timestamp: '2:32 PM',
      isMe: false,
    },
    {
      id: '3',
      senderId: 'me',
      text: 'I\'m trying to reshape an array but getting dimension errors.',
      timestamp: '2:33 PM',
      isMe: true,
    },
    {
      id: '4',
      senderId: '3',
      text: 'Can you share your code? Reshaping can be tricky with incompatible dimensions.',
      timestamp: '2:34 PM',
      isMe: false,
    },
    {
      id: '5',
      senderId: 'me',
      text: 'Here: arr.reshape(5, 3) but arr has shape (16,)',
      timestamp: '2:35 PM',
      isMe: true,
    },
    {
      id: '6',
      senderId: '3',
      text: 'That\'s the issue! 5 * 3 = 15, but your array has 16 elements. Try reshape(4, 4) or (8, 2).',
      timestamp: '2:36 PM',
      isMe: false,
    },
    {
      id: '7',
      senderId: 'me',
      text: 'Oh wow, I can\'t believe I missed that! Thanks for helping with the NumPy problem!',
      timestamp: '2:38 PM',
      isMe: true,
    },
    {
      id: '8',
      senderId: '3',
      text: 'No problem! Happens to all of us 😊',
      timestamp: '2:39 PM',
      isMe: false,
    },
  ],
  '4': [
    {
      id: '1',
      senderId: '4',
      text: 'I\'ve reviewed your portfolio project submission.',
      timestamp: '11:20 AM',
      isMe: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Thank you Professor! How did I do?',
      timestamp: '11:25 AM',
      isMe: true,
    },
    {
      id: '3',
      senderId: '4',
      text: 'Your portfolio project looks excellent! The user research is thorough and the wireframes are very professional.',
      timestamp: '11:27 AM',
      isMe: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'That means a lot! I spent a lot of time on the research phase.',
      timestamp: '11:30 AM',
      isMe: true,
    },
    {
      id: '5',
      senderId: '4',
      text: 'It shows! Keep up the great work. This is portfolio-worthy material.',
      timestamp: '11:32 AM',
      isMe: false,
    },
  ],
  '5': [
    {
      id: '1',
      senderId: '5',
      text: 'Alex: Check out this awesome hooks tutorial I found!',
      timestamp: '8:45 AM',
      isMe: false,
    },
    {
      id: '2',
      senderId: '5',
      text: 'https://react-hooks-advanced.dev',
      timestamp: '8:45 AM',
      isMe: false,
    },
    {
      id: '3',
      senderId: 'me',
      text: 'Thanks! I\'ll check it out.',
      timestamp: '8:50 AM',
      isMe: true,
    },
    {
      id: '4',
      senderId: '5',
      text: 'Jordan: Anyone working with useReducer? I have questions.',
      timestamp: '9:15 AM',
      isMe: false,
    },
    {
      id: '5',
      senderId: 'me',
      text: 'I\'ve used it in a few projects. What do you need help with?',
      timestamp: '9:20 AM',
      isMe: true,
    },
  ],
  '6': [
    {
      id: '1',
      senderId: '6',
      text: 'Hey! We\'re organizing a weekend hackathon. Interested?',
      timestamp: '4:30 PM',
      isMe: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'That sounds awesome! When is it?',
      timestamp: '4:35 PM',
      isMe: true,
    },
    {
      id: '3',
      senderId: '6',
      text: 'Next Saturday and Sunday, 9 AM to 6 PM both days.',
      timestamp: '4:37 PM',
      isMe: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'What\'s the theme?',
      timestamp: '4:40 PM',
      isMe: true,
    },
    {
      id: '5',
      senderId: '6',
      text: 'Building educational tools with AI. Should be fun!',
      timestamp: '4:42 PM',
      isMe: false,
    },
    {
      id: '6',
      senderId: 'me',
      text: 'Count me in! Want to join our weekend hackathon?',
      timestamp: '4:45 PM',
      isMe: true,
    },
  ],
  '7': [
    {
      id: '1',
      senderId: '7',
      text: 'Good morning! Just a reminder about office hours.',
      timestamp: '8:00 AM',
      isMe: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Good morning Professor! What time are they?',
      timestamp: '8:15 AM',
      isMe: true,
    },
    {
      id: '3',
      senderId: '7',
      text: 'Office hours are this Friday at 3 PM. Feel free to drop by with any questions about the hypothesis testing module.',
      timestamp: '8:18 AM',
      isMe: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Perfect! I do have some questions about p-values.',
      timestamp: '8:20 AM',
      isMe: true,
    },
    {
      id: '5',
      senderId: '7',
      text: 'Great! Looking forward to discussing it with you.',
      timestamp: '8:22 AM',
      isMe: false,
    },
  ],
  '8': [
    {
      id: '1',
      senderId: '8',
      text: 'Don\'t forget about our study session tonight!',
      timestamp: '12:00 PM',
      isMe: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'What time was it again?',
      timestamp: '12:15 PM',
      isMe: true,
    },
    {
      id: '3',
      senderId: '8',
      text: 'Meeting tonight at 7 PM EST. We\'ll cover decorators and generators.',
      timestamp: '12:17 PM',
      isMe: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Awesome! I\'ve been wanting to understand decorators better.',
      timestamp: '12:20 PM',
      isMe: true,
    },
    {
      id: '5',
      senderId: '8',
      text: 'Perfect! Bring your questions.',
      timestamp: '12:22 PM',
      isMe: false,
    },
  ],
};

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact>(CONTACTS[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get messages for the selected contact
  const messages = CHAT_MESSAGES[selectedContact.id] || [];

  const filteredContacts = CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: Contact['type']) => {
    switch (type) {
      case 'instructor':
        return <User size={10} />;
      case 'group':
        return <Users size={10} />;
      case 'peer':
        return <MessageCircle size={10} />;
    }
  };

  const getTypeBadgeColor = (type: Contact['type']) => {
    switch (type) {
      case 'instructor':
        return '#A98BFF';
      case 'group':
        return '#83D6FF';
      case 'peer':
        return '#7DEBA3';
    }
  };

  return (
    <div className="flex-1 flex h-screen overflow-hidden animate-in">
      {/* Contacts List */}
      <div className="w-96 border-r border-border flex flex-col bg-white">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-text">Messages</h1>
            <button className="w-9 h-9 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors">
              <MoreVertical size={18} color="#6B6B7B" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} color="#6B6B7B" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-3 border-b border-border">
          {[
            { label: 'All', count: 8 },
            { label: 'Unread', count: 3 },
            { label: 'Groups', count: 3 },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab.label === 'All'
                  ? 'bg-text text-white'
                  : 'bg-transparent text-muted hover:bg-bg'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 ${tab.label === 'All' ? 'opacity-70' : ''}`}>
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-bg ${
                selectedContact.id === contact.id ? 'bg-bg' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                    style={{ background: getTypeBadgeColor(contact.type), color: '#111' }}
                  >
                    {getTypeIcon(contact.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-text truncate">{contact.name}</h3>
                    <span className="text-xs text-muted flex-shrink-0 ml-2">
                      {contact.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-1">{contact.role}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted truncate flex-1">
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <span
                        className="flex-shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ background: '#FF6D70' }}
                      >
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedContact.avatar}
                alt={selectedContact.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              {selectedContact.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-text flex items-center gap-2">
                {selectedContact.name}
                {selectedContact.type === 'instructor' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#EDE9FF', color: '#A98BFF' }}>
                    INSTRUCTOR
                  </span>
                )}
              </h2>
              <p className="text-xs text-muted flex items-center gap-2">
                {selectedContact.online && <span className="text-green-500">● Online</span>}
                {!selectedContact.online && <span className="text-muted">● Offline</span>}
                <span>·</span>
                <span>{selectedContact.role}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors" title="Voice Call">
              <Phone size={18} color="#6B6B7B" />
            </button>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors" title="Video Call">
              <Video size={18} color="#6B6B7B" />
            </button>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors" title="Info">
              <Info size={18} color="#6B6B7B" />
            </button>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors" title="More">
              <MoreVertical size={18} color="#6B6B7B" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ background: '#F6F6F8' }}>
          {/* Date divider */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-muted">
              Today
            </span>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!message.isMe && (
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-md px-4 py-2.5 rounded-3xl ${
                    message.isMe
                      ? 'bg-text text-white rounded-br-lg'
                      : 'bg-white text-text rounded-bl-lg'
                  }`}
                  style={{ boxShadow: message.isMe ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <span className="text-xs text-muted mt-1 px-2">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-border">
          <div className="flex items-end gap-3">
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors flex-shrink-0">
              <Paperclip size={18} color="#6B6B7B" />
            </button>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors flex-shrink-0">
              <ImageIcon size={18} color="#6B6B7B" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors flex-shrink-0">
              <Smile size={18} color="#6B6B7B" />
            </button>
            <button
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all flex-shrink-0"
              style={{ background: messageText ? '#D7FF54' : '#E0E0E8' }}
              disabled={!messageText}
            >
              <Send size={18} color={messageText ? '#111' : '#6B6B7B'} />
            </button>
          </div>
          <p className="text-xs text-muted mt-2 text-center">
            Press Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>

      {/* Right Sidebar - Contact Info */}
      <div className="w-80 border-l border-border bg-white overflow-y-auto no-scrollbar">
        <div className="p-5">
          {/* Contact Card */}
          <div className="text-center mb-6">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-20 h-20 rounded-3xl object-cover mx-auto mb-3"
            />
            <h3 className="font-bold text-lg text-text mb-1">{selectedContact.name}</h3>
            <p className="text-sm text-muted mb-3">{selectedContact.role}</p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 rounded-2xl text-xs font-bold bg-text text-white hover:opacity-90 transition-all">
                View Profile
              </button>
              {selectedContact.type === 'instructor' && (
                <button className="px-4 py-2 rounded-2xl text-xs font-bold bg-bg text-text hover:bg-border transition-all">
                  View Course
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 mb-6">
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-bg transition-colors">
              <Star size={16} color="#6B6B7B" />
              <span className="text-sm font-semibold text-text">Star Conversation</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-bg transition-colors">
              <Bell size={16} color="#6B6B7B" />
              <span className="text-sm font-semibold text-text">Mute Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-bg transition-colors">
              <Archive size={16} color="#6B6B7B" />
              <span className="text-sm font-semibold text-text">Archive Chat</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-bg transition-colors text-red-500">
              <Trash2 size={16} />
              <span className="text-sm font-semibold">Delete Chat</span>
            </button>
          </div>

          {/* Shared Files */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-text mb-3">Shared Files</h4>
            <div className="space-y-2">
              {['gradient_descent_notes.pdf', 'week2_assignment.ipynb', 'learning_rate_chart.png'].map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-bg hover:bg-border transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <Paperclip size={14} color="#6B6B7B" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{file}</p>
                    <p className="text-xs text-muted">2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          {selectedContact.type === 'instructor' && (
            <div>
              <h4 className="text-sm font-bold text-text mb-3">About Instructor</h4>
              <p className="text-xs text-muted leading-relaxed mb-3">
                Teaches Machine Learning Specialization. Available for questions during office hours Monday-Friday 2-4 PM EST.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-bg text-text">
                  Machine Learning
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-bg text-text">
                  AI
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-bg text-text">
                  Deep Learning
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
