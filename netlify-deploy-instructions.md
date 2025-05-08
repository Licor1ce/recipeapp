# Deploying Your Recipe App to GitHub and Netlify

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in (or create an account if you don't have one)
2. Click the "+" button in the top right corner and select "New repository"
3. Give your repository a name (e.g., "my-recipe-app")
4. Choose "Public" or "Private" (your preference)
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

Follow these commands in your terminal after creating the repository:

```bash
# Initialize a git repository (if not already done)
git init

# Add all your files
git add .

# Commit your changes
git commit -m "Initial commit"

# Add your GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/my-recipe-app.git

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `my-recipe-app` with the name you chose for your repository.

## Step 3: Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com/) and sign in (or create an account using your GitHub account)
2. Click "Add new site" and select "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Select the repository you just created
5. Configure your build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
6. Click "Deploy site"

## Step 4: Configure Your Netlify Site

1. Once deployed, click on "Site settings"
2. You can customize your site name under "General" > "Site details" > "Change site name"
3. Your site will be available at `https://your-site-name.netlify.app`

## Important Notes About Your Recipe App

- **Private Recipes**: Each user who accesses your app maintains their own private collection of recipes in their browser's local storage
- **Responsive Design**: Your app works on any device with a web browser - phone, tablet, or desktop
- **Future Customization**: You can continue to update your code in GitHub and Netlify will automatically rebuild your site when you push changes
- **Image Recommendations**:
  - Banner images: 1200x300px
  - Recipe images: 600x600px
  - Icons: 48x48px

Enjoy your new recipe app!