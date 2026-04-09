"use client"

import { useCurrentTheme } from "@/hooks/use-current-theme"
import { UserButton } from "@clerk/nextjs"
import {dark} from "@clerk/themes"

interface Props{
    showName?:boolean,

}
export const UserControl=({showName}:Props)=>{

    const currentTheme=useCurrentTheme();

    return(
        <UserButton
        showName={showName}
        appearance={{
            elements:{
                UserButtonBox:"rounded-medium!",
                UserButtonAvatarBox:"rounded-medium size-8!",
                UserButtonTrigger:"rounded-md!"
            },
            baseTheme:currentTheme==="dark" ? dark:undefined,
        }}
        />
    )

}