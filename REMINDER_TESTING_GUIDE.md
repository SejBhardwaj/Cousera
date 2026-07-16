# 🧪 Course Reminder System - Testing Guide

## Quick Test Instructions

### 🚀 **Test 1: Set 1-Hour Reminder (Quick Test)**

1. **Start the app**: `npm run dev`
2. **Navigate**: Go to any course detail page
3. **Find the bell icon**: Top left, next to the bookmark icon
4. **Click the bell**: Reminder modal opens
5. **Click "Remind me in 1 hour"**
6. **Grant permission**: Browser will ask for notification permission → Click "Allow"
7. **Success!** Modal shows success message
8. **Verify**: Bell icon turns purple with a yellow dot
9. **Wait 1 hour**: Notification will appear automatically

### ⚡ **Test 2: Quick Test with Custom Time (1 minute from now)**

For testing purposes, you can modify the code temporarily:

**Option A: Modify the 1-hour reminder to 1 minute**
1. Open `src/utils/reminderStorage.ts`
2. Find line ~100: `return Date.now() + (60 * 60 * 1000);`
3. Change to: `return Date.now() + (60 * 1000);` (1 minute)
4. Save and test
5. Notification will appear in 1 minute!

**Option B: Use custom date/time picker**
1. Click bell icon
2. Scroll to "Custom Time" section
3. Set date to today
4. Set time to 1 minute from now (e.g., if it's 2:30 PM, set 2:31 PM)
5. Click "Set Custom Reminder"
6. Wait 1 minute → Notification appears!

---

## 📋 Complete Testing Checklist

### ✅ **Permission Flow:**
- [ ] First visit: Purple banner appears at top
- [ ] Click "Enable" → Browser permission prompt appears
- [ ] Grant permission → Banner disappears
- [ ] Bell icon → Modal opens without asking again
- [ ] Dismiss banner → Doesn't show again this session

### ✅ **Setting Reminders:**
- [ ] Click bell icon → Modal opens
- [ ] "Remind me in 1 hour" → Success message, bell turns purple
- [ ] "Remind me tomorrow" → Success message, shows "Tomorrow at 9:00 AM"
- [ ] "Remind me in 1 week" → Success message, shows future date
- [ ] Custom date/time → Select future date/time → Success
- [ ] Past date → Error: "Please select a future date and time"

### ✅ **Visual Indicators:**
- [ ] No reminder: Bell icon is gray
- [ ] Reminder set: Bell icon is purple
- [ ] Active reminder: Yellow dot on bell icon
- [ ] Hover bell: Tooltip shows reminder time
- [ ] Modal: Shows active reminder with cancel button

### ✅ **Notification Delivery:**
- [ ] Wait for reminder time → Notification appears
- [ ] Notification shows course name
- [ ] Notification has motivational message
- [ ] Click notification → Browser window focuses
- [ ] After notification: Bell returns to gray

### ✅ **Canceling Reminders:**
- [ ] Bell icon (with active reminder) → Modal shows active reminder
- [ ] Click "Cancel" button → Confirmation alert
- [ ] Confirm → Reminder deleted
- [ ] Bell icon returns to gray
- [ ] No notification fires at scheduled time

### ✅ **Persistence:**
- [ ] Set reminder → Refresh page → Reminder still active
- [ ] Set reminder → Close tab → Reopen → Reminder still active
- [ ] Set reminder → Close browser → Reopen → Reminder still active
- [ ] Notification fires → Refresh page → Bell is gray (marked complete)

### ✅ **Edge Cases:**
- [ ] Set reminder → Set another → Old one replaced
- [ ] Multiple courses → Each has independent reminder
- [ ] Permission denied → Helpful error message
- [ ] Browser doesn't support notifications → Graceful handling
- [ ] localStorage cleared → Reminders reset (expected behavior)

---

## 🔍 Testing Scenarios

### **Scenario 1: New User Journey**
```
1. Open course detail page
2. See purple permission banner
3. Click "Enable" → Grant permission
4. Banner disappears
5. Click bell icon
6. Select "Remind me in 1 hour"
7. Success message appears
8. Bell turns purple with yellow dot
9. After 1 hour → Notification appears
10. Click notification → Window focuses
11. Bell returns to gray
```

### **Scenario 2: Returning User**
```
1. Open course with active reminder
2. Bell icon is purple with yellow dot
3. Hover → Tooltip shows "Reminder: Tomorrow at 9:00 AM"
4. Click bell → Modal shows active reminder
5. Click "Cancel" → Confirm
6. Bell returns to gray
```

### **Scenario 3: Multiple Reminders**
```
1. Go to Course A → Set reminder for tomorrow
2. Go to Course B → Set reminder for 1 hour
3. Go to Course C → Set reminder for 1 week
4. All three courses show purple bell with yellow dot
5. Each reminder fires independently
```

---

## 🐛 Known Limitations (Expected Behavior)

### **Browser Limitations:**
1. **Notifications only work while browser is open**
   - This is expected without Service Worker
   - Close browser → Notifications won't fire
   - Reopen browser → Background timer resumes checking

2. **iOS Safari has limited support**
   - Notifications may not work on iOS Safari
   - This is a Safari limitation, not a bug

3. **Permission can be denied**
   - User must grant permission
   - If denied, reminders can't send notifications
   - User shown helpful error message

### **By Design:**
1. **One reminder per course**
   - Setting new reminder replaces old one
   - This prevents spam

2. **60-second check interval**
   - Notifications may appear 0-60 seconds after scheduled time
   - This is for performance optimization

3. **Auto cleanup after 7 days**
   - Old notified reminders deleted automatically
   - Keeps storage clean

---

## 🎯 Success Criteria

The system is working perfectly if:

✅ Users can set reminders with all options (1 hour, tomorrow, 1 week, custom)  
✅ Browser notifications appear at scheduled times  
✅ Visual indicators (purple bell, yellow dot) work correctly  
✅ Reminders persist across page refreshes and browser sessions  
✅ Permission flow works smoothly  
✅ Users can cancel reminders  
✅ No console errors  
✅ No TypeScript errors  
✅ Smooth, responsive UI  

---

## 🔧 Debugging Tips

### **Notification not appearing?**
1. Check browser console for errors
2. Verify notification permission is granted
3. Check if reminder time has passed (may need to wait up to 60 seconds)
4. Verify browser tab is open
5. Check localStorage: `localStorage.getItem('coursera_reminders')`

### **Permission issues?**
1. Check notification permission: `Notification.permission`
2. Reset permission: Browser settings → Site settings → Reset permissions
3. Try in incognito mode (fresh permission state)

### **Bell icon not updating?**
1. Check React DevTools for state changes
2. Verify `courseReminder` state in CourseDetail component
3. Check localStorage for saved reminder

### **Console Commands for Debugging:**
```javascript
// Check all reminders
JSON.parse(localStorage.getItem('coursera_reminders'))

// Clear all reminders
localStorage.removeItem('coursera_reminders')

// Check notification permission
Notification.permission

// Request permission manually
await Notification.requestPermission()

// Test notification immediately
new Notification('Test', { body: 'This is a test notification' })
```

---

## 📸 Visual Testing

### **Expected UI States:**

1. **No Reminder Set:**
   - Bell icon: Gray
   - No yellow dot
   - Tooltip: "Set reminder"

2. **Reminder Active:**
   - Bell icon: Purple (#A98BFF)
   - Yellow dot visible (#D7FF54)
   - Tooltip: "Reminder: Tomorrow at 9:00 AM"

3. **Modal - No Active Reminder:**
   - Shows three quick options
   - Shows custom date/time picker
   - "No reminders for now" button at bottom

4. **Modal - Active Reminder:**
   - Green box at top showing active reminder
   - Time display: "Tomorrow at 9:00 AM"
   - Red "Cancel" button

5. **Permission Banner:**
   - Purple gradient background
   - Bell icon on left
   - "Enable" and "X" buttons
   - Appears only when permission not granted

---

## ⚡ Quick Verification (30 seconds)

1. ✅ Open course detail page
2. ✅ Click bell icon → Modal opens
3. ✅ Three quick options visible
4. ✅ Custom date/time picker visible
5. ✅ Click "No reminders for now" → Modal closes
6. ✅ No console errors
7. ✅ Bell icon is gray

**If all above pass → System is working! 🎉**

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console for errors
2. Verify notification permission is granted
3. Try in a different browser (Chrome recommended)
4. Clear localStorage and try again
5. Check the implementation documentation: `REMINDER_SYSTEM_IMPLEMENTATION.md`

---

**Happy Testing! 🚀**
