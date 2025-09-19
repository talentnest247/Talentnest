<!-- # Registration Page Documentation

## Overview

The Registration Page is a comprehensive user onboarding system for the University of Ilorin Artisan Community Platform. It allows both students and artisans to create accounts with role-specific information collection and includes Google OAuth integration for seamless authentication.

## 🏗️ Architecture & Components

### Main Files Structure
```
app/register/page.tsx                    # Main registration page component
components/auth/register-form.tsx        # Registration form component
app/api/auth/register/route.ts          # Backend registration API endpoint
contexts/auth-context.tsx               # Authentication state management
lib/auth-utils.ts                       # Authentication utilities
lib/database.types.ts                   # Database schema types
```

## 🎯 Features

### 1. **Dual Role Registration**
- **Students**: University students wanting to learn artisan skills
- **Artisans**: Skilled craftspeople wanting to teach/offer services

### 2. **Google OAuth Integration**
- One-click registration with Google account
- Seamless redirect flow via `/api/auth/signin/google`
- Fallback to email registration

### 3. **Progressive Form Design**
- Responsive layout with modern UI/UX
- Role-based conditional fields
- Real-time validation and error handling
- Password visibility toggle
- Glass morphism design effects

### 4. **Comprehensive Data Collection**

#### **Common Fields (All Users)**
- First Name & Last Name
- Email Address
- Phone Number
- Password (with confirmation)
- Role Selection (Student/Artisan)

#### **Student-Specific Fields**
- Student ID (e.g., 19/55HA001)
- Department (20+ predefined options + custom)
- Academic Level (100-500, Masters, PhD)

#### **Artisan-Specific Fields** 
- Business/Workshop Name
- Specialization (25+ categories across Fashion, Crafts, Tech, Food, Services)
- Years of Experience (1-10+ years with skill level indicators)
- Location (Ilorin areas, Kwara State, Online services)

## 🔧 Technical Implementation

### Frontend (`register-form.tsx`)

#### **State Management**
```typescript
const [formData, setFormData] = useState({
  // Common fields
  firstName: "", lastName: "", email: "", phone: "",
  password: "", confirmPassword: "", role: "",
  
  // Student fields
  studentId: "", department: "", customDepartment: "", level: "",
  
  // Artisan fields
  businessName: "", specialization: "", customSpecialization: "",
  experience: "", location: ""
})
```

#### **Validation Logic**
- Required field validation for role-specific data
- Password matching and minimum length (6 chars)
- Custom department/specialization validation when "Other" is selected
- Email format validation
- Phone number format validation

#### **Form Submission Flow**
1. Client-side validation (`validateForm()`)
2. Data preparation (role-specific filtering)
3. API call to `/api/auth/register`
4. Success: Redirect to profile page
5. Error: Display error message

### Backend (`app/api/auth/register/route.ts`)

#### **Registration Process**
1. **Input Validation**: Check required fields and role validity
2. **Duplicate Check**: Verify email doesn't exist in database
3. **Password Security**: Hash password using bcrypt
4. **User Creation**: Store user data in Supabase database
5. **JWT Generation**: Create authentication token
6. **Response**: Return user data and set secure HTTP-only cookie

#### **Database Schema Integration**
```typescript
// Users table structure
interface UserRow {
  id: string
  email: string
  password: string          // Bcrypt hashed
  first_name: string
  last_name: string
  full_name: string
  phone: string
  role: 'student' | 'artisan' | 'admin'
  student_id?: string       // Students only
  department?: string       // Students only
  level?: string           // Students only
  created_at: string
  updated_at: string
}
```

### Authentication Context (`auth-context.tsx`)

#### **State Management**
- Global authentication state
- User session persistence
- Loading states during authentication
- Automatic session restoration on page reload

#### **Key Methods**
- `register()`: Handles registration API calls
- `login()`: Handles login functionality
- `logout()`: Clears session and redirects
- `refreshUser()`: Updates user data

## 🎨 UI/UX Features

### **Visual Design**
- **Glass morphism effects**: Backdrop blur and transparency
- **Gradient backgrounds**: Blue to purple to pink color scheme
- **Responsive layout**: Mobile-first design approach
- **University branding**: UNILORIN logo and color scheme
- **Smooth animations**: Fade-in and slide-in effects

### **User Experience**
- **Role-based sections**: Dynamic form sections based on selected role
- **Visual indicators**: Color-coded role selection and progress
- **Clear navigation**: Prominent CTA buttons and navigation links
- **Error handling**: Contextual error messages and validation feedback
- **Loading states**: Animated loading indicators during submission

### **Accessibility**
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Proper ARIA labels and descriptions
- **High contrast**: Clear visual hierarchy and readable text
- **Focus management**: Clear focus indicators

## 📊 Data Flow Diagram

```
User Input → Form Validation → API Request → Database Check → 
Password Hashing → User Creation → JWT Generation → 
Cookie Setting → Success Response → Profile Redirect
```

## 🔐 Security Features

### **Password Security**
- Minimum 6 characters requirement
- Bcrypt hashing with salt rounds
- Password confirmation validation
- No plain text storage

### **Session Management**
- HTTP-only cookies (XSS protection)
- Secure flag for HTTPS in production
- SameSite attribute for CSRF protection
- 7-day expiration with automatic renewal

### **Input Validation**
- Server-side validation for all inputs
- SQL injection prevention via parameterized queries
- Email format validation
- Role-based data validation

### **OAuth Security**
- Secure redirect URIs
- State parameter validation
- Token verification
- Authorized domain restrictions

## 🚀 Setup & Configuration

### **Environment Variables Required**
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT & NextAuth
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
```

### **Google OAuth Setup**
Follow the comprehensive guide in `GOOGLE_OAUTH_SETUP.md` for:
- Google Cloud Console project setup
- OAuth consent screen configuration
- Authorized domains and redirect URIs
- API credentials generation

## 🧪 Testing & Quality Assurance

### **Manual Testing Checklist**

#### **Student Registration**
- [ ] Form displays student-specific fields when "Student" role selected
- [ ] Student ID validation (format: XX/XXHAXX)
- [ ] Department selection with custom option
- [ ] Academic level selection (100-PhD)
- [ ] Successful registration and profile redirect

#### **Artisan Registration**
- [ ] Form displays artisan-specific fields when "Artisan" role selected
- [ ] Business name validation
- [ ] Specialization categories and custom option
- [ ] Experience level selection
- [ ] Location selection (Ilorin areas)
- [ ] Successful registration and profile redirect

#### **Google OAuth Flow**
- [ ] "Continue with Google" button functionality
- [ ] Proper redirect to Google consent screen
- [ ] Successful callback handling
- [ ] User creation in database
- [ ] Session establishment

#### **Error Handling**
- [ ] Duplicate email registration prevention
- [ ] Password mismatch validation
- [ ] Network error handling
- [ ] Server error responses
- [ ] Form field validation messages

### **API Testing Commands**
```bash
# Test registration endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@unilorin.edu.ng",
    "phone": "+2348123456789",
    "password": "password123",
    "role": "student",
    "studentId": "21/55HA001",
    "department": "Computer Science",
    "level": "400"
  }'

# Test OAuth status
curl http://localhost:3000/api/auth/oauth-status
```

## 🐛 Common Issues & Troubleshooting

### **OAuth Issues**
- **"oauth_not_configured"**: Check GOOGLE_CLIENT_ID environment variable
- **"redirect_uri_mismatch"**: Verify Google Console redirect URI settings
- **"This app isn't verified"**: Normal for development, click "Advanced" to proceed

### **Registration Failures**
- **"User already exists"**: Check database for existing email
- **"Missing required fields"**: Verify all role-specific fields are filled
- **"Failed to create user"**: Check Supabase connection and permissions

### **Database Issues**
- **Connection errors**: Verify Supabase environment variables
- **Permission errors**: Check service role key permissions
- **Schema mismatches**: Ensure database schema matches types

## 📝 Development Guidelines

### **Adding New Fields**
1. Update `formData` state in `register-form.tsx`
2. Add form field UI components
3. Update validation logic in `validateForm()`
4. Modify API handler to process new fields
5. Update database schema if needed
6. Update TypeScript interfaces

### **Styling Guidelines**
- Use Tailwind CSS utility classes
- Follow existing color scheme (blue/purple/pink gradients)
- Maintain glass morphism design pattern
- Ensure responsive design for all screen sizes
- Test dark mode compatibility

### **Code Organization**
- Keep components focused and single-purpose
- Extract reusable validation logic
- Use TypeScript for type safety
- Follow Next.js file-based routing conventions
- Maintain consistent error handling patterns

## 📊 Database Schema Details

### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  profile_image TEXT,
  student_id VARCHAR(20),      -- Students only
  department VARCHAR(100),     -- Students only  
  level VARCHAR(20),          -- Students only
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Providers Table** (Future Artisan Profiles)
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  business_name VARCHAR(255) NOT NULL,
  specialization TEXT[] NOT NULL,
  experience INTEGER NOT NULL,
  location VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT false,
  verification_status verification_status DEFAULT 'pending',
  -- Additional provider-specific fields...
);
```

## 🔄 Future Enhancements

### **Planned Features**
- **Email verification**: Send confirmation emails before account activation
- **Two-factor authentication**: SMS or app-based 2FA for enhanced security
- **Social media login**: Facebook, Twitter, LinkedIn integration
- **Profile completion wizard**: Step-by-step profile setup after registration
- **Skill verification**: Upload certificates/portfolios for artisans
- **Advanced validation**: Real-time email/phone validation APIs

### **UI/UX Improvements**
- **Multi-step form**: Break long form into manageable steps
- **Progress indicator**: Show completion percentage
- **Field auto-complete**: Smart suggestions for departments/locations
- **Rich media upload**: Profile pictures during registration
- **Advanced animations**: More sophisticated micro-interactions

## 📞 Support & Maintenance

### **Key Contacts**
- **Frontend Development**: Registration form and UI components
- **Backend Development**: API endpoints and authentication logic
- **Database Administration**: Schema management and optimization
- **DevOps**: Environment configuration and deployment

### **Monitoring & Analytics**
- Track registration conversion rates
- Monitor OAuth success rates
- Log and analyze error patterns
- Measure form abandonment points
- Monitor database performance

---

## 📋 Quick Reference

### **File Locations**
- **Main Page**: `app/register/page.tsx`
- **Form Component**: `components/auth/register-form.tsx` 
- **API Handler**: `app/api/auth/register/route.ts`
- **Auth Context**: `contexts/auth-context.tsx`
- **Types**: `lib/database.types.ts`

### **Key Dependencies**
- **Next.js 14**: Framework and routing
- **React 18**: UI components and state management
- **Tailwind CSS**: Styling and responsive design
- **Supabase**: Database and authentication
- **Jose**: JWT token handling
- **Bcrypt**: Password hashing
- **Lucide React**: Icons and UI elements

### **Environment Setup**
1. Clone repository
2. Install dependencies: `pnpm install`
3. Configure environment variables
4. Setup Google OAuth (see GOOGLE_OAUTH_SETUP.md)
5. Initialize Supabase database
6. Start development server: `pnpm dev`

This registration system provides a robust, secure, and user-friendly onboarding experience for the UNILORIN Artisan Community Platform, supporting both students and artisans with comprehensive data collection and modern authentication features. -->
