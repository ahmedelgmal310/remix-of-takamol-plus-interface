import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function BranchFrame({ title, icon, children, breadcrumb }: { title: string; icon?: ReactNode; children: ReactNode; breadcrumb?: string }) {
  return <AppShell><main dir="rtl" className="branch-page"><header className="branch-heading"><h1>{icon}{title}</h1>{breadcrumb && <p><Link to="/dashboard">الرئيسية</Link><ChevronLeft size={12}/><Link to="/branches">{breadcrumb}</Link><ChevronLeft size={12}/>{title}</p>}</header>{children}</main></AppShell>;
}
export function BranchStatus({ active, change, label }: { active: boolean; change?: (value: boolean) => void; label: string }) {
  return <span className="branch-status"><Switch checked={active} {...(change ? {onCheckedChange:change} : {})} disabled={!change} aria-label={label}/><span className={active ? "branch-badge active" : "branch-badge inactive"}>{active ? "نشط" : "غير نشط"}</span></span>;
}
export function BranchPagination({ page, setPage, total, size, setSize, noun = "فرع" }: { page: number; setPage: (n: number) => void; total: number; size: number; setSize: (n: number) => void; noun?: string }) {
  const pages = Math.max(1, Math.ceil(total / size));
  return <footer className="branch-pagination"><div>من {total ? (page - 1) * size + 1 : 0} إلى {Math.min(page * size, total)} من أصل {total} {noun}<span>عرض</span><select aria-label="عدد الصفوف" value={size} onChange={e => { setSize(Number(e.target.value)); setPage(1); }}><option value={noun === "فرع" ? 6 : 5}>{noun === "فرع" ? 6 : 5}</option><option value={10}>10</option><option value={20}>20</option></select></div><nav dir="ltr" aria-label="صفحات الجدول"><Button variant="outline" size="icon" disabled={page === 1} aria-label="الصفحة السابقة" onClick={() => setPage(page - 1)}><ChevronLeft/></Button>{Array.from({ length: pages }, (_, i) => <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="icon" aria-label={`صفحة ${i + 1}`} onClick={() => setPage(i + 1)}>{i + 1}</Button>)}<Button variant="outline" size="icon" disabled={page === pages} aria-label="الصفحة التالية" onClick={() => setPage(page + 1)}><ChevronRight/></Button></nav></footer>;
}
export function BranchMap({ location, onSelect }: { location: string; onSelect?: (v: string) => void }) {
  return <div className="branch-map"><svg viewBox="0 0 320 190" role="img" aria-label={`موقع الفرع: ${location}`}><rect width="320" height="190" className="branch-map-ground"/><g transform="rotate(-24 160 95)">{Array.from({length:48}, (_, i) => <rect key={i} x={(i % 8) * 45 - 20} y={Math.floor(i / 8) * 37 - 15} width="34" height="25" rx="2" className={i % 13 === 0 ? "branch-map-park" : "branch-map-block"}/>)}{Array.from({length:9}, (_, i) => <path key={i} d={`M${i * 45 - 25},-70 V270 M-80,${i * 37 - 19} H400`} className="branch-map-street"/>)}</g><path d="M-20 160L340 12 M95 -20L205 210" className="branch-map-road"/><path d="M-20 160L340 12 M95 -20L205 210" className="branch-map-road-center"/><text x="245" y="165" className="branch-map-label">الرياض</text><text x="60" y="42" className="branch-map-label">العليا</text><text x="258" y="68" className="branch-map-label">السليمانية</text></svg><MapPin className="branch-map-pin" size={38}/>{onSelect && <Button type="button" variant="outline" onClick={() => onSelect(location === "24.7136, 46.6753" ? "24.7210, 46.6810" : "24.7136, 46.6753")}><MapPin size={16}/>تحديد الموقع على الخريطة</Button>}</div>;
}
export function BranchDemoNotice({ children }: { children?: ReactNode }) { return <p className="branch-demo" role="status">{children || "بيانات وإجراءات تجريبية فقط، لا تُحفظ بعد تحديث الصفحة."}</p>; }