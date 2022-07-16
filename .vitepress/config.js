import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TypeScript Project Creator',
  description: 'A tool for building TypeScript projects Only.',
	base: '/typescript-project-creator/',
	lastUpdated: true,
	themeConfig: {
		siteTitle: 'TPC',
		nav: [
			{ text: 'Home', link: '/' },
			{
				text: 'More tools',
				items: [
					{
						text: 'Toolbar',
						link: 'https://lexmin0412.github.io/advanced-stack-park/'
					}
				]
			}
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
	}
})
