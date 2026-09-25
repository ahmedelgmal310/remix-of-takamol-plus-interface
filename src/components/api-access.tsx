import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, Clock, Copy, Database, Eye, EyeOff, FileText, Headphones, Home, Info, KeyRound,
  Link2, List, MoreVertical, Plus, RefreshCw, ShieldCheck, Trash2, XCircle, Zap, Code2, ArrowUp, ArrowDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import banner from "@/assets/api-banner.jpg";

type Key = { id: number; name: string; scope: string; created: string; expires: string; last: string; active: boolean; token: string };
const rand = (n: number) => Array.from({ length: n }, () => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");
const initial: Key[] = [
  { id: 1, name: "تطبيق الموارد البشرية", scope: "قراءة وكتابة", created: "2025/09/01", expires: "2025/09/01", last: "2025/09/22", active: true, token: `${rand(28)}a7f3` },
  { id: 2, name: "موقع التوظيف", scope: "قراءة فقط", created: "2025/08/15", expires: "2025/09/15", last: "2025/09/21", active: true, token: `${rand(28)}c21e` },
  { id: 3, name: "التقارير الخارجية", scope: "قراءة فقط", created: "2025/09/01", expires: "2025/07/10", last: "2025/09/18", active: false, token: `${rand(28)}9d0b` },
];
const secret = `${rand(28)}b9dd`;
const mask = (s: string) => `${"*".repeat(24)}${s.slice(-4)}`;
const copy = (text: string, msg = "تم النسخ") => { navigator.clipboard?.writeText(text); toast.success(msg); };

const code: Record<string, string> = {
  cURL: `curl -X GET "https://api.takamulplus.sa/v1/employees" \\\n  -H "Authorization: Bearer tkp_your_api_key" \\\n  -H "Content-Type: application/json"`,
  Python: `import requests\n\nres = requests.get(\n    "https://api.takamulplus.sa/v1/employees",\n    headers={"Authorization": "Bearer tkp_your_api_key"},\n)\nprint(res.json())`,
  PHP: `<?php\n$ch = curl_init("https://api.takamulplus.sa/v1/employees");\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer tkp_your_api_key"]);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\necho curl_exec($ch);`,
  JavaScript: `const res = await fetch("https://api.takamulplus.sa/v1/employees", {\n  headers: { Authorization: "Bearer tkp_your_api_key" },\n});\nconsole.log(await res.json());`,
};
const docs = [
  { t: "سياسات الاستخدام", s: "الشروط والقيود", icon: FileText, cls: "bg-primary-soft text-primary", body: ["الحد الأقصى 1000 طلب في الدقيقة لكل مفتاح.", "يُمنع مشاركة المفاتيح مع أطراف خارجية.", "تنتهي صلاحية المفتاح حسب التاريخ المحدد."] },
  { t: "أمثلة عملية", s: "كود وأمثلة جاهزة", icon: Zap, cls: "bg-success/10 text-success", body: ["جلب قائمة الموظفين.", "إنشاء طلب إجازة.", "استعلام مسير الرواتب الشهري."] },
  { t: "قائمة نقاط النهاية", s: "API Endpoints", icon: List, cls: "bg-finance-purple/10 text-finance-purple", body: ["GET /v1/employees", "GET /v1/employees/{id}", "POST /v1/leaves", "GET /v1/payroll", "GET /v1/attendance"] },
  { t: "دليل المطورين", s: "البدء السريع", icon: BookOpen, cls: "bg-success/10 text-success", body: ["أنشئ مفتاحًا في بيئة الاختبار.", "أرسل المفتاح في ترويسة Authorization.", "انتقل لبيئة الإنتاج بعد الاختبار."] },
];

export function ApiAccess() {
  const [keys, setKeys] = useState(initial);
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [env, setEnv] = useState<"sandbox" | "production">("sandbox");
  const [lang, setLang] = useState("cURL");
  const [open, setOpen] = useState(false);
  const [doc, setDoc] = useState<(typeof docs)[number] | null>(null);
  const [del, setDel] = useState<Key | null>(null);
  const [view, setView] = useState<Key | null>(null);
  const [form, setForm] = useState({ name: "", scope: "قراءة فقط", expires: "" });

  const pre = env === "sandbox" ? "tkp_test_" : "tkp_live_";
  const main = keys[0];
  const add = () => {
    if (!form.name || !form.expires) { toast.error("يرجى تعبئة جميع الحقول"); return; }
    const k: Key = { id: Date.now(), name: form.name, scope: form.scope, created: "2025/09/25", expires: form.expires.replaceAll("-", "/"), last: "—", active: true, token: rand(32) };
    setKeys((ks) => [...ks, k]); setOpen(false); setForm({ name: "", scope: "قراءة فقط", expires: "" });
    toast.success("تم إنشاء المفتاح", { description: `${pre}${mask(k.token)}` });
  };
  const stats = [
    { l: "إجمالي الطلبات", v: "12,432", t: "12%", up: true, note: "مقارنة بالشهر السابق", icon: Link2, cls: "bg-finance-purple/10 text-finance-purple" },
    { l: "الطلبات الناجحة", v: "11,982", t: "15%", up: true, icon: ShieldCheck, cls: "bg-success/10 text-success" },
    { l: "الطلبات الفاشلة", v: "450", t: "5%", up: false, icon: XCircle, cls: "bg-destructive/10 text-destructive" },
    { l: "متوسط وقت الاستجابة", v: "320 ms", t: "8%", up: true, icon: Clock, cls: "bg-primary-soft text-primary" },
  ];
  const Field = ({ label, prefix, value, shown, toggle }: { label: string; prefix: string; value: string; shown: boolean; toggle: () => void }) => (
    <div>
      <p className="mb-1 text-sm font-bold" dir="ltr">{label}</p>
      <div className="flex items-center rounded-lg border bg-background" dir="ltr">
        <span className="border-r px-3 py-2.5 text-xs font-bold">{label === "API Key" ? "Key" : "sk"}</span>
        <code className="min-w-0 flex-1 truncate px-3 text-xs text-muted-foreground">{prefix}{shown ? value : mask(value)}</code>
        <button onClick={toggle} className="grid h-9 w-9 shrink-0 place-items-center text-primary" aria-label="إظهار">{shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
        <button onClick={() => copy(prefix + value, `تم نسخ ${label}`)} className="grid h-9 w-9 shrink-0 place-items-center text-primary" aria-label="نسخ"><Copy className="h-4 w-4" /></button>
      </div>
    </div>
  );

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary"><Home className="h-3.5 w-3.5" /></Link><ChevronLeft className="h-3 w-3" />
          <Link to="/settings" className="hover:text-primary">الإعدادات</Link><ChevronLeft className="h-3 w-3" /><span className="text-primary">الوصول البرمجي (API)</span>
        </nav>

        <section className="relative overflow-hidden rounded-xl bg-sidebar">
          <img src={banner} alt="شريحة API" width={1536} height={512} className="absolute inset-0 h-full w-full object-cover object-left" />
          <div className="relative p-5 text-primary-foreground sm:p-8 lg:w-3/5">
            <h1 className="text-2xl font-black sm:text-3xl">الوصول البرمجي (API)</h1>
            <p className="mt-2 font-bold">اربط نظامك مع تكامل بلس بكل سهولة وأمان</p>
            <p className="mt-2 text-sm opacity-90">الوصول إلى بيانات النظام من خلال واجهات برمجة التطبيقات (API) لربط الأنظمة وتكامل الخدمات وتحقيق المزيد من الأتمتة.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[{ l: "آمن وموثوق", i: ShieldCheck }, { l: "أداء عالي", i: RefreshCw }, { l: "تكامل سهل", i: Zap }, { l: "دعم فني متخصص", i: Database }].map((f) => (
                <div key={f.l} className="flex flex-col items-center gap-1 text-center text-xs font-semibold"><f.i className="h-6 w-6" />{f.l}</div>))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
              <div className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">{s.l}</p>
                <p className="text-xl font-black sm:text-2xl" dir="ltr">{s.v}</p>
                <span className={`inline-flex items-center gap-0.5 rounded px-1.5 text-[11px] font-bold ${s.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{s.t}</span>
                {s.note && <span className="mr-1 hidden text-[11px] text-muted-foreground sm:inline">{s.note}</span>}
              </div>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${s.cls}`}><s.icon className="h-6 w-6" /></span>
            </div>))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><KeyRound className="h-5 w-5" />مفاتيح API الخاصة بك</h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[760px] whitespace-nowrap text-sm">
                <thead className="bg-muted/50 text-muted-foreground"><tr>{["#", "اسم المفتاح", "نوع الصلاحيات", "تاريخ الإنشاء", "تاريخ الانتهاء", "آخر استخدام", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-3 text-right font-semibold">{h}</th>)}</tr></thead>
                <tbody>{keys.map((k, i) => (
                  <tr key={k.id} className="border-t">
                    <td className="p-3">{i + 1}</td><td className="p-3 font-bold">{k.name}</td><td className="p-3 text-muted-foreground">{k.scope}</td>
                    <td className="p-3">{k.created}</td><td className="p-3">{k.expires}</td><td className="p-3">{k.last}</td>
                    <td className="p-3"><span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${k.active ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}><span className="h-2 w-2 rounded-full bg-current" />{k.active ? "نشط" : "معلق"}</span></td>
                    <td className="p-3"><div className="flex gap-1">
                      <button onClick={() => setDel(k)} className="grid h-7 w-7 place-items-center rounded border text-destructive" aria-label="حذف"><Trash2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => copy(pre + k.token, "تم نسخ المفتاح")} className="grid h-7 w-7 place-items-center rounded border text-primary" aria-label="نسخ"><Copy className="h-3.5 w-3.5" /></button>
                      <DropdownMenu><DropdownMenuTrigger className="grid h-7 w-7 place-items-center rounded border"><MoreVertical className="h-3.5 w-3.5" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setView(k)}>عرض</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setKeys((ks) => ks.map((x) => (x.id === k.id ? { ...x, active: !x.active } : x))); toast.success(k.active ? "تم إيقاف المفتاح" : "تم تفعيل المفتاح"); }}>{k.active ? "إيقاف" : "تفعيل"}</DropdownMenuItem>
                        </DropdownMenuContent></DropdownMenu>
                    </div></td>
                  </tr>))}</tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <button onClick={() => setOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground"><Plus className="h-4 w-4" />إنشاء مفتاح جديد</button>
            {main && <Field label="API Key" prefix={pre} value={main.token} shown={showKey} toggle={() => setShowKey(!showKey)} />}
            <Field label="API Secret" prefix="sk_" value={secret} shown={showSecret} toggle={() => setShowSecret(!showSecret)} />
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
              <span className="font-bold">البيئة:</span>
              {([["sandbox", "بيئة الاختبار (Sandbox)"], ["production", "الإنتاج (Production)"]] as const).map(([v, l]) => (
                <label key={v} className="flex cursor-pointer items-center gap-2"><input type="radio" checked={env === v} onChange={() => { setEnv(v); toast(`تم التبديل إلى ${l}`); }} className="accent-primary" />{l}</label>))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-extrabold"><BookOpen className="h-5 w-5" />المستندات والتوثيق</h2>
            <p className="mb-4 text-sm text-muted-foreground">تعرّف على جميع نقاط النهاية وطريقة الاستخدام من خلال التوثيق الشامل</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {docs.map((d) => (
                <button key={d.t} onClick={() => setDoc(d)} className="rounded-xl border p-4 text-center transition hover:border-primary hover:shadow">
                  <span className={`mx-auto grid h-10 w-10 place-items-center rounded-lg ${d.cls}`}><d.icon className="h-5 w-5" /></span>
                  <p className="mt-2 text-sm font-bold">{d.t}</p><p className="text-xs text-muted-foreground">{d.s}</p>
                  <ChevronLeft className="mx-auto mt-2 h-4 w-4" />
                </button>))}
            </div>
          </section>
          <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Code2 className="h-5 w-5" />أمثلة على الاستخدام</h2>
            <div className="mb-3 grid grid-cols-4 rounded-lg bg-muted p-1 text-xs font-semibold" dir="ltr">
              {Object.keys(code).map((l) => <button key={l} onClick={() => setLang(l)} className={`rounded-md py-2 ${lang === l ? "bg-primary text-primary-foreground" : ""}`}>{l}</button>)}
            </div>
            <div className="relative rounded-lg bg-sidebar p-4" dir="ltr">
              <button onClick={() => copy(code[lang]!, "تم نسخ الكود")} className="absolute right-3 top-3 text-sidebar-foreground/80 hover:text-sidebar-foreground" aria-label="نسخ الكود"><Copy className="h-4 w-4" /></button>
              <pre className="overflow-x-auto pr-8 text-xs leading-6 text-sidebar-foreground"><code>{code[lang]}</code></pre>
            </div>
            <button onClick={() => setDoc(docs[1]!)} className="mt-3 flex items-center gap-1 rounded-md bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">عرض المزيد من الأمثلة<ArrowLeft className="h-3.5 w-3.5" /></button>
          </section>
        </div>

        <section className="grid gap-5 rounded-xl border bg-card p-5 shadow-sm lg:grid-cols-2">
          <div>
            <h2 className="mb-2 flex items-center gap-2 font-extrabold"><Info className="h-5 w-5 text-primary" />ملاحظات مهمة</h2>
            <ul className="list-disc space-y-1 pr-5 text-sm text-muted-foreground">
              <li>احفظ مفاتيح API بشكل آمن ولا تشاركها مع أي طرف غير مصرح له.</li>
              <li>يوصى باستخدام بيئة الاختبار قبل الانتقال إلى بيئة الإنتاج.</li>
              <li>تخضع جميع الطلبات لبنود الاستخدام وسياسات الأمان الخاصة بالنظام.</li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary-soft"><Headphones className="h-8 w-8 text-primary" /></span>
            <div>
              <h2 className="font-extrabold">تحتاج مساعدة؟</h2>
              <p className="text-sm text-muted-foreground">فريقنا جاهز لمساعدتك في أي استفسار بخصوص واجهات البرمجة</p>
              <button onClick={() => toast.success("تم إرسال طلبك، سيتواصل معك الدعم الفني قريبًا")} className="mt-2 flex items-center gap-1 rounded-lg border border-primary px-4 py-1.5 text-xs font-bold text-primary">تواصل مع الدعم الفني<ArrowLeft className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إنشاء مفتاح جديد</DialogTitle></DialogHeader>
          <div className="grid gap-3 text-sm">
            <label className="grid gap-1">اسم المفتاح<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>
            <label className="grid gap-1">نوع الصلاحيات<select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="h-10 rounded-lg border bg-background px-3"><option>قراءة فقط</option><option>قراءة وكتابة</option></select></label>
            <label className="grid gap-1">تاريخ الانتهاء<input type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>
          </div>
          <DialogFooter className="gap-2"><button onClick={add} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">إنشاء</button><button onClick={() => setOpen(false)} className="rounded-lg border px-5 py-2 text-sm">إلغاء</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={() => setDel(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>حذف المفتاح</DialogTitle></DialogHeader>
          <p className="text-sm">هل أنت متأكد من حذف مفتاح «{del?.name}»؟ لن تتمكن الأنظمة المرتبطة به من الوصول.</p>
          <DialogFooter className="gap-2"><button onClick={() => { setKeys((ks) => ks.filter((k) => k.id !== del?.id)); toast.success("تم حذف المفتاح"); setDel(null); }} className="rounded-lg bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground">حذف</button><button onClick={() => setDel(null)} className="rounded-lg border px-5 py-2 text-sm">إلغاء</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && <div className="grid gap-2 text-sm">
            <p>الصلاحيات: <b>{view.scope}</b></p><p>تاريخ الإنشاء: {view.created}</p><p>تاريخ الانتهاء: {view.expires}</p><p>آخر استخدام: {view.last}</p>
            <p className="flex items-center gap-1">الحالة: {view.active ? <><CheckCircle2 className="h-4 w-4 text-success" />نشط</> : "معلق"}</p>
            <code className="truncate rounded bg-muted p-2 text-xs" dir="ltr">{pre}{mask(view.token)}</code>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!doc} onOpenChange={() => setDoc(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{doc?.t}</DialogTitle></DialogHeader>
          <ul className="space-y-2 text-sm">{doc?.body.map((b) => <li key={b} className="rounded-lg border p-2" dir={b.startsWith("GET") || b.startsWith("POST") ? "ltr" : "rtl"}>{b}</li>)}</ul>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
