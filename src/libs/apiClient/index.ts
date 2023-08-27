export const fetchApi = <T>(fetch: Promise<Response>): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetch
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((json) => {
              resolve(json);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
