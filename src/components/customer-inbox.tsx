import { useMemo, useRef, useState } from "react";
import { ArrowRight, CalendarClock, CheckCheck, ClipboardList, Clock, FileText, Headset, ImageIcon, Inbox, List, Mail, MapPin, MessageSquareText, MoreVertical, Paperclip, Phone, Search, Send, Smile, Star, Ticket, User, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Ch = "wa" | "chat" | "mail";
type Msg = { me: boolean; t: string; time: string };
type Conv = { id: number; name: string; ch: Ch; time: string; unread: number; imp: boolean; msgs: Msg[]; phone: string; email: string; city: string; orders: number; dept: string; vip: boolean; notes: { t: string; d: string }[] };
const mk = (id: number, name: string, ch: Ch, time: string, unread: number, last: string, extra: Partial<Conv> = {}): Conv => ({ id, name, ch, time, unread, imp: false, msgs: [{ me: false, t: last, time: `${time} ص` }], phone: `05${String(10000000 + id * 1234567).slice(0, 8)}`, email: `customer${id}@example.com`, city: ["الرياض", "جدة", "الدمام"][id % 3]!, orders: (id % 5) + 1, dept: "المبيعات", vip: false, notes: [], ...extra });
const seed: Conv[] = [
  mk(1, "أحمد محمد", "wa", "10:24", 1, "شكراً لكم", { imp: true, vip: true, phone: "0501234567", email: "ahmed@example.com", city: "الرياض", orders: 5, notes: [{ t: "العميل مهتم بعروض اليوم الوطني ويفضل التواصل عبر الواتساب.", d: "2025/09/21 10:30 ص" }], msgs: [
    { me: false, t: "السلام عليكم\nهل يوجد توصيل لجميع مناطق المملكة؟", time: "10:12 ص" },
    { me: true, t: "وعليكم السلام\nنعم، متاح التوصيل لجميع مناطق المملكة\nمجاناً 🙂", time: "10:15 ص" },
    { me: false, t: "ممتاز .. وهل يمكن معرفة مدة التوصيل؟", time: "10:18 ص" },
    { me: true, t: "بإذن الله يتم التوصيل خلال 2-4 أيام عمل\nحسب المنطقة.\nيمكنك متابعة طلبك من خلال رقم الطلب\nبعد تأكيده.", time: "10:20 ص" },
    { me: false, t: "شكراً لكم", time: "10:24 ص" }] }),
  mk(2, "سارة خالد", "wa", "10:17", 2, "هل يوجد خصم على الكميات؟", { imp: true }),
  mk(3, "محمد علي", "wa", "10:05", 0, "أرغب في متابعة طلب"),
  mk(4, "نورة عبدالله", "chat", "09:48", 1, "متى يصل الطلب؟", { imp: true }),
  mk(5, "خالد فهد", "wa", "09:32", 0, "هل يمكنني تغيير العنوان؟"),
  mk(6, "ريم أحمد", "mail", "09:20", 1, "شكراً على سرعة الرد"),
  mk(7, "فهد القحطاني", "chat", "09:10", 0, "أريد الاستفسار عن المنتج"),
  mk(8, "لطيفة محمد", "wa", "08:55", 0, "هل يتوفر الدفع عند الاستلام؟"),
  mk(9, "عبدالله حسن", "wa", "08:40", 0, "أحتاج للمساعدة في استرجاع الطلب"),
  mk(10, "منال علي", "chat", "08:25", 0, "متى تتوفر المنتجات؟"),
];
const emojis = ["🙂", "😊", "👍", "🙏", "❤️", "🎉", "✅", "😂"];
const chName = { wa: "واتساب", chat: "محادثة مباشرة", mail: "البريد الإلكتروني" };

function ChIcon({ ch, big }: { ch: Ch; big?: boolean }) {
  const s = big ? 34 : 18;
  if (ch === "wa") return <svg viewBox="0 0 24 24" width={s} height={s} className="text-success"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" /></svg>;
  if (ch === "mail") return <Mail size={s} className="text-primary" />;
  return <MessageSquareText size={s} className="text-primary" />;
}
const nowTime = () => { const d = new Date(); const h = d.getHours(); return `${String(h % 12 || 12).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "ص" : "م"}`; };

export function CustomerInbox() {
  const [convs, setConvs] = useState(seed);
  const [sel, setSel] = useState(1);
  const [tab, setTab] = useState<"all" | "unread" | "imp">("all");
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const [emo, setEmo] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const [toast, setToast] = useState("");
  const [panel, setPanel] = useState<"" | "info" | "orders">("");
  const fileRef = useRef<HTMLInputElement>(null), imgRef = useRef<HTMLInputElement>(null);
  const c = convs.find(x => x.id === sel)!;
  const upd = (id: number, f: (x: Conv) => Conv) => setConvs(p => p.map(x => x.id === id ? f(x) : x));
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };
  const list = useMemo(() => convs.filter(x => (tab === "all" || (tab === "unread" ? x.unread > 0 : x.imp)) && (!q || x.name.includes(q) || x.msgs.some(m => m.t.includes(q)))), [convs, tab, q]);
  const counts = { all: 24 - 10 + convs.length, unread: 7 - seed.filter(s => s.unread).length + convs.filter(x => x.unread).length, imp: convs.filter(x => x.imp).length };
  const open = (id: number) => { setSel(id); upd(id, x => ({ ...x, unread: 0 })); setMobileChat(true); setMenu(false); setPanel(""); };
  const send = (t: string) => { if (!t.trim()) return; upd(sel, x => ({ ...x, msgs: [...x.msgs, { me: true, t, time: nowTime() }] })); setText(""); setEmo(false); };

  const Avatar = ({ me }: { me: boolean }) => me ? <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-deep text-primary-foreground"><Headset size={20} /></span> : <span className="grid size-10 shrink-0 place-items-center rounded-full bg-search text-muted-foreground"><UserRound size={22} /></span>;

  return <AppShell>
    {toast && <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-brand-deep px-5 py-3 text-sm text-primary-foreground shadow-lg">{toast}</div>}
    <div className="grid gap-3 lg:h-[calc(100vh-110px)] lg:grid-cols-[330px_minmax(0,1fr)_290px]">
      {/* inbox */}
      <section className={`panel flex min-h-0 flex-col p-3 ${mobileChat ? "hidden lg:flex" : "flex"}`}>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-brand-deep"><Inbox className="size-6" />صندوق الوارد</h2>
        <div className="grid grid-cols-3 gap-2">{([["all", "الكل", counts.all], ["unread", "غير مقروء", counts.unread], ["imp", "مهم", counts.imp]] as const).map(([k, t, n]) => <button key={k} onClick={() => setTab(k)} className={`flex h-10 items-center justify-center gap-2 rounded-md border text-sm ${tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{k === "imp" && <Star size={13} className="fill-current" />}{t}<span className={`grid size-6 place-items-center rounded-full text-[11px] ${tab === k ? "bg-card text-primary" : k === "imp" ? "bg-destructive/10 text-destructive" : "bg-search"}`}>{n}</span></button>)}</div>
        <div className="relative my-3"><input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث في الرسائل..." className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm" /><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /></div>
        <ul className="-mx-3 min-h-0 flex-1 divide-y divide-border overflow-y-auto">{list.map(x => { const last = x.msgs[x.msgs.length - 1]!; return <li key={x.id}><button onClick={() => open(x.id)} className={`flex w-full items-center gap-3 px-4 py-3 text-right ${x.id === sel ? "border-r-4 border-primary bg-primary/5" : "hover:bg-search/60"}`}><span className="grid size-10 shrink-0 place-items-center rounded-full bg-card shadow-sm"><ChIcon ch={x.ch} /></span><div className="min-w-0 flex-1"><b className="flex items-center gap-1 text-sm">{x.name}{x.imp && <Star size={11} className="fill-warning text-warning" />}</b><p className="truncate text-xs text-muted-foreground">{last.t.split("\n")[0]}</p></div><div className="flex shrink-0 flex-col items-end gap-1.5"><span className="text-[11px] text-muted-foreground">{x.time} ص</span>{x.unread > 0 && <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{x.unread}</span>}</div></button></li>; })}{!list.length && <li className="p-6 text-center text-sm text-muted-foreground">لا توجد رسائل مطابقة</li>}</ul>
      </section>

      {/* chat */}
      <section className={`panel min-h-[70vh] flex-col p-0 lg:min-h-0 ${mobileChat ? "flex" : "hidden lg:flex"}`}>
        <header className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3"><button onClick={() => setMobileChat(false)} className="lg:hidden" aria-label="رجوع"><ArrowRight /></button><ChIcon ch={c.ch} big /><div><b className="block text-xl text-brand-deep">{c.name}</b><span className="flex items-center gap-1.5 text-xs text-success"><span className="size-2 rounded-full bg-success" />{chName[c.ch]}</span><span className="flex items-center gap-1.5 text-xs"><span className="size-2 rounded-full bg-success" />متصل الآن</span></div></div>
          <div className="relative"><button onClick={() => setMenu(!menu)} aria-label="المزيد"><MoreVertical /></button>{menu && <div className="absolute left-0 top-8 z-10 w-44 rounded-md border border-border bg-card py-1 text-sm shadow-lg"><button onClick={() => { upd(sel, x => ({ ...x, imp: !x.imp })); setMenu(false); }} className="block w-full px-3 py-2 text-right hover:bg-search">{c.imp ? "إلغاء التمييز كمهم" : "تمييز كمهم"}</button><button onClick={() => { upd(sel, x => ({ ...x, unread: 1 })); setMenu(false); }} className="block w-full px-3 py-2 text-right hover:bg-search">تحديد كغير مقروء</button></div>}</div>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto p-4">{c.msgs.map((m, i) => <div key={i} className={`flex items-start gap-3 ${m.me ? "flex-row-reverse justify-end" : ""}`}><Avatar me={m.me} /><div className={`max-w-[75%] whitespace-pre-line rounded-xl px-5 py-3 text-sm leading-7 ${m.me ? "bg-primary/15" : "bg-search"}`}>{m.t}<span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">{m.me && <CheckCheck size={13} className="text-primary" />}{m.time}</span></div></div>)}</div>
        <div className="m-3 rounded-lg border border-border p-2">
          <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }} placeholder="اكتب رسالتك هنا..." className="h-12 w-full resize-none bg-transparent px-2 text-sm outline-none" />
          <div className="relative flex items-center justify-between">
            <button onClick={() => send(text)} aria-label="إرسال" className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"><Send size={17} className="-scale-x-100" /></button>
            <div className="flex gap-3 text-muted-foreground"><button onClick={() => imgRef.current?.click()} aria-label="صورة"><ImageIcon size={20} /></button><button onClick={() => setEmo(!emo)} aria-label="إيموجي"><Smile size={20} /></button><button onClick={() => fileRef.current?.click()} aria-label="مرفق"><Paperclip size={20} /></button></div>
            {emo && <div className="absolute bottom-10 left-0 flex gap-1 rounded-md border border-border bg-card p-2 shadow-lg">{emojis.map(e => <button key={e} onClick={() => setText(t => t + e)} className="text-xl">{e}</button>)}</div>}
            <input ref={fileRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) send(`📎 ${f.name}`); e.target.value = ""; }} />
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) send(`🖼️ ${f.name}`); e.target.value = ""; }} />
          </div>
        </div>
      </section>

      {/* customer */}
      <aside className={`min-h-0 space-y-3 overflow-y-auto ${mobileChat ? "block" : "hidden lg:block"}`}>
        <section className="panel p-4">
          <button onClick={() => setMobileChat(false)} className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-deep">رجوع إلى قائمة الرسائل<ArrowRight className="size-4 rotate-180" /></button>
          <div className="flex items-center justify-between"><div><b className="block text-xl text-brand-deep">{c.name}</b>{c.vip ? <span className="mt-2 inline-block rounded-full bg-success-soft px-3 py-0.5 text-xs font-bold text-success">عميل دائم</span> : <span className="mt-2 inline-block rounded-full bg-search px-3 py-0.5 text-xs">عميل</span>}</div><span className="grid size-20 place-items-center rounded-full bg-primary/10 text-brand-deep"><User size={40} className="fill-current" /></span></div>
          <div className="mt-4 grid gap-3 border-b border-border pb-4 text-sm"><span className="flex items-center gap-3"><Phone size={16} />{c.phone}</span><span className="flex items-center gap-3"><Mail size={16} />{c.email}</span><span className="flex items-center gap-3"><MapPin size={16} />{c.city}</span></div>
          <h3 className="mt-3 text-sm font-extrabold">المعلومات الأساسية</h3>
          <div className="mt-3 grid gap-3 text-xs"><span className="flex items-center gap-2"><ClipboardList size={15} />عدد الطلبات: {c.orders}</span><span className="flex items-center gap-2"><Clock size={15} />آخر تواصل: اليوم {c.msgs[c.msgs.length - 1]!.time}</span><span className="flex items-center gap-2"><CalendarClock size={15} />القسم: {c.dept}</span></div>
          {panel === "info" && <div className="mt-3 rounded-md bg-search p-3 text-xs">القناة المفضلة: {chName[c.ch]} · عدد الرسائل: {c.msgs.length}</div>}
          {panel === "orders" && <ul className="mt-3 grid gap-1 rounded-md bg-search p-3 text-xs">{Array.from({ length: Math.min(c.orders, 3) }, (_, i) => <li key={i} className="flex justify-between"><span>ORD-2025-{String(1040 - i * 7 - c.id)}</span><span>{i === 0 ? "قيد التوصيل" : "تم التسليم"}</span></li>)}</ul>}
        </section>
        <section className="panel p-4"><h3 className="mb-3 flex items-center gap-2 font-extrabold text-brand-deep"><FileText size={18} />ملاحظات سابقة</h3>{c.notes.length ? c.notes.map((n, i) => <div key={i} className="mb-2 rounded-md bg-search p-3 text-sm leading-7">{n.t}<span className="block text-left text-[10px] text-muted-foreground">{n.d}</span></div>) : <p className="text-xs text-muted-foreground">لا توجد ملاحظات</p>}</section>
        <section className="panel p-4"><h3 className="mb-3 font-extrabold text-brand-deep">إجراءات سريعة</h3><div className="grid gap-2">{([[UserRound, "عرض بيانات العميل", () => setPanel(panel === "info" ? "" : "info")], [List, "الطلبات السابقة", () => setPanel(panel === "orders" ? "" : "orders")], [FileText, "إضافة ملاحظة", () => { const t = window.prompt("اكتب الملاحظة"); if (t?.trim()) upd(sel, x => ({ ...x, notes: [...x.notes, { t: t.trim(), d: `2025/09/22 ${nowTime()}` }] })); }], [Ticket, "إنشاء تذكرة دعم", () => flash(`تم إنشاء تذكرة دعم برقم TKT-2025-${String(Math.floor(Math.random() * 9000) + 1000)}`)]] as const).map(([I, t, fn]) => <button key={t} onClick={fn} className="flex h-11 items-center gap-3 overflow-hidden rounded-md border border-border text-sm"><span className="grid h-full w-11 place-items-center bg-primary/10 text-primary"><I size={18} /></span>{t}</button>)}</div></section>
      </aside>
    </div>
  </AppShell>;
}
