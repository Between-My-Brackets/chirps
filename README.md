# Chirpy API

Chirpy is a scalable backend API for a microblogging platform, similar to Twitter(vaguely). It is built with Node.js, Express, and TypeScript, providing a clean and modern foundation for a social media application. This project serves as a practical example of building a well-structured RESTful API using professional coding practices and a modern tech stack.

## File Structure

This project follows a standard, feature-rich file structure designed for scalability and maintainability.

```
.
├── src/
│   ├── controllers/    # Contains the core business logic for each endpoint.
│   │   ├── admin.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── chirp.controller.ts
│   │   ├── health.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── db/             # Database configuration, schema, and migrations.
│   │   ├── migrations/
│   │   └── ...
│   │
│   ├── middlewares/    # Express middleware for logging, auth, errors, etc.
│   │   └── ...
│   │
│   ├── routes/         # Defines all API routes and connects them to controllers.
│   │   ├── admin.routes.ts
│   │   ├── api.routes.ts       (Main router)
│   │   ├── auth.routes.ts
│   │   ├── chirp.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── utils/          # Reusable utility functions.
│   │   └── response.utils.ts
│   │
│   └── index.ts        # Main application entry point.
│
├── openapi.yaml        # Centralized OpenAPI/Swagger documentation.
├── package.json
└── tsconfig.json
```

## 🚀 Installation and Setup

Follow these steps to get the Chirpy API running on your local machine.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [PostgreSQL](https://www.postgresql.org/) (a running instance)

### 2. Clone the Repository

```bash
git clone <repository-url>
cd chirpy
```

### 3. Install Dependencies

Install all the required npm packages.

```bash
npm install
```

### 4. Database Setup

This project uses PostgreSQL as its database.

1.  Make sure you have a running PostgreSQL server.
2.  Create a new database for the project (e.g., `chirpy_dev`).
3.  Create a `.env` file in the root of the project by copying the example:

    ```bash
    cp .env.example .env
    ```

4.  Edit the `.env` file and update the `DB_URL` with your PostgreSQL connection string. You should also set your own `JWT_SECRET`.

    ```
    # PostgreSQL connection URL
    DB_URL="postgresql://<user>:<password>@<host>:<port>/<database>"

    # Secret for signing JWTs
    JWT_SECRET="your-super-secret-key"

    # API Key for Polka webhooks
    POLKA_KEY="your-polka-api-key"

    # Set to "dev" for development features like /admin/reset
    PLATFORM="dev"
    ```

### 5. Run Database Migrations

Apply the database schema to your newly created database.

```bash
npm run migrate
```

## ⚙️ Development Scripts

-   **`npm run dev`**: Starts the server in development mode using `nodemon`. The server will automatically restart whenever you make changes to the source code.
-   **`npm run build`**: Compiles the TypeScript code into JavaScript, outputting the result to the `dist/` directory.
-   **`npm run start`**: Starts the server from the compiled JavaScript code in the `dist/` directory. This is typically used for production.
-   **`npm run test`**: Runs the test suite using `vitest`.

## 📖 API Endpoints

The API documentation is interactively served from the `openapi.yaml` file. Once the server is running, you can view and interact with all endpoints at:

**http://localhost:8080/api-docs**

Here is a summary of the available endpoints:

| Method | Path                      | Description                                    | Authentication |
| :----- | :------------------------ | :--------------------------------------------- | :------------- |
| `GET`  | `/api/healthz`            | Checks the health of the API.                  | None           |
| `POST` | `/api/users`              | Creates a new user.                            | None           |
| `PUT`  | `/api/users`              | Updates the authenticated user's info.         | JWT Required   |
| `POST` | `/api/login`              | Logs in a user and returns JWTs.               | None           |
| `POST` | `/api/refresh`            | Issues a new access token using a refresh token. | JWT Required   |
| `POST` | `/api/revoke`             | Revokes a refresh token.                       | JWT Required   |
| `GET`  | `/api/chirps`             | Gets a list of all chirps.                     | None           |
| `POST` | `/api/chirps`             | Creates a new chirp.                           | JWT Required   |
| `GET`  | `/api/chirps/{chirpId}`   | Gets a single chirp by its ID.                 | None           |
| `DELETE`| `/api/chirps/{chirpId}`  | Deletes a chirp.                               | JWT Required   |
| `POST` | `/api/polka/webhooks`     | Handles webhooks from the Polka service.       | Polka API Key  |
| `GET`  | `/admin/metrics`          | Displays an admin page with usage metrics.     | None           |
| `POST` | `/admin/reset`            | Resets the database (dev mode only).           | None           |
