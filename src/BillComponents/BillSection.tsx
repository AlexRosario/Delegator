import { BillSearch } from './BillSearch';
import { BillCarousel } from './BillCarousel';
import { useDisplayBills } from '../Providers/BillProvider';
import React from 'react';

export const BillSection = () => {
  return (
    <section className="bill-section">
      <div className="bill-container">
        <BillSearch />
        <BillCarousel />
      </div>
    </section>
  );
};
