# Middlewares and Google OAuth Implementation

## ✅ What Was Added

### 1. **Google OAuth Authentication**
- **Strategy**: `src/auth/strategies/google.strategy.ts`
- **Guard**: `src/guards/google.guard.ts`
- **Endpoints**:
  - `GET /auth/google` - Initiates Google OAuth flow
  - `GET /auth/google/callback` - Google OAuth callback (sets cookie and redirects)

### 2. **Middlewares Created**

#### **Logger Middleware** (`src/middlewares/logger.middleware.ts`)
- Logs all requests with timestamp, method, and URL
- Applied globally in `main.ts`

#### **Company Approved Middleware** (`src/middlewares/company-approved.middleware.ts`)
- Checks if company user's company is approved
- Can be used for routes that require approved companies

#### **Company Ownership Middleware** (`src/middlewares/company-ownership.middleware.ts`)
- Verifies that the company user owns the company being accessed
- Use for routes like `PATCH /companies/:id`

#### **Vacancy Ownership Middleware** (`src/middlewares/vacancy-ownership.middleware.ts`)
- Verifies that the company user owns the vacancy being accessed
- Use for routes like `PATCH /vacancies/:id` or `DELETE /vacancies/:id`

## 📝 Environment Variables Required

Add to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

## 🔧 How to Use Middlewares

### Option 1: Apply in Module (Recommended for NestJS)

In your module (e.g., `vacancies.module.ts`):

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CompanyApprovedMiddleware } from '../middlewares/company-approved.middleware';
import { VacancyOwnershipMiddleware } from '../middlewares/vacancy-ownership.middleware';

@Module({...})
export class VacanciesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyApprovedMiddleware)
      .forRoutes(
        { path: 'vacancies', method: RequestMethod.POST },
        { path: 'vacancies/my', method: RequestMethod.GET },
      );
    
    consumer
      .apply(VacancyOwnershipMiddleware)
      .forRoutes(
        { path: 'vacancies/:id', method: RequestMethod.PATCH },
        { path: 'vacancies/:id', method: RequestMethod.DELETE },
      );
  }
}
```

### Option 2: Use as Guards (Alternative)

You can convert these middlewares to guards if you prefer route-level checks. The current implementation uses guards (`IsAuthGuard`, `RolesGuard`) which is the NestJS recommended approach.

## 🚀 Google OAuth Flow

1. **Frontend**: Redirect user to `GET /auth/google`
2. **Backend**: Redirects to Google OAuth consent screen
3. **Google**: User authorizes, redirects to `/auth/google/callback`
4. **Backend**: 
   - Creates/finds user
   - Generates JWT token
   - Sets cookie with token
   - Redirects to `FRONT_URL`

## 📦 Dependencies Added

- `passport-google-oauth2`: ^0.2.0
- `@types/passport-google-oauth2`: ^0.1.10

Run `npm install` to install new dependencies.

## 🎯 Benefits

1. **Cleaner Services**: Middlewares handle authorization checks, reducing code duplication
2. **Google OAuth**: Users can sign in with Google (creates user account automatically)
3. **Better Logging**: All requests are logged with timestamps
4. **Reusable**: Middlewares can be applied to multiple routes

## 📝 Notes

- Middlewares require `IsAuthGuard` to run first (to populate `req['userId']`)
- Company approval check is now handled by middleware, simplifying service code
- Google OAuth users are created with `role: USER` by default
- Google OAuth users don't have passwords (empty string)
