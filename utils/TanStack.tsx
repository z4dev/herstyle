"use client";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

const queryClient = new QueryClient()

function TanStack({children}:{children:React.ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default TanStack