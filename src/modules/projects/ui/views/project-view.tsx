"use client";

import { useTRPC } from "@/trpc/client";
import { MessagesContainer } from "../components/messages-container";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProjectHeader } from "../components/project-header";
import { Suspense, useState } from "react";
import { Fragment } from "@prisma/client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CodeView } from "@/components/code-view";
import { FileExplorer } from "@/components/file-explorer";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabsState, setTabsState] = useState<"Preview" | "Code">("Preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={40}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading messages..</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="hover :bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="height-full gap-y-0"
            defaultValue="Preview"
            value={tabsState}
            onValueChange={(value) => setTabsState(value as "Preview" | "Code")}
          >
            <div className="'w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="Preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>

                <TabsTrigger value="Code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" variant="teritiary">
                  <Link href="/pricing">
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="Preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="Code" className="min-h-0">
             {!!activeFragment?.files && (
              <FileExplorer
              files={activeFragment.files as {[path:string]:string}}
              />
             )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
