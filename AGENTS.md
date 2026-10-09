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
- Keep the program purchase journey client-only and its contract explicitly illustrative, because the project has no payment, identity, or persistence backend.

- Keep software development requests and attachments client-only demo state, because this project has no request persistence backend.
- Keep forms and recruitment committees as client-only demo state with reference entries in `mockData.ts`, because the project has no persistence backend.
- Keep payroll dashboard data and payroll creation client-only and explicitly illustrative, because no payroll or payment backend exists.
- Keep the departments screen's reference rows and edits client-only in `mockData.ts`, because this project has no department persistence backend.
- Keep HR report aggregates in `mockData.ts` and derive filtered views locally, because there is no HR reporting backend.
- Keep the home dashboard and employee onboarding reference records in `mockData.ts` with client-only edits, because this project has no persistent employee backend.
- Keep the employee directory reference rows in `mockData.ts` and filter, page, and edit locally, because there is no persistent employee directory backend.
- Keep salary-run reference rows in `mockData.ts` and run payroll previews client-only, because there is no payroll, payment, or persistence backend.
- Keep the treasuries & banks screen data in `mockData.ts` with client-only edits, because there is no treasury or bank persistence backend.
- Keep beneficiaries reference rows in `mockData.ts` with client-only filtering and edits, because there is no beneficiary persistence backend.
- Keep budget reference rows and chart aggregates in `mockData.ts` with client-only filtering and edits, because there is no budget persistence backend.
- Keep the purchase invoice document data in `mockData.ts` as an illustrative printable view, because there is no invoicing backend.
- Keep the purchase order document data in `mockData.ts` as an illustrative printable view, because there is no procurement backend.
- Keep authentication screens client-only and explicitly illustrative until a real identity backend is introduced.
- Keep the public marketing site at `/` and the authenticated-style demo dashboard at `/dashboard`, because public acquisition and product operations are separate journeys.
- Keep program purchase orders admin page client-only in mockData.ts, because there is no order/payment backend.
- Keep the customer buy-programs flow client-only in mockData.ts, because there is no payment or order backend.
- Keep contract issuing and e-signature client-only demo state, because there is no document, signature, or persistence backend.
- Keep rewards, promotions, service tickets/departments, invoices, expenses, form builder, treasury statements, and employee profile edits client-only in `mockData.ts`, because these reference screens have no persistence backend.
