import Conf from 'conf';

const config = new Conf({projectName: 'magicc'});

const setOpenAIKey = (key) => {
  if (!key.startsWith('sk-') || key.length !== 51) {
    console.error('Invalid OpenAI API key. Please provide a valid key.');
  } else {
    config.set('openai', key);
  }
};

const getOpenAIKey = () => {
  return config.get('openai');
}

const deleteOPenAIKey = () => {
  config.delete('openai');
  console.log('OpenAI API key deleted.');
}

export {setOpenAIKey, getOpenAIKey, deleteOPenAIKey};
