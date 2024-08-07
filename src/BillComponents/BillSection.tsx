import { BillSearch } from './BillSearch';
import { BillCarousel } from './BillCarousel';
import { useDisplayBills } from '../Providers/BillProvider';
import React from 'react';
import { BillCollection } from './BillCollection';

export const BillSection = () => {
  const { activeBillTab, setActiveBillTab } = useDisplayBills();

  return (
    <section className="bill-section">
      <div className="bill-status">
        <button
          className={`bill-list-button ${activeBillTab === 'new' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('new');
          }}
        >
          Discover Bills
        </button>
        <button
          className={`bill-list-button ${activeBillTab === 'voted' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('voted');
          }}
        >
          My Bills
        </button>
      </div>

      <div className="bill-container">
        <BillSearch />
        {activeBillTab === 'all' || activeBillTab === 'new' ? (
          <BillCarousel />
        ) : (
          <BillCollection />
        )}
      </div>
    </section>
  );
};
