import React from 'react';
import isGit from 'is-git-repository';
import isCommitterSet from './utils/errors.js';
import askForCommitMessage from './utils/commit.js';
import {getOpenAIKey, setOpenAIKey, deleteOPenAIKey} from './utils/api.js';
import Logo from './utils/logo.js';

export default function App({flags}) {
	if (flags.setopenai) {
		setOpenAIKey(flags.setopenai);
	}
	if (flags.delopenai) {
		deleteOPenAIKey();
	}
	if (!getOpenAIKey()) {
		console.log('Please provide an OpenAI API key.');
		console.log(
			'You can get one from https://platform.openai.com/account/api-keys',
		);
		console.log(
			'Run `magicc --setopenai=<api-key>` to save your API key and try again.',
		);
	} else {
		console.log(
			'You have an OpenAI API key, you can now generate a commit message.',
		);
		const gitCheck = isGit();
		const committerCheck = isCommitterSet();
		if (gitCheck && committerCheck) {
			askForCommitMessage();
		} else {
			console.log('This is not a git repository.');
		}
	}
	return <Logo />;
}
