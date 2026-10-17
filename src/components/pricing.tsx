import { useState } from "react";
import { BarChart3, Bell, CalendarDays, Check, ChevronLeft, ClipboardList, Copy, FileText, Headphones, Infinity, Landmark, MessageSquare, Settings, ShieldCheck, UsersRound, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { OrderStageBar, PurchaseStepsPanel } from "@/components/purchase-steps";
import office from "@/assets/program-pricing-office.jpg";
import styles from "./pricing.module.css";

export interface PurchaseSystem {
  id: string;
  name: string;
  description: string;
  price: number;
  features: readonly string[];
  tone: "success" | "primary" | "violet";
}
export interface PurchaseBank { bankName: string; beneficiary: string; iban: string; logoUrl?: string }
export interface PricingProps {
  systems?: readonly PurchaseSystem[];
  bank?: PurchaseBank;
  orderStage?: number | null;
  onPurchase?: (systems: PurchaseSystem[]) => void;
}
const icons = { success: UsersRound, primary: BarChart3, violet: Headphones };
const featureIcons = [Settings, UsersRound, Wallet, CalendarDays, ShieldCheck, ClipboardList, BarChart3, FileText, Bell, MessageSquare, Headphones];
const dash = (value?: string) => value?.trim() || "—";

// بيانات الأنظمة والحساب البنكي تأتي من الخصائص؛ الاختيار محلي فقط.
export function Pricing({ systems = [], bank, orderStage = null, onPurchase }: PricingProps = {}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const chosen = systems.filter((system) => selected.includes(system.id));
  const copyIban = async () => {
    if (!bank?.iban) return;
    try { await navigator.clipboard.writeText(bank.iban); toast.success("تم نسخ رقم الآيبان"); }
    catch { toast.error("تعذر نسخ رقم الآيبان"); }
  };
  return <AppShell><main dir="rtl" className={styles["page"]}>
    <section className={styles["hero"]}>
      <img src={office} alt="مكتب ولابتوب يعرض نظام إدارة الأعمال" width={1536} height={512} className={styles["heroPhoto"]} />
      <div className={styles["heroContent"]}>
        <h1 className={styles["title"]}>اختر الباقة المناسبة لاحتياج منشأتك</h1>
        <p className={styles["subtitle"]}>برنامج متكامل لإدارة الموارد البشرية والمالية وخدمة العملاء</p>
        <div className={styles["benefits"]}>
          {[{ title: "دعم فني شامل", description: "دعم وتدريب بعد الشراء", icon: Headphones }, { title: "بدون رسوم سنوية", description: "لا توجد رسوم اشتراك سنوي", icon: Settings }, { title: "ترخيص دائم", description: "دفع مرة واحدة", icon: Infinity }].map((benefit) => <div className={styles["benefit"]} key={benefit.title}><div><b>{benefit.title}</b><p>{benefit.description}</p></div><span className={styles["benefitIcon"]}><benefit.icon size={24} /></span></div>)}
        </div>
      </div>
    </section>
    <div className={styles["content"]}>
      <div className={styles["grid"]}>
        <div className={styles["steps"]}><PurchaseStepsPanel /></div>
        {systems.length === 0 ? <p className={styles["empty"]}>لا توجد أنظمة متاحة للشراء حالياً</p> : systems.map((system) => {
          const Icon = icons[system.tone];
          const active = selected.includes(system.id);
          return <article key={system.id} className={`${styles["card"]} ${system.tone === "primary" ? styles["primary"] : system.tone === "violet" ? styles["violet"] : ""}`}>
            <header className={styles["cardHeader"]}><div><h2>{system.name}</h2><p>{system.description}</p></div><Icon /></header>
            <ul className={styles["features"]}>
              {system.features.length === 0 ? <li className={styles["feature"]}>لا توجد مزايا متاحة</li> : system.features.map((feature, index) => {
                const FeatureIcon = featureIcons[index % featureIcons.length] ?? Settings;
                return <li key={`${feature}-${index}`} className={styles["feature"]}><FeatureIcon /><span>{feature}</span><Check strokeWidth={4} /></li>;
              })}
            </ul>
            <div className={styles["pricePanel"]}>
              <label className={styles["price"]}><input type="checkbox" checked={active} onChange={() => toggle(system.id)} aria-label={`اختيار ${system.name}`} /><strong>{Number.isFinite(system.price) ? system.price.toLocaleString("en-US") : "—"}</strong><span>ريال</span></label>
              <Button aria-pressed={active} className={styles["selectButton"]} onClick={() => toggle(system.id)}>{active ? <><Check />تم اختيار هذه الباقة</> : "اختر هذه الباقة"}</Button>
            </div>
          </article>;
        })}
      </div>
      <div className={styles["bottom"]}>
        <Button className={styles["buyButton"]} disabled={chosen.length === 0 || !onPurchase} onClick={() => onPurchase?.(chosen)}><ChevronLeft />شراء البرنامج الآن</Button>
        <section className={styles["bank"]}>
          <h2>بيانات حساب المؤسسة للتحويل</h2>
          <div className={styles["bankBody"]}>
            <div className={styles["bankIban"]}><Button variant="ghost" size="icon" title="نسخ الآيبان" aria-label="نسخ الآيبان" disabled={!bank?.iban} onClick={copyIban}><Copy /></Button><div><small>رقم الآيبان (IBAN)</small><p dir="ltr">{dash(bank?.iban)}</p></div></div>
            <div className={styles["bankBeneficiary"]}><small>اسم المستفيد</small><p>{dash(bank?.beneficiary)}</p></div>
            <div className={styles["bankName"]}>{bank?.logoUrl ? <img src={bank.logoUrl} alt={bank.bankName} width={42} height={42} loading="lazy" /> : <Landmark size={35} />}<span>{dash(bank?.bankName)}</span></div>
          </div>
        </section>
      </div>
      <div className={styles["stages"]}><OrderStageBar currentStage={orderStage} /></div>
      <p className={styles["note"]}>عرض تجريبي: لا يتم تحصيل أي مبالغ أو حفظ الطلبات.{!bank && " بيانات حساب المؤسسة غير متاحة حالياً."}</p>
    </div>
  </main></AppShell>;
}
