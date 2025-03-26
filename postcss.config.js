/**
 * PostCSS Configuration
 * 
 * This file contains the configuration for PostCSS.
 * Previously, this was a bridge file that imported from the config directory.
 * Now the configuration is directly in this file following best practices.
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
