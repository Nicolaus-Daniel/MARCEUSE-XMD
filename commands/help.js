const settings = require('../settings');
const os = require("os");
const fs = require('fs');
const path = require('path');

// Function to format uptime
function getUptimeFormatted() {
    const totalSeconds = process.uptime();
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function helpCommand(sock, chatId, message) {
    const uptimeFormatted = getUptimeFormatted(); // Calculate uptime
    const helpMessage = `
╭━━━《 𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈 》━━━━━┈⊷
┃❍⁠⁠╭──────────────
┃❍⁠⁠│▸  *Usᴇʀ* : ${settings.botOwner}
┃❍⁠⁠│▸  *ʙᴀɪʟᴇʏs* : 𝐌𝐮𝐥𝐭𝐢 𝐝𝐞𝐯𝐢𝐜𝐞
┃❍⁠⁠│▸  *𝖳ʏᴘᴇ* : 𝐍𝐨𝐝𝐞𝐣𝐬
┃❍⁠⁠│▸  *RunTime* : ${uptimeFormatted}
┃❍⁠⁠│▸  *ᴘʟᴀᴛғᴏʀᴍ* : ${os.hostname()}
┃❍⁠⁠│▸  *ᴏᴡɴᴇʀ ɴᴜᴍʙᴇʀ* : ${settings.ownerNumber}
┃❍⁠⁠│▸  *ᴍᴏᴅᴇ* : [ . ]
┃❍⁠⁠│▸  *ᴄᴏᴍᴍᴀɴᴅs* : 147
┃❍⁠⁠│▸  *𝖣ᴇᴠᴇʟᴏᴘᴇʀ* : Nicolaus Daniel 2😈😈😈
┃❍⁠⁠│▸  *Dev Number* : +255652398614
┃❍⁠⁠│▸  *Assintant Dev* : Aliy Abdarazul🦀
┃❍⁠⁠│▸  *Assintant Dev Number* : +255683825288
┃❍⁠⁠│▸  *𝖵ᴇʀsɪᴏɴ* : ${settings.version}
┃❍⁠⁠╰──────────────
╰━━━━━━━━━━━━━━━━━━━┈⊷
*𝐀𝐯𝐚𝐢𝐥𝐥𝐚𝐛𝐥𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬:*
╭━━━━━━━━━━━━━━━┈⊷
┃  *General Commands 19*:
║ • help
║ • menu
║ • ping
║ • alive
║ • tts <text>
║ • owner
║ • joke
║ • quote
║ • fact
║ • weather <city>
║ • news
║ • attp <text>
║ • lyrics <song_title>
║ • 8ball <question>
║ • groupinfo
║ • staff or .admins 
║ • vv
║ • trt <text> <lang>
║ • jid
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━┈⊷
┃ *Admin Commands 21*:
║ • ban @user
║ • promote @user
║ • demote @user
║ • mute <minutes>
║ • unmute
║ • delete or .del
║ • kick @user
║ • warnings @user
║ • warn @user
║ • antilink on
║ • antilink set delete
║ • antilink set warning
║ • antilink set kick
║ • antibadword
║ • clear
║ • tag <message>
║ • tagall
║ • chatbot
║ • resetlink
║ • welcome <on/off>
║ • goodbye <on/off>
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━┈⊷
┃ *Owner Commands 9*:
║ • mode public
║ • mode self
║ • autostatus
║ • clearsession
║ • .antidelete
║ • cleartmp
║ • setpp <reply to image>
║ • autoreact on
║ • autoreact off
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━┈⊷
┃ *Screenshot Tools: 10*:
║ • galaxys5 <link>
║ • ss <link>
║ • ssweb <link>
║ • iphone14promax <link>
║ • iphone12pro <link>
║ • iphonX <link>
║ • iphone6plus <link>
║ • iphone6 <link>
║ • iphone5 <link>
║ • maxage <link>
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━━┈⊷
┃ *Image/Sticker Commands 7*:
║ • blur <image>
║ • simage <reply to sticker>
║ • sticker <reply to image>
║ • tgsticker <Link>
║ • meme
║ • take <packname> 
║ • emojimix <emj1>+<emj2>
╰━━━━━━━━━━━━━━━┈⊷ 
╭━━━━━━━━━━━━━━━┈⊷
┃ *Game Commands 7*:
║ ❐ tictactoe @user
║ ❐ hangman
║ ❐ guess <letter>
║ ❐ trivia
║ ❐ answer <answer>
║ ❐ truth
║ ❐ dare
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━┈⊷
┃ *AI Commands 8*:
║ ❐  gpt <question>
║ ❐  llama <question>
║ ❐  openai <question>
║ ❐  gemini <question>
║ ❐  mi <prompt>
║ ❐  image-generate <prompt>
║ ❐  imagine <prompt>
║ ❐  flux <prompt>
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━━┈⊷
┃ *Fun Commands 11*:
║ ❐ compliment @user
║ ❐ insult @user
║ ❐ flirt 
║ ❐ shayari
║ ❐ goodnight
║ ❐ roseday
║ ❐ character @user
║ ❐ wasted @user
║ ❐ ship @user
║ ❐ simp @user
║ ❐ stupid @user [text]
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━┈⊷
┃ *Textmaker 37*:
║ • metallic <text>
║ • ice <text>
║ • snow <text>
║ • impressive <text>
║ • matrix <text>
║ • light <text>
║ • neon <text>
║ • devil <text>
║ • purple <text>
║ • thunder <text>
║ • leaves <text>
║ • 1917 <text>
║ • arena <text>
║ • hacker <text>
║ • sand <text>
║ • blackpink <text>
║ • glitch <text>
║ • incandescent <text>
║ • gold <text>
║ • purple2 <text>
║ • neon <text>
║ • thor <text>
║ • whitegold <text>
║ • lightglow <text>
║ • cat <text>
║ • harrypotter <text>
║ • transformer <text>
║ • snow <text>
║ • water <text>
║ • devil2 <text>
║ • neonlight <text>
║ • greenneon <text>
║ • fire <text>
║ • wall <text>
║ • hacker <text>
║ • naruto <text>
║ • didong <text>
║ • dragonball <text>
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━┈⊷
┃ *Downloader 12*:
║ • play <song_name>
║ • song <song_name>
║ • instagram or ig <link>
║ • facebook or fb <link>
║ • tiktok or tt <link>
║ • video <song name>
║ • ytmp4 <Link>
║ • shazam @TagAudio
║ • sh @TagAudio
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━┈⊷
┃ *Github Commands: 6*
║ • git
║ • github
║ • sc
║ • script
║ • repo
║ • tgs <Link>
╰━━━━━━━━━━━━━━━┈⊷

> ʀᴇɢᴀʀᴅs Nicolaus Daniel 2😈😈😈
> ʀᴇɢᴀʀᴅs ᴀssɪsᴛᴀɴᴛ Aliy Abdarazul🦀`;

    try {
        const imagePath = path.join(__dirname, '../asserts/bot_image.jpg');
        const audioUrl = "https://files.catbox.moe/fi8h5n.mp3"; // put your audio mp3 link here by caseyrhodes 

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);

            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363375814828971@newsletter',
                        newsletterName: '𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, {
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363375814828971@newsletter',
                        newsletterName: 'POWERED BY NICOLAUS DANIEL 😈',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        // 🔊 Send audio message after menu
        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: message });

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;

//msee iko hivi don't edit just add url mp3 there you are done fitty bro made by Nicolaus friend\\