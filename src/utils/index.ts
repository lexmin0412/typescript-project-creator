import { execSync } from "child_process";

export const printEmptyLine = () => console.log('');

export const getCurrentGitConfig = () => {
	const currentUserName = execSync('git config --get user.name').toString().trim()
	const currentUserEmail = execSync('git config --get user.email').toString().trim()
	return {
		name: currentUserName,
		email: currentUserEmail
	}
}
