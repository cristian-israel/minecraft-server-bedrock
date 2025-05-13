module.exports = {
  apps: [
    {
      name: "minecraft_server_bedrock", // Nome visível no pm2 list
      script: "src/index.ts", // Caminho do seu arquivo TypeScript de entrada
      interpreter: "ts-node", // Permite rodar TS direto
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
