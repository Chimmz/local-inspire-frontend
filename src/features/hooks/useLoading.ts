import { useState } from 'react';

const useLoading = function (init: boolean = false) {
  const [isLoading, setLoading] = useState(init);

  function startLoading() {
    setLoading(true);
  }
  function stopLoading() {
    setLoading(false);
  }

  return [isLoading, startLoading, stopLoading];
};

export default useLoading;
