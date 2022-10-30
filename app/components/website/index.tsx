import React from 'react';
import {
  Image,
  Box,
  Flex,
  Text,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { hideScollbar } from '@/components/Scrollbar';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';
import ThirdSection from './ThirdSection';

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
const Website = ({ resources }: any) => {
  return (
    <>
      <Box
        h="100vh"
        overflowY="auto"
        overflowX="hidden"
        scrollBehavior="smooth"
        sx={hideScollbar}
        pos="relative"
        m="0"
        p="0"
        scrollSnapType="y mandatory"
      >
        <FirstSection />
        <SecondSection />
        <ThirdSection resources={resources} />

        <Flex h="100vh" scrollSnapAlign="start" scrollSnapStop="always">
          footer
        </Flex>
      </Box>
    </>
  );
};

export default Website;
