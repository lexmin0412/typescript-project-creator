export const editorConfig =
	`root = true

[*]
indent_style = tab
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`

export const actionsYml = `name: publish node package

on:
  push:
    branches:
      - master

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 14
          registry-url: https://registry.npmjs.org/
      - run: npm i
      - run: npm run build
      - run: npm publish -access public
        env:
          NODE_AUTH_TOKEN: \${{secrets.npm_token}}`
