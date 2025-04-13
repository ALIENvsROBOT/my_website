# Gowtham Sridhar Portfolio

## Deployment

### GitHub Pages Configuration

This portfolio is set up to deploy automatically to GitHub Pages using GitHub Actions workflow.

#### Environment Variables Setup

For the contact form to work properly when deployed to GitHub Pages, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click on "New repository secret"
4. Add the following secrets:
   - `EMAILJS_SERVICE_ID`: Your EmailJS service ID
   - `EMAILJS_TEMPLATE_ID`: Your EmailJS template ID
   - `EMAILJS_PUBLIC_KEY`: Your EmailJS public key
   - `PUSHBULLET_TOKEN`: Your Pushbullet API token (legacy support)

### EmailJS Setup Instructions

1. Sign up for a free account at [EmailJS](https://www.emailjs.com/)
2. Create an Email Service (Gmail, Outlook, etc.)
3. Create an Email Template
4. Find your Service ID, Template ID, and User ID (public key) in the EmailJS dashboard
5. Add these values as GitHub Secrets

## Local Development Setup

### Environment Variables

To run this website locally, you need to set up the following environment variables:

1. Create a `.env.local` file in the root directory of the project
2. Add the following variables:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_PUSHBULLET_TOKEN=your_pushbullet_token
```

### Installing Dependencies

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the website.

Alternatively, the contact form will fallback to using EmailJS if the server API is not available. 