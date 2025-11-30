# Manual Testing Checklist for Notice Board

## 🧪 **Pre-Deployment Testing Steps**

### **1. Database Migration Testing**
```sql
-- Step 1: Run migration in Supabase SQL Editor
-- Copy contents of database/notice_board_migration.sql

-- Step 2: Verify table creation
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'notice_board' 
ORDER BY ordinal_position;

-- Step 3: Verify sample data
SELECT COUNT(*) as total_notices FROM notice_board;
-- Expected: 8 notices

-- Step 4: Verify RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'notice_board';

-- Step 5: Test public access
SELECT * FROM notice_board WHERE is_active = true LIMIT 3;
-- Should return 3 active notices without authentication
```

### **2. API Endpoint Testing**

#### **Test GET Endpoint**
```bash
# Basic test
curl -X GET "http://localhost:3000/api/notice-board?limit=3" \
  -H "Content-Type: application/json"

# Expected response:
{
  "data": [
    {
      "id": "uuid",
      "title": "Student Requirement",
      "student_name": "Akhil",
      "subject": "Yoga",
      "location": "Sector 83, Gurgaon",
      "contact_number": "9876543210",
      "priority": "urgent",
      "category": "tutoring",
      "created_at": "2025-11-30T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 3,
    "offset": 0,
    "hasMore": true
  }
}
```

#### **Test POST Endpoint**
```bash
# Test creating new notice
curl -X POST "http://localhost:3000/api/notice-board" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Math Tutor Needed",
    "student_name": "Test Student",
    "subject": "Mathematics",
    "location": "Test Location",
    "contact_number": "1234567890",
    "priority": "normal",
    "category": "tutoring",
    "requirements": "Basic math skills required",
    "duration": "3 months"
  }'

# Expected response:
{
  "data": {
    "id": "new-uuid",
    "title": "Test Math Tutor Needed",
    "student_name": "Test Student",
    // ... other fields
  }
}
```

#### **Test Error Handling**
```bash
# Test with missing required fields
curl -X POST "http://localhost:3000/api/notice-board" \
  -H "Content-Type: application/json" \
  -d '{"title": "Incomplete Notice"}'

# Expected: 400 Bad Request with error message
{
  "error": "Required fields missing: title, student_name, subject, location, contact_number"
}
```

### **3. Frontend Component Testing**

#### **Manual Browser Testing**
1. **Open Learn Page**: Navigate to `http://localhost:3000/learn`
2. **Check Notice Board Section**: Scroll to "Notice Board" section
3. **Verify Loading State**: Should see skeleton cards for 1-2 seconds
4. **Verify Data Display**: Should see 6 notice cards with real data
5. **Check Responsive Design**: 
   - Mobile: 1 column
   - Tablet: 2 columns  
   - Desktop: 3 columns
6. **Test Priority Badges**: Check colors match priority levels
7. **Check Time Formatting**: Verify "X hours ago" or "X days ago"

#### **Browser Console Testing**
```javascript
// Open browser developer console and run:

// Test API directly
fetch('/api/notice-board?limit=3')
  .then(response => response.json())
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('Error:', error));

// Test component data
const cards = document.querySelectorAll('[data-notice-card]');
console.log(`Found ${cards.length} notice cards`);

// Check for errors
console.log('Console errors:', window.errors || 'No errors found');
```

### **4. Integration Testing**

#### **Full Page Load Test**
```bash
# Start server
npm run dev

# Test URL
curl -I http://localhost:3000/learn
# Expected: 200 OK

# Check page content
curl http://localhost:3000/learn | grep -i "notice board"
# Should find "Notice Board" in HTML
```

#### **Component Props Testing**
```typescript
// In learn/page.tsx, test different limit values:
// <NoticeBoard limit={3} />   // Show 3 notices
// <NoticeBoard limit={10} />  // Show 10 notices
// <NoticeBoard />             // Show default 10 notices
```

### **5. Performance Testing**

#### **API Response Times**
```bash
# Test API speed
time curl -s "http://localhost:3000/api/notice-board?limit=10" > /dev/null
# Expected: < 500ms response time

# Test with different limits
for limit in 1 5 10 20; do
  echo "Testing limit=$limit"
  time curl -s "http://localhost:3000/api/notice-board?limit=$limit" > /dev/null
done
```

#### **Database Query Optimization**
```sql
-- Check if indexes are being used
EXPLAIN ANALYZE SELECT * FROM notice_board 
WHERE is_active = true 
ORDER BY created_at DESC 
LIMIT 10;

-- Should show "Index Scan" or "Bitmap Index Scan" in plan
```

### **6. Error Scenario Testing**

#### **Database Connection Failure**
1. **Temporarily disconnect internet**
2. **Visit learn page**
3. **Check error handling**: Should show "Error loading notice board" with retry button
4. **Reconnect internet**
5. **Click retry button**: Should reload data successfully

#### **Invalid API Responses**
```bash
# Test malformed requests
curl -X GET "http://localhost:3000/api/notice-board?limit=invalid"
# Expected: Should handle gracefully

curl -X GET "http://localhost:3000/api/notice-board?offset=-1"  
# Expected: Should handle negative offset
```

### **7. Mobile Testing**

#### **Responsive Design Check**
- **iPhone SE**: Single column layout
- **iPad**: Two column layout  
- **Desktop**: Three column layout
- **Large Desktop**: Three column with more spacing

#### **Touch Interface**
- **Tap targets**: Cards should be easily tappable
- **Scrolling**: Smooth scrolling on mobile
- **Text readability**: All text should be readable without zooming

### **8. Browser Compatibility Testing**

Test in these browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Edge (latest)

### **9. Accessibility Testing**

```bash
# Check for ARIA labels and accessibility features
# Test with screen reader simulation
# Verify color contrast for priority badges
# Check keyboard navigation
```

## 🚨 **Common Issues to Watch For**

### **1. Environment Variables Missing**
```
Error: Missing Supabase environment variables
```
**Fix**: Ensure all required env vars are set

### **2. Database Table Doesn't Exist**
```
Error: relation "notice_board" does not exist
```
**Fix**: Run the migration script in Supabase

### **3. RLS Policy Blocking Access**
```
Error: new row violates row-level security policy
```
**Fix**: Check RLS policies allow public read access

### **4. Component Import Errors**
```
Error: Cannot resolve module 'NoticeBoard'
```
**Fix**: Verify component file exists and import path is correct

### **5. API Route Not Found**
```
Error: 404 Not Found for /api/notice-board
```
**Fix**: Ensure route.ts file is in correct location: `app/api/notice-board/route.ts`

## ✅ **Success Criteria**

### **Functional Requirements**
- [ ] Notice board displays dynamic data (not hardcoded)
- [ ] API endpoints work correctly
- [ ] Loading states display properly
- [ ] Error handling works
- [ ] Data loads from database

### **Technical Requirements**  
- [ ] TypeScript compilation succeeds
- [ ] No console errors or warnings
- [ ] API returns proper JSON responses
- [ ] Database queries are optimized
- [ ] Responsive design works

### **User Experience Requirements**
- [ ] Page loads quickly (< 3 seconds)
- [ ] Notice board displays clearly
- [ ] Priority indicators are visible
- [ ] Contact information is readable
- [ ] Mobile experience is smooth

## 🎯 **Testing Priority**

1. **High Priority**: Database migration, API endpoints, basic component rendering
2. **Medium Priority**: Error handling, responsive design, performance
3. **Low Priority**: Accessibility, browser compatibility, edge cases

Once all high priority tests pass, the notice board is ready for production! 🎉