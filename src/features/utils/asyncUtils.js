import AppError from './AppError';

export const API_DEFAULT_TIMEOUT = 25000;

export const timeoutWithin = function (duration) {
   const executor = (_, reject) => {
      // Force a reject after duration
      setTimeout(
         () => reject(new Error('The server is taking too long to respond')),
         duration
      );
   };
   return new Promise(executor);
};

export async function fetchWithinTimeout(request, durationSecs) {
   let millisecs = isNaN(durationSecs)
      ? API_DEFAULT_TIMEOUT
      : +durationSecs * 1000;

   const response = await Promise.race([request, timeoutWithin(millisecs)]);
   return response;
}

export function handleFetchLoadingState(fn, options) {
   options?.startLoading?.(); // Do sth upon start fetching (like show a loading spinner)
   return fn()
      .then(res => {
         options?.stopLoading?.(); // Do sth upon response (like hide a loading spinner)
         return res;
      })
      .catch(err => {
         options?.stopLoading?.(); // Do sth upon fetch error (like hide a loading spinner)
         throw err;
      });
}
