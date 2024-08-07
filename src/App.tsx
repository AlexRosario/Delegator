import './App.css';
import { Header } from './HeaderComponent';

import { BillSection } from './BillComponents/BillSection';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './fonts/BarlowCondensed-SemiBold.ttf';
import { BillProvider } from './Providers/BillProvider';
import React from 'react';

function App() {
  return (
    <>
      <Header />
      <BillProvider>
        <BillSection />
      </BillProvider>
    </>
  );
}

export default App;
