# Notes App

A full-stack web application for creating, organizing, and managing notes with features like tagging, searching, and pinning important notes.

## Features

- **User Authentication**: Secure login and signup
- **Create Notes**: Create rich text notes with a modern editor
- **Organize**: Pin important notes and add tags for organization
- **Search**: Quickly find notes with the search feature
- **Dark Mode**: Toggle between light and dark mode for comfortable viewing
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Zustand for state management
- React Hot Toast for notifications
- React Icons for UI components
- ReactQuill for rich text editing
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Cors for cross-origin requests

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas connection)

### Steps to run the application

1. Clone the repository
   ```bash
   git clone https://github.com/MunnaKumar32990/NotesApp.git
   cd NotesApp
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd Backend
   npm install
   ```

4. Setup environment variables
   - Create a `.env` file in the `Backend` directory
   - Add the following variables:
     ```
     ACCESS_TOKEN_SECRET=your_secret_key
     connectionString=your_mongodb_connection_string
     ```

5. Start the backend server
   ```bash
   cd Backend
   npm start
   ```

6. Start the frontend development server
   ```bash
   # From the root directory
   npm run dev
   ```

7. The application will be available at `http://localhost:3000`

## Deployment

The application can be deployed using platforms like Vercel (frontend) and Render/Heroku (backend).

## License

MIT License

## Author

Munna Kumar
