# Gowtham Sridhar - Interactive Portfolio

A futuristic, interactive portfolio website for Gowtham Sridhar, built with Next.js, TypeScript, and Tailwind CSS. The portfolio showcases expertise in Human-Computer Interaction, Robotics, and XR Applications.

![Portfolio Screenshot](./public/images/screenshot.jpg)

## Features

- ✨ Interactive particle effects background
- 🔄 Smooth animations with Framer Motion and GSAP
- 📱 Fully responsive design for all devices
- ⚡ Fast performance and optimized for accessibility
- 🌗 Modern UI with glass morphism effects
- 🔍 SEO-friendly with proper metadata

## Technologies Used

- **Next.js 14** - React framework for server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Three.js** - 3D graphics for the web
- **React Particles** - Interactive particle backgrounds
- **GSAP** - Professional-grade animation library

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gowtham-sridhar/my_website.git
   cd my_website
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
my_website/
├── public/              # Static assets
│   ├── images/          # General images
│   ├── projects/        # Project images
│   └── Gowtham_Sridhar_CV.pdf  # CV file
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Customization

### Images

Replace the placeholder images in the `public/images/` and `public/projects/` directories with your own images.

### Content

Most of the content is defined in the component files. To update:

1. Edit personal information in the component files in `src/components/`
2. Update project details in `src/components/ProjectsSection.tsx`
3. Modify skills and experience in `src/components/AboutSection.tsx`

## Deployment to GitHub Pages

1. Push your code to GitHub:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Build the static site:

   ```bash
   npm run build
   # or
   yarn build
   ```

3. The site will be generated in the `out` directory, which you can deploy to GitHub Pages.

4. For automated deployment, consider setting up GitHub Actions by creating a workflow file in `.github/workflows/deploy.yml`.

## Accessibility

This website is built with accessibility in mind:

- Proper semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigable interface
- Sufficient color contrast
- Responsive design for all devices

## License

[MIT License](LICENSE)

## Contact

Gowtham Sridhar - [gowtham.sridher5@gmail.com](mailto:gowtham.sridher5@gmail.com)

LinkedIn: [linkedin.com/in/gowtham-sridher](https://www.linkedin.com/in/gowtham-sridher/)

## Deployment

This site is automatically deployed to GitHub Pages via GitHub Actions. The deployment process happens when:

1. Changes are pushed to the main branch
2. The GitHub Action workflow is manually triggered

### Custom Domain Setup

This site is configured to use the custom domain `www.gowthamsridhar.com`. DNS records are configured as follows:

- A CNAME record for `www` pointing to `alienvsrobot.github.io`
- If using the apex domain (gowthamsridhar.com), set up A records pointing to GitHub Pages IP addresses:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

### Manual Deployment

If you need to deploy manually:

1. Build the site: `npm run build`
2. The static files will be generated in the `out` directory
3. These files can be deployed to any static hosting service
