import { defineConfig } from 'vite';
import fs from 'fs';

// Load .env.example into process.env when .env is not present so
// developers who put keys into .env.example for quick testing get a working dev server.
// NOTE: It's still recommended to copy values into .env or .env.local and NOT commit secrets.
export default defineConfig(() => {
	try {
		const examplePath = new URL('./.env.example', import.meta.url).pathname;
		if (fs.existsSync(examplePath)) {
			const raw = fs.readFileSync(examplePath, 'utf8');
			const lines = raw.split(/\r?\n/);
			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith('#')) continue;
				const eq = trimmed.indexOf('=');
				if (eq === -1) continue;
				const key = trimmed.slice(0, eq).trim();
				let val = trimmed.slice(eq + 1).trim();
				if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
					val = val.slice(1, -1);
				}
				if (key && val && !process.env[key]) process.env[key] = val;
			}
		}
	} catch (e) {
		// ignore parsing errors
	}

	return {};
});
