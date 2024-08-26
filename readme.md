## Installation and Setup

## Prerequisites:

Before setting up the project, ensure that you have the following installed:
--> node.js (v14 or later)
--> npm (Node Package Manager)
--> MongoDB (either local installation or MongoDB Atlas for a cloud database)

## Installation Steps

--> Clone the Repository
--> Install Dependencies
--> Set Up Environment Variables
--> Run the Application:

    Start the application using npm:
    ```npm start```

## Access the API:

You can use tools like Postman or cURL to interact with the API. Endpoints include:

User Registration and Login: /api/users/register, /api/users/login
Book and Author Management: /api/books, /api/authors
Borrowing and Returning Books: /api/books/borrow, /api/books/return
Audit Logs: /api/audit-logs

## Project Features

## User Management:

Users can register, log in, and access the system based on their roles (e.g., admin, user).
Passwords are securely hashed using bcrypt before being stored in the database.
Role-based access control (RBAC) ensures that only authorized users can access specific features.

## Book and Author Management:

CRUD operations for books and authors, including the ability to associate books with authors.
Users can borrow and return books, with the system ensuring that a user cannot borrow the same book twice without returning it first.
A maximum borrow limit is enforced to prevent users from borrowing more than a predefined number of books simultaneously.

## Audit Logging:

All significant user actions, such as logging in, borrowing books, and returning books, are logged with timestamps.
The audit log retrieval system supports filtering by date range, user, and action type, with pagination to handle large datasets.

## Security:

JWT-based authentication secures API endpoints.
Role-based access control ensures that only users with appropriate roles can perform certain actions.
Passwords are stored securely using bcrypt hashing.
