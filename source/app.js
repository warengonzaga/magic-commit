import React from 'react';
import {Text} from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import getGitDiff from './utils/openai.js';

export default function App() {
	getGitDiff();

	return (
		<>
			<Gradient name="passion">
				<BigText text="Magicc" />
				<Text>You can do `magicc`, you can build anything that you desire. 🪄</Text>
			</Gradient>
		</>
	);
}
