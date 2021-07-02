import { useRef, useState } from 'react'

export function CallBackRef(cb) {
  const refCb = useRef(cb)
  refCb.current = cb
  const [staticCb] = useState(() => {
    return (...args) => refCb.current(...args)
  })
  return staticCb
}
// import { useCallback, useRef } from 'react'

// export function CallBackRef(fn) {
//   const fnRef = useRef(fn)
//   fnRef.current = fn

//   return useCallback((...args) => fnRef.current(...args), [])
// }
