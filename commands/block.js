const fs = require('fs');
const path = require('path');

async function blockCommand(sock, chatld, message) {
    let userToblock
    