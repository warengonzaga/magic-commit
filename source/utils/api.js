import Conf from 'conf';

const config = new Conf({projectName: 'magicc'});

async function isValidOpenAIKey(apiKey) {
	try {
		const response = await fetch('https://api.openai.com/v1/models', {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});

		if (response.status === 200) {
			return true;
		} else if (response.status === 401) {
			console.error('Invalid API key');
			return false;
		} else {
			console.error('Unexpected response status:', response.status);
			return false;
		}
	} catch (error) {
		console.error('Error while validating API key:', error);
		return false;
	}
}

const setOpenAIKey = key => {
	isValidOpenAIKey(key).then(isValid => {
		if (isValid) {
			console.log('API key is valid');
			config.set('openai', key);
		} else {
			console.log('API key is invalid');
		}
	});
};

const getOpenAIKey = () => {
	return config.get('openai');
};

const deleteOPenAIKey = () => {
	config.delete('openai');
	console.log('OpenAI API key deleted.');
};

export {setOpenAIKey, getOpenAIKey, deleteOPenAIKey};
