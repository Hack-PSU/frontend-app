import { useEffect } from 'react'
import { useLocalStore } from 'mobx-react'

// Helper for cleanly and plainly fetching async data.
//
// I got inspired by error handling in Rust:
// https://doc.rust-lang.org/book/ch09-00-error-handling.html
export interface AsyncData<T> {
    loading: boolean
    error: any | undefined
    data: T | undefined
}

// Creates a default structure for async data.
export function createAsyncData<T>(): AsyncData<T> {
    return {
        loading: false,
        error: undefined,
        data: undefined,
    }
}

export async function fetchAsyncData<T>(data: AsyncData<T>, func: () => Promise<T>): Promise<void> {
    if (data.loading) {
        return
    }

    try {
        data.loading = true
        data.data = await func()
        data.loading = false
        data.error = undefined
    } catch (e) {
        data.loading = false
        data.error = e
    }
}

// React Hook helper.
export function useAsyncData<T>(func?: () => Promise<T>) {
    const store = useLocalStore(() => createAsyncData<T>())

    useEffect(() => {
        if (func) {
            fetchAsyncData(store, func)
        }
    }, [func, store])

    return store
}
