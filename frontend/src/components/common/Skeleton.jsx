export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
      <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
      <div className="h-6 w-12 bg-slate-200 rounded" />
    </div>
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-5 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-2/3 bg-slate-100 rounded" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4"><div className="h-8 w-8 bg-slate-200 rounded-full" /></td>
      <td className="px-4 py-4"><div className="h-3 w-32 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4"><div className="h-3 w-40 bg-slate-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-5 w-20 bg-slate-100 rounded-full" /></td>
      <td className="px-4 py-4"><div className="h-3 w-16 bg-slate-100 rounded" /></td>
    </tr>
  );
}