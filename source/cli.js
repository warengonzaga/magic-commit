#!/usr/bin/env node
import React from 'react';
import meow from 'meow';
import App from './app.js';
import Logo from './utils/logo.js';
import { render } from 'ink';

render(<Logo />, {patchConsole: false});

const cli = meow(
	`Usage
			$ magicc

		Options
			--setopenai, -s  OpenAI API key
			--delopenai, -d  Delete OpenAI API key
			--help        Show help
			--version     Show version

		Examples
			$ magicc -s=sk-<api-key>
	`,
	{
		importMeta: import.meta,
		flags: {
			setopenai: {
				type: 'string',
				alias: 's',
			},
			delopenai: {
				type: 'boolean',
				alias: 'd',
			},
		},
	},
);

render(<App flags={cli.flags} />, {patchConsole: false});
