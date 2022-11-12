import { Flex, Box, Image, Text } from '@chakra-ui/react';
import React from 'react';

const BgProps = {
  height: '100vh',
  width: '100%',
  pos: 'absolute',
  zIndex: '0',
} as any;

const HeaderMenuProps = {
  fontFamily: 'robo',
  fontSize: 'SubHeader.lg',
  fontWeight: 'normal',
  cursor: 'pointer',
};
const FirstSection = () => {
  return (
    <Flex h="100vh" scrollSnapAlign="start">
      <Box zIndex="1" w="100vw" h="100vh" bg="#00000033" pos="absolute" />
      <Image src="website_bg.webp" alt="bg" {...BgProps} />
      <Flex zIndex="2" w="100vw" mt="10px" h="40px" align="center">
        <Flex flexGrow="1" justify="center" gap="40px">
          <Text
            {...HeaderMenuProps}
            color="white"
            transition="all .5s ease-in-out"
            _hover={{
              transform: 'scale(1.2)',
              transition: 'all .5s  ease-in-out',
              cursor: 'pointer',
              //   borderBottom: '1px solid black',
            }}
          >
            <a href="#section2">COMPANY</a>
          </Text>
          <Text
            {...HeaderMenuProps}
            color="white"
            transition="all .5s ease-in-out"
            _hover={{
              transform: 'scale(1.2)',
              transition: 'all .5s ease-in-out',
            }}
          >
            ABOUT US
          </Text>
          <Text
            {...HeaderMenuProps}
            transition="all .5s ease-in-out"
            color="white"
            _hover={{
              transform: 'scale(1.2)',
              transition: 'all .5s ease-in-out',
            }}
          >
            SERVICES
          </Text>
          <Text
            {...HeaderMenuProps}
            color="white"
            transition="all .5s ease-in-out"
            _hover={{
              transform: 'scale(1.2)',
              transition: 'all .5s ease-in-out',
            }}
          >
            CONTACT US
          </Text>
        </Flex>
        <Flex pr="50px">
          <Text
            {...HeaderMenuProps}
            transition="all .5s ease-in-out"
            color="white"
            _hover={{
              transform: 'scale(1.2)',
              transition: 'all .5s ease-in-out',
            }}
          >
            Login
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FirstSection;
