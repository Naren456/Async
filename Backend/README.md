# ASync Backend

The backend service for the ASync mobile application, providing APIs for user authentication, assignment management, and notifications.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Authentication**: JWT & Google OAuth
- **Scheduler**: Node-cron (for push notifications)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database (or NeonDB connection string)

### Installation

1.  **Navigate to the directory**:
    ```bash
    cd Backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the `Backend` directory:
    ```env
    PORT=8000
    DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
    JWT_SECRET="your_jwt_secret_key"
    GOOGLE_CLIENT_ID="your_google_client_id"
    ```

4.  **Database Migration**:
    Initialize the database schema:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the Server**:
    - Development:
      ```bash
      npm run dev
      ```
    - Production:
      ```bash
      npm start
      ```

## 📂 Project Structure

- `controllers/`: Logic for handling API requests.
- `routes/`: API endpoint definitions.
- `services/`: Business logic and database interactions.
- `prisma/`: Database schema and migrations.
- `middleware/`: Auth and error handling middleware.
- `cron/`: Scheduled tasks for assignment reminders.
- `jobs/`: Background jobs.

## 🔗 Key Endpoints

- **Auth**: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/google`
- **Assignments**: `/api/assignments`
- **Subjects**: `/api/subjects`
- **Admin**: `/api/admin`

## 🤝 Contributing

Ensure to run `npx prisma generate` whenever you modify `prisma/schema.prisma`.
