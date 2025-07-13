import {execa} from 'execa';
import OpenAI from 'openai';
import config from './config.json';
import {getOpenAIKey} from './api.js';
import dotenv from 'dotenv';

dotenv.config();

// remove any staged changes in git
async function initGit() {
	try {
		await execa('git', ['restore', '--staged', '.']);
	} catch (error) {
		console.error(error);
	}
}

// git status to see if there are any changes
// if there's any changes add the first file in the list of changes
let firstFilePath = '';

async function gitStatus() {
	try {
		const {stdout: status} = await execa('git', ['status', '--porcelain']);
		if (status) {
			// get the first file path in the list of changes
			const lines = status.split('\n');
			const filePaths = lines
				.map(line => line.split(' ').slice(2).join(' ').trim())
				.filter(filePath => filePath !== '')
				.concat(
					lines
						.filter(line => line.startsWith('??'))
						.map(line => line.split(' ').slice(1).join(' ').trim()),
				);
			// git add the first file in the list of changes
			firstFilePath = filePaths[0];
			await execa('git', ['add', firstFilePath]);
			console.log(`${firstFilePath} has been added to the staging area.`);
		} else {
			console.log('No changes to commit.');
			return false;
		}
	} catch (error) {
		console.error(error);
	}
}

// get the diff of the staged changes
async function gitDiff() {
	try {
		const {stdout: gitDiff} = await execa('git', ['diff', '--staged']);
		return gitDiff;
	} catch (error) {
		console.error(error);
	}
}

async function generatePrompt() {
	const apiKey = await getOpenAIKey();
	const openai = new OpenAI({apiKey: apiKey});
	const maxDiffSize = config.maxDiffSize;

	// get the staged changes
	await initGit();
	await gitStatus();
	const gitDiffContent = await gitDiff();

	if (gitDiffContent.length > maxDiffSize) {
		console.log('Diff content is too large. Skipping OpenAI request.');
		return `✨ tweak (${firstFilePath}): update ${firstFilePath}`;
	}

	// use the prompt from the config file emoji and send to openai
	const category = await openai.chat.completions.create({
		messages: [
			{role: 'system', content: config.emoji},
			{role: 'user', content: gitDiffContent},
		],
		model: config.default_model,
	});
	// use the prmopt from the config file message and send to openai
	const message = await openai.chat.completions.create({
		messages: [
			{role: 'system', content: config.message},
			{role: 'user', content: gitDiffContent},
		],
		model: config.default_model,
	});

	if ((await gitStatus()) !== false) {
		return `${category.choices[0].message.content} (${firstFilePath}): ${message.choices[0].message.content}`;
	} else {
		return false;
	}
}

export default generatePrompt;
