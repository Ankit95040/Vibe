import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messagesRouter } from '@/modules/messages/server/procedures';
export const appRouter = createTRPCRouter({
  messages:messagesRouter
})
// export type definition of API
export type AppRouter = typeof appRouter;