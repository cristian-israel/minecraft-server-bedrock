module.exports = {
  apps: [
    {
      name: "minecraft_server_bedrock", // Nome visível no pm2 list
      script: "dist/index.js", // Caminho do script compilado (para TypeScript, normalmente em dist/)
      instances: 1, // Número de instâncias (1 = single-thread)
      autorestart: true,
      watch: false, // Ative se quiser reiniciar ao detectar mudanças
      max_memory_restart: "200M", // Reinicia se passar esse limite
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
