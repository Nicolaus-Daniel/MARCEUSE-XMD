const { setAntiBadword, getAntiBadword, removeAntiBadword, incrementWarningCount, resetWarningCount } = require('../lib/index');
const fs = require('fs');
const path = require('path');

// Load antibadword config
function loadAntibadwordConfig(groupId) {
    try {
        const configPath = path.join(__dirname, '../data/userGroupData.json');
        if (!fs.existsSync(configPath)) {
            return {};
        }
        const data = JSON.parse(fs.readFileSync(configPath));
        return data.antibadword?.[groupId] || {};
    } catch (error) {
        console.error('❌ Error loading antibadword config:', error.message);
        return {};
    }
}

async function handleAntiBadwordCommand(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*ANTIBADWORD SETUP*\n\n*.antibadword on*\nTurn on antibadword\n\n*.antibadword set <action>*\nSet action: delete/kick/warn\n\n*.antibadword off*\nDisables antibadword in this group`
        });
    }

    if (match === 'on') {
        const existingConfig = await getAntiBadword(chatId, 'on');
        if (existingConfig?.enabled) {
            return sock.sendMessage(chatId, { text: '*AntiBadword is already enabled for this group*' });
        }
        await setAntiBadword(chatId, 'on', 'delete');
        return sock.sendMessage(chatId, { text: '*AntiBadword has been enabled. Use .antibadword set <action> to customize action*' });
    }

    if (match === 'off') {
        const config = await getAntiBadword(chatId, 'on');
        if (!config?.enabled) {
            return sock.sendMessage(chatId, { text: '*AntiBadword is already disabled for this group*' });
        }
        await removeAntiBadword(chatId);
        return sock.sendMessage(chatId, { text: '*AntiBadword has been disabled for this group*' });
    }

    if (match.startsWith('set')) {
        const action = match.split(' ')[1];
        if (!action || !['delete', 'kick', 'warn'].includes(action)) {
            return sock.sendMessage(chatId, { text: '*Invalid action. Choose: delete, kick, or warn*' });
        }
        await setAntiBadword(chatId, 'on', action);
        return sock.sendMessage(chatId, { text: `*AntiBadword action set to: ${action}*` });
    }

    return sock.sendMessage(chatId, { text: '*Invalid command. Use .antibadword to see usage*' });
}

async function handleBadwordDetection(sock, chatId, message, userMessage, senderId) {
    const config = loadAntibadwordConfig(chatId);
    if (!config.enabled) return;

    // Skip if not group
    if (!chatId.endsWith('@g.us')) return;

    // Skip if message is from bot
    if (message.key.fromMe) return;

    // Get antibadword config first
    const antiBadwordConfig = await getAntiBadword(chatId, 'on');
    if (!antiBadwordConfig?.enabled) {
        console.log('Antibadword not enabled for this group');
        return;
    }

    // Convert message to lowercase and clean it
    const cleanMessage = userMessage.toLowerCase()
        .replace(/[^\w\s]/g, ' ')  // Replace special chars with space
        .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
        .trim();

    // Expanded list of bad words (Kiswahili and English)
    const badWords = [
        // Existing English bad words
        'gandu', 'madarchod', 'bhosdike', 'bsdk', 'fucker', 'bhosda',
        'lauda', 'laude', 'betichod', 'chutiya', 'maa ki chut', 'behenchod',
        'behen ki chut', 'tatto ke saudagar', 'machar ki jhant', 'jhant ka baal',
        'randi', 'chuchi', 'boobs', 'boobies', 'tits', 'idiot', 'nigga', 'fuck',
        'dick', 'bitch', 'bastard', 'asshole', 'asu', 'awyu', 'teri ma ki chut',
        'teri maa ki', 'lund', 'lund ke baal', 'mc', 'lodu', 'benchod',
        'shit', 'damn', 'hell', 'piss', 'crap', 'slut', 'whore', 'prick',
        'motherfucker', 'cock', 'cunt', 'pussy', 'twat', 'wanker', 'douchebag', 'jackass',
        'moron', 'retard', 'scumbag', 'skank', 'slutty', 'arse', 'bugger', 'sod off',
        'fck', 'fckr', 'fcker', 'fuk', 'fukk', 'fcuk', 'btch', 'bch', 'bsdk', 'f*ck', 'assclown',
        'a**hole', 'f@ck', 'b!tch', 'd!ck', 'n!gga', 'f***er', 's***head', 'a$$', 'l0du', 'lund69',
        'spic', 'chink', 'cracker', 'towelhead', 'gook', 'kike', 'paki', 'honky',
        'wetback', 'raghead', 'jungle bunny', 'sand nigger', 'beaner',
        'blowjob', 'handjob', 'cum', 'cumshot', 'jizz', 'deepthroat', 'fap',
        'hentai', 'MILF', 'anal', 'orgasm', 'dildo', 'vibrator', 'gangbang',
        'threesome', 'porn', 'sex', 'xxx',
        'fag', 'faggot', 'dyke', 'tranny', 'homo', 'sissy', 'fairy', 'lesbo',
        'weed', 'pot', 'coke', 'heroin', 'meth', 'crack', 'dope', 'bong', 'kush',
        'hash', 'trip', 'rolling',

        // Additional English bad words
        'jerk', 'loser', 'creep', 'pervert', 'asswipe', 'dumbass', 'dipshit',
        'tool', 'numbskull', 'git', 'knob', 'tosser', 'prat', 'twit', 'nitwit',
        'imbecile', 'clown', 'buffoon', 'oaf', 'lout', 'brat', 'punk', 'thug',
        'vandal', 'hooligan', 'rascal', 'rogue', 'villain', 'scoundrel', 'cad',
        'swine', 'pig', 'dog', 'rat', 'snake', 'weasel', 'sleaze', 'creepo',

        // Kiswahili bad words
        'msenge', 'kuma', 'unatombwa', 'malaya', 'choko', '🖕', 'kafirwe', 'mboo',
        'ass', 'asshole', 'kuma la mama ako', 'mkundu', 'kinyeo', 'kubabako',
        'chokoraa', 'shoga', 'matako', 'k*ma', 'kum*', 'mseng*', 'pumbu', 'mapumbu',
        'pumb*', 'mapumb*', 'fuck you', 'fu** you', 'son of bitch', 'unatiwa mboo',
        'ududu', 'unaingiliwa', 'mpumbavu', 'mjinga', 'mlevi', 'mchafu', 'mhogolo',
        'kijiweni', 'kiburi', 'mwizi', 'tapeli', 'mjanja', 'mchoyo', 'mshamba',
        'kijana wa mtaa', 'mjanja wa mtaa', 'mzembe', 'mhalifu', 'mdudu', 'mchafuko',
        'mharamia', 'mtawala', 'mchafu wa roho', 'mchafu wa mdomo', 'mjanja wa barabara',
        'mwenye uchu', 'mwenye ujinga', 'mwenye hasira', 'mwenye kelele', 'mwenye uovu',
        'mwenye dhuluma', 'mwenye fitina', 'mwenye wivu', 'mwenye chuki', 'mwenye uasi',
        'mwenye makosa', 'mwenye ukaidi', 'mwenye ujanja', 'mwenye ufisadi', 'mwenye uchafu',

        // Additional Kiswahili slang/offensive terms
        'kijana wa kichwa ngumu', 'mwenye akili fukara', 'mwenye macho ya nguo',
        'mwenye mdomo mchafu', 'mwenye roho chafu', 'mwenye sura ya kichwa ngumu',
        'mwenye tabia mbaya', 'mwenye tabia ya kuumiza', 'mwenye tamaa mbaya',
        'mwenye ujinga wa hali ya juu', 'mwenye ushamba wa hali ya juu',
        'mwenye vituko', 'mwenye hasira kali', 'mwenye ujinga wa kutosha',
        'mwenye maisha ya mtaa', 'mwenye maisha ya wizi', 'mwenye maisha ya ujinga',
        'mwenye mawazo mabaya', 'mwenye mawazo ya uovu', 'mwenye mdomo wa moto',
        'mwenye mdomo wa uchafu', 'mwenye roho ya moto', 'mwenye roho ya uovu',
        'mwenye tabia za mtaa', 'mwenye tabia za ujinga', 'mwenye tabia za wizi',
        'mwenye tabia za uchafu', 'mwenye tabia za uovu', 'mwenye tabia za kelele',
        'mwenye tabia za fitina', 'mwenye tabia za wivu', 'mwenye tabia za chuki',
        'mwenye tabia za uasi', 'mwenye tabia za makosa', 'mwenye tabia za ukaidi',
        'mwenye tabia za ujanja', 'mwenye tabia za ufisadi', 'mwenye tabia za uchafu'
    ];

    // Split message into words
    const messageWords = cleanMessage.split(' ');
    let containsBadWord = false;

    // Check for exact word matches only
    for (const word of messageWords) {
        // Skip empty words or very short words
        if (word.length < 2) continue;

        // Check if this word exactly matches any bad word
        if (badWords.includes(word)) {
            containsBadWord = true;
            break;
        }

        // Also check for multi-word bad words
        for (const badWord of badWords) {
            if (badWord.includes(' ')) {  // Multi-word bad phrase
                if (cleanMessage.includes(badWord)) {
                    containsBadWord = true;
                    break;
                }
            }
        }
        if (containsBadWord) break;
    }

    if (!containsBadWord) return;

    // console.log('Bad word detected in:', userMessage);

    // Check if bot is admin before taking action
    const groupMetadata = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = groupMetadata.participants.find(p => p.id === botId);
    if (!bot?.admin) {
        // console.log('Bot is not admin, cannot take action');
        return;
    }

    // Check if sender is admin
    const participant = groupMetadata.participants.find(p => p.id === senderId);
    if (participant?.admin) {
        // console.log('Sender is admin, skipping action');
        return;
    }

    // Delete message immediately
    try {
        await sock.sendMessage(chatId, {
            delete: message.key
        });
        // console.log('Message deleted successfully');
    } catch (err) {
        console.error('Error deleting message:', err);
        return;
    }

    // Take action based on config
    switch (antiBadwordConfig.action) {
        case 'delete':
            await sock.sendMessage(chatId, {
                text: `*@${senderId.split('@')[0]} bad words are not allowed here*`,
                mentions: [senderId]
            });
            break;

        case 'kick':
            try {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, {
                    text: `*@${senderId.split('@')[0]} has been kicked for using bad words*`,
                    mentions: [senderId]
                });
            } catch (error) {
                console.error('Error kicking user:', error);
            }
            break;

        case 'warn':
            const warningCount = await incrementWarningCount(chatId, senderId);
            if (warningCount >= 3) {
                try {
                    await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                    await resetWarningCount(chatId, senderId);
                    await sock.sendMessage(chatId, {
                        text: `*@${senderId.split('@')[0]} has been kicked after 3 warnings*`,
                        mentions: [senderId]
                    });
                } catch (error) {
                    console.error('Error kicking user after warnings:', error);
                }
            } else {
                await sock.sendMessage(chatId, {
                    text: `*@${senderId.split('@')[0]} warning ${warningCount}/3 for using bad words*`,
                    mentions: [senderId]
                });
            }
            break;
    }
}

module.exports = {
    handleAntiBadwordCommand,
    handleBadwordDetection
};