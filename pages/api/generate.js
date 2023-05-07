import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: generatePrompt(question),
    //   temperature: 0,
    // });
    // res.status(200).json({ result: completion.data.choices[0].text });

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: generatePrompt(question) }
      ],
      temperature: 0,
    });
    res.status(200).json({ result: completion.data.choices[0].message.content });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question) {
  return `我正在做问卷测验,我希望得到你的帮助,请你用简洁的语言回答我的问题.注意不要重复我的问题,请直接说出答案

问题: ${question}
答案:`;
}
