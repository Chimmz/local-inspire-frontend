import React, { useState } from 'react';

interface Params {
  autoStopLoading?: boolean;
}

function useRequest(args?: Params) {
  const [loading, setLoading] = useState(false);
  const [startLoading, stopLoading] = [() => setLoading(true), () => setLoading(false)];

  const send = (req: Promise<any>) => {
    startLoading();
    return req.then(data => data).finally(args?.autoStopLoading ? stopLoading : null);
  };

  return { send, loading, stopLoading };
}

export default useRequest;
