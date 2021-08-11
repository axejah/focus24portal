const textToSpeech = require('@google-cloud/text-to-speech');
const path = require('path');
const fs = require('fs');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient();

exports.audioIndexPage = (req, res) => {
  return res.render('portal/apps/tts/');
};

exports.generateAudio = async (req, res) => {
  const { bestandsnaam, bericht, stem, useSsml } = req.body;

  const availableVoices = [
    'nl-NL-Wavenet-B',
    'nl-NL-Wavenet-A',
    'nl-NL-Wavenet-C',
    'nl-NL-Wavenet-D',
    'nl-NL-Wavenet-E',
  ];

  let useVoice = availableVoices.includes(stem) ? stem : 'nl-NL-Wavenet-D';

  const request = {
    audioConfig: {
      audioEncoding: 'LINEAR16',
      effectsProfileId: ['telephony-class-application'],
      pitch: 0,
      speakingRate: 1,
    },
    input: useSsml ? { ssml: bericht } : { text: bericht },
    voice: { languageCode: 'nl-NL', name: useVoice },
    audioConfig: { audioEncoding: 'MP3' },
  };

  // for uniqueness filename + timestamp
  const genFileName = `${bestandsnaam}-${Date.now()}`;

  try {
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);

    // filepath "/audio/--filename"
    await writeFile(
      path.join(__dirname + `../../public/audio/${genFileName}.mp3`),
      response.audioContent,
      'binary'
    );
  } catch (err) {
    if (err) console.log(err);
  }

  const audio = {
    url: `/audio/${genFileName}.mp3`,
    filename: bestandsnaam,
  };

  return res.render('portal/apps/tts/generated', { audio });
};
