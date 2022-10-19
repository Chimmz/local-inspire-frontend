import { useState } from 'react';

const useToggle = function (initState = false) {
   const [state, setState] = useState(initState);

   const toggle = () => setState(!state);
   const setOn = () => setState(true);
   const setOff = () => setState(false);
   const reset = () => setState(initState);

   return [state, toggle, setOn, setOff, setState, reset];
};

export default useToggle;
