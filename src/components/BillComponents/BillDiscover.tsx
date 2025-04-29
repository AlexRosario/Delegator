import { useEffect, useState } from 'react';
import { BillCarousel } from './BillCarousel';
import BillCard from './BillCard';
import { searchForBill } from '../../api';
import { Bill } from '../../types';

export const BillDiscover = () => {
  const [searchType, setSearchType] = useState('hopper');
  const [searchedBill, setSearchedBill] = useState<Bill | null>(null);
  const [billNumber, setBillNumber] = useState('');
  const [billType, setBillType] = useState('hr');
  const billTypeArray = [
    'hr',
    's',
    'hjres',
    'sjres',
    'hconres',
    'sconres',
    'hres',
    'sres'
  ];
  const isNumeric = (billNumber: string) => {
    return /^\d+$/.test(billNumber) && billNumber.length > 0;
  };

  const renderDiscoverBills = () => {
    const billNumberNotBlank = billNumber !== '';

    if (searchType === 'hopper') {
      return <BillCarousel />;
    }

    if (searchedBill && billNumberNotBlank) {
      return <BillCard bill={searchedBill} className="searched-bill" />;
    }

    if (!isNumeric(billNumber) && billNumberNotBlank) {
      return <h2>{billNumber} is not a valid number</h2>;
    }

    if (billNumberNotBlank && searchedBill === null) {
      return <h2>No Bill found</h2>;
    }

    return <h2>Search for Bill by number</h2>;
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchBill = async () => {
      if (isNumeric(billNumber)) {
        const bill = await searchForBill(
          billType,
          billNumber,
          controller.signal
        );
        setSearchedBill(bill);
        if (!bill) {
          setSearchedBill(null);
        }
      }
    };

    const debounceFetch = setTimeout(fetchBill, 500);

    return () => {
      clearTimeout(debounceFetch);
      controller.abort();
    };
  }, [billNumber, billType]);

  return (
    <>
      <div className="search-subject">
        <div className="selectors">
          <div
            className={`selector ${searchType === 'hopper' ? 'active' : ''}`}
            onClick={() => {
              setSearchType('hopper');
            }}
          >
            Hopper
          </div>
          <div
            className={`selector ${searchType === 'bill-number' ? 'active' : ''}`}
            onClick={() => {
              setSearchType('bill-number');
            }}
          >
            Search by Bill Number
          </div>
        </div>
        {searchType === 'bill-number' && (
          <div className="bill-number">
            <div id="bill-num">
              <select
                name=""
                id=""
                onChange={(e) => setBillType(e.target.value)}
              >
                {billTypeArray.map((billType) => (
                  <option key={billType} value={billType}>
                    {billType}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search for bills by number"
                onChange={(e) => {
                  if (e.target.value === '') {
                    setSearchedBill(null);
                  }
                  return setBillNumber(e.target.value);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {renderDiscoverBills()}
    </>
  );
};
export default BillDiscover;
