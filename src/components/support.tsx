import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, FileText, Headphones, HelpCircle, Home, Mail, MessageCircle, MessagesSquare, Phone, Search, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import agent from "@/assets/support-agent.png";

type Status = "مفتوح" | "قيد المعالجة" | "مغلق";
type Ticket = { id: string; subject: string; status: Status; date: string; details: string };
const initialTickets: Ticket[] = [
  { id: "001", subject: "مشكلة في تسجيل الدخول", status: "مفتوح", date: "2025/09/23", details: "لا أستطيع تسجيل الدخول من الجوال." },
  { id: "002", subject: "إضافة مستخدم جديد", status: "قيد المعالجة", date: "2025/09/22", details: "نرغب بإضافة مستخدم لقسم المالية." },
  { id: "003", subject: "استفسار عن الرواتب", status: "مغلق", date: "2025/09/21", details: "استفسار عن موعد صرف رواتب الشهر." },
  { id: "004", subject: "مشكلة في التقارير", status: "قيد المعالجة", date: "2025/09/20", details: "تقرير الحضور لا يظهر بعض الموظفين." },
  { id: "005", subject: "طلب صلاحيات إضافية", status: "مفتوح", date: "2025/09/19", details: "طلب صلاحية الاطلاع على العهد." },
];
const articles = [
  { title: "طريقة إضافة مستخدم جديد", body: "من الإعدادات ← المستخدمون ← إضافة مستخدم، ثم أدخل البيانات وحدد الصلاحيات واضغط حفظ." },
  { title: "حل مشكلة تسجيل الدخول", body: "تأكد من البريد وكلمة المرور، ثم جرّب «نسيت كلمة المرور». إن استمرت المشكلة أرسل طلب دعم." },
  { title: "إدارة الصلاحيات في النظام", body: "يمكن تحديد صلاحيات كل مستخدم حسب الإدارة والشاشات من صفحة الإعدادات." },
  { title: "إعدادات البريد الإلكتروني", body: "من الإعدادات ← الإشعارات يمكنك تحديد البريد المستلم للتنبيهات." },
  { title: "دليل استخدام النظام", body: "دليل شامل يشرح كل أقسام تكامل بلس خطوة بخطوة." },
];
const faqs = [
  { title: "كيف أغيّر كلمة المرور؟", body: "من صفحة الملف الشخصي أو عبر «نسيت كلمة المرور» في صفحة الدخول." },
  { title: "متى يتم الرد على الطلبات؟", body: "نرد خلال 24 ساعة كحد أقصى في أيام العمل." },
  { title: "هل يمكن تصدير التقارير؟", body: "نعم، يمكن تصدير التقارير بصيغة Excel وPDF." },
];
const statusCls: Record<Status, string> = {
  "مفتوح": "bg-destructive/10 text-destructive",
  "قيد المعالجة": "bg-warning/15 text-warning",
  "مغلق": "bg-success/15 text-success",
};

export function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState<{ title: string; body: string } | null>(null);
  const [list, setList] = useState<null | "faq" | "articles" | "tickets">(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", details: "" });
  const [chat, setChat] = useState(false);
  const [msgs, setMsgs] = useState([{ me: false, t: "مرحبًا! كيف يمكنني مساعدتك اليوم؟" }]);
  const [msg, setMsg] = useState("");

  const results = useMemo(() => query ? [...articles, ...faqs].filter((a) => a.title.includes(query) || a.body.includes(query)) : [], [query]);

  const submit = () => {
    if (!form.subject.trim()) return toast.error("اكتب موضوع الطلب");
    const id = String(tickets.length + 1).padStart(3, "0");
    setTickets([{ id, subject: form.subject, details: form.details, status: "مفتوح", date: "2025/09/25" }, ...tickets]);
    setForm({ subject: "", details: "" }); setNewOpen(false); toast.success(`تم إرسال الطلب رقم ${id}`);
  };
  const send = () => {
    if (!msg.trim()) return;
    setMsgs((m) => [...m, { me: true, t: msg }]); setMsg("");
    setTimeout(() => setMsgs((m) => [...m, { me: false, t: "شكرًا لتواصلك، سيقوم أحد ممثلي الدعم بالرد عليك قريبًا." }]), 700);
  };

  const cards = [
    { icon: HelpCircle, title: "الأسئلة الشائعة", sub: "إجابات سريعة", cls: "bg-success/15 text-success", on: () => setList("faq") },
    { icon: FileText, title: "متابعة الطلبات", sub: "عرض حالة طلباتك", cls: "bg-primary/10 text-primary", on: () => setList("tickets") },
    { icon: MessagesSquare, title: "تواصل معنا", sub: "إرسال طلب جديد", cls: "bg-success/15 text-success", on: () => setNewOpen(true) },
    { icon: BookOpen, title: "قاعدة المعرفة", sub: "مقالات وشروحات", cls: "bg-primary/10 text-primary", on: () => setList("articles") },
  ];
  const contacts = [
    { icon: Send, title: "إرسال طلب دعم", a: "إنشاء طلب جديد", b: "ومتابعة حل مشكلتك", on: () => setNewOpen(true) },
    { icon: MessageCircle, title: "المحادثة المباشرة", a: "ابدأ محادثة الآن", b: "متاح أيام طوال الأسبوع", on: () => setChat(true) },
    { icon: Mail, title: "البريد الإلكتروني", a: "support@takamulplus.sa", b: "نرد خلال 24 ساعة", on: () => (window.location.href = "mailto:support@takamulplus.sa") },
    { icon: Phone, title: "الاتصال بنا", a: "9200 12345", b: "من 8 ص إلى 5 م", on: () => (window.location.href = "tel:920012345") },
  ];
  const listItems = list === "faq" ? faqs : list === "articles" ? articles : [];

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Home className="size-4" /><Link to="/" className="hover:text-primary">الرئيسية</Link><ChevronLeft className="size-4" /><span>الدعم الفني</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-xl bg-primary/10 text-primary"><Headphones className="size-7" /></div>
          <div><h1 className="text-2xl font-extrabold">الدعم الفني</h1><p className="text-sm text-muted-foreground">نحن هنا لمساعدتك دائمًا</p></div>
        </div>

        <section className="grid items-center gap-4 overflow-hidden rounded-2xl bg-primary/5 p-5 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold md:text-3xl">كيف يمكننا مساعدتك؟</h2>
            <p className="text-muted-foreground">ابحث عن إجابة، أو أرسل طلب دعم فني</p>
            <form onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); }} className="flex overflow-hidden rounded-xl border bg-card">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في الأسئلة الشائعة أو اكتب مشكلتك ..." className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
              <button className="grid w-12 place-items-center bg-primary text-primary-foreground"><Search className="size-5" /></button>
            </form>
            {query && (
              <div className="rounded-xl border bg-card p-2 text-sm">
                {results.length ? results.map((r) => <button key={r.title} onClick={() => setInfo(r)} className="block w-full rounded-lg p-2 text-right hover:bg-muted">{r.title}</button>)
                  : <p className="p-2 text-muted-foreground">لا توجد نتائج. <button onClick={() => { setForm({ subject: query, details: "" }); setNewOpen(true); }} className="text-primary">أرسل طلب دعم</button></p>}
              </div>
            )}
          </div>
          <img src={agent} alt="موظف دعم فني" width={944} height={704} className="mx-auto max-h-56 w-auto" />
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <button key={c.title} onClick={c.on} className="rounded-2xl border bg-card p-5 text-center transition hover:shadow-md">
              <div className={`mx-auto grid size-14 place-items-center rounded-xl ${c.cls}`}><c.icon className="size-7" /></div>
              <p className="mt-3 font-bold">{c.title}</p><p className="text-xs text-muted-foreground">{c.sub}</p>
            </button>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between"><h3 className="font-bold">أحدث الطلبات</h3><button onClick={() => setList("tickets")} className="text-sm text-primary">عرض الكل</button></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="bg-muted text-muted-foreground"><tr><th className="p-2 text-right">#</th><th className="p-2 text-right">الموضوع</th><th className="p-2">الحالة</th><th className="p-2">تاريخ الإنشاء</th></tr></thead>
                <tbody>{tickets.slice(0, 5).map((t) => (
                  <tr key={t.id} onClick={() => setTicket(t)} className="cursor-pointer border-b hover:bg-muted/50">
                    <td className="p-2 font-bold">{t.id}</td><td className="p-2">{t.subject}</td>
                    <td className="p-2 text-center"><span className={`rounded-md px-2 py-0.5 text-xs ${statusCls[t.status]}`}>{t.status}</span></td>
                    <td className="p-2 text-center text-muted-foreground">{t.date}</td>
                  </tr>))}</tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <h3 className="mb-2 font-bold">مقالات شائعة</h3>
            {articles.map((a) => (
              <button key={a.title} onClick={() => setInfo(a)} className="flex w-full items-center gap-3 border-b py-2.5 text-right text-sm hover:text-primary">
                <FileText className="size-5 shrink-0 text-primary" />{a.title}
              </button>
            ))}
            <button onClick={() => setList("articles")} className="mt-3 text-sm text-primary">عرض جميع المقالات</button>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <h3 className="mb-3 font-bold">طرق التواصل</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((c) => (
              <button key={c.title} onClick={c.on} className="rounded-xl border p-4 text-center text-sm hover:bg-muted/50">
                <c.icon className="mx-auto size-6 text-primary" /><p className="mt-2 font-bold">{c.title}</p>
                <p className="break-all text-muted-foreground">{c.a}</p><p className="text-xs text-muted-foreground">{c.b}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={!!info} onOpenChange={() => setInfo(null)}>
        <DialogContent dir="rtl"><DialogHeader><DialogTitle>{info?.title}</DialogTitle></DialogHeader><p className="text-sm leading-7 text-muted-foreground">{info?.body}</p></DialogContent>
      </Dialog>

      <Dialog open={!!list} onOpenChange={() => setList(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{list === "faq" ? "الأسئلة الشائعة" : list === "articles" ? "قاعدة المعرفة" : "جميع الطلبات"}</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {list === "tickets" ? tickets.map((t) => (
              <button key={t.id} onClick={() => { setList(null); setTicket(t); }} className="flex w-full items-center justify-between rounded-lg border p-3 text-sm">
                <span>{t.id} — {t.subject}</span><span className={`rounded-md px-2 py-0.5 text-xs ${statusCls[t.status]}`}>{t.status}</span>
              </button>
            )) : listItems.map((a) => (
              <details key={a.title} className="rounded-lg border p-3 text-sm"><summary className="cursor-pointer font-bold">{a.title}</summary><p className="mt-2 text-muted-foreground">{a.body}</p></details>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!ticket} onOpenChange={() => setTicket(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>طلب رقم {ticket?.id}</DialogTitle></DialogHeader>
          {ticket && <div className="space-y-2 text-sm">
            <p><b>الموضوع:</b> {ticket.subject}</p><p><b>التاريخ:</b> {ticket.date}</p>
            <p><b>الحالة:</b> <span className={`rounded-md px-2 py-0.5 text-xs ${statusCls[ticket.status]}`}>{ticket.status}</span></p>
            <p className="text-muted-foreground">{ticket.details || "لا توجد تفاصيل."}</p>
          </div>}
          <DialogFooter>
            {ticket?.status !== "مغلق" && <button onClick={() => { setTickets((ts) => ts.map((t) => t.id === ticket!.id ? { ...t, status: "مغلق" } : t)); setTicket(null); toast.success("تم إغلاق الطلب"); }} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">إغلاق الطلب</button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>طلب دعم جديد</DialogTitle></DialogHeader>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="موضوع الطلب" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="اشرح المشكلة بالتفصيل" rows={4} className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <DialogFooter><button onClick={submit} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">إرسال الطلب</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={chat} onOpenChange={setChat}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>المحادثة المباشرة</DialogTitle></DialogHeader>
          <div className="h-64 space-y-2 overflow-y-auto rounded-lg bg-muted/50 p-3">
            {msgs.map((m, i) => <div key={i} className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.me ? "mr-auto bg-primary text-primary-foreground" : "bg-card"}`}>{m.t}</div>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm" />
            <button className="rounded-lg bg-primary px-4 text-primary-foreground"><Send className="size-4" /></button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
