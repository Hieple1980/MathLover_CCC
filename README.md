# 📐 MathLover CCC

> **An independent, student-led mathematics learning community and peer-matching platform for the Seven City Colleges of Chicago.**

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![City Colleges of Chicago](https://img.shields.io/badge/City_Colleges_of_Chicago-7_Campuses-1E3A8A)](https://www.ccc.edu)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 🌟 Overview

**MathLover CCC** is a dedicated web application designed to connect and empower community college students pursuing mathematics and STEM disciplines across all seven City Colleges of Chicago (CCC). 

Whether tackling college algebra, conquering multivariable calculus, or preparing to transfer into 4-year engineering and computer science programs at universities like UIC, UIUC, IIT, and Loyola, **MathLover CCC** provides the collaborative infrastructure students need:
- Find ideal study partners tailored to specific courses and schedules.
- Form or join in-person and virtual math study circles.
- Ask and resolve tricky problems with beautiful LaTeX formula formatting.
- Access campus-specific tutoring schedules and transit-friendly study hubs across Chicago.

---

## 🏛️ Supported City Colleges of Chicago

MathLover CCC embraces the city-wide network of Chicago's community colleges:

| College | Neighborhood | Focus / Notable Highlights |
| :--- | :--- | :--- |
| **Harry S Truman College** | Uptown | Home campus of developer **Hiep Le**; STEM transfer pathways & modern biology/chem/math labs |
| **Harold Washington College** | The Loop (Downtown) | Central commuter hub, business & liberal arts transfer programs |
| **Kennedy-King College** | Englewood | Automotive, culinary, and science learning facilities |
| **Malcolm X College** | Medical District | Premier healthcare sciences, allied health, and nursing math pathways |
| **Olive-Harvey College** | Pullman | Transportation, logistics, and South Side STEM programs |
| **Richard J. Daley College** | West Lawn | Advanced manufacturing, engineering robotics, and calculus sequences |
| **Wilbur Wright College** | Dunning / Northwest | Engineering Transfer Academy (ETA) partnering directly with UIUC Grainger |

---

## 🚀 Core Features

### 1. 🤝 Smart Math Match (Peer Pairing)
- **Multi-Parameter Filtering**: Find peer study partners based on enrolled course, campus proximity, preferred study mode (*In-Person, Virtual, or Hybrid*), and 4-year transfer target.
- **Independent Course Options**: Includes dedicated matching for **Precalculus**, Calculus I/II/III, Linear Algebra, Differential Equations, Discrete Mathematics, and Introductory Statistics.
- **Connection System**: Send direct connection requests with custom study notes and manage incoming student requests.

### 2. 📚 Study Circles & Group Sessions
- **Session Discovery**: Explore student-led study groups hosting regular review sessions before midterms and finals.
- **Real-Time Seat Caps & RSVPs**: Track available spots, session agendas, and exact meeting venues (e.g., Truman College Main Student Center, Harold Washington 5th Floor Library, or Zoom).
- **Group Creation**: Create your own study circle with custom meeting cadence, venue, and prerequisite topic tags.

### 3. 💬 Mathematical Community Forum
- **LaTeX Formula Formatting**: Render clean equations, limits, integrals, and matrix notation directly within discussions.
- **Interactive Question Editor**: Write and preview questions in real time with step-by-step math breakdowns.
- **Helpful Solutions & Peer Verification**: Upvote quality explanations and mark community solutions as verified.

### 4. 🗂️ Campus Directory & Commuter Guide
- **Transit & Access**: Direct CTA transit details (Red Line, Blue Line, Brown Line, Green Line, Pink Line, and bus lines) for each campus.
- **Tutoring Center Hours**: Fast access to official campus Academic Support Centers and free Math Lab schedules.

### 5. 🏆 Student Profile & Gamification
- **Customizable Profile**: Show your home CCC campus (e.g., **Truman College**), enrolled math courses, study styles, and transfer aspirations.
- **Badges & XP Leveling**: Earn recognition badges for helping peers (*Study Master*, *Circle Host*, *Proof Pioneer*, *Campus Champion*).
- **Offline-First Resilience**: Changes, joined groups, and forum activity persist safely in local storage.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **State Management**: React Context with LocalStorage persistence
- **Backend / API**: Express & Node.js proxy readiness with Google GenAI capabilities

---

## 📂 Project Structure

```text
mathlover-ccc/
├── public/
│   └── assets/              # App banners, campus imagery, and math logos
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Footer.tsx       # Campus directory footer and attribution
│   │   ├── Navbar.tsx       # Navigation bar with connection notifications
│   │   ├── ToastContainer.tsx # Live notification toasts
│   │   └── ...
│   ├── context/
│   │   └── MathContext.tsx  # Global state (profile, groups, questions, peers)
│   ├── data/
│   │   └── mockData.ts      # Seed data for 7 CCC campuses, courses, and circles
│   ├── screens/             # Primary application views
│   │   ├── HomeDashboard.tsx   # Banner, quick actions, stats, and campus hub
│   │   ├── MathCommunity.tsx   # Q&A forum with LaTeX rendering
│   │   ├── MathMatch.tsx       # Peer search and connection portal
│   │   ├── StudentProfile.tsx  # User info, badges, and enrolled courses
│   │   └── StudyGroups.tsx     # Study circles, group creation, and RSVPs
│   ├── types.ts             # TypeScript definitions and interfaces
│   ├── App.tsx              # Root app component and mobile navigation
│   ├── main.tsx             # Application bootstrap
│   └── index.css            # Tailwind CSS styling and theme setup
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript compiler configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or 20.x recommended)
- `npm` (bundled with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mathlover-ccc.git
   cd mathlover-ccc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

### Building for Production
To generate an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

### Code Quality & Type Check
To verify TypeScript types across all files:
```bash
npm run lint
```

---

## 👤 Developer & Community Lead

- **Name**: **Hiep Le**
- **Home Campus**: **Harry S Truman College** (City Colleges of Chicago)
- **Email**: [hle61@gmail.com](mailto:hle61@gmail.com)
- **Role**: Platform Developer & Mathematics Peer Advocate

---

## 🤝 Contributing

Contributions from City Colleges of Chicago students, tutors, and STEM enthusiasts are warmly welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See `LICENSE` for details.

*Built with ❤️ for math students across Chicago.*
