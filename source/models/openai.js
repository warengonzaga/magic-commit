import OpenAI from 'openai';
import config from './config.json';
import dotenv from 'dotenv';

import {getOpenAIKey, setOpenAIKey, deleteOPenAIKey} from './api.js';

dotenv.config();

async function openAiModel(model, flags, diffContent) {
	if (flags.setopenai) {
		setOpenAIKey(flags.setopenai);
	}
	if (flags.delopenai) {
		deleteOPenAIKey();
	}
	if (!getOpenAIKey()) {
		return {
			message:
				'Please provide an OpenAI API key.\n' +
				'You can get one from https://platform.openai.com/account/api-keys\n' +
				'Run `magicc --setopenai=<api-key>` to save your API key and try again.',
		};
	} else {
		console.log(
			'You have an OpenAI API key, you can now generate a commit message.',
		);

		const apiKey = await getOpenAIKey();
		const openai = new OpenAI({apiKey: apiKey});

		const category = await openai.chat.completions.create({
			messages: [
				{role: 'system', content: config.commitConfig.emoji},
				{role: 'user', content: diffContent},
			],
			model,
		});
		// use the prmopt from the config file message and send to openai
		const message = await openai.chat.completions.create({
			messages: [
				{role: 'system', content: config.commitConfig.message},
				{role: 'user', content: diffContent},
			],
			model,
		});

		return {
			category: category.choices[0].message.content,
			message: message.choices[0].message.content,
		};
	}
}

export default openAiModel;
