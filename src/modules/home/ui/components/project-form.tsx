'use client'
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {  useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import { ArrowUp01Icon , Loader2Icon} from "lucide-react"
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import {Form,FormField} from "@/components/ui/form"
import z from "zod"
import { Field } from "@/components/ui/field"
import { error } from "node:console"
import { useRouter } from "next/navigation"
import { PROJECT_TEMPLATES } from "@/constant"
import { useClerk } from "@clerk/nextjs"


 
const formSchema=  z.object({
    value:z.string()
    .min(1,{message:"Value is Required"})
    .max(10000,{message:"Value is too long"}),
   
})
 export const ProjectForm=()=>{
    const router = useRouter()
    const trpc=useTRPC()
    const queryClient=useQueryClient()
   const clerk=useClerk()


    const form =useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            value:""
        }
    })

    const createProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess:(data)=>{
           
            queryClient.invalidateQueries(
                trpc.projects.getMany.queryOptions(),
            );
            
            router.push(`/projects/${data.id}`)
            
        },
        onError:(error)=>{
            toast.error(error.message)
            if(error.data?.code==="UNAUTHORIZED"){
                clerk.openSignIn();
            }
           if(error.data?.code==="TOO_MANY_REQUESTS"){
            router.push("/pricing")
           }


            
        }
  } ))
    const onSubmit= async (values:z.infer<typeof formSchema>)=>{
        await createProject.mutateAsync({
            value:values.value,
            
        })
    }
    const onSelect=(value:string)=>{
        form.setValue("value",value,{
            shouldDirty:true,
            shouldTouch:true,
            shouldValidate:true
        })
    }

    const [isFocused,setisFocused]=useState(false)
    
    const isPending=createProject.isPending
    const isButtonDisabled=isPending || !form.formState.isValid


    return (
       <Form {...form}>
        <section className="space-y-6">
         <form
         onSubmit={form.handleSubmit(onSubmit)}
         className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-siidebar transition-all",
            isFocused && "shadow-xs",
           
         )}
         >
            <FormField
            control={form.control}
            name="value"
            render={({field})=>(
                <TextareaAutosize
                {...field}
                disabled={isPending}
                onFocus={() => setisFocused(true)}
                onBlur={() => setisFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                placeholder="What would you like to build"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                    }
                }}
            />
            )

            }
            
            />
           <div className="flex gap-x-2 items-end justify-between pt-2">
    
    <div className="mt-1 text-[10px] text-muted-foreground font-mono">
        <kbd>
            <span className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground m-2">
                ⌘
            </span>
            Enter
        </kbd>
        &nbsp;to submit
    </div>

    <button
        disabled={isButtonDisabled}
        className={cn(
            "size-8 rounded-full flex items-center justify-center",
            isButtonDisabled && "bg-muted-foreground border"
        )}
    >
        {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
        ) : (
            <ArrowUp01Icon className="size-4" />
        )}
    </button>

</div>

         </form>
         <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
              {PROJECT_TEMPLATES.map((tempelate)=>(
                <Button 
                key={tempelate.title}
                variant="outline"
                size='sm'
                className="bg-white dark:bg-sidebar "
                onClick={()=>onSelect(tempelate.prompt)}


                >
                   {tempelate.emoji}{tempelate.title}
                </Button>
              ))}
         </div>
         </section>
       </Form>
    )
}