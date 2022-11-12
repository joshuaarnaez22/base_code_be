import React, { useState } from 'react';
import {
  Text,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Stack,
  Collapse,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useFormContext, useFormState } from 'react-hook-form';
import Link from 'next/link';

const RegisterFields = () => {
  const [password, showPassword] = useState<boolean>(false);
  const [confirmPass, showConfirmPass] = useState<boolean>(false);
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();
  const { errors } = useFormState();
  return (
    <>
      <Flex gap="5" direction="column" align="center">
        <Text fontSize="Header.lg" fontWeight="normal" fontFamily="lexendDeca">
          Register
        </Text>
        <Text fontSize="Header.xs" fontWeight="normal" fontFamily="lexendDeca">
          Register and start managing your candidates!
        </Text>
        <Stack>
          <Input
            variant="basic"
            placeholder="Email"
            w="300px"
            autoComplete="off"
            _placeholder={{
              color: 'white',
              opacity: '.5',
              fontFamily: 'lexendDeca',
              fontSize: 'SubHeader.lg',
            }}
            {...register('email')}
          />
          <Collapse in={errors.email ? true : false} animateOpacity>
            {errors.email && (
              <Text fontSize="SubHeader.md" color="red">
                {errors.email.message as string}
              </Text>
            )}
          </Collapse>
        </Stack>
        <Stack>
          <InputGroup w="300px">
            <Input
              bg="black300"
              placeholder="Password"
              type={password ? 'text' : 'password'}
              _placeholder={{
                color: 'white',
                opacity: '.5',
                fontFamily: 'lexendDeca',
                fontSize: 'SubHeader.lg',
              }}
              variant="basic"
              {...register('password')}
            />

            <InputRightElement>
              <Icon
                onClick={() => showPassword(!password)}
                as={password ? FiEye : FiEyeOff}
                color="white"
                _hover={{
                  cursor: 'pointer',
                  transform: 'scale(1.1)',
                  transition: 'all 1s all ease',
                }}
              />
            </InputRightElement>
          </InputGroup>

          <Collapse in={errors.password ? true : false}>
            {errors.password && (
              <Text fontSize="SubHeader.md" color="red">
                {errors.password.message as string}
              </Text>
            )}
          </Collapse>
        </Stack>

        <Stack>
          <InputGroup w="300px">
            <Input
              placeholder="Confirm Password"
              type={confirmPass ? 'text' : 'password'}
              variant="basic"
              _placeholder={{
                color: 'white',
                opacity: '.5',
                fontFamily: 'lexendDeca',
                fontSize: 'SubHeader.lg',
              }}
              {...register('confirm')}
            />

            <InputRightElement>
              <Icon
                onClick={() => showConfirmPass(!confirmPass)}
                as={confirmPass ? FiEye : FiEyeOff}
                color="white"
                _hover={{
                  cursor: 'pointer',
                  transform: 'scale(1.1)',
                  transition: 'all 1s all ease',
                }}
              />
            </InputRightElement>
          </InputGroup>
          <Collapse in={errors.confirm ? true : false}>
            {errors.confirm && (
              <Text fontSize="SubHeader.md" color="red">
                {errors.confirm.message as string}
              </Text>
            )}
          </Collapse>
        </Stack>

        <Button
          w="300px"
          color="black300"
          fontFamily="lexendDeca"
          fontSize="SubHeader.lg"
          bg="green500"
          type="submit"
          isLoading={isSubmitting}
        >
          SignUp
        </Button>
        <Text>
          Already have an account?{' '}
          <Link href="/" target="_blank">
            <Text as="span" fontWeight="bold" _hover={{ cursor: 'pointer' }}>
              Login
            </Text>
          </Link>
        </Text>
      </Flex>
    </>
  );
};

export default RegisterFields;
