import inquirer from 'inquirer'
import { PackageJson } from 'pkg-types'
import { IInitAPIOptions, init as initAPI } from '../apis/index'
import { getCurrentGitConfig } from '../utils'

/**
 * 初始化 API
 */
export default async function init() {

	const config: PackageJson = {}

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
		const { registry } = await inquirer.prompt([
			{
				type: 'list',
				name: 'registry',
				message: '请选择源',
				choices: [
					'https://registry.npmjs.org/',
					'https://registry.npmmirror.com/',
				],
			}])
		config.publishConfig = {
			access: 'public',
			registry,
		}
	}

	const vcsConfig: IInitAPIOptions['vcs'] = {}
	const {
		vcsType
	} = await inquirer.prompt([
		{
			type: 'list',
			name: 'vcsType',
			message: '请选择存储库类型',
			choices: [
				'github',
				'gitlab',
			],
		}
	])
	vcsConfig.type = vcsType

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
		pkgType
	})
}
