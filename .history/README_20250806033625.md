# Social Media Feed App

A Twitter-style social media feed built with React and TypeScript. This project started as a learning exercise for MVVM architecture and evolved into a full-featured feed application.

## What I Built

I wanted to create a social media feed that felt real and responsive. The app includes:

- **Real-time feed updates** with pull-to-refresh and infinite scrolling
- **Multiple post types** - text, images, polls, events, and articles
- **Interactive features** like voting on polls and attending events
- **Responsive design** that works on mobile and desktop
- **Offline support** with proper error handling

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Vite
- **State Management**: Custom MVVM pattern with reactive observables

## Architecture

I chose MVVM (Model-View-ViewModel) because it keeps the UI separate from business logic. Here's how it's structured:

- **Models**: Data structures and business rules
- **Views**: React components for the UI
- **ViewModels**: Handle state and user interactions

The reactive system uses a custom Observable implementation that works like Combine or RxJS.

## Key Features

### Feed Functionality

- Display posts with text, images, and user info
- Pull-to-refresh with visual feedback
- Infinite scrolling when you reach the bottom
- Real-time online/offline status

### Post Types

- **Text posts** with hashtags and mentions
- **Image posts** with media galleries
- **Video posts** with thumbnails
- **Polls** with interactive voting
- **Events** with attendance tracking
- **Articles** with rich previews
- **Quote posts** via plugin system

```
Open http://localhost:8082

## Project Structure

```

src/
├── components/
│ ├── feed/ # Feed components
│ └── ui/ # Reusable UI components
├── models/ # Data models
├── viewmodels/ # MVVM ViewModels
├── services/ # Business logic
├── plugins/ # Plugin system
└── pages/ # Page components

```



```
