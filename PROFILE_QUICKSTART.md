# CodeClash Profile Page - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

### 2. Start the Frontend Server

```bash
cd frontend
npm run dev
```

### 3. Access the Profile

- Navigate to `http://localhost:5173`
- Login to your account
- Click on your avatar in the top right navbar
- Select "My Profile" from dropdown
- OR click "View My Profile" button on homepage
- OR directly visit `http://localhost:5173/profile`

## 📊 Profile Page Sections

### 1. Hero Stats (Top Row - 4 Cards)

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Trophy    │   Flame     │   Award     │ Trending Up │
│  Problems   │  Current    │   Global    │ Acceptance  │
│   Solved    │   Streak    │    Rank     │    Rate     │
│    150      │   7 days    │   #1,234    │    85.5%    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. Activity Calendar

```
GitHub-style heatmap showing daily problem-solving activity
[Calendar visualization with green intensity based on daily problems]
```

### 3. Problem Statistics (Left) | Language Usage (Right)

```
┌─────────────────────────────┬─────────────────────────────┐
│ Problem Statistics          │ Language Usage              │
│ ┌─────┬─────┬─────┐        │                             │
│ │Easy │Med  │Hard │        │      Donut Chart            │
│ │ 50  │ 75  │ 25  │        │   Python - 45%              │
│ └─────┴─────┴─────┘        │   JavaScript - 30%          │
│                             │   Java - 25%                │
│ [Doughnut] | [Bar Chart]   │                             │
└─────────────────────────────┴─────────────────────────────┘
```

### 4. Submission Trends

```
┌─────────────────────────────────────────────────────────┐
│ Submission Trends (Last 30 Days)                        │
│                                                         │
│ [Line Chart: Total vs Accepted Submissions over time]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5. Playlist Progress

```
┌─────────────┬─────────────┬─────────────┐
│ Playlist 1  │ Playlist 2  │ Playlist 3  │
│   [Ring]    │   [Ring]    │   [Ring]    │
│    75%      │    50%      │   100%      │
│  30/40 ✓    │  15/30 ⏳   │  25/25 🎉   │
└─────────────┴─────────────┴─────────────┘
```

### 6. Recent Activity Timeline

```
┌─────────────────────────────────────────┐
│ ✓ Two Sum                    [Easy]     │
│   2 hours ago                           │
├─────────────────────────────────────────┤
│ ✓ Binary Tree Traversal      [Medium]  │
│   5 hours ago                           │
├─────────────────────────────────────────┤
│ ✓ Maximum Subarray           [Hard]    │
│   1 day ago                             │
└─────────────────────────────────────────┘
```

## 🎨 Color Scheme

- **Easy**: Green (#22c55e)
- **Medium**: Amber (#f59e0b)
- **Hard**: Red (#ef4444)
- **Primary**: Blue gradient
- **Secondary**: Purple/Cyan gradient
- **Background**: Dark with glassmorphism effect

## 🔧 API Endpoints Used

```
GET /api/v1/profile              - Main profile data
GET /api/v1/profile/activity     - Calendar heatmap data
GET /api/v1/profile/languages    - Language statistics
GET /api/v1/profile/recent       - Recent solved problems
GET /api/v1/profile/trends       - Submission trends
GET /api/v1/profile/problem-stats - Difficulty breakdown
```

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Single column layout
- **Tablet** (768px - 1024px): 2 column grid
- **Desktop** (> 1024px): 3-4 column grid

## ✨ Animations

- **Fade In**: Page load (400ms)
- **Hover Scale**: Cards scale to 105% (200ms)
- **Progress Bars**: 1000ms ease-out animation
- **Chart Transitions**: Built-in Chart.js animations

## 🎯 Key Features

✅ Real-time statistics  
✅ Interactive charts and graphs  
✅ Activity heatmap (365 days)  
✅ Streak tracking  
✅ Global ranking  
✅ Language preferences  
✅ Playlist progress tracking  
✅ Recent activity feed  
✅ Acceptance rate analytics  
✅ Responsive design  
✅ Dark mode optimized  
✅ Glassmorphism styling

## 🐛 Testing Checklist

- [ ] Profile loads without errors
- [ ] All stats display correctly
- [ ] Charts render properly
- [ ] Activity calendar shows data
- [ ] Recent activity timeline works
- [ ] Playlist progress cards display
- [ ] Hover effects work smoothly
- [ ] Mobile responsive layout
- [ ] Links navigate correctly
- [ ] Loading states show properly

## 📝 Sample Data Required

To see a fully populated profile, ensure:

- User has solved at least 10 problems
- Problems span Easy/Medium/Hard difficulties
- Submissions made in last 30 days
- At least 1 playlist created
- Multiple programming languages used

## 🔗 Related Files

**Backend**:

- `backend/src/controllers/profile.controller.js`
- `backend/src/routes/profile.routes.js`

**Frontend**:

- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/store/useProfileStore.js`
- `frontend/src/components/ActivityHeatmap.jsx`
- `frontend/src/components/ProblemStatsChart.jsx`
- `frontend/src/components/LanguageChart.jsx`
- `frontend/src/components/SubmissionTrendsChart.jsx`
- `frontend/src/components/RecentActivityTimeline.jsx`
- `frontend/src/components/PlaylistProgressCards.jsx`

## 🎓 How It Works

1. **Page Load**: ProfilePage.jsx mounts
2. **Data Fetch**: useProfileStore calls `fetchAllProfileData()`
3. **Parallel API Calls**: 6 endpoints called simultaneously
4. **State Update**: Zustand store updates with response data
5. **Component Render**: All child components receive data
6. **Visualizations**: Charts render with Chart.js/react-activity-calendar
7. **Animations**: CSS transitions trigger on mount/hover

## 💡 Tips

- **First Time User**: Stats will be zero until problems are solved
- **Streak Calculation**: Based on consecutive days with at least 1 solve
- **Rank**: Calculated based on total problems solved vs other users
- **Activity Calendar**: Shows last 365 days of activity
- **Playlist Progress**: Automatically calculates based on solved problems

## 🚨 Common Issues

**Issue**: Charts not displaying  
**Solution**: Ensure Chart.js is properly imported and registered

**Issue**: Activity calendar empty  
**Solution**: Check that problemSolved records exist in database

**Issue**: Profile loads slow  
**Solution**: Data is fetched in parallel, check network/API performance

**Issue**: Percentile shows 100%  
**Solution**: Expected if user is rank #1 or only user in system

---

**Need Help?** Check the full documentation in `PROFILE_DOCUMENTATION.md`
