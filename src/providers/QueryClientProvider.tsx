import {
  QueryClient,
  QueryClientProvider as ReactQueryProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';
interface QueryClientProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();
const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return (
    <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
  );
};

export default QueryClientProvider;
