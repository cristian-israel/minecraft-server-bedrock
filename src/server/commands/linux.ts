import { spawn } from "child_process";

export function killPortProcess(port: number): Promise<void> {
		const killer = spawn("fuser", ["-k", `${port}/udp`]);
		return new Promise<void>((resolve) => {
			killer.on("close", () => resolve());
		});
}
