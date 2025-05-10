import { spawn } from "child_process";

export function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const command = `netstat -ano | findstr :${port}`;
    const process = spawn(command, { shell: true });

    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (errorOutput) {
        return reject(new Error(errorOutput));
      }
      // Se houve alguma saída, então a porta está em uso
      const inUse = output.trim().length > 0;
      resolve(inUse);
    });

    process.on("error", (err) => {
      reject(err);
    });
  });
}

export function killPortProcess(port: number): Promise<void> {
  const command = spawn("powershell.exe", [
    "-Command",
    `
			$port = ${port};
			$p = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue;
			if ($p) {
				$pid = $p.OwningProcess;
				Stop-Process -Id $pid -Force;
			}
		`,
  ]);

  return new Promise<void>((resolve) => {
    command.on("close", () => resolve());
  });
}
