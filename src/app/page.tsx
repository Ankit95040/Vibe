
import React from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, trpc } from '@/trpc/server'
import {Client} from './client'
import { Suspense } from 'react'

const page = async () => {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: 'ankit' }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
      <Client/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page
