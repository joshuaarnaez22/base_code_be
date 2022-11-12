import React from 'react';
import LoginFields from './LoginFields';
const BgProps = {
  height: '100%',
  width: '100%',
  pos: 'absolute',
  zIndex: '0',
} as any;

import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, Image, useToast } from '@chakra-ui/react';
import { createUser } from '@/services/user.service';
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Not a proper email')
    .required('Email is required.'),
  password: yup.string().required('Password is required.'),
});

const Login = () => {
  const formMethods = useForm({
    resolver: yupResolver(schema),
  });

  const toast = useToast();

  const onSubmit = async () => {
    return new Promise((resolve, reject) => {
      try {
        // const response = createUser();
        // console.log(response);
      } catch (error) {
        reject(error);
      }
      // setTimeout(() => {
      //     toastUI(1, "We've created your account for you.");
      //     resolve(true);
      // }, 3000);
    });
  };

  const toastUI = (type: number, description: string) => {
    toast({
      status: type == 1 ? 'success' : 'error',
      variant: 'left-accent',
      position: 'top-right',
      isClosable: true,
      title: 'Account created.',
      description: `${description}`,
      duration: 5000,
    });
  };
  return (
    <>
      <Image src="loginBg.jpg" alt="bg" {...BgProps} />
      <Flex
        height="100vh"
        position="relative"
        pt="50px"
        align="center"
        direction="column"
      >
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <LoginFields />
          </form>
        </FormProvider>
      </Flex>
    </>
  );
};

export default Login;
