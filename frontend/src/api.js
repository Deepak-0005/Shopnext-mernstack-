export const API_BASE_URL = 'http://localhost:5000';

const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out after ' + ms + 'ms'));
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export const apiFetch = (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  console.log('apiFetch', url, options);
  return timeoutPromise(
    10000,
    fetch(url, options)
  );
};
