import React from 'react';
import {Text} from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import getGitDiff from './utils/openai.js';
import info from './utils/info.js';

export default function App() {
	// getGitDiff();
	return (
		<>
			<Text color='yellow'>Note: Coming Soon... Follow @warengonzaga for updates</Text>
			<Gradient name='passion'>
				<BigText text='Magicc' />
				<Text>You can do `magicc`, you can build anything that you desire. 🪄</Text>
			</Gradient>
			<Text>Version: <Text color='green'>{info('version')}</Text> | Author: <Text color='blue'>{info('author')}</Text></Text>
		</>
	);
}
