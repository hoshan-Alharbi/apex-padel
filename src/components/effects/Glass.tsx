import { BlurTargetView, BlurView } from 'expo-blur';
import {
  type ComponentRef,
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useFocusEffect } from 'expo-router';

// Android blurs only what sits inside a BlurTargetView, so every glass surface needs the ref
// of the content behind it. iOS ignores the target and blurs natively.
export type GlassTarget = RefObject<ComponentRef<typeof View> | null>;
type Target = GlassTarget;

/** Ref for a BlurTargetView. */
export function useGlassTarget(): GlassTarget {
  return useRef<ComponentRef<typeof View> | null>(null);
}

const ScreenTargetContext = createContext<{ target: Target | null; setTarget: (t: Target) => void } | null>(null);

/** Shares the focused screen's blur target with chrome rendered outside it (the tab bar). */
export function ScreenTargetProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<Target | null>(null);
  const value = useMemo(() => ({ target, setTarget }), [target]);
  return <ScreenTargetContext.Provider value={value}>{children}</ScreenTargetContext.Provider>;
}

export function useScreenTarget(): Target | null {
  return useContext(ScreenTargetContext)?.target ?? null;
}

/** Wraps a tab screen's content so the tab bar (and the screen's own sticky header) can blur it. */
export function ScreenBlurTarget({ children, style, targetRef }: { children: ReactNode; style?: StyleProp<ViewStyle>; targetRef?: Target }) {
  const ownRef = useGlassTarget();
  const ref = targetRef ?? ownRef;
  const ctx = useContext(ScreenTargetContext);
  const setTarget = ctx?.setTarget;

  useFocusEffect(
    useCallback(() => {
      setTarget?.(ref);
    }, [setTarget, ref]),
  );

  return (
    <BlurTargetView ref={ref} style={style}>
      {children}
    </BlurTargetView>
  );
}

export { BlurTargetView };

type GlassProps = {
  target: Target | null;
  /** Tint drawn over the blur, e.g. 'rgba(23,28,38,0.9)' for surface-container-low/90. */
  tint: string;
  /** Tailwind backdrop-blur-md ≈ 12px, -lg ≈ 16px. */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/** Frosted surface: real backdrop blur on iOS and Android 12+, translucent tint elsewhere. */
export function Glass({ target, tint, intensity = 40, style, children }: GlassProps) {
  return (
    <View style={[styles.clip, style]}>
      <BlurView
        tint="dark"
        intensity={intensity}
        // No target yet (first frame): plain tint, instead of asking for a blur it can't do.
        blurMethod={target ? 'dimezisBlurViewSdk31Plus' : 'none'}
        blurTarget={target ?? undefined}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});
