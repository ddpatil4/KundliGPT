# Overview

This is a Hindi Kundli Insight web application that provides astrological guidance in Hindi using modern web technologies. The application generates personalized kundli reports based on user birth data and provides practical life guidance without making guaranteed predictions. It's designed to be production-ready, mobile-first, and AdSense-friendly.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Client-side routing with Wouter library for lightweight navigation
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom Hindi fonts (Noto Sans Devanagari) and warm orange/amber color scheme
- **State Management**: React Query for server state management and React Hook Form for form handling
- **Responsive Design**: Mobile-first approach with dedicated mobile components and layouts

## Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful endpoints with structured error handling and logging
- **Rate Limiting**: In-memory rate limiter (10 requests per 10 minutes per IP)
- **Data Validation**: Zod schemas for request/response validation
- **Development Setup**: Hot module replacement with Vite integration for development

## Data Storage Solutions
- **Primary Database**: PostgreSQL configured via Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Local Storage**: Client-side form data persistence for user convenience

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Rate Limiting**: IP-based request throttling for API protection
- **Data Privacy**: No user accounts, minimal data collection approach

## Form and Validation System
- **Form Management**: React Hook Form with Zod validation
- **Multilingual Support**: Hindi labels with English field names
- **Location Services**: City search with coordinates lookup for major Indian cities
- **Data Persistence**: Browser localStorage for form state recovery

## External Dependencies

### AI Services
- **OpenAI API**: GPT integration for generating kundli insights and interpretations
- **API Key Management**: Environment variable configuration for secure key storage

### UI and Styling Libraries
- **Radix UI**: Complete set of accessible UI primitives (dialogs, forms, navigation)
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

### Development and Build Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **ESBuild**: JavaScript bundler for production builds
- **TypeScript**: Type safety across client, server, and shared code
- **Drizzle Kit**: Database schema management and migrations

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database queries and schema definitions
- **PostgreSQL**: Production database with UUID primary keys

### Deployment and Performance
- **Replit Integration**: Custom plugins for development environment
- **SEO Optimization**: Meta tags, structured data, and Hindi language support
- **Print Support**: CSS optimizations for PDF generation and printing
- **Font Loading**: Google Fonts integration with preload optimization

The architecture emphasizes simplicity, performance, and accessibility while maintaining cultural sensitivity for Hindi-speaking users. The application avoids making medical, financial, or guaranteed predictions, focusing instead on respectful guidance and insights.