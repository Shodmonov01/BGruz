// import { useEffect, useRef } from 'react'

// function useInfiniteScroll(loadMore, hasMore, loading) {
//     const observerRef = useRef<IntersectionObserver | null>(null)
//     const sentinelRef = useRef<HTMLTableRowElement | null>(null)

//     useEffect(() => {
//         if (!sentinelRef.current || !hasMore || loading) return

//         observerRef.current = new IntersectionObserver(
//             entries => {
//                 if (entries[0].isIntersecting && hasMore && !loading) {
//                     loadMore()
//                 }
//             },
//             { rootMargin: '50px' }
//         )

//         observerRef.current.observe(sentinelRef.current)

//         return () => {
//             observerRef.current?.disconnect()
//         }
//     }, [hasMore, loading, loadMore])

//     return sentinelRef
// }
// export default useInfiniteScroll


import { useEffect, useRef } from 'react'

function useInfiniteScroll(loadMore, hasMore, loading) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLTableRowElement | null>(null)

    useEffect(() => {
        if (!sentinelRef.current || !hasMore || loading) return

        observerRef.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore()
                }
            },
            { rootMargin: '100px' }
        )

        observerRef.current.observe(sentinelRef.current)

        return () => {
            observerRef.current?.disconnect()
        }
    }, [hasMore, loading, loadMore])

    return sentinelRef
}
export default useInfiniteScroll
