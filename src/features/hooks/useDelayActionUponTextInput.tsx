import { useEffect, useState } from 'react';

interface Props {
  action(): any;
  delay?: number;
}

const useDelayActionUponTextInput = function ({ action, delay = 500 }: Props) {
  const [timer, setTimer] = useState(setTimeout(() => {}, 1));

  const onInputKeyUp: React.KeyboardEventHandler<HTMLInputElement> = ev => {
    clearTimeout(timer);
    // Causes a delay before searching upon user input. This prevents API calls on every keystroke
    setTimer(setTimeout(action, delay));
  };

  useEffect(() => clearTimeout.bind(null, timer), []);

  return onInputKeyUp;
};

export default useDelayActionUponTextInput;
