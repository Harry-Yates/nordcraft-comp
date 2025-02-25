# Nordcraft

A modern task management application with a Nordic design aesthetic, built with Next.js and Supabase.

## Features

- Clean, minimalist Nordic-inspired design
- Task management with categories and priorities
- Real-time updates using Supabase
- Dark/light theme support
- Responsive design for all devices
- Built with modern web technologies

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nordcraft-comp.git
   cd nordcraft-comp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT © Harry Yates
