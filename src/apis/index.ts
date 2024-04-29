import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { editorConfig, actionsYml } from './../files/index'
import ora, {Ora} from 'ora'
import { getCurrentGitConfig, printEmptyLine } from './../utils/index'
import { PackageJson } from 'pkg-types'

interface FileItem {
	path: string
	content: string
}

interface IInitAPIOptions {
	cwd: string
	pkgJsonConfig?: PackageJson
	fileList?: FileItem[]
	dependencies?: Record<string, string>
}

export function init(options: IInitAPIOptions) {

	if (!options.cwd) {
		console.error('No cwd provided.')
		process.exit(1)
	}

	const message = 'init project'
	const spinner = ora(message).start()

	if (!fs.existsSync(path.resolve(options.cwd, 'package.json'))) {
		spinner.fail()
		console.error('No package.json found - create a new one with: npm init.')

		process.exit()
	}

	printEmptyLine()

	modifyPackage(spinner, options)
	spinner.succeed(spinner.text)

	createFiles(spinner, options)

	spinner.succeed(spinner.text)

	spinner.text = 'Installing custom dependencies and typescript, ts-node, rimraf...'

	execSync('pnpm add -D typescript ts-node rimraf @types/node', {
		stdio: 'inherit',
		cwd: options.cwd,
	})

	spinner.succeed(spinner.text)

	spinner.stop()
	console.log('✓ 3/3 Done!')

	info()
}

function modifyPackage(spinner: Ora, options: IInitAPIOptions) {
	spinner.text = 'Adding stuff to package.json...'
	const pkg = fs.readFileSync(path.resolve(options.cwd, 'package.json')).toString()
	let json: PackageJson = JSON.parse(pkg)

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

	// 仓库相关信息 start
	const { name, email } = getCurrentGitConfig()
	// 作者信息
	json.author = {
		name,
		email,
		url: `https://github.com/${name}`,
	}
	// 仓库相关信息 end

	json = {
		...json,
		...options?.pkgJsonConfig,  // 写入用户输入的配置
	}

	const packageJsonPath = path.resolve(options.cwd, 'package.json')
	fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2))
}

function createFiles(spinner: Ora, options: IInitAPIOptions) {
	spinner.text = 'Creating files and directories...'

	const resolvePath = (subPath: string) => path.resolve(options.cwd, subPath)

	// 需要新建的目录
	const validatePaths = [resolvePath('src'), resolvePath('test')]
	validatePaths.forEach(path => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path)
		}
	})

	if (!fs.existsSync(resolvePath('.github'))) {
		fs.mkdirSync(resolvePath('.github'))
		fs.mkdirSync(resolvePath('.github/workflows'))
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
	fs.writeFileSync(resolvePath('tsconfig.json'), JSON.stringify(tsConfig, null, 2))
	fs.appendFileSync(resolvePath('.gitignore'), 'lib\nes\nnode_modules')
	fs.writeFileSync(resolvePath('.github/workflows/npmPublish.yml'), actionsYml)
	fs.writeFileSync(resolvePath('.editorConfig'), editorConfig)

	// 自定义的文件列表
	options.fileList?.forEach(file => {
		const filePath = resolvePath(file.path)
		fs.writeFileSync(filePath, file.content)
 	})
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
