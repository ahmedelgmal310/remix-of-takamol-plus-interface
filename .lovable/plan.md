# شاشة "الميزانيات"

A new page at `/finance/budgets`, built to match the reference image exactly (Arabic, right to left), inside the current sidebar and top bar. It gets a link in the الشؤون المالية section of the sidebar.

## What the page shows (top to bottom, matching the image)
1. **Header**: the title "الميزانيات" and the trail الرئيسية / الميزانيات. On the left: dropdowns for the quarter (الربع الحالي), projects (جميع المشاريع), departments (جميع الأقسام) and the year (2026), plus a navy "+ إضافة ميزانية" button with gold text.
2. **4 summary cards**, each with a soft tint and a round icon:
   - إجمالي الميزانيات: 5,000,000 (purple)
   - إجمالي المنصرف: 1,800,000 (orange)
   - إجمالي المتبقي: 3,200,000 (blue)
   - إجمالي الفائض: 1,450,000 (green)
3. **Three panels in one row**:
   - **نسبة الصرف العام**: a green half-circle gauge showing 36% "من إجمالي الميزانية". Under it, three columns: منصرف 1,800,000 in orange, متبقي 3,200,000 in navy, فائض 1,450,000 in green.
   - **المصروفات مقارنة بالميزانية**: bars grouped in threes (navy المعتمد, green المنصرف, light blue المتبقي) for 5 departments.
   - **توزيع الميزانيات حسب الأقسام**: a colored donut with 5,000,000 ريال in the middle. Its legend gives each department's share: 35 / 20 / 15 / 12 / 10 / 8%.
4. **Tabs**: قائمة الميزانيات (active, with a gold underline), تفاصيل الميزانية, المشاريع المرتبطة, العقود المرتبطة, سجل الحركات. Next to them: a "تصدير" button with an Excel icon and a "..." button.
5. **Budget table** with 8 rows. Columns: number, budget name, department, project, approved budget, spent, remaining, surplus (green, or red in brackets when negative), a spend progress bar with its percentage (green normally, orange when high), and a status badge (سارية green, قيد المراجعة blue, متوقفة red). Each row has view, edit and "..." actions. Under the table: page numbers with the current page in navy, and "إظهار 10 من 8 نتيجة".

## What works in the demo
- The department and project filters narrow the table and update the cards.
- "إضافة ميزانية" and edit open a small form. New and changed budgets show up right away and update the cards and the gauge. Nothing is saved, so everything resets on refresh.
- The other tabs show short sample content: details of the selected budget, linked projects, contracts, and a transaction log.
- "تصدير" downloads the table as a CSV file. The "..." menu offers delete.

## Checks
- Compare against the image at 1440 wide, then check 1024 and 390. On narrow screens the panels stack, the table scrolls sideways, and right-to-left order holds.

## Technical details
- Route `src/routes/finance_.budgets.tsx` → component `src/components/budgets.tsx`, with its own head() metadata.
- Sample data goes in `mockData.ts` as client-only state. Add the matching rule to AGENTS.md and an item to roadmap.md.
- Charts use recharts. The gauge is a half pie. Colors come from existing tokens: buy-navy, buy-gold, success, warning, primary, finance-purple, destructive.
- Add a nav entry to the finance section in `mockData.ts`.
