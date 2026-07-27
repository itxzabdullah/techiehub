# TechieHub

TechieHub is a modern web application for discovering and sharing technology events in Karachi. It enables users to browse upcoming hackathons, workshops, conferences, AI events, meetups, startup events, and more. Organizers can securely submit new events through an authenticated admin interface, while users can search and filter events based on categories and keywords.

## 🌐 Live Demo

https://techiehub-ten.vercel.app

---

## Problem it solved

The technology community in Karachi is fragmented, with over 250 technology companies, numerous educational institutes, and presence of global groups like Google, Figma, and Microsoft. The technology communities often list their events on LinkedIn pages and WhatsApp communities, which makes the whole user experience pretty much fragmented. And existing events platforms such as Eventbrite and Luma often lack the listing of local technology events happening in Karachi, which creates a gap in the market.The fragmentation creates a condition where staying informed requires monitoring 8-12 different handles, social media pages, communities, WhatsApp groups. This requires an immense amount of mental load and pressure often overwhelming students who are also carrying a heavy study schedule.

The motivation behind this project is my personal experience while looking for different technology events happening in Karachi. The purpose of the project is to maximize the student involvement in different communities so that they would never miss an opportunity to connect, network, and grow.

## Target Audience

TechieHub is designed for:

- University students
- Software engineers
- AI enthusiasts
- Startup founders
- Technology communities
- Event organizers
- Anyone interested in discovering technology events in Karachi

---

# ✨ Features

## Event Discovery

- Browse all upcoming technology events
- Responsive event listing
- Event cards with detailed information
- External registration links

## Search

Users can search events by:

- Event title
- Description
- Category
- Organizer
- Location
- Tags

## Category Filtering

Filter events by categories including:

- AI
- Hackathons
- Workshops
- Conferences
- Meetups
- Startup
- Exhibition

## Event Details

Each event displays:

- Title
- Description
- Date & Time
- Location
- Organizer
- Categories
- Tags
- Registration Link
- Event Image
- Free/Paid Status

## Admin Authentication

Secure authentication using Supabase Auth.

Features include:

- Login
- Logout
- Protected routes
- Session management

## Event Submission

Authenticated users can submit:

- Title
- Description
- Categories
- Tags
- Date
- Time
- Organizer
- Location
- Registration Link
- Image URL
- Free/Paid status

## Dynamic Navigation

Navigation automatically changes depending on authentication state.

Guest users:

- Home
- Events
- AI Recommendation
- About
- Login

Logged-in users:

- Home
- Events
- AI Recommendation
- About
- Submit Event
- Logout

---

# 🤖 AI Feature

TechieHub includes an AI-powered recommendation system built using Google's Gemini API.

Users enter their interests (for example: AI, cybersecurity, startups, web development), and the AI analyzes available events to recommend the most relevant ones.

The recommendation considers:

- Event category
- Event tags
- Event description
- User interests

This helps users quickly discover events aligned with their goals.

# 🧠 AI Prompt

The recommendation system sends the following prompt to the Gemini API:

```text
You are TechieHub AI.

The user likes:
${interests}

Here are all available events:
${JSON.stringify(events)}

Return ONLY valid JSON.

Rules:
- Recommend at most 3 events.
- Use ONLY ids from the provided list.
- No markdown.
- No explanations.
- Only valid JSON.
```

Where:

- `${interests}` is replaced with the user's interests entered in the recommendation form.
- `${JSON.stringify(events)}` is replaced with the list of events currently stored in the database.

---

# 🛠 Technologies Used

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

## Backend

- Supabase
- PostgreSQL
- Supabase Authentication

## AI

- Google Gemini API

## Deployment

- Vercel

## Development Tools

- Visual Studio Code
- Git
- GitHub

# 🗄 Database

The project uses **Supabase PostgreSQL** as its backend database.

---

# 📷 Screenshots

## Home Page

![Home](screenshots/home.png)

## Explore Events

![Events](screenshots/events.png)

## Submit Event

![Submit](screenshots/submit-event.png)

## AI Recommendation

![User Interests](screenshots/recommendation1.png)
![Recommendations](screenshots/recommendation2.png)

## Admin Dashboard

![Admin](screenshots/admin.png)

---

## Requirements

- Node.js 18 or newer
- npm

# 💻 Installation

Clone the repository

```bash
git clone https://github.com/itxzabdullah/techiehub
```

Go into the project

```bash
cd techiehub
```

Install dependencies

```bash
npm install
```

# ⚙ Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```
---

# 🚀 Deployment

This project is deployed using Vercel.

Required environment variables:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GEMINI_API_KEY

Supabase Authentication configuration:

- Site URL = Vercel Deployment URL
- Redirect URL = Vercel Deployment URL

---

# 📈 Future Improvements

- Event editing
- Event deletion
- Image uploads using Supabase Storage
- User profiles
- Saved/Favorite events
- Email notifications
- Calendar integration
- Multi-city support
- Advanced AI ranking
- Personalized recommendations based on user history