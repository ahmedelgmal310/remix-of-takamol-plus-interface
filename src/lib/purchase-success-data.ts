export type PurchaseStageState = 'completed' | 'current' | 'not-started';
export type PurchaseStageId = 'received' | 'review' | 'transfer' | 'activation' | 'contract';
export interface PurchaseStage { id: PurchaseStageId; label: string; state: PurchaseStageState; detail?: string }
export interface PurchaseSuccessOrder {
  number: string; plan: string; amount: number; currency: string; requestedAt: string;
  paymentStatus: string; orderStatus: string; stages: readonly PurchaseStage[];
}
export function purchaseNumber(value: string) { return /^TAK-\d+$/.test(value) ? value : '—'; }
export function readPurchaseSuccessOrder(value: unknown): PurchaseSuccessOrder | undefined {
  if (!value || typeof value !== 'object') return;
  const order = value as Record<string, unknown>;
  if (typeof order['number'] !== 'string' || typeof order['plan'] !== 'string' || typeof order['amount'] !== 'number' || !Number.isFinite(order['amount']) || typeof order['currency'] !== 'string' || typeof order['requestedAt'] !== 'string' || typeof order['paymentStatus'] !== 'string' || typeof order['orderStatus'] !== 'string' || !Array.isArray(order['stages']) || order['stages'].length !== 5) return;
  const ids = ['received', 'review', 'transfer', 'activation', 'contract'];
  const stages: PurchaseStage[] = [];
  for (const [index, item] of order['stages'].entries()) {
    if (!item || typeof item !== 'object' || item.id !== ids[index] || typeof item.label !== 'string' || !['completed', 'current', 'not-started'].includes(item.state) || (item.detail !== undefined && typeof item.detail !== 'string')) return;
    stages.push({ id: item.id, label: item.label, state: item.state, detail: item.detail });
  }
  return { number: order['number'], plan: order['plan'], amount: order['amount'], currency: order['currency'], requestedAt: order['requestedAt'], paymentStatus: order['paymentStatus'], orderStatus: order['orderStatus'], stages };
}