# ProofLift Frontend Component

<h3>Presentation Component - User Interface Service</br><small>Software Architecture</br>2025-II</small></h3>

---

## 1. Component Overview

**ProofLift Frontend** is a **presentation component** in the distributed ProofLift architecture that provides the user interface for fitness tracking, social interaction, and exercise management using React framework with modern web technologies.

### 1.1. Technical Specifications

| Aspect | Technology |
|--------|------------|
| **Programming Language** | JavaScript (ES6+) |
| **Framework** | React 18.x + Vite |
| **Styling** | Tailwind CSS |
| **State Management** | React Hooks |
| **Routing** | React Router DOM |
| **Form Handling** | React Hook Form |
| **HTTP Client** | Fetch API |

### 1.2. Architectural Role

- **Component Type:** Presentation Component
- **Primary Function:** User interface and user experience management
- **Client Type:** Single Page Application (SPA)

### 1.3. Connectors Used

| Connector Type | Protocol | Purpose |
|----------------|----------|---------|
| **HTTP REST API** | HTTP/HTTPS | Communication with backend authentication service |
| **HTTP REST API** | HTTP/HTTPS | Communication with exercise suggestion service |
| **HTTP REST API** | HTTP/HTTPS | Communication with posts/social service |
| **LocalStorage** | Browser API | Token and user session management |

## 2. Project Structure

```
prooflift-fe/
├── public/
│   └── vite.svg                     # Application icons
├── src/
│   ├── API/
│   │   ├── auth.js                  # Authentication API calls
│   │   ├── exercises.js             # Exercise API calls
│   │   └── posts.js                 # Posts API calls
│   ├── components/
│   │   ├── exercise/
│   │   │   ├── ExerciseCard.jsx     # Exercise display component
│   │   │   └── ExerciseSearch.jsx   # Exercise search component
│   │   ├── login/
│   │   │   ├── InputCamp.jsx        # Form input component
│   │   │   └── FormInput.jsx        # Form wrapper component
│   │   ├── posts/
│   │   │   ├── PostCard.jsx         # Post display component
│   │   │   ├── ReactionsDetail.jsx  # Post reactions component
│   │   │   └── CreatePost.jsx       # Post creation component
│   │   └── ui/
│   │       ├── Header.jsx           # Navigation header
│   │       ├── Footer.jsx           # Application footer
│   │       └── Modal.jsx            # Modal dialog component
│   ├── constants/
│   │   └── reactions.js             # Post reaction definitions
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Posts.jsx                # Social feed page
│   │   ├── Exercises.jsx            # Exercise browser page
│   │   └── Profile.jsx              # User profile page
│   ├── styles/
│   │   └── index.css                # Global styles and Tailwind
│   ├── App.jsx                      # Main application component
│   └── main.jsx                     # Application entry point
├── Dockerfile                       # Container configuration
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.js                   # Vite build configuration
└── .env                             # Environment variables

```

## 3. Main Features

| Feature | Description | Components |
|---------|-------------|------------|
| **Authentication** | User login, registration, and session management | Login.jsx, Register.jsx, auth.js |
| **Social Feed** | Post creation, viewing, and interactions | Posts.jsx, PostCard.jsx, CreatePost.jsx |
| **Exercise Browser** | Exercise search, filtering, and details | Exercises.jsx, ExerciseCard.jsx, ExerciseSearch.jsx |
| **Responsive Design** | Mobile-first responsive interface | All components with Tailwind CSS |

## 4. Local Deployment Instructions

### 4.1. Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend services running (auth-be, suggest-be)

### 4.2. Environment Setup

```bash
# 1. Install dependencies
npm install

# 2. Install development dependencies
npm install --save-dev

```

### 4.3. Configuration

In the root directory you need to create two environment files:  

#### `.env.production`
This file is used when building and running the app in production.

```env
VITE_API_URL=http://localhost:8080
```


### 4.4. Development Server

```bash
# Start development server
npm run dev

# The application will be available at:
# http://localhost:5173
```

### 4.5. Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### 4.6. Docker Deployment

```bash
# Build Docker image
docker build -t prooflift-fe .

# Run container
docker run -p 5173:5173 prooflift-fe
```

## 5. API Integration

### 5.1. Authentication Service Integration

The frontend integrates with the authentication backend service through [`auth.js`](src/API/auth.js):

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `login(email, password)` | POST /auth/login | User authentication |
| `signup(nombre, email, password)` | POST /auth/register | User registration |

### 5.2. Exercise Service Integration

Exercise data is managed through [`exercises.js`](src/API/exercises.js):

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `getExercises(filters)` | GET /exercises | Exercise list with filters |
| `getExercise(id)` | GET /exercises/{id} | Exercise details |

### 5.3. Posts Service Integration

Social features are handled through [`posts.js`](src/API/posts.js) using GraphQL:

| Operation | Type | Purpose |
|-----------|------|---------|
| `getPosts` | Query | Fetch user posts |
| `createPost` | Mutation | Create new post |
| `deletePost` | Mutation | Delete user post |

## 6. Component Architecture

### 6.1. Page Components

| Component | Route | Description |
|-----------|-------|-------------|
| [`Login`](src/pages/Login.jsx) | `/` | User authentication page |
| [`SignUp`](src/pages/SignUp.jsx) | `/signup` | User registration page |
| [`Exercises`](src/pages/Exercises.jsx) | `/exercises` | Exercise browser with search and filters |
| [`InfoExercises`](src/pages/InfoExercises.jsx) | `/exercises/:id` | Detailed exercise information |
| [`Posts`](src/pages/Posts.jsx) | `/posts` | Social feed and post management |

### 6.2. Core Components

#### Authentication Components
- [`FormInput`](src/components/login/FormInput.jsx): Reusable form wrapper with validation
- [`InputCamp`](src/components/login/InputCamp.jsx): Form input fields with validation
- [`TitleLogin`](src/components/login/TitleLogin.jsx): Login page header component

#### Exercise Components
- [`ExerciseCard`](src/components/exercises/ExerciseCard.jsx): Exercise display card
- [`SearchBar`](src/components/exercises/SearchBar.jsx): Exercise search functionality
- [`MuscularGroupButton`](src/components/exercises/MuscularGroupButton.jsx): Muscle group filter buttons
- [`MuscleGroupCard`](src/components/infoExercises/MuscleGroupCard.jsx): Muscle group information display

#### Social Components
- [`PostCard`](src/components/posts/PostCard.jsx): Individual post display
- [`CreatePost`](src/components/posts/create/CreatePost.jsx): Post creation interface
- [`CommentSection`](src/components/posts/comments/CommentSection.jsx): Comment management
- [`ReactionBar`](src/components/posts/ReactionBar.jsx): Post reaction interface

#### Layout Components
- [`Header`](src/components/layout/Header.jsx): Navigation header with authentication
- [`Footer`](src/components/layout/Footer.jsx): Application footer

## 7. Styling and Design System

### 7.1. Tailwind CSS Configuration

Custom color palette defined in [`style.css`](src/style.css):

```css
@theme {
    --color-primary: #00DA78;      /* Green accent */
    --color-secondary: #FFFFFF;     /* White text */
    --color-tertiary: #303030;      /* Dark cards */
    --color-background: #191919;    /* Main background */
    --color-background-secondary: #0f2319; /* Header background */
}
```

### 7.2. Responsive Design

- **Mobile-first approach** with responsive breakpoints
- **Flexible layouts** using CSS Grid and Flexbox
- **Adaptive navigation** with mobile hamburger menu

### 7.3. Component Styling Classes

| Class | Purpose |
|-------|---------|
| `.button` | Primary button styling with hover effects |
| `.login` | Login form container responsive layout |
| `.h1__title` | Main heading typography |
| `.main__exercises` | Exercise page layout container |

## 8. State Management

### 8.1. Authentication State

- **Token storage**: localStorage for session persistence
- **Navigation guards**: Route protection based on authentication
- **User session**: Managed through React context and local storage

### 8.2. Application State

- **Exercise filters**: Local state for search and filtering
- **Post interactions**: Real-time updates for likes and comments
- **Form validation**: React Hook Form for input validation

## 9. Performance Optimization

### 9.1. Image Optimization

- **Exercise images**: WebP format for optimal loading
- **Lazy loading**: Images loaded on demand
- **Placeholder images**: Fallback images for missing content

### 9.2. Code Splitting

- **Dynamic imports**: Components loaded when needed
- **Bundle optimization**: Vite's built-in tree shaking
- **Asset optimization**: Automatic asset optimization in production

## 10. Security Considerations

### 10.1. Authentication Security

- **JWT tokens**: Secure token storage in localStorage
- **HTTPS enforcement**: Production deployment over HTTPS
- **Input validation**: Client-side and server-side validation

### 10.2. API Security

- **CORS configuration**: Proper origin restrictions
- **Token expiration**: Automatic logout on token expiry
- **Secure headers**: CSP and security headers in production

## 11. Development Guidelines

### 11.1. Code Structure

- **Component organization**: Logical grouping by feature
- **Naming conventions**: PascalCase for components, camelCase for functions
- **File structure**: Clear separation of concerns

### 11.2. Best Practices

- **Responsive design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Optimized loading and rendering


## 12. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Authentication service URL | `http://localhost:8080` |
| `VITE_SUGGEST_API_URL` | Exercise service URL | `http://localhost:8082` |
| `VITE_POSTS_API_URL` | Posts service URL | `http://localhost:8001` |
