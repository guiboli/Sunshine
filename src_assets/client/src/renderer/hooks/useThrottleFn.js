import { throttle } from 'lodash';
import { useRef, useEffect, useCallback } from 'react';

const useThrottleFn = (fn, ms, options, deps = []) => {
  const fnRef = useRef(fn);

  // make sure every time call fn, the state used in fn is the newest
  useEffect(() => {
    fnRef.current = fn;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleFn = useCallback(
    throttle(() => fnRef.current(), ms, options),
    deps,
  );

  return throttleFn;
};

export { useThrottleFn };
