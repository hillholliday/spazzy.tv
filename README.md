# Spazzy.tv
Finding random twitch streamers through the power of rng

## about
This project leverages a few modern web technologies
- [React](https://facebook.github.io/react/)
- [Webpack](https://webpack.github.io/)
- ES2015 via Babel-Loader
- SCSS, Compass, Bourbon
- [Yeoman](http://yeoman.io/)
- [Grunt](http://gruntjs.com/)
- [Twitch.tv API](https://github.com/justintv/Twitch-API)

## running the project
```bash
# Install the project
npm install

# Start for development
npm start # or
npm run serve

# Start the dev-server with the dist version
npm run serve:dist

# Just build the dist version and copy static files
npm run dist

# Run unit tests
npm test

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint

# Clean up the dist directory
npm run clean

# Just copy the static assets
npm run copy
```