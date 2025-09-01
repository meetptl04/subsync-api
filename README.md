# SubSync API

SubSync is a robust backend API for managing user subscriptions. It provides a comprehensive set of features for handling users, authentication, subscription plans, and automated renewal reminders. Built with Node.js and Express, it offers a secure and scalable solution for any application requiring subscription management.

## Features

- **User Authentication:** Secure sign-up and sign-in using JWT.
- **User Management:** CRUD operations for user profiles.
- **Subscription Management:** Create, read, update, and delete subscriptions.
- **Cancel Subscriptions:** Endpoint to handle subscription cancellations.
- **Renewal Reminders:** Automated email reminders for upcoming subscription renewals using Upstash & Nodemailer.
- **Security:** Rate limiting and bot protection with Arcjet.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Arcjet
- **Workflow Automation:** Upstash (QStash)
- **Email:** Nodemailer

## Project Structure

```
.
├── app.js
├── config/
│   ├── arcjet.js
│   ├── env.js
│   ├── nodemailer.js
│   └── upstash.js
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js
├── middleware/
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── subscription.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── utils/
│   ├── email-template.js
│   └── send-email.js
├── package.json
└── README.md
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- MongoDB instance (local or cloud-based)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/<your-github-username>/subsync-api.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd subsync-api
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.development.local` file in the root of the project and add the following environment variables.

```
# Server Configuration
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000

# Database
DB_URI=<your_mongodb_connection_string>

# JWT
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1d

# Arcjet (for security)
ARCJET_KEY=<your_arcjet_site_key>

# Upstash (for workflows)
QSTASH_TOKEN=<your_qstash_token>
QSTASH_URL=<your_qstash_url>

# Nodemailer (for sending emails)
ACCOUNT_EMAIL=<your_email_address>
EMAIL_PASSWORD=<your_email_password>
```

### Running the Application

-   To run the server in development mode (with hot-reloading):
    ```bash
    npm run dev
    ```
-   To run the server in production mode:
    ```bash
    npm start
    ```

## API Endpoints

The API is versioned under `/api/v1`.

### Auth

-   `POST /auth/sign-up`: Register a new user.
-   `POST /auth/sign-in`: Log in a user and receive a JWT.

### Users

-   `GET /users`: Get a list of all users.
-   `GET /users/:id`: Get a single user by ID.
-   `PUT /users/:id`: Update a user's information.
-   `DELETE /users/:id`: Delete a user.

### Subscriptions

-   `POST /subscriptions`: Create a new subscription.
-   `GET /subscriptions/user/:id`: Get all subscriptions for a specific user.
-   `GET /subscriptions/:id`: Get a single subscription by ID.
-   `PUT /subscriptions/:id`: Update a subscription.
-   `DELETE /subscriptions/:id`: Delete a subscription.
-   `PUT /subscriptions/:id/cancel`: Cancel a subscription.
-   `GET /subscriptions/:id/upcoming-renewals`: Get a list of upcoming renewals for a subscription.

### Workflows

-   `POST /workflows/subscription/reminder`: Trigger the workflow to send subscription reminders. This is likely called by a scheduler like Upstash Cron.
