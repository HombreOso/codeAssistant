import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const production = !process.env.ROLLUP_WATCH

export default fs.readdirSync(path.join(__dirname, 'webviews', 'pages')).map((input) => {
	const name = input.split('.')[0]
	return {
		input: 'webviews/pages/' + input,
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'out/compiled/' + name + '.js',
		},
		plugins: [
			svelte({
				dev: !production,
				// disable CSS output for Svelte
				css: false,
				preprocess: sveltePreprocess(),
			}),
			css({
				output: function (styles) {
					// write all css to the correct bundled file
					fs.writeFileSync('out/compiled/' + name + '.css', styles)
				},
			}),
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),
			typescript({
				tsconfig: 'webviews/tsconfig.json',
				sourceMap: !production,
				inlineSources: !production,
			}),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	}
})
