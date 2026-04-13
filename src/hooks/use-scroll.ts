import { useEffect, useState } from "react";


export const useScroll = (threshold=10)=>{
    const [isScrolled,setIsScrolled]=useState(false);
    useEffect(()=>{
        const handleSCroll=()=>{
            setIsScrolled(window.scrollY>threshold)
        }
        window.addEventListener("scroll",handleSCroll);
        return ()=> window.removeEventListener("scroll",handleSCroll)
    },[threshold])
    return isScrolled

}