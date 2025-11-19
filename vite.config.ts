import { defineConfig } from 'vite'
import { resolve } from 'path'

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
		assetFileNames: (assetInfo) => {
		    if (assetInfo.name?.endsWith('.png')) {
			return 'icons/[name].[ext]';
		    }
		    return 'assets/[name].[ext]';
		},
	    }
	},
	outDir: 'dist'
    },
    plugins: []
});
