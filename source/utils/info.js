import packageJSON from '../../package.json';

const {author, version} = packageJSON;

const info = info => {
	if (info === 'version') {
		return version;
	}

	if (info === 'author') {
		return author;
	}

	return console.error('Invalid info type');
};

export default info;
