# شاشة "المستفيدون"

New page at `/beneficiaries`, built to match the reference image exactly (Arabic, right-to-left), inside the existing sidebar and top bar. It gets a link in the الموارد البشرية section of the sidebar.

## What the page shows (top to bottom, matching the image)
1. **Header**: the title "المستفيدون" and the trail الرئيسية / الموارد البشرية / المستفيدون. On the left, a gold "إضافة مستفيد جديد" button with an add-person icon.
2. **5 summary cards**, each with its own soft tint and round icon, plus a green up-arrow percentage and "مقارنة بالشهر السابق":
   - إجمالي المستفيدين: 312 (green), up 12%
   - الأطباء: 156 (blue), up 8%
   - الكادر الصحي: 126 (purple), up 15%
   - قيد المراجعة: 18 (orange), up 20%
   - مرفوضة: 12 (red), up 5%
3. **Filter bar**: a "تصفية" button, then dropdowns for الجنسيات, الأنواع, التخصصات, الأنواع and الحالات, then a search box for المستفيدين.
4. **Main area, split in two**:
   - **Table**: checkbox, avatar and name, nationality, ID/residency number, specialty, beneficiary type, a colored status badge (معتمد green, قيد المراجعة orange, مرفوض red), registration date, and view / edit / file / "..." actions. Below it: "عرض 1 إلى 10 من 312 نتيجة", page numbers with the current page in navy, and a "إظهار 10" selector.
   - **Side card for the selected beneficiary**: an "معتمد" tag, a large photo, name and specialty, and a "طبيب" tag with a star. It has 4 tabs (البيانات الأساسية، المستندات، العقود، المستحقات) and the basic details: ID number, nationality, phone, email, specialty, type, registration date and status. At the bottom: a navy "تعديل البيانات" button, plus "عرض المستندات" and "إصدار عقد" buttons.

## What works in the demo
- Clicking a row shows that person in the side card.
- Search, the filters, paging and the rows-per-page selector all work on the sample list.
- "إضافة مستفيد جديد" and "تعديل البيانات" open a small form. Changes show up right away and update the cards. Nothing is saved, so everything resets on refresh.
- The tabs switch the side card's content. Documents, contracts and dues show short sample lists.
- The "..." menu offers delete.

## Checks
- Compare against the image at 1440 wide, then check 1024 and 390. On narrow screens the side card moves above the table and the table scrolls sideways. Right-to-left order holds everywhere.

## Technical details
- Route `src/routes/beneficiaries.tsx` → component `src/components/beneficiaries.tsx`, with its own head() metadata.
- Sample rows (about 24 people, so paging has something to do) go in `mockData.ts` as client-only state. Add a rule to AGENTS.md and an item to roadmap.md.
- Avatars use simple initials or person icons from lucide, not real photos. Colors come from existing tokens: buy-navy, buy-gold, success, warning, destructive, primary, finance-purple.
- Add a nav entry to the sidebar list in `mockData.ts`.
