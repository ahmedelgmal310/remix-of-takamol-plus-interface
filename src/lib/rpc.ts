const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function callRpc<TInput, TOutput>(
  functionName: string,
  data: TInput,
  token: string,
): Promise<TOutput> {
  const response = await fetch(`${API_BASE}/rpc/${functionName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) throw new Error("تعذّر تحميل البيانات، حاول مرة أخرى.");
  return response.json() as Promise<TOutput>;
}