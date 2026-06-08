import { useObserve } from 'expo-observe';
import { useEffect } from 'react';

/**
 * Reports EAS Observe Time-to-Interactive for the current route once the screen
 * is genuinely usable. `useObserve` scopes the call to the active route, and
 * `markInteractive` is idempotent, so callers may pass a `ready` flag that flips
 * to `true` after any per-screen loading completes.
 */
export function useMarkInteractive(ready: boolean = true) {
  const { markInteractive } = useObserve();
  useEffect(() => {
    if (ready) {
      markInteractive();
    }
  }, [ready, markInteractive]);
}
