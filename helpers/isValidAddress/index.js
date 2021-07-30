const base58 = require("./base58");
const { BufferReader } = require("./reader");
let isValidAddress = function(address) {
    let subAddress = address.slice(3);
    try {
        let buf = base58.decode(subAddress);
        if (buf.length !== 25) {
            return false;
        }
        let br = new BufferReader(buf);
        br.readU8();
        br.readBytes(20);
        br.verifyChecksum();
    } catch (error) {
        return false;
    }
    return true;
}
module.exports = isValidAddress;