import React from 'react';
import {Text, Newline} from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import info from './utils/info.js';
import askForCommitMessage from './utils/commit.js';
import { getOpenAIKey, setOpenAIKey, deleteOPenAIKey } from './utils/api.js';

export default function App({flags}) {
	if(flags.setopenai) {
		setOpenAIKey(flags.setopenai);
	}
	if(flags.delopenai) {
		deleteOPenAIKey();
	}
	if (!getOpenAIKey()) {
		console.log('Please provide an OpenAI API key.');
		console.log('You can get one from https://platform.openai.com/account/api-keys')
		console.log('Run `magicc --setopenai=<api-key>` to save your API key and try again.');
	} else {
		console.log('You have an OpenAI API key, you can now generate a commit message.');
		askForCommitMessage();
	}
	return (
		<>
			<Gradient name='passion'>
				<BigText text='Magicc' />
				<Text>You can do `magicc`, you can build anything that you desire. 🪄</Text>
			</Gradient>
			<Text>
				Version: <Text color='green'>{info('version')}</Text> | 
				Author: <Text color='blue'>{info('author')}</Text><Newline/>
				<Text>
					Need Help? <Text color="cyan">magicc --help</Text>
				</Text><Newline/>
				==================================================
			</Text>
		</>
	);
}
