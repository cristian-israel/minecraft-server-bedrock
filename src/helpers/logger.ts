type LogContext =
  | "APP"
  | "DOWNLOAD"
  | "BACKUP"
  | "PERMISSIONS"
  | "SERVER"
  | "TELEGRAM"
  | "VALIDATION";
type LogType = "info" | "error" | "success" | "warning";

interface ILogProps {
  context: LogContext;
  message: string;
  type?: LogType;
}

export function logger({ context, message, type = "info" }: ILogProps) {
  const date = getFormattedDate();

  const logColors: Record<LogType, string> = {
    info: "\x1b[34m[INFO]\x1b[0m", // Blue
    error: "\x1b[31m[ERROR]\x1b[0m", // Red
    success: "\x1b[32m[SUCCESS]\x1b[0m", // Green
    warning: "\x1b[33m[WARNING]\x1b[0m", // Yellow
  };

  const contextTag = `\x1b[35m[${context}]\x1b[0m`; // Purple for context
  const timeTag = `\x1b[90m${date}\x1b[0m`; // Gray for timestamp

  console.log(`${timeTag} ${logColors[type]} ${contextTag} ${message}`);
}

function getFormattedDate(): string {
  const now = new Date();
  const date = now.toLocaleDateString("pt-BR");
  const time = now.toLocaleTimeString("pt-BR");
  return `${date} ${time}`;
}
