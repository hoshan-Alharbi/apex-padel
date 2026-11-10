import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type FavoritesValue = {
  ids: ReadonlySet<string>;
  isFavorite: (clubId: string) => boolean;
  toggle: (clubId: string) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

// In memory only (UI-only phase): resets to the seed on app restart.
const SEED = ['arena'];

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set(SEED));

  const toggle = useCallback((clubId: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(clubId)) next.delete(clubId);
      else next.add(clubId);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ ids, toggle, isFavorite: (id: string) => ids.has(id) }), [ids, toggle]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
