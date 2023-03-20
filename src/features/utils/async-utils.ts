export const API_DEFAULT_TIMEOUT = 25000;

export const timeoutWithin = function (duration: number) {
  return new Promise(
    setTimeout.bind(
      null,
      Promise.reject.bind(null, new Error('The server is taking too long to respond')),
      duration,
    ),
  );
};

export async function fetchWithinTimeout(request: Promise<any>, durationSecs: number) {
  let millisecs = isNaN(durationSecs) ? API_DEFAULT_TIMEOUT : +durationSecs * 1000;
  const response = await Promise.race([request, timeoutWithin(millisecs)]);
  return response;
}

export const simulateRequest = async (secs: number, fn: (req: Promise<any>) => any) => {
  return await fn(new Promise(resolve => setTimeout(resolve, secs * 1000)));
};
