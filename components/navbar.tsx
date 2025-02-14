"use client"

import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ModeToggle from './mode-toggle';
import { Utensils, MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useRef } from 'react';

export default function Navbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const pathname = usePathname();
    const sheetTriggerRef = useRef<HTMLButtonElement>(null);

    const closeSheet = () => {
        sheetTriggerRef.current?.click();
    };

    if (!isLoaded) return null;

    return (
        <nav className='fixed w-full z-50 bg-background/80 backdrop-blur-sm border-b flex justify-between items-center py-3 px-4 md:px-8'>
            <Link href='/' className='font-bold text-xl flex items-center gap-3 text-foreground hover:opacity-90 transition-opacity'>
                <Utensils size={24} className="text-primary" />
                <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                    Meal Planner
                </span>
            </Link>

            <div className='hidden md:flex items-center gap-6'>
                <SignedIn>
                    <div className='flex items-center gap-6'>
                        <Link 
                            className={`relative hover:text-foreground transition-colors ${
                                pathname === '/' 
                                    ? 'text-primary font-medium after:absolute after:left-0 after:bottom-[-18px] after:w-full after:h-[2px] after:bg-primary' 
                                    : 'text-muted-foreground'
                            }`} 
                            href='/'
                        >
                            Home
                        </Link>
                        <Link 
                            className={`relative hover:text-foreground transition-colors ${
                                pathname === '/meal-plan' 
                                    ? 'text-primary font-medium after:absolute after:left-0 after:bottom-[-18px] after:w-full after:h-[2px] after:bg-primary' 
                                    : 'text-muted-foreground'
                            }`} 
                            href='/meal-plan'
                        >
                            Meal Plan
                        </Link>
                        <Link 
                            className={`relative hover:text-foreground transition-colors flex items-center gap-2 ${
                                pathname === '/account' 
                                    ? 'text-primary font-medium after:absolute after:left-0 after:bottom-[-18px] after:w-full after:h-[2px] after:bg-primary' 
                                    : 'text-muted-foreground'
                            }`} 
                            href='/account'
                        >
                            My Account
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <SignOutButton>
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                Sign out
                            </Button>
                        </SignOutButton>
                    </div>
                </SignedIn>

                <SignedOut>
                    <div className='flex items-center gap-6'>
                        <Link 
                            className={`relative hover:text-foreground transition-colors ${
                                pathname === '/' 
                                    ? 'text-primary font-medium after:absolute after:left-0 after:bottom-[-18px] after:w-full after:h-[2px] after:bg-primary' 
                                    : 'text-muted-foreground'
                            }`} 
                            href='/'
                        >
                            Home
                        </Link>
                        <Link 
                            className={`relative hover:text-foreground transition-colors ${
                                pathname === '/subscribe' 
                                    ? 'text-primary font-medium after:absolute after:left-0 after:bottom-[-18px] after:w-full after:h-[2px] after:bg-primary' 
                                    : 'text-muted-foreground'
                            }`}  
                            href={isSignedIn ? '/subscribe' : '/sign-up'}
                        >
                            Subscribe
                        </Link>
                        <Link href='/sign-up'>
                            <Button>Sign up</Button>
                        </Link>
                    </div>
                </SignedOut>

                <ModeToggle />
            </div>

            <div className='md:hidden flex items-center gap-4'>
                <ModeToggle />
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button 
                            ref={sheetTriggerRef}
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <MenuIcon className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className='w-72'>
                        <SheetHeader className="mb-6">
                            <SheetTitle className="flex items-center gap-2">
                                <Utensils size={20} className="text-primary" />
                                <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                                    Meal Planner
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <div className='flex flex-col gap-4'>
                            <SignedIn>
                                <Link 
                                    className={`relative hover:text-foreground transition-colors ${
                                        pathname === '/' 
                                            ? 'text-primary font-medium bg-primary/10 -mx-4 px-4 py-2 rounded-md' 
                                            : 'text-muted-foreground'
                                    }`} 
                                    href='/'
                                    onClick={closeSheet}
                                >
                                    Home
                                </Link>
                                <Link 
                                    className={`relative hover:text-foreground transition-colors ${
                                        pathname === '/meal-plan' 
                                            ? 'text-primary font-medium bg-primary/10 -mx-4 px-4 py-2 rounded-md' 
                                            : 'text-muted-foreground'
                                    }`} 
                                    href='/meal-plan'
                                    onClick={closeSheet}
                                >
                                    Meal Plan
                                </Link>
                                <Link 
                                    className={`relative hover:text-foreground transition-colors flex items-center justify-between ${
                                        pathname === '/account' 
                                            ? 'text-primary font-medium bg-primary/10 -mx-4 px-4 py-2 rounded-md' 
                                            : 'text-muted-foreground'
                                    }`} 
                                    href='/account'
                                    onClick={closeSheet}
                                >
                                    My Account
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <SignOutButton>
                                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={closeSheet}>
                                        Sign out
                                    </Button>
                                </SignOutButton>
                            </SignedIn>

                            <SignedOut>
                                <Link 
                                    className={`relative hover:text-foreground transition-colors ${
                                        pathname === '/' 
                                            ? 'text-primary font-medium bg-primary/10 -mx-4 px-4 py-2 rounded-md' 
                                            : 'text-muted-foreground'
                                    }`} 
                                    href='/'
                                    onClick={closeSheet}
                                >
                                    Home
                                </Link>
                                <Link 
                                    className={`relative hover:text-foreground transition-colors ${
                                        pathname === '/subscribe' 
                                            ? 'text-primary font-medium bg-primary/10 -mx-4 px-4 py-2 rounded-md' 
                                            : 'text-muted-foreground'
                                    }`}  
                                    href={isSignedIn ? '/subscribe' : '/sign-up'}
                                    onClick={closeSheet}
                                >
                                    Subscribe
                                </Link>
                                <Link href='/sign-up' className="mt-2" onClick={closeSheet}>
                                    <Button className="w-full">Sign up</Button>
                                </Link>
                            </SignedOut>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}