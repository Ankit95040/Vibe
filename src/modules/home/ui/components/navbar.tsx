"use client"

import Image from "next/image"
import Link from "next/link"

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { UserControl } from "@/components/user-control"

export const Navbar = () => {
  const { isSignedIn } = useUser()

  return (
    <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 border-b">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">

        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Vibe" width={24} height={24} />
          <span className="font-semibold text-lg">Vibe</span>
        </Link>

        {!isSignedIn ? (
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </SignUpButton>

            <SignInButton>
              <Button size="sm">
                Sign In
              </Button>
            </SignInButton>
          </div>
        ) : (
          <UserControl showName/>
        )}

      </div>
    </nav>
  )
}