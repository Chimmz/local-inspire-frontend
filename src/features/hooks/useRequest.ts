import React, { useState } from 'react';

interface Params {
  autoStopLoading?: boolean;
}

function useRequest({ autoStopLoading = true }: Params) {
  const [loading, setLoading] = useState(false);
  const [startLoading, stopLoading] = [() => setLoading(true), () => setLoading(false)];

  const send = (req: Promise<any>) => {
    startLoading();
    req
      .then(data => data)
      .catch(err => console.log('Error in useRequest: ', err))
      .finally(() => autoStopLoading && stopLoading());
    return req;
  };

  return { send, loading, startLoading, stopLoading };
}

export default useRequest;
