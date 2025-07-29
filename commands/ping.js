const os = require('os');
const settings = require('../settings');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days> 0) time += `${days}d `;
    if (hours> 0) time += `${hours}h `;
    if (minutes> 0) time += `${minutes}m `;
    if (seconds> 0) time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: 'Pong!'}, { quoted: message});
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeFormatted = formatTime(process.uptime());

        const botInfo = `
〔🚘  𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈  〕
🌼 ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟♥️ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟ ⃟🌼
ⵗⵗ̥̥̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̥ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̊̊

┃ 💥 𝗣𝗶𝗻𝗴: ${ping} ms
┃ 🌧 𝗥𝘂𝗻𝘁𝗶𝗺𝗲: ${uptimeFormatted}
┃ ⚡ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: v${settings.version}
┗━━━━━━━━━━━━━━━━━━━┛`.trim();

        const sentMsg = await sock.sendMessage(chatId, { text: botInfo}, { quoted: message});

        // 🩸 Add reaction emoji to the message
        await sock.sendMessage(chatId, {
            react: { text: '🩸', key: sentMsg.key}
});

} catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, {
            text: `❌ Failed to get bot status.\n\nError: ${error.message}`,
            quoted: message
});
}
}

module.exports = pingCommand;