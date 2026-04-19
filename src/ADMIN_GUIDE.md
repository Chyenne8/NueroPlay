# NeuroPlay Admin Guide

## Accessing the Admin Panel

There are two ways to access the admin dashboard:

### Method 1: Direct URL Access
Navigate directly to `/admin` in your browser

### Method 2: Hidden Access from Kid Dashboard
1. On the Kid Dashboard, **click the NeuroPlay logo 5 times** within 3 seconds
2. A confirmation dialog will appear asking if you want to access the admin panel
3. Click "OK" and you'll be redirected to the admin login page

**Note:** This hidden feature is designed to keep the admin access secure while making it accessible when needed.

## Admin Login

**Demo Passwords:**
- `parent`
- `admin`
- `1234`

**Security Note:** In production, implement proper authentication with secure password hashing, JWT tokens, and backend validation.

## Admin Dashboard Features

### 1. Users Tab

#### Overview Statistics
- **Total Users:** Total number of registered accounts
- **Completed:** Users who finished the quest
- **Not Started:** Users who haven't completed the quest yet
- **Locked:** Users whose quiz retake is locked

#### Search & Filter
- **Search Bar:** Find users by username
- **Filter Buttons:**
  - All: Show all users
  - Completed: Show only users who completed the quest
  - Not Started: Show only users who haven't started

#### Bulk Actions
- **Export All:** Download all user data as JSON
- **Refresh:** Reload user data from localStorage

#### Individual User Actions

For each user, you can:

1. **View Profile** (if quest completed)
   - See detailed performance metrics
   - View sensory preferences
   - Check personalized game recommendations

2. **Export** (if quest completed)
   - Download individual user data as JSON
   - Includes all quiz results and preferences

3. **Allow Retake** (if locked)
   - Enable the user to retake the quest
   - Useful when you want to refresh their profile

4. **Reset Progress**
   - Clear all quiz results
   - Reset completion status
   - User can start fresh

5. **Delete User**
   - Permanently remove user account
   - ⚠️ Cannot be undone!

### 2. Analytics Tab

#### Completion Rate
- Visual progress bar showing percentage of users who completed the quest
- Detailed breakdown of completion statistics

#### User Status
- Real-time count of:
  - Completed quests
  - Not started users
  - Locked accounts

#### Recent Activity
- Shows last 5 users who completed the quest
- Displays completion dates
- Helps track recent engagement

#### System Information
- Total accounts in the system
- Active sessions (currently logged-in users)
- Storage usage in localStorage

### 3. Settings Tab

#### Admin Password
- View current accepted passwords
- Change password option (placeholder for production implementation)
- Security reminder about proper authentication

#### Data Management
- **Export All User Data:** Backup all user information
- **Clear All Data:** Reset the entire system (⚠️ irreversible!)

#### Important Notices
- Security warnings about localStorage usage
- Production implementation recommendations
- Data privacy reminders

## User Profile View

When viewing an individual user profile (from "View Profile" button), you can see:

### Overview Tab
- **Cognitive Skills:** Brain power score (0-5)
- **Executive Function:** Focus power score (0-4)
- **Social Interaction:** Friend power score (0-3)
- Animated progress bars for each category

### Preferences Tab
- **Color Preference:** Bright vs. Soft colors
- **Sound Preference:** Music type preference
- **Animation Speed:** Fast vs. Smooth movements

### Recommendations Tab
- Personalized game suggestions based on scores
- Skill-specific activities:
  - Puzzle adventures (high cognitive)
  - Strategy games (high executive function)
  - Story-based games (high social awareness)

## Best Practices

### Security
- Change default passwords in production
- Implement proper backend authentication
- Use encrypted database instead of localStorage
- Add role-based access control (RBAC)
- Enable audit logging for admin actions

### Data Privacy
- Never store PII in localStorage
- Implement GDPR-compliant data handling
- Provide data export for user requests
- Ensure secure data deletion

### User Management
- Regularly backup user data using "Export All"
- Monitor completion rates to track engagement
- Use "Allow Retake" sparingly to maintain data integrity
- Document reasons for user deletions

### Accessibility
- Admin panel includes proper ARIA labels
- Keyboard navigation supported
- Color-coded status indicators
- Clear visual feedback for all actions

## Troubleshooting

### Users Not Showing Up
1. Click "Refresh" button
2. Check browser localStorage in DevTools
3. Verify `neuroPlayUsers` key exists
4. Check for JavaScript console errors

### Can't Access Admin Panel
1. Verify you're using correct password
2. Clear browser cache and try again
3. Check if localStorage is enabled
4. Try direct URL: `/admin`

### Export Not Working
1. Check browser's download permissions
2. Verify user has completed data to export
3. Try exporting all users instead
4. Check browser console for errors

### Data Synchronization Issues
1. Use "Refresh" button to reload data
2. Check if multiple tabs are open (localStorage sync)
3. Clear cache and reload
4. Verify localStorage quota not exceeded

## Production Deployment Checklist

Before deploying to production:

- [ ] Replace localStorage with secure database
- [ ] Implement proper backend authentication
- [ ] Add password hashing (bcrypt, Argon2)
- [ ] Set up JWT token authentication
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable HTTPS only
- [ ] Set up audit logging
- [ ] Implement proper error handling
- [ ] Add email notifications for admin actions
- [ ] Set up automated backups
- [ ] Implement 2FA for admin access
- [ ] Add IP whitelisting option
- [ ] Create admin activity dashboard
- [ ] Set up monitoring and alerts

## Support

For questions or issues with the admin panel:
1. Check this guide first
2. Review browser console for errors
3. Verify localStorage data structure
4. Test in incognito mode to rule out extensions

---

**Remember:** This is a demo implementation. Always prioritize security and data privacy in production environments.
