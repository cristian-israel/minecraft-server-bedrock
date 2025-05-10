import fs from "fs";
import path from "path";

export default function cleanServerDir(SERVER_DIR: string): void {
  if (!fs.existsSync(SERVER_DIR)) return;

  const files = fs.readdirSync(SERVER_DIR);

  for (const file of files) {
    const fullPath = path.join(SERVER_DIR, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}
