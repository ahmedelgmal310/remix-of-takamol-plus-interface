import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sidebarGroups } from "@/data/mockData";

function Brand() {
  return (
    <div className="flex h-[54px] items-center gap-3 border-b border-sidebar-border px-5">
      <span className="brand-mark">t</span>
      <p className="text-base font-extrabold text-sidebar-foreground">تكامل بلس</p>
    </div>
  );
}

function SidebarContent({ close }: { close?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeGroup = sidebarGroups.find((g) => g.children?.some(([, href]) => href === pathname))?.label;
  const [openGroup, setOpenGroup] = useState<string | undefined>(activeGroup);
  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Brand />
      <nav className="flex-1 overflow-y-auto py-2" aria-label="القائمة الرئيسية">
        {sidebarGroups.map((item) => {
          const Icon = item.icon;
          const isOpen = openGroup === item.label;
          const isActive = activeGroup === item.label;
          if (!item.children) {
            return item.href ? (
              <Link key={item.label} to={item.href} onClick={close} className="sidebar-item"><Icon size={18} /><span className="flex-1 text-right">{item.label}</span></Link>
            ) : (
              <button key={item.label} type="button" className="sidebar-item opacity-70"><Icon size={18} /><span className="flex-1 text-right">{item.label}</span><ChevronLeft size={13} /></button>
            );
          }
          return (
            <div key={item.label}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpenGroup(isOpen ? undefined : item.label)} className={`sidebar-item ${isActive || isOpen ? "sidebar-group-active" : ""}`}>
                <Icon size={18} /><span className="flex-1 text-right">{item.label}</span>{isOpen ? <ChevronUp size={13} /> : <ChevronLeft size={13} />}
              </button>
              {isOpen && (
                <div className="sidebar-submenu">
                  {item.children.map(([label, href]) => (
                    <Link key={href} to={href} onClick={close} activeOptions={{ exact: true }} activeProps={{ className: "sidebar-subitem-active" }}>{label}</Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function Topbar({ openMenu }: { openMenu: () => void }) {
  return (
    <header className="topbar flex items-center justify-between gap-3 px-4 lg:px-7">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="فتح القائمة" onClick={openMenu}><Menu /></Button>
      <label className="relative hidden w-[400px] shrink-0 sm:block">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input className="h-9 w-full rounded-md border border-input bg-search pr-10 pl-3 text-xs outline-none focus:ring-2 focus:ring-ring" placeholder="ابحث عن موظف، رقم الهوية، أو أي بيانات أخرى..." />
      </label>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" aria-label="الإعدادات"><Settings /></Button>
        <Button variant="ghost" size="icon" aria-label="الرسائل"><MessageSquareText /></Button>
        <Button asChild variant="ghost" size="icon" className="relative"><Link to="/notifications" aria-label="الإشعارات"><Bell /><span className="notification-dot">12</span></Link></Button>
        <div className="mx-1 hidden h-7 w-px bg-border sm:block" />
        <div className="hidden min-w-[150px] items-center gap-2 sm:flex">
          <span className="avatar">أم</span><div><p className="text-xs font-extrabold">أحمد محمد</p><p className="text-[9px] text-primary">مدير الموارد البشرية</p></div><ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="min-w-0 lg:mr-[244px]"><Topbar openMenu={() => setMobileOpen(true)} />{children}</div>
      <div className="fixed inset-y-0 right-0 z-40 hidden w-[244px] lg:block"><SidebarContent /></div>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-overlay" aria-label="إغلاق القائمة" onClick={() => setMobileOpen(false)} /><div className="absolute inset-y-0 right-0 w-[260px]"><Button variant="ghost" size="icon" className="absolute left-2 top-2 z-10 text-sidebar-foreground" onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة"><X /></Button><SidebarContent close={() => setMobileOpen(false)} /></div></div>}
    </div>
  );
}