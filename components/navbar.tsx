"use client"

import * as React from "react"
import Link from "next/link"
import { SearchIcon, MenuIcon } from 'lucide-react'
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./theme-mode"

const menuItems = [
    {
        title: "TILL SALU",
        href: "/estates",
    },
    {
        title: "OM OSS",
        href: "/om-oss",
    },
    {
        title: "KONTAKTA OSS",
        href: "/kontakta-oss",
    },
]

export function Navbar() {
    const { setTheme, theme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                            <MenuIcon className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <SheetTitle>Menu</SheetTitle>
                        <MobileNav />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">STHLMESTATE</span>
                    </Link>
                </div>
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        {menuItems.map((item) => (
                            <NavigationMenuItem key={item.title}>
                                <Link href={item.href} legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {item.title}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" className="w-9 px-0">
                        <SearchIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle search</span>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

function MobileNav() {
    return (
        <div className="flex flex-col space-y-3">
            {menuItems.map((item) => (
                <div key={item.title}>
                    <Link href={item.href} className="font-bold">
                        {item.title}
                    </Link>
                </div>
            ))}
        </div>
    )
}
