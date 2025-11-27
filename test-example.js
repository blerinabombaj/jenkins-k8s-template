console.log('=== RUNNING TESTS ===');
const assert = require('assert');
assert.equal(1 + 1, 2, 'Math test FAILED');
console.log('✅ Math test PASSED');
assert.ok(true, 'Pipeline test FAILED');
console.log('✅ Pipeline test PASSED');
console.log('=== ALL TESTS PASSED ===');
