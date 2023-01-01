import React, { useState } from 'react';

interface Params<ExpectedResponse> {
  startLoadingInitially?: boolean;
  autoStopLoading?: boolean;
  checkPositiveResponse?: (res: ExpectedResponse) => boolean;
}

function useRequest<ExpectedResponse>(props: Params<ExpectedResponse>) {
  const { autoStopLoading = true, startLoadingInitially = false } = props;

  const [loading, setLoading] = useState(startLoadingInitially);
  const [startLoading, stopLoading] = [() => setLoading(true), () => setLoading(false)];
  const [isRetrying, setIsRetrying] = useState(false);

  const send = async (req: Promise<any>, maxRetries?: number | '~'): Promise<any> => {
    startLoading();

    try {
      const data = await req;
      if (!maxRetries) return data;

      // Base case for recursion
      if (
        (typeof maxRetries === 'number' && maxRetries < 1) ||
        (maxRetries === '~' && props.checkPositiveResponse?.(data))
      ) {
        setIsRetrying(false);
        return data;
      }

      setIsRetrying(true);
      const keepRetryingUntilPositiveResponse = maxRetries === '~';

      return send(req, keepRetryingUntilPositiveResponse ? '~' : maxRetries - 1); // Retry
    } catch (err) {
      console.log('Error in useRequest: ', err);
    } finally {
      autoStopLoading && stopLoading();
    }

    // req
    //   .then(data => data)
    //   .finally(autoStopLoading ? stopLoading : () => {});
    // return req;
  };

  return { send, loading, startLoading, stopLoading, isRetrying };
}

export default useRequest;
