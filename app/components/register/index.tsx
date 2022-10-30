import React from 'react';
import RegisterFields from './RegisterFields';
const BgProps = {
  height: '100%',
  width: '100%',
  pos: 'absolute',
  zIndex: '0',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, Image, useToast } from '@chakra-ui/react';
import { createUser } from '@/services/user.service';
import { useRouter } from 'next/router';
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Not a proper email')
    .required('Email is required.'),
  password: yup.string().required('Password is required.'),
  confirm: yup
    .string()
    .required('Confirm Password is required.')
    .oneOf([yup.ref('password'), null], 'Passwords do not match.'),
});

const Register = () => {
  const router = useRouter();
  const formMethods = useForm({
    resolver: yupResolver(schema),
  });

  const toast = useToast();

  const onSubmit = async (payload: any) => {
    try {
      const { data }: any = await createUser(payload);
      if (data.message === 'Account Registered successfully') {
        toastUI(1, data.message, 'Account created.');
        router.push('/');
      } else {
        toastUI(2, data.message, 'Account Invalid.');
      }
    } catch (error) {
      console.log(error);
      toastUI(2, 'Something went wrong', 'Error');
    }
  };

  const toastUI = (type: number, description: string, title: string) => {
    toast({
      status: type == 1 ? 'success' : 'error',
      variant: 'left-accent',
      position: 'top-right',
      isClosable: true,
      title: title,
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
            <RegisterFields />
          </form>
        </FormProvider>
      </Flex>
    </>
  );
};

export default Register;
