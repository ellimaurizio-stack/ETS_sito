module.exports = {
  apps: [{
    name: "vanilla-cms",
    script: "./server.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
