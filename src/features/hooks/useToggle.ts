import { useState, useCallback } from 'react';

const useToggle = function (initState = false) {
  const [state, setState] = useState(initState);

  const toggle = useCallback(() => setState(!state), [state]);
  const setOn = useCallback(() => setState(true), []);
  const setOff = useCallback(() => setState(false), []);
  const reset = useCallback(() => setState(initState), [initState]);

  return { state, toggle, setOn, setOff, setState, reset };
};

export default useToggle;
