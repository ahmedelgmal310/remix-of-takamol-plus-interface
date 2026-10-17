import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pricingSystemsReference} from '../data/mockData';
// الأسعار الواردة بالصورة المرجعية.
test('الأنظمة الثلاثة بسعر 500 ريال لكل نظام', () => {
 assert.equal(pricingSystemsReference.length, 3);
 assert.deepEqual(pricingSystemsReference.map(system => system.price), [500,500,500]);
});
