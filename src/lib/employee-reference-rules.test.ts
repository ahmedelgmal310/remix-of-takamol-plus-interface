import { describe,it } from "node:test";
import assert from "node:assert/strict";
import { employeeReferenceSalary,employeeAttendanceSummary,employeeAdvanceSummary,employeeRewardSummary,employeeAdvanceRows,employeeRewardRows } from "../data/mockData";
import { acceptedEmployeeFile,leaveDays,salaryTotals,validEmployeeAmount,employeeWorkHours } from "./employee-reference-store";
describe("Employee reference calculations",()=>{
 it("totals salary 12000 + 3500 - 1800 = 13700",()=>assert.deepEqual(salaryTotals(employeeReferenceSalary),{allowances:3500,deductions:1800,gross:15500,net:13700}));
 it("accepts supported insurance files up to 10MB only",()=>{assert.equal(acceptedEmployeeFile({type:"application/pdf",size:10*1024*1024}),true);assert.equal(acceptedEmployeeFile({type:"application/pdf",size:10*1024*1024+1}),false);assert.equal(acceptedEmployeeFile({type:"application/x-msdownload",size:10}),false);});
 it("limits lab files to 5MB",()=>{assert.equal(acceptedEmployeeFile({type:"image/png",size:5*1024*1024},5),true);assert.equal(acceptedEmployeeFile({type:"image/png",size:5*1024*1024+1},5),false);});
 it("counts inclusive leave dates and rejects reversed dates",()=>{assert.equal(leaveDays("2026-10-20","2026-10-22"),3);assert.equal(leaveDays("2026-10-22","2026-10-20"),0);});
 it("preserves attendance reference aggregates",()=>assert.deepEqual(employeeAttendanceSummary,{hours:152,late:8,early:5,absent:2,present:21,total:30}));
 it("preserves advance reference totals and eight rows",()=>{assert.deepEqual(employeeAdvanceSummary,{total:25000,active:10000,paid:12000,pending:3000});assert.equal(employeeAdvanceRows.length,8)});
 it("preserves reward reference totals and six rows",()=>{assert.deepEqual(employeeRewardSummary,{total:24000,annual:15000,monthly:4000,performance:3000,occasion:2000});assert.equal(employeeRewardRows.length,6)});
 it("calculates attendance hours without reversed times",()=>{assert.equal(employeeWorkHours('08:01','16:05'),'08:04');assert.equal(employeeWorkHours('16:05','08:01'),'');assert.equal(employeeWorkHours('bad','16:05'),'')});
 it("accepts positive financial amounts only",()=>{assert.equal(validEmployeeAmount(1500),true);assert.equal(validEmployeeAmount(0),false);assert.equal(validEmployeeAmount(-1),false);assert.equal(validEmployeeAmount(NaN),false)});
});