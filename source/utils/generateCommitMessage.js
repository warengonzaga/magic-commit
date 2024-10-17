import openAiModel from '../models/openai.js';
import ollamaModel from '../models/ollama.js';
import config from './config.json';
import {gitDiff, gitStatus, initGit} from './commit.js';

// remove any staged changes in git

async function generateCommitMessage(flags, model) {
	const maxDiffSize = config.maxDiffSize;

	await initGit();
	const status = await gitStatus();

	const gitDiffContent = await gitDiff();
	const {category, message} = await getModelResponse(
		model,
		flags,
		gitDiffContent,
	);

	if (gitDiffContent.length > maxDiffSize) {
		console.log('Diff content is too large. Skipping OpenAI request.');
		return `✨ tweak (${firstFilePath}): update ${firstFilePath}`;
	}

	if (status !== false) {
		return `${category} (${firstFilePath}): ${message}`;
	} else {
		return false;
	}
}

async function getModelResponse(model, flags, gitDiffContent) {
	let response;

	try {
		switch (model) {
			case 'gpt-4o-mini':
				response = await openAiModel(model, flags, gitDiffContent);
				break;
			case 'llama3.1:8b':
				response = await ollamaModel(model, flags, gitDiffContent);
				break;
			default:
				throw new Error('Unsupported model selected');
		}
		console.log('response', response);

		if (response && response.category && response.message) {
			// Destructure and return the required fields
			const {category, message} = response;
			return {category, message};
		} else {
			throw new Error(response.message);
		}
	} catch (error) {
		console.log(error.message);
	}
}

export default generateCommitMessage;
