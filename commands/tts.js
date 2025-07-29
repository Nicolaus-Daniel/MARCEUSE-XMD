const gTTS = require('gtts');
const fs = require('fs').promises; // Use promises version for async operations
const path = require('path');

async function ttsCommand(sock, chatId, text, message, language = 'en') {
    if (!text) {
        await sock.sendMessage(chatId, { text: 'Please provide the text for TTS conversion.' });
        return;
    }

    const fileName = `tts-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, '..', 'asserts', fileName);

    try {
        // Ensure the assets directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            await fs.mkdir(dir, { recursive: true });
        }

        const gtts = new gTTS(text, language);
        await new Promise((resolve, reject) => {
            gtts.save(filePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await sock.sendMessage(chatId, {
            audio: { url: filePath },
            mimetype: 'audio/mpeg'
        }, { quoted: message });

        // Delete the file after sending
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Error in TTS command:', error);
        await sock.sendMessage(chatId, { text: 'Error generating TTS audio.' });
    }
}

module.exports = ttsCommand;