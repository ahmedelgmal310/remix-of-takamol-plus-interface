# شاشة "الخزائن والبنوك"

New screen at `/finance/treasuries` that matches the reference image exactly (Arabic, RTL), inside the existing sidebar/topbar layout. The existing "حسابات البنوك" screen stays as it is.

## What the screen shows (top to bottom, matching the image)
1. **Header**: title "الخزائن والبنوك" with the trail الرئيسية / الشؤون المالية / الخزائن والبنوك. On the left: a date range (01/10/2026 - 31/10/2026), a "جميع الأنواع" dropdown, a "جميع الحالات" dropdown, and a dark navy "+ إضافة حركة مالية" button with a gold border.
2. **5 summary cards**, each with its own soft tint and round icon: إجمالي أرصدة الخزائن 450,000 (gold), إجمالي أرصدة البنوك 2,850,000 (blue), إجمالي الرصيد الكلي 3,300,000 (green), إجمالي الإيرادات 620,000 (blue arrow), إجمالي المصروفات 410,000 (red text and red arrow).
3. **Two charts in one row**:
   - "أرصدة الخزائن والبنوك": grouped bars, navy for البنوك and gold for الخزائن, across 7 accounts (الراجحي، الأهلي، الإنماء، الرياض، الخزينة الرئيسية، خزينة المشاريع، خزينة الطوارئ).
   - "حركة الحسابات الشهرية": two shaded lines, green for الإيرادات and blue for المصروفات, January to October, with a "هذا العام" filter.
4. **Three panels in one row**:
   - "توزيع الأرصدة": donut chart with 3,300,000 ريال in the center and a legend with percentages (37.9 / 25.8 / 13.6 / 9.1 / 13.6).
   - "حسابات البنوك": table with bank logo, masked IBAN, balance, a "..." menu, and a gold "+ إضافة حساب بنكي" button.
   - "الخزائن": 3 treasuries with gold icons, balances, a "..." menu, and a gold "+ إضافة خزينة" button.
5. **"آخر الحركات المالية"**: table with 5 rows. Type is shown as a colored badge (إيداع green, صرف red, تحويل blue), amounts are green or red, there is an attachment icon, and every row has a green "مكتملة" status. A "جميع الحركات" filter sits above it.

## What works in the demo
- The date, type, and status filters narrow the transactions table.
- "إضافة حركة مالية", "إضافة حساب بنكي", and "إضافة خزينة" each open a small form. New entries show up right away and update the cards. Nothing is saved, so everything resets on refresh.
- The "..." menus offer view, edit, and delete.

## Navigation
- Add "الخزائن والبنوك" to the الشؤون المالية section of the sidebar, right after حسابات البنوك.

## Checks
- Compare against the image at 1440, then check 1024 and 390. On narrow screens, cards and panels stack and tables scroll sideways, keeping right-to-left order.

## Technical details
- Route `src/routes/finance_.treasuries.tsx` → component `src/components/treasuries-banks.tsx`, with its own head() metadata.
- Demo data goes in `mockData.ts` as client-only state, consistent with the AGENTS.md demo-only rules. Add a matching rule to AGENTS.md.
- Charts use recharts (already used in the finance screens). Colors come from existing tokens: navy primary, gold accent, success, destructive, info.
- Add a nav entry in mockData's sidebar list and a roadmap.md item.
