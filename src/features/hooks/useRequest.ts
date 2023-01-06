import React, { useCallback, useState } from 'react';

interface Params<ExpectedResponse> {
  startLoadingInitially?: boolean;
  autoStopLoading?: boolean;
  checkPositiveResponse?: (res: ExpectedResponse) => boolean;
}

function useRequest<ExpectedResponse>(props: Params<ExpectedResponse>) {
  const { autoStopLoading = true, startLoadingInitially = false } = props;

  const [loading, setLoading] = useState(startLoadingInitially);
  const [isRetrying, setIsRetrying] = useState(false);

  const startLoading = useCallback(() => setLoading(true), [setLoading]);
  const stopLoading = useCallback(() => setLoading(false), [setLoading]);

  const send = useCallback(
    async (req: Promise<any>, maxRetries?: number | '~'): Promise<any> => {
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
    },
    [startLoading, stopLoading, setIsRetrying],
  );

  return { send, loading, startLoading, stopLoading, isRetrying };
}

export default useRequest;
