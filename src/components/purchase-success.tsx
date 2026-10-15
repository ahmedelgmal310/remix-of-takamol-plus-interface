import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Check, FileText, Layers, CreditCard, CalendarDays, UploadCloud, Clock, Search, Settings, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { BrandLogo } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { purchaseSuccessReference } from '@/data/mockData';
import { purchaseNumber, readPurchaseSuccessOrder, type PurchaseSuccessOrder, type PurchaseStage } from '@/lib/purchase-success-data';
import office from '@/assets/purchase-success-office.jpg';
import styles from './purchase-success.module.css';

const icons = { received: Check, review: Search, transfer: CreditCard, activation: Settings, contract: FileText };
const stateLabels = { completed:'مكتملة',current:'حاليّة','not-started':'لم تبدأ' };
function Tracker({ stages }: { stages: readonly PurchaseStage[] }) {
 return <ol className={styles.tracker} aria-label="مراحل طلب الشراء">{stages.map(stage=>{const Icon=stage.state==='completed'?Check:icons[stage.id];return <li key={stage.id} className={styles.stage} data-state={stage.state} aria-current={stage.state==='current'?'step':undefined} aria-label={`${stage.label} — ${stateLabels[stage.state]}`}><span className={styles.circle}><Icon aria-hidden="true"/></span><h3>{stage.label}</h3><p>{stage.detail || '—'}</p></li>;})}</ol>;
}
export function PurchaseSuccessPage({ order: suppliedOrder, stages, onTrack }: { order?: PurchaseSuccessOrder; stages?: readonly PurchaseStage[]; onTrack?: (order: PurchaseSuccessOrder)=>void }) {
 const [navigationOrder,setNavigationOrder]=useState<PurchaseSuccessOrder>();
 const [tracking,setTracking]=useState(false);
 useEffect(()=>{const state:unknown=window.history.state;if(state && typeof state==='object')setNavigationOrder(readPurchaseSuccessOrder((state as Record<string,unknown>)['purchaseOrder']));},[]);
 const order=suppliedOrder ?? navigationOrder ?? purchaseSuccessReference;
 const displayedStages=stages ?? order.stages;
 const rows=[{label:'رقم الطلب',value:purchaseNumber(order.number),icon:FileText,ltr:true},{label:'الباقة المطلوبة',value:order.plan || '—',icon:Layers,ltr:true},{label:'مبلغ التحويل',value:`${order.amount.toLocaleString('en-US')} ${order.currency}`,icon:CreditCard},{label:'تاريخ الطلب',value:order.requestedAt || '—',icon:CalendarDays,ltr:true},{label:'حالة الدفع',value:order.paymentStatus || '—',icon:UploadCloud,badge:styles.payment},{label:'حالة الطلب',value:order.orderStatus || '—',icon:Clock,badge:styles.status}];
 return <main dir="rtl" className={styles.page}>
  <img className={styles.photo} src={office} width={1536} height={1024} alt="مكتب ووثائق محايدة بلا شعارات"/><div className={styles.wash}/><div className={styles.arc}/>
  <div className={styles.content}>
   <header className={styles.brand}><BrandLogo compact/><p>إدارة الموارد البشرية والمالية وخدمة العملاء</p></header>
   <section className={styles.success}><div aria-hidden="true" className={styles.confetti}>{Array.from({length:8},(_,i)=><i key={i}/>)}</div><span className={styles.seal} aria-hidden="true"><Check/></span><h1>تم استلام طلب شراء المنصة بنجاح</h1><p>شكراً لك، تم استلام طلبك وسيتم مراجعته من قبل الإدارة وسنرسل لك إشعارات بحالة الطلب عبر بريدك الإلكتروني.</p></section>
   <section className={styles.details} aria-labelledby="purchase-details"><h2 id="purchase-details"><FileText size={23}/>تفاصيل الطلب</h2><dl>{rows.map(row=><div key={row.label}><dt><row.icon aria-hidden="true"/>{row.label}</dt><dd dir={row.ltr?'ltr':undefined}>{row.badge?<span className={`${styles.badge} ${row.badge}`}>{row.value}</span>:row.value}</dd></div>)}</dl></section>
   <Tracker stages={displayedStages}/>
   <div className={styles.actions}><Button className="bg-buy-navy text-primary-foreground hover:bg-buy-navy/90" onClick={()=>onTrack?onTrack(order):setTracking(true)}>متابعة حالة الطلب<ArrowLeft/></Button><Button asChild variant="outline" className="border-buy-navy bg-card text-buy-navy"><Link to="/dashboard"><LayoutDashboard/>العودة إلى لوحة التحكم</Link></Button></div>
   <p className={styles.notice}>بيانات عرض تجريبية؛ لا يتم إرسال طلب أو إشعار أو تفعيل حساب فعلي.</p>
  </div>
  <Dialog open={tracking} onOpenChange={setTracking}><DialogContent dir="rtl" className="max-w-3xl"><DialogHeader className="text-right"><DialogTitle>متابعة حالة الطلب — {purchaseNumber(order.number)}</DialogTitle><DialogDescription>حالة الطلب الحالية: {order.orderStatus}</DialogDescription></DialogHeader><p className={styles.trackingSummary}>{order.plan} · {order.amount.toLocaleString('en-US')} {order.currency} · {order.paymentStatus}</p><Tracker stages={displayedStages}/><p className="text-center text-xs text-muted-foreground">معاينة بيانات الطلب المعروضة، غير متصلة بخدمة متابعة فعلية.</p></DialogContent></Dialog>
 </main>;
}