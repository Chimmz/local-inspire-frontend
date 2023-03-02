import React, { useCallback, useState } from 'react';
import useToggle from './useToggle';

interface Params<ExpectedResponse> {
  startLoadingInitially?: boolean;
  autoStopLoading?: boolean;
  checkPositiveResponse?: (res: ExpectedResponse) => boolean;
}

function useRequest<ExpectedResponse>(props: Params<ExpectedResponse>) {
  const { autoStopLoading = true, startLoadingInitially = false } = props;
  const {
    state: loading,
    setOn: startLoading,
    setOff: stopLoading,
  } = useToggle(startLoadingInitially);

  const [loaded, setLoaded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

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
        setLoaded(true);
      }
    },
    [startLoading, stopLoading, setIsRetrying],
  );

  return { send, loading, startLoading, stopLoading, loaded, isRetrying };
}

export default useRequest;
