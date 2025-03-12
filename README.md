# Barbershop Scheduler

A modern, React-based scheduling application designed for barbershops and hair salons. This application helps manage appointments, services, staff, and clients with an intuitive and responsive user interface.

## Features

### Appointments
- Schedule and manage appointments
- View daily, weekly, and monthly calendar views
- Drag-and-drop appointment scheduling
- Appointment status tracking
- Client history and preferences

### Services
- Comprehensive service management
- Categorized service listings
- Real-time search and filtering
- Sort by name, price, or duration
- Active/Inactive service status
- Service statistics dashboard
- Category-based organization

### Staff Management (Coming Soon)
- Staff profiles and schedules
- Skill sets and specializations
- Availability tracking
- Performance metrics

### Client Management (Coming Soon)
- Client profiles and history
- Appointment preferences
- Contact information
- Service history

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd scheduler-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
scheduler-app/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   ├── services/      # Service-related components
│   │   └── appointments/  # Appointment-related components
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Appointments.tsx
│   │   ├── Services.tsx
│   │   └── ...
│   ├── types/             # TypeScript type definitions
│   ├── theme/             # MUI theme customization
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Application entry point
├── public/               # Static assets
└── package.json         # Project dependencies and scripts
```

## Technology Stack

- **React**: Frontend library
- **TypeScript**: Type-safe JavaScript
- **Material-UI**: UI component library
- **React Router**: Navigation and routing
- **Formik**: Form management
- **Yup**: Form validation
- **date-fns**: Date manipulation

## Features in Detail

### Services Page
- **Service Cards**: Display service information with category color coding
- **Statistics Dashboard**: Shows total services, active services, average price, and popular categories
- **Search & Filter**: 
  - Real-time search by name or description
  - Category-based filtering with color-coded chips
  - Advanced sorting options (name, price, duration)
- **Service Management**:
  - Add new services
  - Edit existing services
  - Toggle service status
  - Delete services with confirmation

### Appointments Page (In Progress)
- Calendar view for appointment scheduling
- Time slot management
- Service duration handling
- Client assignment
- Status tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
