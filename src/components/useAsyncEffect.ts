import React, {useState, useEffect} from "react";

/**
 * useAsyncEffect completely simplifies the pattern of using an async
 * function inside useEffect. Also handles loading states, error states,
 * and unmounting of the component.
 *
 * Return type is [data, isLoading, error].
 */
export default function useAsyncEffect<T>(cb: () => Promise<T>, deps?: Array<any>): [T, boolean, any] {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    console.log('hi')
    cb()
      .then(loadedData => {
        console.log('setdata', loadedData);
        if (!unmounted) {
          setData(loadedData);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!unmounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      console.log('unmounted');
      unmounted = true;
    };
  }, deps);

  return [data, loading, error];
}