import { describe,it } from 'node:test';import assert from 'node:assert/strict';import { workforceEmployees,workforceSummary,workforceAttendanceSummary } from '../data/mockData';import { filterWorkforce,sortWorkforce,parseWorkforceRows,shiftedWorkforceDate,spreadsheetCell } from './workforce-rules';
const empty={query:'',department:'',location:'',status:'',nationality:''};
describe('Workforce local rules',()=>{
 it('keeps screenshot aggregates independent from ten rows',()=>{assert.equal(workforceEmployees.length,10);assert.deepEqual(workforceSummary.map(s=>s.value),[164,118,46,152,6,6]);assert.deepEqual(workforceAttendanceSummary.map(s=>s.value),[164,128,12,5,8])});
 it('filters Ahmed by ID and department together',()=>{assert.deepEqual(filterWorkforce(workforceEmployees,{...empty,query:'EMP-0001',department:'تقنية المعلومات'}).map(r=>r.name),['أحمد محمد الشهري']);assert.equal(filterWorkforce(workforceEmployees,{...empty,query:'EMP-0001',department:'المالية'}).length,0)});
 it('sorts without mutating source',()=>{assert.equal(sortWorkforce(workforceEmployees,'id',true)[0]?.id,'EMP-0010');assert.equal(workforceEmployees[0]?.id,'EMP-0001')});
 it('imports valid new row and rejects duplicate IDs',()=>{const cells=['EMP-0011','موظف اختبار','1234567890','المالية','محاسب','الفرع الرئيسي','سعودي','2024-07-15','على رأس العمل'];assert.equal(parseWorkforceRows([cells],workforceEmployees)[0]?.id,'EMP-0011');assert.throws(()=>parseWorkforceRows([['EMP-0001',...cells.slice(1)]],workforceEmployees));assert.throws(()=>parseWorkforceRows([cells,cells],workforceEmployees))});
 it('rejects incomplete import',()=>assert.throws(()=>parseWorkforceRows([['EMP-0011','اسم']],workforceEmployees)));
 it('moves date across month boundary',()=>{assert.equal(shiftedWorkforceDate('2024-07-31',1),'2024-08-01');assert.equal(shiftedWorkforceDate('2024-07-15',-1),'2024-07-14')});
 it('exports text without executable formulas',()=>{assert.equal(spreadsheetCell('=1+1'),"'=1+1");assert.equal(spreadsheetCell('أحمد'),'أحمد');assert.equal(spreadsheetCell(164),164)})
});
