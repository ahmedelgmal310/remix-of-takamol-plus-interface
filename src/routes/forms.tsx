import { createFileRoute } from "@tanstack/react-router";
import { FormsPage } from "@/components/forms";
const title = "النماذج — تكامل بلس";
const description = "استعراض النماذج الإدارية والوظيفية ومعاينتها في تكامل بلس.";
export const Route = createFileRoute("/forms")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: FormsPage,
});
