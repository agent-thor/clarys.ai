# Clarys.AI Polkadot OpenGov AI assistant

An Open-Source AI Chatbot for Polkadot Governance build on the [Next.js AI Chatbot template by Vercel](https://vercel.com/templates/next.js/nextjs-ai-chatbot). Clarys.AI is here to simplify decision-making in OpenGov. Fed with OpenGov data, Clarys.AI helps you explore on-chain and off-chain data, proposals, and discussions effortlessly.

## Documentation

More details about Clarys can be found in the backend's [repository](https://github.com/mcanti/clarys-backend).

# Getting Started

## Setup Instructions

1. Run `npm run init` to install all project dependencies.
2. Copy variables from `.env.example` to `.env.local` and add your credentials.
3. Start the development server with `npm run dev`.
   1. (OPTIONAL) To use a custom port: `npm run dev -- -p 3001`


   1. (OPTIONAL) For debugging: `npm run dev-inspect`
4. Access the application at `http://localhost:3000` (or your custom port).

## Environment Configuration

Ensure all required environment variables are properly configured in your `.env.local` file before starting the application.

## Available Commands

### Development

- `npm run dev` - Start development server with Turbo
- `npm run dev-inspect` - Start development server with Node inspector
- `npm run start` - Start production server
- `npm run build` - Create production build (runs DB migrations first)

### Code Quality

- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Biome

### Database Operations

- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push schema changes to database
- `npm run db:pull` - Pull database schema
- `npm run db:check` - Check schema for changes
- `npm run db:up` - Apply pending migrations

# Add team members
`npm run add-user` developer1@company.com

`npm run add-user` developer2@company.com

`npm run add-user` manager@company.com

`npm run add-users-batch` all users

# Remove former employees
`npm run delete-user` former-employee@company.com

