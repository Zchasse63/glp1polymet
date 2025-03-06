
# Health Insights Application

A comprehensive health tracking and insights application built following the CodeFarm Development Methodology.

## Project Overview

This application helps users track health metrics, manage medications, and gain personalized insights about their health data. It combines robust error handling, accessibility features, and a modular component architecture to deliver a seamless user experience.

## CodeFarm Development Methodology

This project implements the CodeFarm Development Methodology which integrates:

- **Holistic Development**: Combining technical excellence with strategic thinking
- **Continuous Learning**: Embracing emerging technologies and methodologies
- **User-Centric Design**: Prioritizing end-user experience in every development stage
- **Sustainable Code**: Creating maintainable, scalable, and efficient solutions

The codebase is structured around these key personas:
- **CodeFarmer**: Strategic project architecture and innovation
- **Programmatron**: Technical implementation and patterns
- **CritiBot**: Quality assurance and optimization

## Key Features

- Health metrics tracking and visualization
- Medication management and reminders
- AI-powered insights and correlations
- Personalized recommendations
- Comprehensive accessibility support
- Robust error handling and logging

## Technology Stack

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Shadcn UI, Tailwind CSS
- **State Management**: React Query, Context API
- **Charting**: Recharts
- **Authentication**: Supabase Auth
- **Data Storage**: Supabase PostgreSQL

## Project Structure

The application follows a modular, component-based architecture:

```
src/
├── components/      # UI components organized by feature
├── hooks/           # Custom React hooks
├── contexts/        # React context providers
├── utils/           # Utility functions and helper modules
├── types/           # TypeScript type definitions
├── lib/             # External library integrations
├── pages/           # Route components
├── routes/          # Routing configuration
├── services/        # API and service integrations
├── architecture/    # Architecture documentation
```

## Development Setup

Follow these steps to set up the project locally:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Architectural Documentation

For more details about the application architecture, refer to:

- [Core Architecture](./src/architecture/CoreArchitecture.md)
- [Quality Standards](./src/architecture/QualityStandards.md)
- [Accessibility Guidelines](./src/architecture/AccessibilityGuidelines.md)
- [Component Patterns](./src/architecture/component-patterns/README.md)
- [Architectural Decision Records](./src/architecture/ADR.md)

## Error Handling Framework

The application implements a comprehensive error handling framework:

- Centralized error logging
- Structured error objects with severity levels
- User-friendly notifications
- Analytics integration
- Error boundaries for UI resilience

## Accessibility Features

We prioritize accessibility through:

- ARIA compliance
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion accommodations
- High contrast mode support

## Deployment

This project can be deployed using:

1. **Lovable Platform**: Click on the Deploy button in the Lovable interface.
2. **Custom Deployment**: Export to GitHub and deploy to your preferred hosting service.

## Contributing

For contribution guidelines, please see [CONTRIBUTING.md](./src/architecture/CONTRIBUTING.md).

## License

[License information]
