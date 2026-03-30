import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext.tsx';
import { router } from './routes.ts';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
