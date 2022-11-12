import { instance } from './client';
import { addUser } from './endpoint';
import { ILogin } from './types';
export const createUser = async (payload: ILogin) => {
  console.log(payload);

  const data = {
    username: 'lolol',
    role: 'admin',
    ...payload,
  };
  const query = await instance.post(addUser, data);
  return query;
};
