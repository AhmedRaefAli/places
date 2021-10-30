//here we crete custom hook
import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  //set state and init it value and set the func can change it
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  //make state survive the rerender cycle //piece of data not init when this func run again 
  const activeHttpRequests = useRef([]);
  //use callback is used to make sure this func never recreated when the component use it 
  //rerender
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

//useEffect run when component mount or un mount or when one depency change 
//when we use return so we want it to run when component unMount 
//this code logic we try to make sure we never continue with req on it's way out when we switch component that triger the req 
  useEffect(() => {

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
