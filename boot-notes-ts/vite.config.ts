import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    build: {
	rollupOptions: {
	    input: {
		popup: resolve(__dirname, 'popup.html'),
		content: resolve(__dirname, 'src/content.ts'),
	    },
	    output: {
		entryFileNames: '[name].js',
		chunkFileNames: 'chunks/[name].js',
		assetFileNames: 'assets/[name].[ext]',
	    }
	},
	outDir: 'dist'
    },
    plugins: [
	viteStaticCopy({
	    targets: [
		{
		    src: 'manifest.json',
		    dest: '.'
		},
		{
		    src: 'icons',
		    dest: '.'
		}
	    ]
	})
    ]
});
