import { createContext, useContext } from 'react';

type OpeningState = {
  /** True once the opening lets the app behind it mount (before its first frame). */
  revealed: boolean;
  /** The screen behind the opening calls this once it has laid out, so the animation can start. */
  markReady: () => void;
};

export const OpeningContext = createContext<OpeningState>({ revealed: true, markReady: () => {} });

export function useRevealed(): boolean {
  return useContext(OpeningContext).revealed;
}

export function useMarkOpeningReady(): () => void {
  return useContext(OpeningContext).markReady;
}
