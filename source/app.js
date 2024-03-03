import React from 'react';
import {Text} from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

export default function App() {
	return (
		<>
			<Gradient name="passion">
				<BigText text="Magicc" />
				<Text>You can do `magicc`, you can commit anything that you desire. 🪄</Text>
			</Gradient>
		</>
	);
}
