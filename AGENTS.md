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
