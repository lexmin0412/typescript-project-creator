import { program } from 'commander'
const pkgJson = require('./../package.json')
import { init } from './commands'

program
.version(pkgJson.version)
.command('init')
.description('create a new project')
.action(()=>{
	try {
		init()
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
})

program.parse()
