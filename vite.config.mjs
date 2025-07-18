import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isDev = mode === "development";

    return {
        plugins: [
            react(),
            svgr({
                // svgr options: https://react-svgr.com/docs/options/
                svgrOptions: {
                    // ...
                },
                // esbuild options, to transform jsx to js
                esbuildOptions: {
                    // ...
                },
                // A minimatch pattern to include files
                include: "**/*.svg",
                // A minimatch pattern to exclude files
                exclude: "",
            }),
            // This plugin copies the correct manifest and other static files
            viteStaticCopy({
                targets: [
                    {
                        src: isDev ? "manifest.dev.json" : "manifest.prod.json",
                        dest: ".",
                        rename: "manifest.json",
                    },
                    {
                        src: "background.js",
                        dest: ".",
                    },
                ],
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        build: {
            // This is important for the hot-reload plugin to work correctly
            sourcemap: isDev ? "inline" : false,
            emptyOutDir: true,
        },
    };
});
