# Pixabay Favorites

A full-stack application that allows users to search and save their favorite images and videos from the Pixabay API.

## 📋 Features

- **User Authentication**: Secure registration and login system
- **Pixabay Content Search**: Search for photos and videos from Pixabay
- **Favorites Management**: Save and organize your favorite Pixabay content
- **Responsive UI**: Clean, mobile-friendly interface 

## 🔧 Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **TypeScript** for type-safe code
- **PostgreSQL** database
- **Sequelize ORM** for database interactions
- **JWT** for authentication
- **Joi** for request validation and type conversion
- **Docker** and **Docker Compose** for containerization

### Frontend
- **HTML5/CSS3** for structure and styling
- **Vanilla JavaScript** for interactivity

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Pixabay API key](https://pixabay.com/api/docs/) (free to obtain)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/pixabay-favorites.git
cd pixabay-favorites
```

2. **Environment Setup**

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
DB_HOST=postgres
DB_PORT=5432
POSTGRES_DB=pixabay_favorites
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_key
PIXABAY_API_KEY=your_pixabay_api_key
```

Remember to replace `your_jwt_secret_key` with a strong secret and `your_pixabay_api_key` with your Pixabay API key.

3. **Start the application with Docker**

```bash
docker-compose up
```

This will start the backend server and PostgreSQL database. The application will be available at `http://localhost:5000`.

### Running Without Docker

If you prefer to run without Docker:

1. **Install dependencies**

```bash
npm install
```

2. **Set up PostgreSQL**

Make sure you have PostgreSQL installed and running. Update the `.env` file with your PostgreSQL connection details.

3. **Run the development server**

```bash
npm run dev
```

4. **Or build and run the production version**

```bash
npm run build
npm start
```

## 📚 API Documentation

### Authentication Endpoints

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ "email": "user@example.com", "password": "StrongP@ssw0rd" }`
  - Response: `{ "token": "jwt_token" }`

- **POST /api/auth/login**
  - Login a user
  - Body: `{ "email": "user@example.com", "password": "StrongP@ssw0rd" }`
  - Response: `{ "token": "jwt_token" }`

### Search Endpoints

- **GET /api/search**
  - Search Pixabay content
  - Query params:
    - `query`: Search term
    - `type`: "photo" or "video"
    - `page`: Page number (default: 1)
    - `per_page`: Results per page (default: 20)
  - Headers: `x-auth-token: jwt_token`
  - Response: Paginated search results

### Favorites Endpoints

- **GET /api/favorites**
  - Get user's favorites
  - Query params:
    - `page`: Page number (default: 1)
    - `per_page`: Results per page (default: 20)
  - Headers: `x-auth-token: jwt_token`
  - Response: Paginated favorites

- **GET /api/favorites/ids**
  - Get IDs of favorited content
  - Headers: `x-auth-token: jwt_token`
  - Response: `{ "favoritedIds": ["123", "456"] }`

- **POST /api/favorites**
  - Add content to favorites
  - Headers: `x-auth-token: jwt_token`
  - Body: Content data to favorite
  - Response: Favorite object

- **DELETE /api/favorites/:contentId**
  - Remove content from favorites
  - Headers: `x-auth-token: jwt_token`
  - Response: Success message

## 🛡️ Validation Strategy

This project uses **Joi** for robust request validation:

- **Centralized Schemas**: All validation rules are defined in schema files for consistency
- **Automatic Type Conversion**: Query parameters are automatically converted to appropriate types
- **Descriptive Error Messages**: User-friendly validation errors are returned to the client
- **Middleware Approach**: Validation happens before request handlers, keeping controllers clean

Validation schemas can be found in the `src/schemas` directory, with separate files for auth, search, and favorites endpoints.

## 🧪 Testing

To be implemented...

## 🛠️ Project Structure

```
pixabay-favorites/
├── frontend/                 # Frontend static files
│   ├── css/                  # Stylesheets
│   │   └── styles.css
│   ├── js/                   # JavaScript files
│   │   └── main.js
│   └── index.html            # Main HTML page
├── src/                      # Backend TypeScript source files
│   ├── config/               # Configuration files
│   │   └── database.ts       # Database configuration
│   ├── controllers/          # Request handlers
│   │   ├── authController.ts
│   │   ├── favoritesController.ts
│   │   └── searchController.ts
│   ├── middleware/           # Middleware functions
│   │   └── auth.ts           # Authentication middleware
│   ├── models/               # Database models
│   │   ├── Favorite.ts
│   │   ├── User.ts
│   │   └── index.ts
│   ├── routes/               # API routes
│   │   ├── auth.ts
│   │   ├── favorites.ts
│   │   └── search.ts
│   ├── schemas/              # Joi validation schemas
│   │   ├── auth.schema.ts
│   │   ├── favorites.schema.ts
│   │   └── search.schema.ts
│   ├── types/                # TypeScript type definitions
│   │   └── interfaces.ts
│   └── server.ts             # Main server file
├── .dockerignore
├── .gitignore
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker configuration
├── nodemon.json              # Nodemon configuration
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Dependency lock file
├── README.md                 # Project documentation
└── tsconfig.json             # TypeScript configuration
```

## 📮 Contact

Tommaso Bilancia - tommaso.bila@gmail.com

Project Link: [https://github.com/yourusername/pixabay-favorites](https://github.com/yourusername/pixabay-favorites)

