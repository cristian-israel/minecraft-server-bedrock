module.exports = {
  apps: [
    {
      name: "minecraft_server_bedrock", // Nome visível no pm2 list
      script: "src/index.ts", // Caminho do seu arquivo TypeScript de entrada
      interpreter: "ts-node", // Permite rodar TS direto
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        NODE_NO_WARNINGS: "1", // Ignorar avisos de depreciação
      },
      env_production: {
        NODE_ENV: "production",
        NODE_NO_WARNINGS: "1", // Ignorar avisos de depreciação
      },
      env_file: ".env", // Carrega variáveis do arquivo .env
      watch: false, // Reinicia a aplicação se arquivos mudarem
      ignore_watch: [".cache", "logs", "node_modules"], // Não reinicia se esses diretórios mudarem
      error_file: "./logs/app-err.log", // Arquivo para logs de erro
      out_file: "./logs/app-out.log", // Arquivo para logs de saída
      log_date_format: "YYYY-MM-DD HH:mm", // Formato de data nos logs
      max_restarts: 4, // Número máximo de reinicializações
      restart_delay: 5000, // Atraso entre reinicializações (em milissegundos)
      autorestart: true,
    },
  ],
};
