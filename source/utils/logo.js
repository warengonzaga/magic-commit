import React from 'react';
import info from './info.js';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import {Text, Newline} from 'ink';
import ModelSelection from './modelSelection.js';

export default function Logo(children) {
	return (
		<>
			<Gradient name="passion">
				<BigText text="Magicc" />
				<Text>
					You can do `magicc`, you can build anything that you desire. 🪄
				</Text>
			</Gradient>
			<Text>
				Version: <Text color="green">{info('version')}</Text> | Author:{' '}
				<Text color="blue">{info('author')}</Text>
				<Newline />
				<Text>
					Need Help? <Text color="cyan">magicc --help</Text>
				</Text>
				<Newline />
				==================================================
			</Text>
			<ModelSelection {...children} />

		</>
	);
}
