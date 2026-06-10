import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const clientRoot = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, clientRoot, "");

  return {
    root: clientRoot,
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT || 5173),
      proxy: {
        "/api": env.VITE_DEV_API_TARGET || "http://localhost:5000"
      }
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT || 4173)
    }
  };
});
