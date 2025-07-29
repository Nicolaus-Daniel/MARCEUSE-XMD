const os = require('os');
const settings = require("../settings");

function runtime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        // Show reaction emoji
        await sock.sendMessage(chatId, {
            react: { text: '🌩', key: message.key}
});

        const message1 = `
╭━━✧★☞ ᗒ𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈ᗕ ✧━━❖
┊✺┌────••••。゜゜😈 🦀 ゜゜。────⊷
┃★│◎ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥: ᚛𝙽𝚒𝚌𝚘𝚕𝚊𝚞𝚜 𝙳𝚊𝚗𝚒𝚎𝚕 2😈😈😈᚜
┃★│◎ 𝗣𝗥𝗘𝗙𝗜𝗫: [ ${settings.prefix} ]
┃★│◎ 𝗠𝗢𝗗𝗘: ${settings.commandMode}
┃★│◎ 𝗥𝗔𝗠: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃★│◎ 𝗥𝘂𝗻𝗧𝗶𝗺𝗲: ${runtime(process.uptime())}
┃★│◎ 𝗛𝗢𝗦𝗧: ${os.hostname()}
┃★│◎ 𝗣𝗟𝗔𝗧𝗙𝗢𝗥𝗠: ${os.platform()}
┃★│◎ 𝗨𝘀𝗲𝗿𝗕𝗼𝘁: ${settings.botOwner}
┃★│◎ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${settings.version}
┊   └────••••๐·°৹̵😈 🦀 ৹°·๐────⊷
╰━━━••✧© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝚒𝚌𝚘𝚕𝚊𝚞𝚜😈 & 𝙰𝚕𝚒𝚢🦀✧••━━━◆
`;

        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363375814828971@newsletter',
                    newsletterName: 'MARCEUSE-XMD😈',
                    serverMessageId: -1
}
}
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in alive command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Bot is alive but encountered an error displaying full info.',
            quoted: message
});
}
}

module.exports = aliveCommand;