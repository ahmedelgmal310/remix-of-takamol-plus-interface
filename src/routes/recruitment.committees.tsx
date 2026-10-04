import { createFileRoute } from "@tanstack/react-router";
import { RecruitmentCommitteesPage } from "@/components/recruitment-committees";
const title = "لجان التوظيف — تكامل بلس";
const description = "استعراض لجان التوظيف وأعضائها والمتقدمين ومراحل التوظيف في تكامل بلس.";
export const Route = createFileRoute("/recruitment/committees")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: RecruitmentCommitteesPage,
});
