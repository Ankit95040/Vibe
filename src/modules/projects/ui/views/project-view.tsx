"use client";

import { useTRPC } from "@/trpc/client";
import { MessagesContainer } from "../components/messages-container";
import { useSuspenseQuery } from "@tanstack/react-query";
import {ProjectHeader} from "../components/project-header"
import { Suspense, useState } from "react";
import { Fragment } from "@prisma/client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Props {
  projectId: string;
}


export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment,setActiveFragment]=useState<Fragment | null>(null);
  const trpc = useTRPC();

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={40}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading project...</p>}>
          <ProjectHeader projectId={projectId}/>
          </Suspense>
          <Suspense fallback={<p>Loading messages..</p>}>
            <MessagesContainer 
            projectId={projectId}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
             />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          TODO
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
  
};
