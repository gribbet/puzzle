import { DependencyList, useEffect } from "react";
import { useEventCallback } from "./useEventCallback";

export function useWindowEvent<K extends keyof WindowEventMap>(
  event: K,
  listener: (event: WindowEventMap[K]) => any,
  dependencies: DependencyList
) {
  const callback = useEventCallback(listener, dependencies);
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => window.removeEventListener(event, callback);
  }, []);
}
