# MYFC - Your Personal Facial Fitness App

MYFC is a modern, Progressive Web Application (PWA) built with Next.js 15.1.0 that helps users track and improve their facial fitness routines. The app provides a comprehensive platform for workout management, progress tracking, and personalized facial exercise routines.

## 🌟 Features

- **Progressive Web App (PWA)**
  - Installable on mobile devices
  - Offline functionality
  - Push notifications support

- **Authentication & User Management**
  - Secure login and signup
  - Password reset functionality
  - User profile management

- **Workout Management**
  - Browse workout library
  - Enhanced workout viewer
  - Video-based exercise instructions
  - Progress tracking
  - Workout scheduling
  - Favorites system

- **Movement Library**
  - Comprehensive facial exercise database
  - Detailed movement instructions
  - Video demonstrations
  - Area-specific targeting

- **Dashboard & Analytics**
  - Progress charts
  - Streak tracking
  - Monthly progress visualization
  - Recent activity tracking

- **Settings & Customization**
  - Notification preferences
  - Account management
  - Theme customization
  - Billing settings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chans00n/myfcv6.git
cd myfcv6
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- **Framework**: [Next.js 15.1.0](https://nextjs.org/) - React framework for production
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom animations
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
  - Custom shadcn/ui components
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Notifications**: Web Push API integration
- **Date Handling**: date-fns
- **Carousel**: Embla Carousel
- **Icons**: Lucide React

## 📱 PWA Features

- Installable on mobile devices
- Offline support
- Push notifications
- Responsive design
- Touch-optimized interface

## 🔒 Security

- Secure authentication system
- Protected API routes
- Environment variable protection
- Type-safe development with TypeScript

## 📂 Project Structure

```
myfcv6/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard views
│   ├── workout/           # Workout pages
│   └── settings/          # Settings pages
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── public/               # Static assets
│   └── icons/            # PWA icons
├── styles/               # Global styles
├── lib/                  # Utility functions
└── types/                # TypeScript types
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Authors

- **Chan Soon** - *Initial work* - [chans00n](https://github.com/chans00n)

## 🙏 Acknowledgments

- Radix UI team for the excellent component library
- Next.js team for the amazing framework
- All contributors and users of the application
