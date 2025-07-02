# Job Application Tracker

A comprehensive, production-ready web application for tracking job applications, built with React and TailwindCSS. Perfect for students, developers, and professionals applying to companies like Google, Microsoft, and other tech giants.

![Job Application Tracker](https://images.pexels.com/photos/5240446/pexels-photo-5240446.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

### 📄 **Complete Job Application Management**
- **CRUD Operations**: Create, read, update, and delete job applications
- **Detailed Tracking**: Company name, job title, application status, source, deadlines, notes, and more
- **Resume Management**: Store resume/application URLs for easy access
- **Custom Tags**: Organize applications with skill-based tags (React, Python, AI, etc.)

### 📅 **Smart Deadline Management**
- **Visual Warnings**: Color-coded alerts for approaching deadlines
- **Deadline Calculator**: Shows exact days remaining until application deadlines
- **Urgency Levels**: Different alert styles for overdue, today, urgent (≤3 days), and normal deadlines

### 🔄 **Follow-up System**
- **Reminder Alerts**: Banner notifications when follow-up dates pass
- **Date Tracking**: Set and track follow-up dates for each application
- **Proactive Management**: Never miss an important follow-up opportunity

### 🔍 **Advanced Filtering & Search**
- **Multi-field Search**: Search across company names, job titles, and notes
- **Status Filtering**: Filter by Wishlist, Applied, Interview, Offer, or Rejected
- **Source Filtering**: Filter by LinkedIn, Indeed, Glassdoor, etc.
- **Tag-based Filtering**: Find applications by specific skills or technologies
- **Date Range Filtering**: Filter by today, this week, this month, or last 3 months
- **Active Filter Display**: See all applied filters at a glance

### 📊 **Statistics Dashboard**
- **Application Metrics**: Total applications, response rates, and recent activity
- **Status Breakdown**: Visual representation of applications by status
- **Success Analytics**: Calculate interview and offer rates
- **Upcoming Deadlines**: Quick view of approaching deadlines
- **Follow-up Tracking**: See overdue follow-ups at a glance

### 💾 **Data Management**
- **Local Storage**: All data persists in your browser's local storage
- **CSV Export**: Download your application data for backup or analysis
- **Data Validation**: Ensures data integrity and prevents corruption
- **Import/Export Ready**: Easy data portability

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for mobile devices, tablets, and desktop
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Breakpoint System**: Tailored layouts for different screen sizes
- **Cross-Browser**: Works on all modern browsers

### 🎨 **Professional UI/UX**
- **Modern Design**: Clean, Apple-inspired design aesthetics
- **Color-Coded Status**: Intuitive color system for different application states
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading States**: Smooth transitions and visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd job-application-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

### Build for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Use

### Adding Your First Job Application

1. **Click "Add Application"** button in the top-right corner
2. **Fill in the required fields**:
   - Company Name (required)
   - Job Title (required)
   - Application Status (Wishlist, Applied, Interview, Offer, Rejected)
   - Source (LinkedIn, Indeed, Company Website, etc.)
3. **Set important dates**:
   - Application Deadline (optional)
   - Follow-up Date (optional)
4. **Add relevant tags** for skills or technologies
5. **Include notes** for interview questions, salary details, etc.
6. **Save the application**

### Managing Applications

- **Edit**: Click the edit icon on any job card to modify details
- **Delete**: Click the trash icon to remove an application (with confirmation)
- **Status Updates**: Change status as you progress through the application process
- **Bulk Actions**: Use filters to manage multiple applications efficiently

### Using Filters Effectively

1. **Search**: Use the search bar to find specific companies or roles
2. **Status Filter**: Focus on specific stages of your job search
3. **Source Filter**: See which platforms are most effective
4. **Tag Filter**: Find applications requiring specific skills
5. **Date Filter**: Review recent activity or plan follow-ups
6. **Clear Filters**: Reset all filters with one click

### Tracking Progress

1. **Toggle Statistics**: Click the "Stats" button to view your dashboard
2. **Monitor Response Rates**: Track your success metrics
3. **Watch Deadlines**: Keep an eye on upcoming application deadlines
4. **Follow-up Reminders**: Act on overdue follow-ups displayed in banners

### Exporting Data

1. **Click "Export"** in the header
2. **Choose your filename** (defaults to current date)
3. **Open in Excel/Sheets** for further analysis
4. **Backup Regularly** to prevent data loss

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 18 with Hooks
- **Styling**: TailwindCSS 3.x
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns library
- **Storage**: Browser LocalStorage API

### Project Structure
```
src/
├── components/          # React components
│   ├── Header.jsx      # App header with navigation
│   ├── StatsPanel.jsx  # Statistics dashboard
│   ├── FilterBar.jsx   # Search and filter controls
│   ├── JobCard.jsx     # Individual job display
│   ├── AddJobForm.jsx  # Add/edit job form
│   └── FollowUpBanner.jsx # Follow-up reminders
├── utils/              # Utility functions
│   ├── localStorage.js # Data persistence
│   ├── dateUtils.js    # Date calculations
│   └── exportUtils.js  # CSV export functionality
├── App.jsx            # Main application component
├── main.jsx           # React DOM entry point
└── index.css          # Global styles and Tailwind
```

### Data Schema
Each job application contains:
```javascript
{
  id: string,              // Unique identifier
  company: string,         // Company name (required)
  jobTitle: string,        // Job title (required)
  status: string,          // Application status
  source: string,          // Where you found the job
  deadline: string|null,   // Application deadline (ISO date)
  followUpDate: string|null, // Follow-up date (ISO date)
  notes: string,           // Additional notes
  resumeUrl: string,       // Resume/application URL
  tags: string[],          // Skill/technology tags
  dateApplied: string|null, // When you applied (ISO date)
  createdAt: string,       // Creation timestamp
  updatedAt: string        // Last update timestamp
}
```

## 🎨 Customization

### Color Scheme
The app uses a professional color palette:
- **Primary**: Blue (#3B82F6) - Buttons, links, active states
- **Success**: Green - Interviews, offers, positive states
- **Warning**: Yellow - Pending, upcoming deadlines
- **Danger**: Red - Rejections, overdue items, urgent alerts
- **Neutral**: Gray shades - Text, borders, backgrounds

### Adding New Features

1. **New Status Types**: Modify the status options in `AddJobForm.jsx`
2. **Additional Fields**: Extend the data schema in `localStorage.js`
3. **Custom Filters**: Add new filter types in `FilterBar.jsx`
4. **Export Formats**: Extend `exportUtils.js` for JSON, PDF, etc.

## 🔧 Troubleshooting

### Common Issues

**Data Not Saving**
- Check if localStorage is enabled in your browser
- Ensure you're not in private/incognito mode
- Clear browser cache and reload

**Export Not Working**
- Verify you have applications to export
- Check if downloads are blocked in your browser
- Try a different browser if issues persist

**Filters Not Working**
- Ensure you have data matching your filter criteria
- Try clearing all filters and reapplying
- Check for case-sensitive search terms

**Performance Issues**
- Limit to under 1000 applications for optimal performance
- Export and archive old applications regularly
- Clear browser cache periodically

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Best Practices

### Effective Job Tracking
1. **Update Status Promptly**: Keep application statuses current
2. **Set Realistic Follow-ups**: Don't overwhelm yourself or employers
3. **Use Descriptive Notes**: Include interview questions, company culture notes
4. **Tag Consistently**: Use standardized tags for better filtering
5. **Regular Maintenance**: Archive old applications periodically

### Data Management
1. **Export Weekly**: Regular backups prevent data loss
2. **Consistent Naming**: Use standard company names (e.g., "Google" not "Google Inc.")
3. **Detailed Notes**: Include salary ranges, benefits, remote options
4. **Link Management**: Keep resume URLs updated and accessible

## 🤝 Contributing

This is an open-source project. Contributions are welcome! 

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Feature Requests
- GitHub Issues for bug reports
- Discussions for feature requests
- Pull requests for contributions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TailwindCSS** for the excellent utility-first CSS framework
- **Lucide React** for beautiful, consistent icons
- **date-fns** for reliable date manipulation
- **Vite** for fast development and building
- **Pexels** for high-quality stock photos

---

**Happy Job Hunting! 🎯**

Track your applications, stay organized, and land your dream job with this comprehensive job application tracker.