import './app.css';
import { Header } from './components/HeaderComponent';
import { BillSection } from './components/BillComponents/BillSection';
import { RepSection } from './components/RepComponents/RepSection';
import './fonts/BarlowCondensed-SemiBold.ttf';
import { BillProvider } from './providers/BillProvider';
import { MemberProvider } from './providers/MemberProvider';
import { useScreenInfo } from './providers/ScreenProvider';

function App() {
  const { screenSelect } = useScreenInfo();
  return (
    <div className="main">
      <Header />
      <BillProvider>
        <MemberProvider>
          {screenSelect === 'bills' ? <BillSection /> : <RepSection />}
        </MemberProvider>
      </BillProvider>
    </div>
  );
}

export default App;
