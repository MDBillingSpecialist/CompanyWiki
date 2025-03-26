#\!/bin/bash

echo "Cleaning up Next.js cache and node_modules..."
rm -rf .next node_modules package-lock.json

echo "Installing fresh dependencies..."
npm install next@14.0.0 react@18.2.0 react-dom@18.2.0 @heroicons/react@2.0.18

echo "Installing dev dependencies..."
npm install --save-dev tailwindcss@3.3.0 postcss@8.4.27 autoprefixer@10.4.15 typescript@5.1.6

echo "Creating PostCSS config..."
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "Creating tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

echo "Starting the application..."
npm run dev
