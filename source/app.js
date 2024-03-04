import React from 'react';
import {Text, Newline} from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import info from './utils/info.js';
import askForCommitMessage from './utils/commit.js';

export default function App() {
	askForCommitMessage();
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
