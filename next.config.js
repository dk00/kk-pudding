const withPWA = require('next-pwa')({
  dest: 'public',
  fallbacks: {
    document: '/offline-home.html',
  }
})

module.exports = withPWA({
  output: 'export'
})