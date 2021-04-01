import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://github.com/vitejs/vite/issues/1927#issuecomment-805803918
const prefix = `monaco-editor/esm/vs`;

export default defineConfig({
  plugins: [vue(), vueJsx({})],
  base: "./",
  build: {
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // https://github.com/vitejs/vite/issues/1927#issuecomment-805803918
        manualChunks: {
          jsonWorker: [`${prefix}/language/json/json.worker`],
          cssWorker: [`${prefix}/language/css/css.worker`],
          htmlWorker: [`${prefix}/language/html/html.worker`],
          tsWorker: [`${prefix}/language/typescript/ts.worker`],
          editorWorker: [`${prefix}/editor/editor.worker`],
        },
      },
    },
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },

  optimizeDeps: {
    include: [
      `${prefix}/language/json/json.worker`,
      `${prefix}/language/css/css.worker`,
      `${prefix}/language/html/html.worker`,
      `${prefix}/language/typescript/ts.worker`,
      `${prefix}/editor/editor.worker`,
    ],
  },
});
