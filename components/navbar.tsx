"use client"

import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ModeToggle from './mode-toggle';
import { CookingPot, MenuIcon} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

export default function Navbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const pathname = usePathname();

    if (!isLoaded) return <p>Loading...</p>

    return (
        <nav className='fixed w-full border flex justify-between items-center p-4 md:px-8'>
            <Link href='/' className='font-bold text-xl flex gap-2 items-center'>
                <CookingPot size={48} />
                Meal Planner
            </Link>

            <div className='hidden md:flex items-center gap-4'>
                <SignedIn>
                    <Link className={`${pathname === '/' ? 'underline' : ''} link`} href='/'>Home</Link>
                    <Link className={`${pathname === '/meal-plan' ? 'underline' : ''} link`} href='/meal-plan'>Meal Plan</Link>
                    <Link className={`${pathname === '/account' ? 'underline' : ''} link flex gap-2 items-center`} href='/account'>
                        My Account
                        <Avatar>
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>JMW</AvatarFallback>
                        </Avatar>
                    </Link>
                    <SignOutButton>
                        <Button>Sign out</Button>
                    </SignOutButton>
                </SignedIn>

                <SignedOut>
                    <Link className={`${pathname === '/' ? 'underline' : ''} link`} href='/'>Home</Link>
                    <Link className={`${pathname === '/subscribe' ? 'underline' : ''} link`}  href={isSignedIn ? '/subscribe' : '/sign-up'}>Subscribe</Link>
                    <Link href='/sign-up'>
                        <Button>Sign up</Button>
                    </Link>
                </SignedOut>

                <ModeToggle  />
            </div>

            <div className='md:hidden flex items-center gap-4'>
                <ModeToggle  />
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant={'outline'}>
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>

                    <SheetContent className='md:hidden'>
                        <SheetHeader>
                        <SheetTitle>Meal Planner</SheetTitle>
                        </SheetHeader>
                        <div className='flex flex-col gap-4'>
                            <SignedIn>
                                <Link className={`${pathname === '/' ? 'underline' : ''} link`} href='/'>Home</Link>
                                <Link className={`${pathname === '/meal-plan' ? 'underline' : ''} link`} href='/meal-plan'>Meal Plan</Link>
                                <Link className={`${pathname === '/account' ? 'underline' : ''} link flex gap-2 items-center`} href='/account'>
                                    My Account
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback>JMW</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <SignOutButton>
                                    <Button>Sign out</Button>
                                </SignOutButton>
                            </SignedIn>

                            <SignedOut>
                                <Link className={`${pathname === '/' ? 'underline' : ''} link`} href='/'>Home</Link>
                                <Link className={`${pathname === '/subscribe' ? 'underline' : ''} link`}  href={isSignedIn ? '/subscribe' : '/sign-up'}>Subscribe</Link>
                                <Link href='/sign-up'>
                                    <Button>Sign up</Button>
                                </Link>
                            </SignedOut>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}