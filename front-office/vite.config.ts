import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Front-office dev server runs on port 5173 (see package.json).
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
});
