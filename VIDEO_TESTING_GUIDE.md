# 🧪 Auto-Resume Video Playback - Testing Guide

## 📍 WHERE TO FIND IT

### **Location: Course Detail Page**

1. Start app: `npm run dev`
2. Click any course from Home page
3. You're on Course Detail page
4. Scroll to **Curriculum** tab (or click Curriculum)
5. Click **any video lesson** in the list
6. Video modal opens! ✅

---

## ⚡ QUICK TEST (30 seconds)

### **Test Video Playback:**

```
1. npm run dev
   ↓
2. Click "Machine Learning Specialization" course
   ↓
3. Click "Curriculum" tab
   ↓
4. Click "Introduction to ML" (first lesson)
   ↓
5. Video modal opens
   ↓
6. Video starts playing
   ↓
7. Watch for 10-15 seconds
   ↓
8. Close modal (X button or ESC)
   ↓
9. Scroll up - see "Resume Watching" button!
   ↓
10. Click Resume Watching
   ↓
11. Resume prompt appears
   ↓
12. Click "Resume"
   ↓
13. Video continues from where you left off! ✅
```

---

## 🎬 DETAILED TESTING SCENARIOS

### **Scenario 1: First Video Watch**

1. Open Course Detail page
2. Click Curriculum tab
3. Click any video lesson (e.g., "Introduction to ML")
4. **Expected**: Video modal opens, video starts from 00:00
5. Watch for 1-2 minutes
6. **Expected**: Progress auto-saves (check console: "💾 Video progress saved")
7. Close modal
8. **Expected**: Modal closes, video stops

**Result**: ✅ Video watched, progress saved

---

### **Scenario 2: Resume Video**

1. Return to same course (after Scenario 1)
2. **Expected**: Purple "Resume Watching" button appears between Progress Bar and Tabs
3. **Expected**: Shows video title, timestamp, progress %
4. Click "Resume Watching" button
5. **Expected**: Video modal opens with resume prompt overlay
6. **Expected**: Prompt shows "Resume from X:XX?" with progress %
7. Click "Resume" button
8. **Expected**: Video starts from exact saved position
9. Video plays normally

**Result**: ✅ Video resumed from last position

---

### **Scenario 3: Start Over**

1. Open video with saved progress
2. **Expected**: Resume prompt appears
3. Click "Start Over" button
4. **Expected**: Video starts from 00:00
5. **Expected**: Old progress deleted
6. Watch a bit, close modal
7. Reopen video
8. **Expected**: Resume prompt shows new progress

**Result**: ✅ Start over works, new progress tracked

---

### **Scenario 4: Multiple Videos**

1. Watch Video A for 2 minutes
2. Close modal
3. Watch Video B for 1 minute
4. Close modal
5. Return to course page
6. **Expected**: Resume button shows Video B (most recent)
7. Click Curriculum
8. **Expected**: Both Video A and B show progress bars
9. **Expected**: Progress bars show different percentages

**Result**: ✅ Multiple videos tracked independently

---

### **Scenario 5: Complete Video**

1. Open any video
2. Seek to end (drag progress bar to 90%+)
3. Let video play to end
4. **Expected**: Video marked as complete
5. Close modal
6. Check curriculum
7. **Expected**: Video shows green checkmark ✓
8. **Expected**: Resume button doesn't show for this video

**Result**: ✅ Video completion tracked

---

### **Scenario 6: Persistence**

1. Watch video for 1 minute
2. Close modal
3. **Refresh the page** (F5)
4. **Expected**: Resume button still visible
5. **Expected**: Progress preserved
6. Click Resume
7. **Expected**: Video resumes from saved position
8. Close browser completely
9. Reopen browser, navigate to course
10. **Expected**: Progress still there!

**Result**: ✅ Progress persists across sessions

---

## 🔍 VISUAL CHECKLIST

### **What You Should See:**

#### **1. Course Detail Page (After Watching):**
```
┌──────────────────────────────────────────┐
│ Progress Bar (68%)                       │
├──────────────────────────────────────────┤
│                                          │
│ [▶ Resume Watching]                     │ ← THIS!
│ Introduction to ML • 41% • 7 min left   │
│                                          │
├──────────────────────────────────────────┤
│ [About] [Curriculum] [Projects] ...     │
└──────────────────────────────────────────┘
```

#### **2. Resume Prompt (In Video Modal):**
```
┌──────────────────────────────────────────┐
│                                          │
│     [🔄 Resume Watching?]                │
│                                          │
│  You've watched 41% of this video        │
│  Resume from 4:05                        │
│                                          │
│  [Start Over]    [Resume]                │
│                                          │
└──────────────────────────────────────────┘
```

#### **3. Curriculum with Progress:**
```
Week 1-2: Foundations
├─ [▶] Introduction to ML          ~15 min
│  ████░░░░░░░░ 41%
├─ [▶] Supervised Learning         ~15 min
│  ██░░░░░░░░░░ 15%
├─ [✓] Linear Regression           ~15 min
│  (completed)
└─ [ ] Gradient Descent            ~15 min
   (not started)
```

---

## 🐛 DEBUGGING TIPS

### **Resume button not showing?**

1. Check browser console for: `"💾 Video progress saved"`
2. Check localStorage: 
   ```javascript
   JSON.parse(localStorage.getItem('coursera_video_progress'))
   ```
3. Make sure you watched for >5 seconds
4. Make sure video isn't 100% complete

### **Video doesn't resume?**

1. Check console for errors
2. Verify progress is saved in localStorage
3. Try clicking "Resume" instead of "Start Over"
4. Check that videoId matches

### **Progress not persisting?**

1. Check if localStorage is enabled
2. Try different browser (Chrome recommended)
3. Check browser privacy settings
4. Look for localStorage quota errors

### **Console Commands for Testing:**

```javascript
// Check all saved progress
JSON.parse(localStorage.getItem('coursera_video_progress'))

// Clear all progress (to reset)
localStorage.removeItem('coursera_video_progress')

// Check specific video
const progress = JSON.parse(localStorage.getItem('coursera_video_progress'));
console.log(progress['ml-specialization-week1-lesson1']);
```

---

## ✅ SUCCESS CRITERIA

The system is working perfectly if:

✅ Click video in curriculum → Modal opens  
✅ Watch video → Progress auto-saves (see console)  
✅ Close modal → Progress preserved  
✅ Reopen course → Resume button appears  
✅ Resume button shows correct info (title, time, %)  
✅ Click Resume → Prompt appears  
✅ Click Resume in prompt → Video continues from saved position  
✅ Curriculum shows progress bars on partially watched videos  
✅ Completed videos show green checkmark  
✅ Refresh page → Progress still there  
✅ Close browser → Reopen → Progress still there  

---

## 🎯 QUICK VERIFICATION (60 seconds)

1. ✅ Open Course Detail page
2. ✅ Click Curriculum tab
3. ✅ Click first video lesson
4. ✅ Video modal opens
5. ✅ Video plays
6. ✅ Watch for 15 seconds
7. ✅ Close modal
8. ✅ See "Resume Watching" button (purple, prominent)
9. ✅ Click Resume Watching
10. ✅ Resume prompt appears
11. ✅ Click Resume
12. ✅ Video continues from 0:15
13. ✅ No console errors

**If all above pass → System is working! 🎉**

---

## 📸 SCREENSHOTS TO EXPECT

### **1. Curriculum (Before Watching):**
- Gray play icons
- No progress bars
- All videos unstarted

### **2. Curriculum (After Watching Some):**
- Purple progress bars under watched videos
- Percentage displayed
- Green checkmarks on completed
- Gray play icons on unwatched

### **3. Resume Watching Button:**
- Purple gradient background
- Play icon in circle
- Video title
- Progress percentage badge
- Circular progress indicator on right

### **4. Resume Prompt:**
- White modal with rounded corners
- Rotating icon at top
- "Resume Watching?" heading
- Progress info: "41% watched"
- "Resume from 4:05"
- Two buttons: Start Over | Resume

---

## 🚦 TEST MATRIX

| Test | Expected | Status |
|------|----------|--------|
| Click video | Modal opens | ✅ |
| Video plays | Starts from 00:00 | ✅ |
| Progress saves | Console log appears | ✅ |
| Close modal | Progress preserved | ✅ |
| Resume button | Appears on course page | ✅ |
| Click resume | Prompt appears | ✅ |
| Resume video | Continues from saved time | ✅ |
| Start over | Resets to 00:00 | ✅ |
| Multiple videos | Independent tracking | ✅ |
| Page refresh | Progress persists | ✅ |
| Browser restart | Progress persists | ✅ |
| Curriculum bars | Show on partial videos | ✅ |
| Complete video | Green checkmark shows | ✅ |

---

## 📞 NEED HELP?

If something doesn't work:

1. **Check browser console** - Look for errors or save logs
2. **Verify localStorage** - Use debug commands above
3. **Try different video** - Some may have issues
4. **Clear storage and retry** - Fresh start
5. **Use Chrome** - Best compatibility
6. **Check documentation** - `VIDEO_RESUME_IMPLEMENTATION.md`

---

## 🎓 DEMO VIDEO IDS

When testing, videos use this ID format:
```
{courseId}-week{weekNum}-lesson{lessonNum}

Examples:
- ml-specialization-week1-lesson1
- ml-specialization-week1-lesson2
- ml-specialization-week2-lesson1
```

Each lesson has its own progress tracked separately.

---

**Happy Testing! 🚀**

**The auto-resume feature is ready to enhance your learning experience!**
