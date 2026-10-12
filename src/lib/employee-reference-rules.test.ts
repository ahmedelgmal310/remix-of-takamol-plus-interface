import { describe,it } from "node:test";
import assert from "node:assert/strict";
import { employeeReferenceSalary } from "../data/mockData";
import { acceptedEmployeeFile,leaveDays,salaryTotals } from "./employee-reference-store";
describe("Employee reference calculations",()=>{
 it("totals salary 12000 + 3500 - 1800 = 13700",()=>assert.deepEqual(salaryTotals(employeeReferenceSalary),{allowances:3500,deductions:1800,gross:15500,net:13700}));
 it("accepts supported insurance files up to 10MB only",()=>{assert.equal(acceptedEmployeeFile({type:"application/pdf",size:10*1024*1024}),true);assert.equal(acceptedEmployeeFile({type:"application/pdf",size:10*1024*1024+1}),false);assert.equal(acceptedEmployeeFile({type:"application/x-msdownload",size:10}),false);});
 it("limits lab files to 5MB",()=>{assert.equal(acceptedEmployeeFile({type:"image/png",size:5*1024*1024},5),true);assert.equal(acceptedEmployeeFile({type:"image/png",size:5*1024*1024+1},5),false);});
 it("counts inclusive leave dates and rejects reversed dates",()=>{assert.equal(leaveDays("2026-10-20","2026-10-22"),3);assert.equal(leaveDays("2026-10-22","2026-10-20"),0);});
});