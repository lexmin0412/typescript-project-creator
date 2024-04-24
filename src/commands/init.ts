import inquirer from 'inquirer'
import { PackageJson } from 'pkg-types'
import { init as initAPI } from '../apis/index'

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

	initAPI({
		cwd: process.cwd(),
		pkgJsonConfig: config
	})
}
