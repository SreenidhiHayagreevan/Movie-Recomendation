# User Authentication Backend

A Node.js Express backend with MongoDB for user authentication.

## Features

- User registration and authentication
- JWT-based authentication
- MongoDB database integration
- Secure password storage with bcrypt
- Protected routes

## Setup Instructions

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/userdb
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=30d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Deployment to AWS

#### Option 1: AWS Amplify

1. Connect your repository to AWS Amplify
2. Configure environment variables in the Amplify Console
3. Deploy using the provided amplify.yml configuration file

#### Option 2: AWS Elastic Beanstalk

1. Initialize Elastic Beanstalk in your directory:
   ```
   eb init
   ```

2. Create an environment:
   ```
   eb create
   ```

3. Configure environment variables in the Elastic Beanstalk Console

4. Deploy:
   ```
   eb deploy
   ```

#### Option 3: AWS Lambda + API Gateway

1. Create a Lambda function
2. Set up API Gateway to route requests to your Lambda function
3. Configure environment variables in the Lambda Console
4. Deploy using AWS SAM or serverless framework

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (Protected)

- `POST /api/auth/logout` - Logout user 