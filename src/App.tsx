import './app.css';
import { Header } from './components/HeaderComponent';
import { BillSection } from './components/BillComponents/BillSection';
import './fonts/BarlowCondensed-SemiBold.ttf';
import { BillProvider } from './providers/BillProvider';

function App() {
  return (
    <div className="main">
      <Header />
      <BillProvider>
        <BillSection />
      </BillProvider>
    </div>
  );
}

export default App;
