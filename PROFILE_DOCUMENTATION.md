# User Profile Page - CodeClash

## Overview

A comprehensive user profile page for CodeClash, featuring detailed statistics, visualizations, and progress tracking for coding platform users. The page is designed with a modern glassmorphism dark theme, matching the LeetCode premium aesthetic.

## Features Implemented

### 1. Backend API Endpoints

#### Profile Controller (`backend/src/controllers/profile.controller.js`)

- **GET `/api/v1/profile`** - Main profile endpoint

  - Returns complete user profile with all statistics
  - Includes solved problems breakdown by difficulty
  - Calculates current and max streaks
  - Provides rank and percentile
  - Returns acceptance rate and submission stats
  - Lists playlists with completion progress

- **GET `/api/v1/profile/activity`** - Activity calendar data

  - Returns daily problem-solving activity
  - Data formatted for heatmap visualization

- **GET `/api/v1/profile/languages`** - Language usage statistics

  - Shows submission count by programming language
  - Includes percentage breakdown

- **GET `/api/v1/profile/recent`** - Recent activity

  - Returns last N solved problems (default: 10)
  - Includes problem details and timestamps

- **GET `/api/v1/profile/trends`** - Submission trends

  - Returns submission data over time
  - Includes success rates by date
  - Configurable time range (default: 30 days)

- **GET `/api/v1/profile/problem-stats`** - Problem statistics
  - Detailed breakdown by difficulty
  - Acceptance rates per difficulty level

### 2. Frontend Components

#### Main Profile Page (`frontend/src/pages/ProfilePage.jsx`)

**Hero Stats Cards** (4 cards):

- **Total Problems Solved** - Trophy icon, shows progress out of total
- **Current Streak** - Flame icon, displays current and max streak
- **Global Rank** - Award icon, shows rank and percentile (Top X%)
- **Acceptance Rate** - Trending Up icon, displays accepted/total submissions

**Activity Calendar** (`frontend/src/components/ActivityHeatmap.jsx`):

- GitHub-style heatmap showing daily solving activity
- Color intensity based on problems solved per day
- Uses `react-activity-calendar` library
- Custom theme matching app colors
- Shows weekday labels and total count

**Problem Statistics Chart** (`frontend/src/components/ProblemStatsChart.jsx`):

- **Summary Cards**: Easy/Medium/Hard solved count with color-coded badges
- **Doughnut Chart**: Visual breakdown of problems solved by difficulty
- **Bar Chart**: Acceptance rate by difficulty level
- Uses Chart.js and react-chartjs-2

**Language Usage Chart** (`frontend/src/components/LanguageChart.jsx`):

- **Donut Chart**: Programming language distribution
- **Language List**: Detailed breakdown with submission counts
- Color-coded languages with percentages
- Interactive tooltips

**Submission Trends** (`frontend/src/components/SubmissionTrendsChart.jsx`):

- **Summary Cards**: Total submissions, accepted, avg success rate
- **Line Chart**: Dual-line graph showing total vs accepted submissions over time
- Time-based visualization with smooth animations
- Success rate tooltips

**Playlist Progress** (`frontend/src/components/PlaylistProgressCards.jsx`):

- Grid of playlist cards with progress visualization
- **Circular Progress Ring**: SVG-based animated progress circles
- **Status Badges**: Dynamic status (Just Started, In Progress, Almost There, Completed)
- **Progress Bar**: Linear progress indicator
- Shows completion percentage and problem counts

**Recent Activity Timeline** (`frontend/src/components/RecentActivityTimeline.jsx`):

- Vertical timeline of last 10 solved problems
- **Problem Cards**: Title, difficulty badge, time ago
- **Success Badge**: Green badge indicating solved status
- Links to problem pages
- Timeline connector lines

### 3. State Management

#### Profile Store (`frontend/src/store/useProfileStore.js`)

Zustand store managing:

- Profile data
- Activity calendar
- Language statistics
- Recent activity
- Submission trends
- Problem statistics
- Loading states
- Error handling
- Batch data fetching with `fetchAllProfileData()`

### 4. Styling & Animations

**Glassmorphism Theme**:

- `bg-base-100/50 backdrop-blur-lg` - Semi-transparent backgrounds
- `border border-white/10` - Subtle borders
- Gradient overlays with primary/secondary colors

**Animations**:

- Fade-in effects on load
- Hover scale transforms (cards scale to 105%)
- Smooth transitions (200-300ms duration)
- Progress bar animations (1000ms ease-out)
- Chart animations via Chart.js

**Responsive Design**:

- Mobile-first approach
- Grid layouts: 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)
- Overflow handling for charts and heatmap

**Color Scheme**:

- **Easy**: Green (#22c55e)
- **Medium**: Amber (#f59e0b)
- **Hard**: Red (#ef4444)
- **Primary**: Blue gradient
- **Secondary**: Cyan/Purple gradient
- **Success**: Emerald (#10b981)

### 5. Badges & Milestones

**Role Badge**:

- Admin badge (gold/yellow gradient)
- Percentile badge (primary gradient)

**Difficulty Badges**:

- Color-coded with background tint
- Border styling
- Font weight variations

**Status Badges**:

- Playlist progress status
- Dynamic color based on completion percentage

### 6. Interactive Elements

**Hover Effects**:

- Card scaling and border color changes
- Icon scale transforms
- Button hover states with background color shifts

**Navigation**:

- Profile link in navbar dropdown
- Route: `/profile` (protected, requires authentication)
- Links to individual problems from recent activity

### 7. Data Visualization Libraries

**Installed Dependencies**:

```json
{
  "chart.js": "^latest",
  "react-chartjs-2": "^latest",
  "react-activity-calendar": "^latest"
}
```

**Chart Types**:

- Doughnut charts (problem difficulty, language usage)
- Bar charts (acceptance rates)
- Line charts (submission trends)
- Custom SVG progress rings (playlist progress)

## Usage

### Accessing the Profile Page

1. User must be logged in
2. Navigate to `/profile` or click "My Profile" in navbar dropdown
3. All data is automatically fetched on page load

### API Integration

```javascript
// Example: Fetching profile data
const { fetchAllProfileData } = useProfileStore();

useEffect(() => {
  fetchAllProfileData(); // Fetches all profile stats in parallel
}, []);
```

### Backend Routes

```javascript
// In backend/src/index.js
app.use("/api/v1/profile", profileRoutes);
```

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── profile.controller.js    (New: All profile endpoints)
│   └── routes/
│       └── profile.routes.js        (New: Profile routes)

frontend/
├── src/
│   ├── pages/
│   │   └── ProfilePage.jsx          (New: Main profile page)
│   ├── components/
│   │   ├── ActivityHeatmap.jsx      (New: Calendar heatmap)
│   │   ├── ProblemStatsChart.jsx    (New: Problem stats visualizations)
│   │   ├── LanguageChart.jsx        (New: Language usage donut chart)
│   │   ├── SubmissionTrendsChart.jsx (New: Submission line chart)
│   │   ├── RecentActivityTimeline.jsx (New: Activity timeline)
│   │   └── PlaylistProgressCards.jsx (New: Playlist progress cards)
│   └── store/
│       └── useProfileStore.js       (New: Profile state management)
```

## Key Features Matching LeetCode

✅ Activity calendar heatmap (like GitHub contributions)  
✅ Problem difficulty breakdown with charts  
✅ Acceptance rate tracking  
✅ Streak counter with flame icon  
✅ Global rank and percentile  
✅ Language usage statistics  
✅ Recent activity timeline  
✅ Playlist/collection progress tracking  
✅ Submission trends over time  
✅ Glassmorphism dark theme  
✅ Smooth animations and transitions  
✅ Responsive design  
✅ Color-coded badges and indicators  
✅ Interactive hover effects

## Performance Optimizations

- Parallel API calls with `Promise.all()`
- Lazy loading of chart libraries
- Memoized calculations (percentages, streaks)
- Efficient data transformations
- Responsive image loading

## Future Enhancements

Potential additions:

- Contest history and rankings
- Problem recommendation engine based on stats
- Comparison with friends/peers
- Achievement badges and trophies
- Export profile as PDF/image
- Shareable profile links
- Weekly/monthly reports
- Time spent coding analytics
- Topic-wise problem breakdown

## Testing

To test the profile page:

1. Start backend server
2. Start frontend development server
3. Login as a user
4. Solve some problems to generate data
5. Visit `/profile` to see statistics

## Dependencies

**Backend**:

- Prisma (database ORM)
- Express.js (routing)

**Frontend**:

- React (UI framework)
- Zustand (state management)
- Chart.js + react-chartjs-2 (charts)
- react-activity-calendar (heatmap)
- Lucide React (icons)
- TailwindCSS + DaisyUI (styling)
- React Router (navigation)

---

**Created for CodeClash** - A LeetCode-inspired coding platform
