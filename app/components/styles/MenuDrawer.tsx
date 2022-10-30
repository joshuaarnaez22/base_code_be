import {
    DrawerContent,
    DrawerOverlay,
    DrawerHeader,
    DrawerBody,
    Drawer,
} from '@chakra-ui/react';
import React from 'react';

export default function MenuDrawer({ onClose, isOpen }: any) {
    return (
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            {/* <DrawerOverlay /> */}
            <DrawerContent mt="10vh" maxW="300px">
                <DrawerHeader borderBottomWidth="1px">
                    Basic Drawer
                </DrawerHeader>
                <DrawerBody>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
