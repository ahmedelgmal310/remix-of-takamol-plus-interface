import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [
    { title: "الموظفين — تكامل بلس" },
    { name: "description", content: "استعراض الموظفين والبحث في سجلاتهم وتفاصيلهم في تكامل بلس." },
    { property: "og:title", content: "الموظفين — تكامل بلس" },
    { property: "og:description", content: "استعراض الموظفين والبحث في سجلاتهم وتفاصيلهم في تكامل بلس." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Outlet,
});
