import React from 'react';
import { Button, Flex, Icon, useDisclosure } from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import MenuDrawer from './MenuDrawer';
export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Flex h="10vh" bg="main" shadow="xl" justify="start" align="center">
                <Button ml="20px" onClick={onOpen}>
                    <Icon as={AiOutlineMenu} />
                </Button>
            </Flex>
            <MenuDrawer {...{ isOpen, onClose }} />
        </>
    );
}
