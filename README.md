# Registration flow using edge functions with supabase

A user registration system with asynchronous email processing using Supabase Edge Functions and PGMQ queues.

## Features

- User registration with email and password
- Supabase Authentication integration
- Automatic welcome email dispatch via queue system
- PGMQ (Postgres Message Queue) for reliable email queuing
- Supabase Edge Function for processing email queue
- Resend API integration for email delivery
- Pug templating for views

## Tech Stack

- **Backend**: Express.js, TypeScript
- **Database/Auth**: Supabase (PostgreSQL, Auth)
- **Queue**: PGMQ (Postgres Message Queue)
- **Email**: Resend API
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **Templating**: Pug

## Prerequisites

- Node.js (v18+)
- Supabase account and project
- Resend API key
- Supabase CLI installed

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Installation

```bash
npm install
```

## Database Setup

1. Create a `user` table in the public schema with the following columns:
   - `id` (text, primary key)
   - `name` (text)
   - `email` (text)

2. Enable the PGMQ extension in Supabase:

3. Create the email queue in the `pgmq_public` schema with name `send-email-queue`:

4. Create a Supabase cron which runs at a regular interval and invokes the edge function passing in `X-EDGE-FUNCTION-API-KEY` key and its value (any custom secret) in the Http header

## Running the Application

```bash
# Development mode (with tsx)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production mode
npm run start
```

The Express server will run on `http://localhost:3000`.

## Deploying Edge Functions

Deploy the email processing edge function to Supabase:

```bash
npx supabase functions deploy process-emails
```

Make sure to set the required environment variables in your Supabase project's Edge Function settings:

- `X-EDGE-FUNCTION-API-KEY`
- `WELCOME_FROM_EMAIL`
- `RESEND_API_KEY`

## API Endpoints

### POST /register

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**

```
Account created successfully for John Doe!
```

**Error Response (400/500):**

```
All fields are required.
```

or

```
Something went wrong during registration.
```

## Project Structure

```
queues-test/
├── src/
│   ├── app.ts              # Express server and routes
│   ├── lib/
│   │   ├── auth.ts         # Supabase client helpers
│   │   └── ops.ts          # User operations & queue publishing
│   └── views/              # Pug templates
├── supabase/
│   ├── functions/
│   │   ├── process-emails/
│   │   │   └── index.ts    # Email processing edge function
│   │   └── _shared/        # Shared utilities for edge functions
│   │       ├── services/   # Auth, email, supabase services
│   │       ├── templates/  # Email templates
│   │       └── utils.ts    # Utility functions
│   └── config.toml         # Supabase configuration
├── package.json
├── tsconfig.json
└── .env
```

## How It Works

1. User submits registration data via `/register` endpoint
2. Express app creates user in Supabase Auth
3. User data is saved to the `user` table in the public schema
4. A welcome email message is published to `send-email-queue` via PGMQ
5. Supabase Edge Function (`process-emails`) polls the queue
6. Edge function retrieves user data and renders the email template
7. Email is sent via Resend API
8. Message is deleted from the queue after successful delivery

## Development Notes

- TypeScript with strict mode enabled
- ES modules (`"type": "module"`)
- Uses tsx for TypeScript execution in development

## License

ISC
