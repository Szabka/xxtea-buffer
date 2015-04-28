## xxtea-buffer

Buffer based javascript implementation of the [XXTEA block cipher](http://en.wikipedia.org/wiki/XXTEA) for Node.js.

Install\n\n\t
npm install xxtea-buffer\n\n

### Examples

var assert = require('assert');
var xxteaBuf = require('xxtea-buffer').XXTeaBuffer;

xxteaBuf.setKey('0102040810204080fffefcf8f0e0c080');
var ebuf = xxteaBuf.encrypt('fffefcf8f0e0c080');
var ebuf2 = xxteaBuf.decrypt('8c3707c01c7');

assert.equal('8c3707c01c7', ebuf.toString('hex'));
assert.equal('fffefcf8f0e0c080', ebuf2.toString('hex'));
