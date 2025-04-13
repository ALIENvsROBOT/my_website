# Gowtham Sridhar Portfolio

## Deployment

### GitHub Pages Configuration

This portfolio is set up to deploy automatically to GitHub Pages using GitHub Actions workflow.

#### Environment Variables Setup

For the contact form to work properly when deployed to GitHub Pages, you need to set up the following secret in your GitHub repository:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click on "New repository secret"
4. Add the following secret:
   - Name: `PUSHBULLET_TOKEN`
   - Value: Your Pushbullet API token

Alternatively, the contact form will fallback to using EmailJS if the server API is not available. 