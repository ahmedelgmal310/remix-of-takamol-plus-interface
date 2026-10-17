import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/pricing";
import { checkoutReference, pricingSystemsReference } from "@/data/mockData";
const t = "شراء البرنامج — أنظمة تكامل بلس";
const d = "اختر أنظمة الموارد البشرية والمالية وخدمة العملاء بترخيص دائم وبدون رسوم سنوية، وتابع خطوات شراء البرنامج.";
export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PricingRoute,
});

function PricingRoute() {
 const navigate = Route.useNavigate();
 return <Pricing systems={pricingSystemsReference} bank={checkoutReference.bank} onPurchase={(systems) => { void navigate({to:"/checkout",search:{systems:systems.map((system) => system.id).join(",")}}); }} />;
}
