import { useState, useCallback } from 'react';

const useToggle = function (initState = false) {
  const [state, setState] = useState(initState);

  // const toggle = useCallback(() => setState(!state), [state, setState]);
  // const setOn = useCallback(() => setState(true), [setState]);
  // const setOff = useCallback(() => setState(false), [setState]);
  // const reset = useCallback(() => setState(initState), [initState, setState]);
  const toggle = setState.bind(null, !state);
  const setOn = setState.bind(null, true);
  const setOff = setState.bind(null, false);
  const reset = setState.bind(null, initState);

  return { state, toggle, setOn, setOff, setState, reset };
};

export default useToggle;
