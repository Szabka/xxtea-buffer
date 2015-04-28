var assert = require('assert');
var xxteaBuf = require('../index.js').XXTeaBuffer;

var testVector = [];
testVector[0] = {'key': '00000000000000000000000000000000','plain': '0000000000000000','encrypted': 'ab043705808c5d57'};
testVector[1] = {'key': '0102040810204080fffefcf8f0e0c080','plain': '0000000000000000','encrypted': 'd1e78be2c746728a'};
testVector[2] = {'key': '9e3779b99b9773e9b979379e6b695156','plain': 'ffffffffffffffff','encrypted': '67ed0ea8e8973fc5'};
testVector[3] = {'key': '0102040810204080fffefcf8f0e0c080','plain': 'fffefcf8f0e0c080','encrypted': '8c3707c01c7fccc4'};

var ebuf = null;

describe('xxtea-buffer', function(){
    it('encrypt vector test', function(){
        for (var i=0;i<testVector.length;i++) {
            xxteaBuf.setKey(testVector[i].key);
            ebuf = xxteaBuf.encrypt(testVector[i].plain);
            assert.equal(testVector[i].encrypted, ebuf.toString('hex'));
        }
    })
    it('decrypt vector test', function(){
        for (var i=0;i<testVector.length;i++) {
            xxteaBuf.setKey(testVector[i].key);
            ebuf = xxteaBuf.decrypt(testVector[i].encrypted);
            assert.equal(testVector[i].plain, ebuf.toString('hex'));
        }
    })
});

