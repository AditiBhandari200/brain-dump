import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import DarkModeToggle from './DarkModeToggle';
import LogoutButton from './LogoutButton';
import { getUser } from '@/auth/server';
import { SidebarTrigger } from './ui/sidebar';
async function Header() {
    const user= await getUser();
  return (
    <header 
    className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
    style={{boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",}}>
    <SidebarTrigger/>
    <Link className="flex items-center gap-2" href="/">
    <Image 
    src="/braindumplogo.png" 
    height={60} 
    width={60} 
    alt="logo" 
    className="rounded-full" 
    priority/>
    <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6 ">Brain<span>Dump</span></h1>
        </Link>
        <div className="flex  gap-4">
            {user?(
                <LogoutButton/>
            ) : (
                <>
                <Button asChild><Link href="/sign-up" className='hidden sm:block'>
                Sign Up</Link></Button>
                <Button asChild variant="outline"><Link href="/login" >Login</Link>
                </Button>
                </>
            )}
            <DarkModeToggle/>
        </div>
        </header>
  )
}

export default Header 