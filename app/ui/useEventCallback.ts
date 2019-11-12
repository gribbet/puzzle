import { DependencyList, useCallback, useEffect, useRef } from "react";

export function useEventCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: DependencyList
): T {
  const ref = useRef<(...args: any[]) => T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback, ...dependencies]);

  return useCallback((...args: any[]) => ref.current!(...args), [ref]) as T;
}
