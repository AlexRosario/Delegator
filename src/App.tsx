import './app.css';
import { Header } from './components/HeaderComponent';
import { BillSection } from './components/BillComponents/BillSection';
import { RepSection } from './components/RepComponents/RepSection';
import './fonts/BarlowCondensed-SemiBold.ttf';
import { BillProvider } from './providers/BillProvider';
import { MemberProvider } from './providers/MemberProvider';
import { useScreenInfo } from './providers/ScreenProvider';
import { useLocation } from 'react-router-dom';

function App() {
  const { screenSelect } = useScreenInfo();
  const location = useLocation();
  const address = location.state;
  return (
    <div className="main">
      <Header />
      <BillProvider>
        <MemberProvider address={address}>
          {screenSelect === 'bills' ? <BillSection /> : <RepSection />}
        </MemberProvider>
      </BillProvider>
    </div>
  );
}

export default App;
