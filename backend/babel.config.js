module.exports = {
  presets: [
    '@babel/preset-env',  // This preset supports modern JavaScript features
    '@babel/preset-react', // This preset is for React applications
  ],
  plugins: [
     '@babel/plugin-transform-class-properties'
  ],
};