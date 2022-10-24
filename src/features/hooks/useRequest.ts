import React, { useState } from 'react';

function useRequest() {
  const [loading, setLoading] = useState(false);
  const [startLoading, stopLoading] = [() => setLoading(true), () => setLoading(false)];

  const send = (req: Promise<any>) => {
    startLoading();
    return req.then(data => data).finally(stopLoading);
  };

  return { send, loading };
}

export default useRequest;
