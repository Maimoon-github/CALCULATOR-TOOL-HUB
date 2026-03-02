import Calculator from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-midnight-shale flex items-center justify-center p-4">
      <div className="w-full">
        <Calculator />
        <footer className="text-center mt-8 text-xs text-gray-600 font-mono">
          <span className="border-t border-white/5 pt-4 inline-block px-8">
            designed with precision · the data specialist
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
