import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TypeScript Project Creator',
  description: 'A tool for building TypeScript projects Only.',
	base: '/typescript-project-creator/',
	lastUpdated: true,
	themeConfig: {
		footer: {
			message: 'Created By Lexmin0412',
		},
		siteTitle: 'TPC',
		logo: 'https://via.placeholder.com/1500/ffffff/45aafa/?text=TPC',
		nav: [
			{ text: 'Github', link: 'https://github.com/lexmin0412/typescript-project-creator' },
			{
				text: 'More Tools',
				items: [
					{
						text: 'MPP',
						link: 'https://github.com/lexmin0412/make-pkg-perfect'
					},
					{
						text: 'Toolbar',
						link: 'https://lexmin0412.github.io/advanced-stack-park/'
					},
					{
						text: 'Awesome Wheels',
						link: 'https://lexmin0412.github.io/awesome-wheels/'
					}
				]
			},
			{
				text: 'Find me',
				items: [
					{
						text: 'Github',
						link: 'https://github.com/lexmin0412'
					}
				]
			},
		],
		sidebar: [
			{
				text: 'Introduction',
				items: [
					{
						text: 'Getting Started',
						link: '/guide'
					}
				]
			}
		],
		lastUpdatedText: 'Last Updated',
		editLink: {
      pattern: 'https://github.com/lexmin0412/typescript-project-creator/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
	}
})
