# Gowtham Sridhar Portfolio

A cutting-edge, 3D-interactive personal portfolio built with **Next.js 16**, **React 19**, and **Three.js**.

## 🚀 Modern Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **Engine**: React 19
- **3D Graphics**: @react-three/fiber & @react-three/drei (Three.js)
- **Animations**: Framer Motion 12 & GSAP
- **Analytics**: PostHog (Open Source)
- **Deployment**: Node.js 24 LTS on GitHub Pages

## 📦 Deployment & Environment Variables

### 1. GitHub Pages Configuration
This portfolio deploys automatically using GitHub Actions. To ensure everything (Contact Form + Analytics) works, set up the following **Secrets** in your repository:

#### **GitHub Repository Secrets**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `EMAILJS_SERVICE_ID`: EmailJS service ID
   - `EMAILJS_TEMPLATE_ID`: EmailJS template ID
   - `EMAILJS_PUBLIC_KEY`: EmailJS public key
   - `PUSHBULLET_TOKEN`: Pushbullet API token (optional)
   - `POSTHOG_KEY`: Your PostHog Project API Key (`phc_...`)

---

### 2. Analytics Setup (PostHog)
This project uses **PostHog** for open-source analytics, heatmaps, and session replays.
1. Create a free account at [PostHog](https://posthog.com/) (EU or US Cloud).
2. Create a "Web" project.
3. Copy your **Project API Key** and add it to GitHub Secrets as `POSTHOG_KEY`.
4. The project is configured to use the **EU Cloud** by default. To change this, update `NEXT_PUBLIC_POSTHOG_HOST` in `.github/workflows/deploy.yml`.

---

### 3. Contact Form (EmailJS)
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an Email Service and Template.
3. Add your credentials to GitHub Secrets as shown above.

---

## 🛠️ Local Development

### **Prerequisites**
- **Node.js**: v24.x (LTS) or higher
- **npm**: v10.x or higher

### **Environment Variables**
Create a `.env.local` file in the root:
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_key
NEXT_PUBLIC_POSTHOG_KEY=your_phc_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### **Getting Started**
```bash
# Install dependencies (use legacy-peer-deps for R3F compatibility)
npm install --legacy-peer-deps

# Run dev server
npm run dev

# Build for static export
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view your site. 