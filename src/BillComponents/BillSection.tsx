import { BillSearch } from './BillSearch';
import { BillCarousel } from './BillCarousel';
import { useDisplayBills } from '../Providers/BillProvider';
import React from 'react';
import { BillCollection } from './BillCollection';
import BillDiscover from './BillDiscover';

export const BillSection = () => {
  const { activeBillTab, setActiveBillTab } = useDisplayBills();

  return (
    <section className="bill-section">
      <div className="bill-status">
        <button
          className={`bill-list-button ${activeBillTab === 'discover-bills' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('discover-bills');
          }}
        >
          Discover Bills
        </button>
        <button
          className={`bill-list-button ${activeBillTab === 'voted-bills' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('voted-bills');
          }}
        >
          My Bills
        </button>
      </div>

      <div className="bill-container">
        <BillSearch />
        {activeBillTab === 'all' || activeBillTab === 'discover-bills' ? (
          <BillDiscover />
        ) : (
          <BillCollection />
        )}
      </div>
    </section>
  );
};
