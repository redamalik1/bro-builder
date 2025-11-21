import { ExampleCard, SeoCategory, SeoStat, ShowcaseApp } from './types';

export const LEMON_SQUEEZY_CHECKOUT_URL = "https://brobuilder.lemonsqueezy.com/buy/a61e4d34-77fa-4cd1-b15d-5aa61be233ff";

export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: 's1',
    title: 'Neon Crypto Hub',
    description: 'Cyberpunk dashboard with glowing charts',
    prompt: 'Build a futuristic crypto dashboard in dark mode. Use a black background with neon green and purple accents. Include a vertical sidebar, a main glassmorphism card showing a simulated Bitcoin price chart (use CSS bars), and a list of trending assets with glowing status indicators. Font should be tech-inspired.',
    previewGradient: 'from-gray-900 via-purple-900 to-black',
    previewIcon: 'fa-chart-line'
  },
  {
    id: 's2',
    title: 'Retro Snake 88',
    description: '8-bit arcade style game',
    prompt: 'Create a fully playable Snake game with a retro 80s arcade aesthetic. Use a bright green grid on a black background. The snake should be blocky yellow, and the food red. Add a pixel-art style "GAME OVER" overlay and a high score counter at the top. Use a press-start-2p font style if possible.',
    previewGradient: 'from-green-900 via-black to-green-900',
    previewIcon: 'fa-gamepad'
  },
  {
    id: 's3',
    title: 'Zen Taskmaster',
    description: 'Ultra-minimalist productivity',
    prompt: 'Build a beautiful, minimalist todo list app inspired by Japanese Zen design. Use soft beige and cream colors (#fdfbf7). The UI should have plenty of whitespace, elegant serif fonts, and subtle shadow effects. Tasks should slide in with animation. Include a "Focus Mode" toggle that dims the background.',
    previewGradient: 'from-orange-50 via-white to-orange-50',
    previewIcon: 'fa-check'
  },
  {
    id: 's4',
    title: 'Insta-Vibe Feed',
    description: 'Social media style feed',
    prompt: 'Build a mobile-first social media feed like Instagram. Top header with circular "Stories" avatars. Main feed containing cards with user headers, square placeholder images, and action buttons (Heart, Comment, Share) below. Add a bottom navigation bar with Home, Search, Reels, and Profile icons. Clean white theme.',
    previewGradient: 'from-purple-500 via-pink-500 to-yellow-500',
    previewIcon: 'fa-camera'
  },
  {
    id: 's5',
    title: 'Brainy Bot AI',
    description: 'ChatGPT-style interface',
    prompt: 'Create a modern AI chat interface like ChatGPT. Dark sidebar on the left for chat history. Main chat area with a dark gray background (#343541). Message bubbles should distinguish between "User" (blue/dark) and "AI" (gray/light). Fixed input bar at the bottom with a send button.',
    previewGradient: 'from-emerald-600 to-teal-900',
    previewIcon: 'fa-robot'
  },
  {
    id: 's6',
    title: 'Hype Kicks',
    description: 'Premium sneaker product page',
    prompt: 'Build a high-converting product page for a limited edition sneaker. Split layout: Left side large product image, Right side details. Big bold typography for the title "AIR MAX GEN". Size selector grid. Large "ADD TO CART" button with hover effect. Minimalist aesthetic.',
    previewGradient: 'from-orange-600 to-red-900',
    previewIcon: 'fa-shoe-prints'
  },
  {
    id: 's7',
    title: 'Glass Weather',
    description: 'Frosted glass weather dashboard',
    prompt: 'Build a weather dashboard using Glassmorphism. Background should be a colorful gradient blob. The main content is a translucent card (backdrop-filter: blur) showing the current temperature (big number), weather icon, and a 7-day forecast list below. Make it look premium and airy.',
    previewGradient: 'from-blue-400 to-blue-800',
    previewIcon: 'fa-cloud-sun-rain'
  },
  {
    id: 's8',
    title: 'Cyber Beat Pad',
    description: 'Interactive drum machine',
    prompt: 'Build a browser-based drum machine. A 4x4 grid of colored buttons. When clicked, they should flash brightly and play a sound (use simulated frequencies or placeholder audio tags). Dark background with neon glow effects on the pads. Include a volume slider.',
    previewGradient: 'from-violet-600 to-fuchsia-900',
    previewIcon: 'fa-music'
  }
];

export const EXAMPLE_CARDS: ExampleCard[] = [
  {
    id: '1',
    emoji: '📹',
    title: 'Video Downloader',
    description: 'YouTube, TikTok, IG Reels fetcher',
    prompt: 'Build a video downloader app that supports YouTube, TikTok, and Instagram URLs. It should have a paste input, a download button, and show fake progress bars for the demo.'
  },
  {
    id: '2',
    emoji: '🍔',
    title: 'Food Delivery',
    description: 'Menu, cart, checkout flow',
    prompt: 'Create a food delivery app interface like UberEats. Include a list of burgers with images, an "Add to Cart" button, a floating cart total, and a checkout modal.'
  },
  {
    id: '3',
    emoji: '📅',
    title: 'Booking System',
    description: 'Calendly-style appointments',
    prompt: 'Build an appointment booking system. Show a calendar view, time slots for selected days, and a form to confirm the booking with name and email.'
  },
  {
    id: '4',
    emoji: '🎮',
    title: 'Mini Game',
    description: 'Tetris, Snake, or Puzzle',
    prompt: 'Create a fully playable Snake game. Use arrow keys for controls, keep score, and show a "Game Over" screen with a restart button.'
  },
  {
    id: '5',
    emoji: '💳',
    title: 'Landing + Pay',
    description: 'Product sales with generic pay UI',
    prompt: 'Build a high-converting landing page for a "Smart Water Bottle". Include a hero section, features list, and a "Buy Now" section that simulates a credit card form.'
  },
  {
    id: '6',
    emoji: '📊',
    title: 'Dashboard',
    description: 'Analytics & Charts',
    prompt: 'Create an admin dashboard with a sidebar. Include 3 metric cards (Revenue, Users, Bounce Rate) and use a library like Chart.js (via CDN) to show a sales line chart.'
  },
  {
    id: '7',
    emoji: '✅',
    title: 'Productivity',
    description: 'Todo list & Project Board',
    prompt: 'Build a Kanban board application. Allow users to add tasks to "To Do", "In Progress", and "Done" columns. Allow dragging or moving items between columns.'
  },
  {
    id: '8',
    emoji: '🛒',
    title: 'E-commerce',
    description: 'Online shop with catalog',
    prompt: 'Create a modern e-commerce store front for sneakers. Grid layout of products with hover effects, price tags, and a filter sidebar for Brand and Size.'
  },
  {
    id: '9',
    emoji: '💬',
    title: 'Chat App',
    description: 'Messaging Interface',
    prompt: 'Build a chat application interface. Sidebar with channels, main chat area with simulated incoming messages, and a message input box with emoji button.'
  },
  {
    id: '10',
    emoji: '🎨',
    title: 'Portfolio',
    description: 'For creatives & freelancers',
    prompt: 'Create a dark-themed portfolio website for a UI/UX Designer. Include an "About Me" section, a "Work" grid with placeholder images, and a "Contact" form.'
  }
];

export const SEO_CATEGORIES: SeoCategory[] = [
  {
    title: 'Business Apps',
    items: ['CRM Systems', 'Invoicing Tools', 'Project Mgmt', 'HR Portals'],
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'Social & Community',
    items: ['Dating Apps', 'Social Networks', 'Forums', 'Event Planning'],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'E-commerce',
    items: ['Marketplaces', 'Dropshipping', 'Booking Engines', 'Auctions'],
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    title: 'Agency & Creative',
    items: ['Portfolios', 'Photo Galleries', 'Client Portals', 'Agency Sites'],
    gradient: 'from-emerald-500 to-teal-400'
  }
];

export const STATS: SeoStat[] = [
  { value: '100K+', label: 'Apps Built' },
  { value: '0.5s', label: 'Gen Speed' },
  { value: '100%', label: 'Code Ownership' },
  { value: 'Free', label: 'Forever Bro' }
];