import { useState } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Palette, Download, Shield, Mail, Smartphone, Trash2, LogOut, ChevronRight, Check } from 'lucide-react';
import IOSToggle from '../components/IOSToggle';

type SettingsTab = 'account' | 'notifications' | 'privacy' | 'billing' | 'appearance' | 'language';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseReminders: true,
    weeklyDigest: true,
    marketingEmails: false,
    profilePublic: true,
    showProgress: true,
    dataCollection: true,
    theme: 'light',
    language: 'en',
    autoDownload: false,
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate learner exploring data science and machine learning.',
  });

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    Google: true,
    Facebook: false,
    LinkedIn: true,
    GitHub: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleCancelProfile = () => {
    // Reset to original values
    setProfileData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      bio: 'Passionate learner exploring data science and machine learning.',
    });
  };

  const toggleAccountConnection = (accountName: keyof typeof connectedAccounts) => {
    const isCurrentlyConnected = connectedAccounts[accountName];
    
    if (isCurrentlyConnected) {
      // Disconnect
      if (confirm(`Are you sure you want to disconnect ${accountName}?`)) {
        setConnectedAccounts({ ...connectedAccounts, [accountName]: false });
      }
    } else {
      // Connect - simulate OAuth flow
      alert(`Connecting to ${accountName}...`);
      // In a real app, this would redirect to OAuth
      setTimeout(() => {
        setConnectedAccounts({ ...connectedAccounts, [accountName]: true });
      }, 500);
    }
  };

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: <User size={18} /> },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy' as SettingsTab, label: 'Privacy & Security', icon: <Lock size={18} /> },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: <CreditCard size={18} /> },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'language' as SettingsTab, label: 'Language & Region', icon: <Globe size={18} /> },
  ];

  return (
    <div className="flex-1 flex h-screen overflow-hidden animate-in">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white border-r border-border overflow-y-auto no-scrollbar">
        <div className="p-5 border-b border-border">
          <h1 className="text-xl font-black text-text mb-1">Settings</h1>
          <p className="text-xs text-muted">Manage your account and preferences</p>
        </div>
        <div className="p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-text text-white'
                  : 'text-muted hover:bg-bg hover:text-text'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-semibold">{tab.label}</span>
              <ChevronRight size={14} className="ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#F6F6F8' }}>
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Account Settings */}
          {activeTab === 'account' && (
            <>
              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Profile Information</h2>
                
                <div className="flex items-center gap-5 mb-6">
                  <img
                    src="https://i.pravatar.cc/150?img=68"
                    alt="Profile"
                    className="w-20 h-20 rounded-3xl object-cover"
                  />
                  <div>
                    <button className="px-4 py-2 rounded-2xl text-sm font-bold bg-text text-white hover:opacity-90 transition-all mr-2">
                      Change Photo
                    </button>
                    <button className="px-4 py-2 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Email Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none"
                      />
                      <button className="px-4 py-2.5 rounded-2xl text-sm font-bold bg-bg text-text hover:bg-border transition-all">
                        Verify
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-2xl text-sm font-bold bg-text text-white hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={handleCancelProfile}
                    className="px-6 py-3 rounded-2xl text-sm font-bold bg-bg text-text hover:bg-border transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Connected Accounts</h2>
                <div className="space-y-3">
                  {[
                    { 
                      name: 'Google' as const,
                      logo: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Facebook' as const,
                      logo: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'LinkedIn' as const,
                      logo: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'GitHub' as const,
                      logo: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#181717">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )
                    },
                  ].map((account) => (
                    <div key={account.name} className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                          {account.logo}
                        </div>
                        <span className="font-semibold text-sm text-text">{account.name}</span>
                      </div>
                      <button
                        onClick={() => toggleAccountConnection(account.name)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                          connectedAccounts[account.name]
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-text text-white hover:opacity-90'
                        }`}
                      >
                        {connectedAccounts[account.name] ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl border-2 border-red-200">
                <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                <p className="text-sm text-muted mb-4">Irreversible actions. Please be careful.</p>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-red-200 hover:bg-red-50 transition-all">
                    <div className="flex items-center gap-3">
                      <Trash2 size={18} color="#EF4444" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-text">Delete Account</p>
                        <p className="text-xs text-muted">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#EF4444" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-3">
                      <LogOut size={18} color="#6B6B7B" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-text">Sign Out</p>
                        <p className="text-xs text-muted">Sign out from all devices</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#6B6B7B" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <>
              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Email Notifications</h2>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive email notifications about your account activity' },
                    { key: 'courseReminders' as const, label: 'Course Reminders', desc: 'Get reminded about upcoming deadlines and lessons' },
                    { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Weekly summary of your learning progress' },
                    { key: 'marketingEmails' as const, label: 'Marketing Emails', desc: 'Receive updates about new courses and features' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                      <div>
                        <p className="font-bold text-sm text-text mb-1">{item.label}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                      <IOSToggle
                        checked={settings[item.key]}
                        onChange={() => toggleSetting(item.key)}
                        size="md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Push Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                    <div>
                      <p className="font-bold text-sm text-text mb-1">Push Notifications</p>
                      <p className="text-xs text-muted">Receive push notifications on your devices</p>
                    </div>
                    <IOSToggle
                      checked={settings.pushNotifications}
                      onChange={() => toggleSetting('pushNotifications')}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Privacy & Security */}
          {activeTab === 'privacy' && (
            <>
              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { key: 'profilePublic' as const, label: 'Public Profile', desc: 'Make your profile visible to other learners' },
                    { key: 'showProgress' as const, label: 'Show Progress', desc: 'Display your course progress publicly' },
                    { key: 'dataCollection' as const, label: 'Analytics & Data Collection', desc: 'Help us improve by sharing usage data' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                      <div>
                        <p className="font-bold text-sm text-text mb-1">{item.label}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                      <IOSToggle
                        checked={settings[item.key]}
                        onChange={() => toggleSetting(item.key)}
                        size="md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Security</h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg hover:bg-border transition-all">
                    <div className="flex items-center gap-3">
                      <Lock size={18} color="#6B6B7B" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-text">Change Password</p>
                        <p className="text-xs text-muted">Update your password regularly</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#6B6B7B" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg hover:bg-border transition-all">
                    <div className="flex items-center gap-3">
                      <Shield size={18} color="#6B6B7B" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-text">Two-Factor Authentication</p>
                        <p className="text-xs text-muted">Not enabled · Recommended</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#6B6B7B" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg hover:bg-border transition-all">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} color="#6B6B7B" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-text">Active Sessions</p>
                        <p className="text-xs text-muted">Manage devices and sessions</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#6B6B7B" />
                  </button>
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Data & Privacy</h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg hover:bg-border transition-all">
                    <div className="flex items-center gap-3">
                      <Download size={18} color="#6B6B7B" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-text">Download Your Data</p>
                        <p className="text-xs text-muted">Export all your personal data</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#6B6B7B" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <>
              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Current Plan</h2>
                <div className="p-5 rounded-3xl mb-4" style={{ background: 'linear-gradient(135deg, #D7FF54 0%, #A98BFF 100%)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-black text-text mb-1">Premium Plus</h3>
                      <p className="text-sm text-text/70">Unlimited access to all courses</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-text">$49</p>
                      <p className="text-sm text-text/70">per month</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-2xl text-sm font-bold bg-white text-text hover:opacity-90 transition-all">
                      Manage Plan
                    </button>
                    <button className="px-4 py-2 rounded-2xl text-sm font-bold bg-text text-white hover:opacity-90 transition-all">
                      Upgrade
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted">Next billing date: August 15, 2024 · <button className="font-bold underline">Cancel subscription</button></p>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Payment Methods</h2>
                <div className="space-y-3">
                  {[
                    { type: 'Visa', last4: '4242', expiry: '12/25', default: true },
                    { type: 'Mastercard', last4: '8888', expiry: '08/26', default: false },
                  ].map((card, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500" />
                        <div>
                          <p className="font-bold text-sm text-text">{card.type} •••• {card.last4}</p>
                          <p className="text-xs text-muted">Expires {card.expiry}</p>
                        </div>
                        {card.default && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <button className="text-sm font-bold text-muted hover:text-text">
                        Edit
                      </button>
                    </div>
                  ))}
                  <button className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 text-sm font-bold text-muted hover:border-text hover:text-text transition-all">
                    + Add Payment Method
                  </button>
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Billing History</h2>
                <div className="space-y-2">
                  {[
                    { date: 'Jul 15, 2024', amount: '$49.00', status: 'Paid', invoice: '#INV-2024-07' },
                    { date: 'Jun 15, 2024', amount: '$49.00', status: 'Paid', invoice: '#INV-2024-06' },
                    { date: 'May 15, 2024', amount: '$49.00', status: 'Paid', invoice: '#INV-2024-05' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-bg hover:bg-border transition-all">
                      <div>
                        <p className="font-bold text-sm text-text">{item.date}</p>
                        <p className="text-xs text-muted">Invoice {item.invoice}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm text-text">{item.amount}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          {item.status}
                        </span>
                        <button className="text-xs font-bold text-muted hover:text-text">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <>
              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Theme</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', name: 'Light', preview: 'bg-white' },
                    { id: 'dark', name: 'Dark', preview: 'bg-gray-900' },
                    { id: 'auto', name: 'Auto', preview: 'bg-gradient-to-r from-white to-gray-900' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings({ ...settings, theme: theme.id })}
                      className={`p-4 rounded-3xl border-2 transition-all ${
                        settings.theme === theme.id
                          ? 'border-text bg-bg'
                          : 'border-border hover:border-text'
                      }`}
                    >
                      <div className={`w-full h-24 rounded-2xl mb-3 ${theme.preview}`} />
                      <p className="font-bold text-sm text-text mb-1">{theme.name}</p>
                      {settings.theme === theme.id && (
                        <div className="flex items-center justify-center gap-1 text-xs text-text">
                          <Check size={12} /> Active
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Display Options</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                    <div>
                      <p className="font-bold text-sm text-text mb-1">Auto-Download Videos</p>
                      <p className="text-xs text-muted">Automatically download for offline viewing</p>
                    </div>
                    <IOSToggle
                      checked={settings.autoDownload}
                      onChange={() => toggleSetting('autoDownload')}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Language & Region */}
          {activeTab === 'language' && (
            <>
              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Language Preferences</h2>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSettings({ ...settings, language: lang.code })}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        settings.language === lang.code
                          ? 'border-text bg-bg'
                          : 'border-border hover:border-text'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-bold text-sm text-text">{lang.name}</span>
                      {settings.language === lang.code && (
                        <Check size={16} className="ml-auto" color="#0F0F0F" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Region Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Time Zone</label>
                    <select className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none">
                      <option>(GMT-5:00) Eastern Time</option>
                      <option>(GMT-8:00) Pacific Time</option>
                      <option>(GMT+0:00) UTC</option>
                      <option>(GMT+5:30) India Standard Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Currency</label>
                    <select className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
