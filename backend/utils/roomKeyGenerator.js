const { nanoid, customAlphabet  } = require('nanoid');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateRoomKey() {
    const nanoid = customAlphabet(alphabet, 4);
    return nanoid(); 
}

module.exports = { generateRoomKey };
