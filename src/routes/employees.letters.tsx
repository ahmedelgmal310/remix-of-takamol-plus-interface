import { Outlet, createFileRoute } from "@tanstack/react-router";
export const Route=createFileRoute("/employees/letters")({component:()=> <Outlet/>});
