import { useEffect, useState } from 'react';

interface Props {
  apiSearch: () => void;
}

const useApiTextSearch = function (props: Props) {
  const [timer, setTimer] = useState(setTimeout(() => {}, 1));

  const handleInputKeyUp: React.KeyboardEventHandler<HTMLInputElement> = () => {
    clearTimeout(timer);
    // Causes a delay before searching upon user input. This prevents API calls on every keystroke
    setTimer(setTimeout(props.apiSearch, 500));
  };

  useEffect(() => clearTimeout.bind(null, timer), []);

  return { handleInputKeyUp };
};

export default useApiTextSearch;
