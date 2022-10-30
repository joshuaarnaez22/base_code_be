/* eslint-disable @typescript-eslint/ban-types */
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/theme';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import React from 'react';
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page);
    return (
        <ChakraProvider theme={theme}>
            {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
    );
}

export default MyApp;
