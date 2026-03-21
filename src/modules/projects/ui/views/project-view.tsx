"use client";

import { useTRPC } from "@/trpc/client";
import { MessagesContainer } from "../components/messages-container";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  projectId: string;
}
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense } from "react";

export const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={40}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading messages..</p>}>
            <MessagesContainer projectId={projectId} />
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
