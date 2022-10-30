import React from 'react';
import Navbar from '@/components/styles/Navbar';
export default function Layout({ children }: any) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
