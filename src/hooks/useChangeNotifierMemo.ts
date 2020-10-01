import { useState, useCallback, useEffect, useMemo } from 'react'

import ChangeNotifier from '../ChangeNotifier'

export default function useChangeNotifierMemo<T>(
    changeNotifier: ChangeNotifier,
    callback: () => T
) {
    const [tick, setTick] = useState(0)
    const update = useCallback(() => {
        // eslint-disable-next-line no-shadow
        setTick((tick) => tick + 1)
    }, [])

    useEffect(() => {
        changeNotifier.addListener(update)

        return () => {
            changeNotifier.removeListener(update)
        }
    }, [changeNotifier, update])

    return useMemo(callback, [callback, tick])
}
