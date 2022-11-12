import axios from 'axios';

const errorResponseHandler = (error: any) => {
  console.log(error);
};

export const instance = axios.create({
  // baseURL: process.env.DEVELOPMENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(function (response) {
  return response;
}, errorResponseHandler);
