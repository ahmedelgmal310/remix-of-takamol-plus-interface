import {test} from 'node:test';
import assert from 'node:assert/strict';
import {personalCustodyReference as d} from '../data/mockData';
import {custodyCounts,employeeCustodyRows,employeeCustodyHistory,validCustodyRequest} from './personal-custody-rules';
test('reference totals are six assets, four current, one temporary and one returned',()=>{assert.deepEqual(custodyCounts(d.assets,'EMP-0001'),{total:6,current:4,temporary:1,returned:1});});
test('assets and movement history never include another employee',()=>{const first=d.assets[0];assert.ok(first);const other={...first,employeeId:'OTHER',id:99};assert.equal(employeeCustodyRows([...d.assets,other],'EMP-0001').length,6);assert.equal(employeeCustodyHistory(d.movements,'OTHER').length,0);assert.equal(employeeCustodyRows(d.assets,'OTHER').length,0);});
test('request quantity must be a positive integer with required fields',()=>{assert.equal(validCustodyRequest('technology','شاشة','أجهزة تقنية',1),true);for(const quantity of [0,-1,1.5,NaN])assert.equal(validCustodyRequest('technology','شاشة','أجهزة تقنية',quantity),false);assert.equal(validCustodyRequest('','شاشة','أجهزة تقنية',1),false);});