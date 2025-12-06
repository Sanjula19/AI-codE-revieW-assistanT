import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from 'sonner'
import Router from '@/routes/Router'

function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gray-50">
        <Router />
        <Toaster position="top-center" richColors />
      </div>
    </QueryProvider>
  )
}

export default App