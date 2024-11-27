'use client'

import CustomMenu from '@/components/common/CustomMenu'
import NextTopLoader from 'nextjs-toploader'
import QueryClientProviderWrapper from './QueryClientProvider'
import { ThemeProvider } from './ThemeProvider'
import { UserProvider } from '@/contexts/UserContext'

export default function Wrapper({ children }) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system" // system || dark || light
                enableSystem
                disableTransitionOnChange
            >
                <NextTopLoader
                    color="#ff4400"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    // shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                    template='<div class="bar" role="bar"><div class="peg"></div></div> 
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                    zIndex={1600}
                    showAtBottom={false}
                />
                <QueryClientProviderWrapper>
                    <UserProvider>
                        <CustomMenu>
                            {children}
                        </CustomMenu>
                    </UserProvider>
                </QueryClientProviderWrapper>
            </ThemeProvider>
        </>
    )
}
