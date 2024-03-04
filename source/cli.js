#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
		Usage
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

render(<App flags={cli.flags}/>);
