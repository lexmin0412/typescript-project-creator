import * as fs from 'fs'
import * as path from 'path'
import inquirer from 'inquirer'
import { PackageJson } from 'pkg-types'
import { IInitAPIOptions, init as initAPI } from '../apis/index'
import { getCurrentGitConfig } from '../utils'

/**
 * 初始化 API
 */
export default async function init() {

	const config: PackageJson = {}

	const paths = process.cwd().split(path.sep)
	const pkgJsonPath = path.resolve(process.cwd(), '..', '..', 'package.json')
	const isUnderMonorepo = paths[paths.length - 2] === 'packages' && fs.existsSync(pkgJsonPath)

	const { isPublic } = await inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'isPublic',
				message: '是否作为公共包发布?'
			},
		])

	config.private = !isPublic
	if (isPublic) {
		const { registry, npmPkgName } = await inquirer.prompt([
			{
				type: 'list',
				name: 'registry',
				message: '请选择源',
				choices: [
					'https://registry.npmjs.org/',
					'https://registry.npmmirror.com/',
				],
			},
			{
				type: 'input',
				name: 'npmPkgName',
				message: '请输入包名',
				default: paths[paths.length - 1],
			}
		])
		config.name = npmPkgName
		config.publishConfig = {
			access: 'public',
			registry,
		}
	}

	const vcsConfig: IInitAPIOptions['vcs'] = {}
	const {
		vcsType,
		vcsRepoName
	} = await inquirer.prompt([
		{
			type: 'list',
			name: 'vcsType',
			message: '请选择存储库类型',
			choices: [
				'github',
				'gitlab',
			],
		},
		{
			type: 'input',
			name: 'vcsRepoName',
			message: '请输入仓库名称',
			default: isUnderMonorepo ? paths[paths.length - 3] : paths[paths.length - 1],
		},
	])
	if (isUnderMonorepo) {
		const { vceRepoDir } = await inquirer.prompt([
			{
				type: 'input',
				name: 'vceRepoDir',
				message: '请输入子包目录',
				default: paths.slice(paths.length-2).join('/'),
			},
		])
		vcsConfig.dir = vceRepoDir
	}
	vcsConfig.type = vcsType
	vcsConfig.repoName = vcsRepoName

	if (vcsType === 'github') {
		const currentGitConfig = getCurrentGitConfig()
		const {
			githubUsername,
			githubUserEmail
		} = await inquirer.prompt([
			{
				type: 'input',
				name: 'githubUsername',
				message: 'Github 用户名',
				default: currentGitConfig.name
			},
			{
				type: 'input',
				name: 'githubUserEmail',
				message: 'Github 邮箱',
				default: currentGitConfig.email
			},
		])
		vcsConfig.userConfig = {
			name: githubUsername,
			email: githubUserEmail,
		}
	}

	const { pkgType } = await inquirer.prompt([
		{
			type: 'list',
			name: 'pkgType',
			message: '请选择包类型',
			choices: [
				'cli',
				'lib',
			]
		}
	])

	if (pkgType === 'cli') {
		const {
			binName,
		} = await inquirer.prompt([
			{
				type: 'input',
				name: 'binName',
				message: '请输入 bin 名称',
				default: process.cwd().split(path.sep)?.pop() || '',
			},
		])
		config.bin = {
			[binName]: './lib/cli.js'
		}
	}

	initAPI({
		cwd: process.cwd(),
		pkgJsonConfig: config,
		vcs: vcsConfig,
		pkgType,
	})
}
