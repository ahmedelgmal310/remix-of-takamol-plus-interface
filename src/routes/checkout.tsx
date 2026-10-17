import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/checkout-page";
import { checkoutReference } from "@/data/mockData";

const title = "إكمال الطلب والتوقيع على العقد | تكامل بلس";
const description = "أكمل بيانات منشأتك ووقّع عقد ترخيص منصة تكامل بلس إلكترونياً.";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): {systems?: string} => (typeof search["systems"] === "string" ? {systems: search["systems"]} : {}),
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CheckoutRoute,
});

function CheckoutRoute() {
 const {systems} = Route.useSearch();
 const items = systems === undefined ? checkoutReference.items : checkoutReference.items.filter((item) => systems.split(",").includes(item.id));
 return <CheckoutPage {...checkoutReference} items={items} />;
}
