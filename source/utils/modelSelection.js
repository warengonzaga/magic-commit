import React, {useState} from 'react';
import readline from 'readline';

import isGit from 'is-git-repository';
import SelectInput from 'ink-select-input';
import askForCommitMessage from './commit.js';
import isCommitterSet from './errors.js';
import {Text, Box, useApp} from 'ink';
import config from './config.json';

const ModelSelection = ({flags}) => {
	const {exit} = useApp();
	const [isDisabled, setIsDisabled] = useState(false); // State to disable the options after selection

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const models = config.models;

	const handleSelect = async item => {
		if (item.value) {
			const model = item.value;
			const gitCheck = isGit();
			const committerCheck = await isCommitterSet();
			if (gitCheck && committerCheck) {
				try {
					await askForCommitMessage(flags, model); // Await the function that handles commit message
				} catch (error) {
					rl.close();

					// console.error('Error generating commit message:', error);
					exit();
				}
			} else {
				console.log('This is not a git repository.');
			}
		} else {
			exit();
			rl.close();
		}
	};

	const modelItems = models.map(model => ({
		label: model.title,
		value: model.model, // Model name to pass to generatePrompt
	}));

	return (
		<Box flexDirection="column">
			<Text>Select a model:</Text>
			{!isDisabled && ( // Conditionally render the SelectInput based on whether a selection has been made
				<SelectInput items={modelItems} onSelect={handleSelect} />
			)}
			{isDisabled && <Text>Model selection in progress...</Text>}
		</Box>
	);
};

export default ModelSelection;
