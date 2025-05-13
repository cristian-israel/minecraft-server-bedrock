module.exports = {
  apps: [
    {
      name: "minecraft_server_bedrock",
      script: "./dist/index.js", // Arquivo de entrada compilado
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        NODE_NO_WARNINGS: "1",
      },
      env_production: {
        NODE_ENV: "production",
        NODE_NO_WARNINGS: "1",
      },
      env_file: ".env",
      watch: false,
      ignore_watch: ["node_modules", ".cache", "logs"],
      error_file: "./logs/app-err.log",
      out_file: "./logs/app-out.log",
      log_date_format: "YYYY-MM-DD HH:mm",
      max_restarts: 4,
      restart_delay: 5000,
      autorestart: true,
    },
  ],
};
