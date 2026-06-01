import type { QueryState, UnknownRow } from "@/types/monster-command";

export function SourceNotice<T extends UnknownRow>({ state, table }: { state: QueryState<T>; table: string }) {
  if (!state.error) {
    return (
      <p className="text-xs text-zinc-500">
        {table}: reading from {state.source}.
      </p>
    );
  }

  return (
    <p className="rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-3 text-xs text-yellow-100">
      {table}: {state.error}
    </p>
  );
}
