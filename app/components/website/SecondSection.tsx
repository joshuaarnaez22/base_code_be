import { Flex, Text, Button } from '@chakra-ui/react';
import React from 'react';

const SecondSection = () => {
  return (
    <>
      <Flex
        direction="column"
        gap="100px"
        pt="50px"
        justify="center"
        align="center"
        id="section2"
        scrollSnapAlign="start"
      >
        <Text fontFamily="robo" fontSize="50px" fontWeight="extranormal">
          Book your place
        </Text>
        <Text
          w="500px"
          fontFamily="robo"
          fontSize="Header.xs"
          fontWeight="300"
          align="center"
        >
          Pure Mining - this is a reliable hotel for ASIC miners. Enjoy comfort!{' '}
        </Text>
        <Button
          w="200px"
          h="50px"
          borderRadius="full"
          bg="black500"
          color="white"
          _hover={{
            color: 'black',
            bg: 'gray300',
            transform: 'scale(1.1)',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          Request
        </Button>
        <Text fontFamily="robo" fontWeight="extranormal" fontSize="30px">
          Why Us ?
        </Text>
      </Flex>
    </>
  );
};

export default SecondSection;
