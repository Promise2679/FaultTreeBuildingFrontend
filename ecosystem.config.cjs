module.exports = {
  apps: [
    {
      exec_mode: 'cluster',
      instances: 'max',
      name: 'NuxtAppName',
      port: '3000',
      script: './.output/server/index.mjs'
    }
  ]
}
