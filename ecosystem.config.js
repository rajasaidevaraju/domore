module.exports = {
  apps: [
    {
      name: "domore",
      script: "npm",
      args: "start",
      cwd: ".",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};