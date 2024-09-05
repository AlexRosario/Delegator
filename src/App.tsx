import './app.css';
import { Header } from './components/HeaderComponent';

import { BillSection } from './components/BillComponents/BillSection';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './fonts/BarlowCondensed-SemiBold.ttf';
import { BillProvider } from './providers/BillProvider';
import React from 'react';

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
