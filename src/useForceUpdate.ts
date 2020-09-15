import { useState, useCallback } from "react";

// https://stackoverflow.com/questions/53215285/how-can-i-force-component-to-re-render-with-hooks-in-react
export default function useForceUpdate() {
  const [,setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, [])
  return update;
}
