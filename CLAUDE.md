# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production application (includes commit hash and build time)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run Jest tests
- `npm test:watch` - Run Jest tests in watch mode
- `npm test:coverage` - Run Jest tests with coverage report
- `npm run codegen` - Generate GraphQL types from schema

## Architecture Overview

This is a Next.js application for an energy dashboard system that manages electricity billing, contracts, and transfer documents. The app uses TypeScript throughout and follows a modular component-based architecture.

### Key Technologies
- **Framework**: Next.js 15 with React 18
- **Styling**: Material-UI (MUI) with custom theme
- **Data Layer**: Apollo Client for GraphQL with TypeScript codegen
- **Authentication**: Custom auth context with JWT-based authentication
- **Forms**: React Hook Form with Yup validation
- **Testing**: Jest with React Testing Library
- **Build**: Custom webpack config for SVG handling

### Project Structure

- `pages/` - Next.js pages using file-based routing
- `components/` - Reusable UI components organized by feature
- `core/` - Core application logic including GraphQL operations and context
- `config/` - Configuration files for theme, menu, and application settings
- `utils/` - Utility functions and custom hooks
- `styles/` - Global CSS and component styles

### Component Architecture

Components are organized by domain (e.g., `Company/`, `UserContract/`, `IndustryBill/`) and follow consistent patterns:
- Dialog components for create/edit operations with form validation
- Panel components for data display with tables and charts
- Custom hooks for GraphQL operations in `utils/hooks/`
- Shared UI components in base directories

### GraphQL Integration

- Schema codegen generates types in `core/graphql/types.ts`
- Operations are split into `queries/` and `mutations/` directories
- Fragment definitions in `core/graphql/fragment/` for reusable field sets
- Custom hooks wrap Apollo operations with error handling and loading states

### Authentication Flow

- `AuthProvider` context manages authentication state
- `AuthGuard` component protects authenticated routes
- JWT token management with automatic refresh
- Role-based access control throughout the application

### Form Handling

- Consistent form patterns using React Hook Form
- Shared field configuration objects for complex forms
- Custom input components with Material-UI integration
- Dialog-based forms for CRUD operations

### Testing Setup

- Jest configuration with jsdom environment
- Path aliases mapped to project structure
- Coverage thresholds set at 70% for all metrics
- Test files located in `__tests__/` directories or `.test.tsx` files

## Development Notes

- The application connects to a staging GraphQL API at `https://api-staging.annealenergy.com/graphql`
- Uses custom webpack configuration for SVG imports as React components
- Material-UI theme customization in `config/theme/`
- Error boundaries implemented for component-level error handling
- Progress indicators using nprogress for route transitions