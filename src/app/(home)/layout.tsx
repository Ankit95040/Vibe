import { Navbar } from "@/modules/home/ui/components/navbar"

interface Props{
   children :React.ReactNode
}
const Layout=({children}:Props)=>{
    return(
     
        <main className="flex flex-col min-h-screen max-h-screen">
            <Navbar/>
            <div className="
  absolute inset-0 -z-10 h-full w-full
  bg-background
  dark:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]
  bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)]
  [background-size:24px_24px]
"/>
            <div className="flex-1 flex flex-col px-4 pb-4">
                {children}

            </div>

        </main>
     
    )
}
export default Layout