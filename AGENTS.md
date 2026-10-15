<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the activity log's demo entries in `mockData.ts` and derive displayed rows locally; the project intentionally has no persistent audit backend.
- Keep issued admin letters on a standalone route with props/navigation data and organization settings, not fabricated records; the issuer stays unchanged.
- Keep the program purchase journey and contract client-only and illustrative; no payment or identity backend exists.

- Keep software development requests and attachments client-only demo state, because this project has no request persistence backend.
- Keep forms and recruitment committees as client-only demo state with reference entries in `mockData.ts`, because the project has no persistence backend.
- Keep payroll dashboard data and payroll creation client-only and explicitly illustrative, because no payroll or payment backend exists.
- Keep the departments screen's reference rows and edits client-only in `mockData.ts`, because this project has no department persistence backend.
- Keep HR report aggregates in `mockData.ts` and derive filtered views locally, because there is no HR reporting backend.
- Keep the home dashboard and employee onboarding reference records in `mockData.ts` with client-only edits, because this project has no persistent employee backend.
- Keep the employee directory reference rows in `mockData.ts` and filter, page, and edit locally, because there is no persistent employee directory backend.
- Keep the directory and daily attendance reference views linked by their own employee IDs and local details, rather than opening the separate fixed-person profile, so selected employees never display another person's record.
- Keep salary-run reference rows in `mockData.ts` and run payroll previews client-only, because there is no payroll, payment, or persistence backend.
- Keep the treasuries & banks screen data in `mockData.ts` with client-only edits, because there is no treasury or bank persistence backend.
- Keep beneficiaries reference rows in `mockData.ts` with client-only filtering and edits, because there is no beneficiary persistence backend.
- Keep budget reference rows and chart aggregates in `mockData.ts` with client-only filtering and edits, because there is no budget persistence backend.
- Keep purchase invoice/order printable reference data client-only in `mockData.ts`; no invoicing or procurement backend exists.
- Keep authentication screens client-only and explicitly illustrative until a real identity backend is introduced.
- Keep the public marketing site at `/` and the authenticated-style demo dashboard at `/dashboard`, because public acquisition and product operations are separate journeys.
- Keep program purchase orders admin page client-only in mockData.ts, because there is no order/payment backend.
- Keep the customer buy-programs flow client-only in mockData.ts, because there is no payment or order backend.
- Keep contract issuing and e-signature client-only demo state, because there is no document, signature, or persistence backend.
- Keep rewards, promotions, service tickets/departments, invoices, expenses, form builder, treasury statements, and employee profile edits client-only in `mockData.ts`, because these reference screens have no persistence backend.
- Keep salary criteria, linked jobs, evaluation documents, committees, and payroll documents in shared client-only reference data, because these screens are illustrative and have no HR or payroll backend.
- Keep attendance, salary-scale, allowances, letters and approvals client-only. Supply penalties form options and stages via props; preserve its table/profile.
- Keep employee documents and leave requests in client-only reference data; no persistence services exist.
- Isolate `/verify` and `/careers/login` with props-supplied data, settings and callbacks; absent services never fabricate results. Keep careers login un-nested to preserve its existing parent page.
- Keep registration request rows, filters, details, and approval actions in shared client-only reference data, because there is no registration or approval backend.
- Keep registration-specific banner sizing in the shared AppShell and reference layout rules scoped to registration screens, because their compact medical header must not alter other HR pages or the unified navigation.
- Keep branch records and report reference aggregates in mockData.ts with a shared client-only session store; branch creation, edits, status changes, and report filters are illustrative without persistence services.

- Keep linked employee profile, salary, documents, insurance, leaves, attendance, advances, rewards and isolated /employee-custody on one shared client-only reference store backed by mockData.ts; this preserves identity and illustrative edits between views without persistence. Store screenshot summary aggregates separately from reference rows when their totals disagree, so original reference values remain inspectable.

- Scope employee custody assets/history by employee ID in one mockData.ts bundle; preserve organization custody and all existing pages.
