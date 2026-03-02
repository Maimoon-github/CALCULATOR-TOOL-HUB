import Calculator from './components/Calculator'

function App() {
  return (
    <div className="min-h-screen bg-midnight-shale text-white flex flex-col">
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <Calculator />
      </main>
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-white/5 font-mono">
        <span className="inline-block px-6">precision data · the specialist</span>
      </footer>
    </div>
  )
}

export default App
