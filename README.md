# Task Manager Application

This is a full-stack task management application with a React/Next.js frontend and a Node.js/Express backend.

## Project Structure

-   `/client`: Contains the Next.js frontend application.
-   `/task-manager`: Contains the Node.js, Express, and Prisma backend application.

## Setup and Running the Application

### Backend (Task Manager)

1.  Navigate to the `task-manager` directory:
    ```bash
    cd task-manager
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Set up your database connection in the `.env` file. You will need a PostgreSQL database. A sample `.env` file would look like this:
    ```
    DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
    JWT_SECRET="your-secret-key"
    ```
4.  Run the database migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### Frontend (Client)

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Features and Recent Changes

This project is a complete task management solution. Here's a summary of recent improvements:

### 1. Search and Filter Functionality
-   **Search**: Users can search for tasks by their title.
-   **Filter**: Users can filter tasks by their status (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
-   The implementation involved updating the frontend to send search and filter queries to the backend, which then returns the filtered data.

### 2. Enhanced Task Status Management
-   **New "IN_PROGRESS" Status**: Added a new status to better reflect the task lifecycle.
-   **Status Toggling**: Users can now cycle through task statuses (`PENDING` -> `IN_PROGRESS` -> `COMPLETED` -> `PENDING`) directly from the task card.
-   The UI now uses a card-based layout (`TaskCard`) to display tasks, replacing the previous table view.

### 3. Improved User Interface
-   **Task Cards**: Tasks are now displayed in a responsive card grid, which is more suitable for various screen sizes.
-   **Simplified Footer**: The website footer has been cleaned up to show a simple and authentic copyright notice, removing placeholder content.

## Challenges Faced During Development

-   **Integrating Frontend and Backend**: Ensuring the frontend and backend were communicating correctly, especially with new features like search and filter, required careful coordination of API endpoints and data structures.
-   **Refactoring UI Components**: The application was initially using a table to display tasks. To implement the more user-friendly card-based view, several components had to be refactored. This involved separating data logic from presentation and ensuring the new components received the correct data and functions.
-   **State Management**: Managing the state of filters, search queries, and the task list itself while ensuring the UI updates correctly was a key challenge that was solved using React hooks (`useState`, `useEffect`, `useCallback`).

# -Task-Management-System-