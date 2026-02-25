# Jobs Backend

A NestJS-based REST API for a job board application (similar to Jobs.ge). This backend provides authentication, company management, vacancy posting, and application handling with role-based access control.

## Features

### Authentication & Authorization
- **User Registration**: Job seekers can register with email and password
- **Company Registration**: Companies can register but require admin approval before becoming active
- **JWT-based Authentication**: Secure token-based authentication
- **Google OAuth**: Social login via Google OAuth 2.0
- **Role-based Access Control**: Three roles - `user`, `company`, and `admin`

### Users (Job Seekers)
- Browse and search vacancies
- Apply to jobs with CV upload (stored in AWS S3)
- Track application status
- View application history

### Companies
- Create and manage company profile
- Post and manage job vacancies
- View and manage applications received
- Requires admin approval before posting vacancies

### Admin Panel
- Approve/ban companies
- Moderate vacancies
- View all applications
- Full system oversight

### Additional Features
- **File Upload**: CV files stored securely in AWS S3
- **Email Notifications**: Welcome emails and application notifications via Nodemailer
- **API Documentation**: Swagger/OpenAPI documentation
- **Request Logging**: Morgan middleware for logging HTTP requests

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js + JWT
- **File Storage**: AWS S3
- **Email**: Nodemailer
- **API Docs**: Swagger/OpenAPI

## Project Structure

```
src/
├── app.module.ts          # Root application module
├── main.ts                # Application entry point
├── auth/                  # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/              # Data transfer objects
│   └── strategies/       # OAuth strategies
├── users/                 # User management
│   ├── users.service.ts
│   ├── users.module.ts
│   └── schema/          # Mongoose schemas
├── companies/            # Company management
│   ├── companies.controller.ts
│   ├── companies.service.ts
│   ├── companies.module.ts
│   └── schema/
├── vacancies/            # Job vacancy management
│   ├── vacancies.controller.ts
│   ├── vacancies.service.ts
│   ├── vacancies.module.ts
│   └── schema/
├── applications/         # Job applications
│   ├── applications.controller.ts
│   ├── applications.service.ts
│   ├── applications.module.ts
│   └── schema/
├── aws-s3/              # AWS S3 file upload service
├── email-sender/       # Email sending service
├── common/             # Shared utilities
├── decorators/         # Custom decorators
├── guards/             # Auth guards
├── middlewares/        # Custom middlewares
└── enum/               # Enumerations
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- AWS S3 bucket (for file storage)
- Google OAuth credentials (optional)

### Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd jobs-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=3001
   MONGO_URL=mongodb://localhost:27017/jobs-board
   JWT_SECRET=your-secret-key-change-in-production

   # Email (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # AWS S3
   AWS_ACCESS_KEY_=your-access-key
   AWS_SECRET_KEY_=your-secret-key
   AWS_REGION=eu-central-1
   AWS_BUCKET_NAME=your-bucket-name

   # Frontend URL
   FRONT_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
   ```

### Running the Application

#### Development
```bash
npm run start:dev
```

#### Production
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`

### API Documentation

Once the server is running, visit the Swagger documentation at:
```
http://localhost:3001/api/docs
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sign-up/user` | Register a new job seeker |
| POST | `/auth/sign-up/company` | Register a new company |
| POST | `/auth/sign-in` | User login |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/current-user` | Get current user info |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/companies` | List all approved companies (admin) |
| GET | `/companies/pending` | List pending companies (admin) |
| GET | `/companies/:id` | Get company details |
| PATCH | `/companies/:id` | Update company profile |
| PATCH | `/companies/:id/approve` | Approve company (admin) |
| PATCH | `/companies/:id/ban` | Ban company (admin) |

### Vacancies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vacancies` | List approved vacancies |
| GET | `/vacancies/my` | List company's vacancies |
| GET | `/vacancies/:id` | Get vacancy details |
| POST | `/vacancies` | Create new vacancy |
| PATCH | `/vacancies/:id` | Update vacancy |
| DELETE | `/vacancies/:id` | Delete vacancy |
| GET | `/vacancies/admin/pending` | List pending vacancies (admin) |
| PATCH | `/vacancies/admin/:id/approve` | Approve vacancy (admin) |
| PATCH | `/vacancies/admin/:id/reject` | Reject vacancy (admin) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications/my` | List user's applications |
| POST | `/applications` | Submit job application |
| GET | `/applications/company` | List company's received applications |
| GET | `/applications/vacancy/:id` | List applications for a vacancy |

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| `user` | Browse vacancies, apply to jobs, track applications |
| `company` | Manage company profile, post vacancies, view received applications |
| `admin` | Approve companies, moderate vacancies, view all data |

## License

Private - All rights reserved
