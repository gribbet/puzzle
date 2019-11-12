import { DependencyList, useEffect } from "react";

export function useAsyncEffect(
  callback: () => Promise<void>,
  dependencies: DependencyList
) {
  useEffect(() => {
    callback();
  }, dependencies);
}
