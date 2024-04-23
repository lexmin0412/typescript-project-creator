import { execSync } from 'child_process'
import * as fs from 'fs'
import { editorConfig, actionsYml } from './files/index'
import { program } from 'commander'
const pkgJson = require('./../package.json')
import ora, {Ora} from 'ora'
import { printEmptyLine } from './utils/index'

program
.version(pkgJson.version)
.command('init')
.description('create a new project')
.action(()=>{
	try {
		main()
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
})

program.parse()

const noop = (_: any) => { }

function main() {

	const message = 'init project'
	const spinner = ora(message).start()

	if (!fs.existsSync('package.json')) {
		spinner.fail()
		console.error('No package.json found - create a new one with: npm init.')

		process.exit()
	}

	printEmptyLine()

	spinner.text = 'Installing typescript, ts-node, rimraf...'

	execSync('pnpm add -D typescript ts-node rimraf @types/node', {
		stdio: 'inherit',
	})

	spinner.succeed(spinner.text)

	modifyPackage(spinner)
	spinner.succeed(spinner.text)

	createFiles(spinner)

	spinner.succeed(spinner.text)
	spinner.stop()
	console.log('✓ 3/3 Done!')

	info()
}

function modifyPackage(spinner: Ora) {
	spinner.text = 'Adding stuff to package.json...'
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
	json.publishConfig = {
		access: 'public',
		registry: 'https://registry.npmjs.org',
	}

	fs.writeFileSync('package.json', JSON.stringify(json, null, 2))
}

function createFiles(spinner: Ora) {
	spinner.text = 'Creating files and directories...'
	if (!fs.existsSync('src')) fs.mkdirSync('src')
	if (!fs.existsSync('test')) fs.mkdirSync('test')
	if (!fs.existsSync('.github')) {
		fs.mkdirSync('.github')
		fs.mkdirSync('.github/workflows')
	}

	const tsConfig = {
		compilerOptions: {
			moduleResolution: 'node',
			lib: ['es6'],
			alwaysStrict: true,
			strictNullChecks: true,
			noImplicitAny: true,
		},
		includes: ['src/*'],
	}
	fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2))
	fs.appendFileSync('.gitignore', 'lib\nes\nnode_modules')
	fs.writeFileSync('.github/workflows/npmPublish.yml', actionsYml)
	fs.writeFileSync('.editorConfig', editorConfig)
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
