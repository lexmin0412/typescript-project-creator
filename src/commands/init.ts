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
		const {
			githubUsername,
		} = await inquirer.prompt([
			{
				type: 'input',
				name: 'githubUsername',
				message: 'Github 用户名',
				default: getCurrentGitConfig().name
			},
		])
		vcsConfig.githubUsername = githubUsername
	}

	initAPI({
		cwd: process.cwd(),
		pkgJsonConfig: config,
		vcs: vcsConfig
	})
}
