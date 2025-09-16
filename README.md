# TalentNest - University of Ilorin Skills Marketplace

A professional marketplace platform connecting University of Ilorin students to showcase skills, offer services, and collaborate within the campus community.

## 🎓 About TalentNest

TalentNest is specifically designed for University of Ilorin (UNILORIN) students to:
- Showcase their skills and build portfolios
- Offer services to fellow students
- Find talented peers for projects
- Build trust through verified student community
- Connect via WhatsApp for seamless communication

## 🚀 Features

### For Service Providers
- **Student Verification**: Register with UNILORIN matric number
- **Skill Showcase**: Create detailed service listings
- **Portfolio Building**: Upload work samples and build reputation
- **Direct Communication**: WhatsApp integration for client contact
- **Rating System**: Build trust through peer reviews

### For Service Seekers
- **Browse Services**: Explore categorized student services
- **Advanced Search**: Filter by category, price, rating, and availability
- **Secure Booking**: Book services with integrated communication
- **Review System**: Rate and review service providers

### Platform Features
- **Admin Dashboard**: Comprehensive platform management
- **User Management**: Student verification and moderation
- **Service Oversight**: Content moderation and quality control
- **Analytics**: Platform usage and performance metrics
- **Mobile Responsive**: Optimized for all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth with Row Level Security
- **Deployment**: Vercel (recommended)
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Supabase account (free tier available)

## 🔧 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd talentnest
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Application Configuration
SITE_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
\`\`\`

### 4. Database Setup
Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
1. `01-create-tables.sql` - Creates all necessary tables and types
2. `02-setup-rls.sql` - Sets up Row Level Security policies
3. `03-seed-data.sql` - Seeds initial data (categories, etc.)

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add your Supabase environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

### Manual Deployment

1. **Build the Application**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start Production Server**:
   \`\`\`bash
   npm start
   \`\`\`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `SITE_URL` | Application URL | Yes |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Analytics ID | No |

## 📁 Project Structure

\`\`\`
talentnest/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── marketplace/       # Service marketplace
│   └── ...
├── components/            # Reusable components
│   ├── navigation/        # Header, footer, navigation
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client configurations
│   ├── storage.ts        # Local storage utilities
│   ├── types.ts          # TypeScript types
│   └── validation.ts     # Form validation
├── public/               # Static assets
└── scripts/              # Database SQL scripts
\`\`\`

## 🎯 Usage

### For Students (Service Providers)
1. **Register**: Sign up with your UNILORIN matric number
2. **Complete Profile**: Add skills, bio, and contact information
3. **Create Services**: List your skills as bookable services
4. **Manage Bookings**: Accept/decline requests via dashboard
5. **Build Reputation**: Collect reviews and ratings

### For Students (Service Seekers)
1. **Browse**: Explore available services by category
2. **Search**: Use filters to find specific skills
3. **Contact**: Reach out via WhatsApp integration
4. **Book**: Request services through the platform
5. **Review**: Rate your experience

### For Administrators
1. **User Management**: Verify and manage student accounts
2. **Content Moderation**: Review and approve services
3. **Platform Analytics**: Monitor usage and performance
4. **Support**: Handle disputes and user issues

## 🔒 Security Features

- **Student Verification**: UNILORIN matric number validation
- **Row Level Security**: Database-level access control
- **Secure Authentication**: Supabase Auth with JWT tokens
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API endpoint protection
- **Data Encryption**: Secure password hashing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- University of Ilorin student community
- Supabase for backend infrastructure
- shadcn/ui for the component library
- Vercel for hosting and deployment

---

**Built with ❤️ for the University of Ilorin community**
