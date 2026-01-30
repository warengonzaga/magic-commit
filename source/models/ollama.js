import Ollama from 'ollama'; // Import the Ollama model
import config from '../utils/config.json';

async function ollamaModel(model, flags, diffContent) {
	try {
		// Use the prompt from the config file emoji and send to Ollama
		const categoryResponse = await Ollama.chat({
			messages: [
				{role: 'system', content: config.commitConfig.emoji},
				{role: 'user', content: diffContent},
			],
			model,
		});
		// Use the prompt from the config file message and send to Ollama

		const messageResponse = await Ollama.chat({
			messages: [
				{role: 'system', content: config.commitConfig.message},
				{role: 'user', content: diffContent},
			],
			model,
		});
		console.log('categoryResponse', categoryResponse);
		console.log('messageResponse', messageResponse);
		return {
			category: categoryResponse?.message?.content,
			message: messageResponse?.message?.content,
		};
	} catch (error) {
		throw new Error(
			'Failed to connect to local Ollama instance. To start Ollama, first download it at https://ollama.ai.',
		);
	}
}

export default ollamaModel;
