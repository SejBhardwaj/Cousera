import { useState } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Palette, Download, Shield, Mail, Smartphone, Trash2, LogOut, ChevronRight, Check } from 'lucide-react';

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

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
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
                        defaultValue="John"
                        className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Email Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
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
                      defaultValue="Passionate learner exploring data science and machine learning."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-2xl text-sm bg-bg border border-transparent focus:border-purple focus:bg-white outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="px-6 py-3 rounded-2xl text-sm font-bold bg-text text-white hover:opacity-90 transition-all">
                    Save Changes
                  </button>
                  <button className="px-6 py-3 rounded-2xl text-sm font-bold bg-bg text-text hover:bg-border transition-all">
                    Cancel
                  </button>
                </div>
              </div>

              <div className="card-static p-6 rounded-4xl">
                <h2 className="text-lg font-bold text-text mb-5">Connected Accounts</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Google', icon: '🔵', connected: true },
                    { name: 'Facebook', icon: '🔵', connected: false },
                    { name: 'LinkedIn', icon: '🔵', connected: true },
                    { name: 'GitHub', icon: '⚫', connected: false },
                  ].map((account) => (
                    <div key={account.name} className="flex items-center justify-between p-4 rounded-2xl bg-bg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{account.icon}</span>
                        <span className="font-semibold text-sm text-text">{account.name}</span>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                          account.connected
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-text text-white hover:opacity-90'
                        }`}
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
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
                      <button
                        onClick={() => toggleSetting(item.key)}
                        className={`w-12 h-7 rounded-full transition-all relative ${
                          settings[item.key] ? 'bg-text' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                            settings[item.key] ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
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
                    <button
                      onClick={() => toggleSetting('pushNotifications')}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        settings.pushNotifications ? 'bg-text' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                          settings.pushNotifications ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
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
                      <button
                        onClick={() => toggleSetting(item.key)}
                        className={`w-12 h-7 rounded-full transition-all relative ${
                          settings[item.key] ? 'bg-text' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                            settings[item.key] ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
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
                    <button
                      onClick={() => toggleSetting('autoDownload')}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        settings.autoDownload ? 'bg-text' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                          settings.autoDownload ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
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
