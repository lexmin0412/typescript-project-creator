import { exec } from 'child_process'
import * as fs from 'fs'

const tsConfig = {
	compilerOptions: {
		moduleResolution: 'node',
		lib: ['es6'],
		alwaysStrict: true,
		strictNullChecks: true,
		noImplicitAny: true,
	},
	files: ['src/index.ts'],
}

const editorConfig =
`root = true

[*]
indent_style = tab
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`

const actionsYml = `name: publish node package

on:
  push:
    branches:
      - master

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 14
          registry-url: https://registry.npmjs.org/
      - run: npm i
      - run: npm run build
      - run: npm publish -access public
        env:
          NODE_AUTH_TOKEN: \${{secrets.npm_token}}`

const noop = (_: any) => { }

function main() {
	if (!fs.existsSync('package.json')) {
		console.error('No package.json found - create a new one with: npm init.')

		process.exit()
	}

	console.log('1. Installing typescript, ts-node, rimraf...')
	exec('pnpm add -D typescript ts-node rimraf @types/node', (err: any, _, stderr: any) => {
		if (stderr) {
			console.error(stderr)
		}

		if (err) {
			console.error(err)

			process.exit()
		}

		console.log('✓ 1/3 Done!')

		modifyPackage()
		createFiles()

		info()
	})
}

function modifyPackage() {
	console.log('2. Adding stuff to package.json...')

	const pkg = fs.readFileSync('package.json').toString()
	const json = JSON.parse(pkg)

	if (!json.scripts) {
		json.scripts = {}
	}

	Object.assign(json.scripts, {
		'build:commonjs':
			'rimraf lib && tsc --target es5 --outDir lib --module commonjs --declaration',
		'build:es': 'rimraf es && tsc --target es6 --outDir es --module es6',
		build: 'npm run build:commonjs && npm run build:es',
		ts: 'ts-node src/',
		prepublishOnly: 'npm run build',
	})

	json.files = ['es', 'lib']

	json.main = './lib/index.js'
	json.types = './lib/index.d.ts'
	json.module = json['jsnext:main'] = './es/index.js'

	fs.writeFileSync('package.json', JSON.stringify(json, null, 2))

	console.log('✓ 2/3 Done!')
}

function createFiles() {
	console.log('3. Creating files and directories...')

	if (!fs.existsSync('src')) fs.mkdirSync('src')
	if (!fs.existsSync('test')) fs.mkdirSync('test')
	if (!fs.existsSync('.github')) {
		fs.mkdirSync('.github')
		fs.mkdirSync('.github/workflows')
	}

	fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2))
	fs.appendFileSync('.gitignore', 'lib\nes\nnode_modules')
	fs.writeFileSync('.github/workflows/npmPublish.yml', actionsYml)
	fs.writeFileSync('.editorConfig', editorConfig)

	console.log('✓ 3/3 Done!')
}

function info() {
	console.log('---')
	console.log('Files:')
	console.log('src/            - source files')
	console.log('test/           - test files')
	console.log('es/             - ES6 build files')
	console.log('lib/            - CommonJS (npm) build files')
	console.log('tsconfig.json   - TypeScript config')
	console.log()
	console.log('Scripts:')
	console.log('npm run build   - build project')
	console.log('npm run ts      - run project with ts-node')
	console.log('---')
	console.log('Enjoy your coding! :)')
}

main()
