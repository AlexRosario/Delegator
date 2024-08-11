import React, { useEffect, useRef, useState } from 'react';
import { BillCarousel } from './BillCarousel';
import BillCard from './BillCard';
import { Requests } from '../api';
import DOMPurify from 'dompurify';
import { Bill } from '../types';
import { faHourglass2 } from '@fortawesome/free-solid-svg-icons';

export const BillDiscover = () => {
  const [searchType, setSearchType] = useState('hopper');
  const [searchedBill, setSearchedBill] = useState<Bill | null | undefined>(
    undefined
  );
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

  const searchForBill = async (signal: AbortSignal) => {
    try {
      const fullBillDataPromise = Requests.getFullBill(
        '118',
        billType,
        billNumber,
        signal
      );
      const summariesDataPromise = Requests.getBillDetail(
        '118',
        billType,
        billNumber,
        'summaries',
        signal
      );
      const subjectsDataPromise = Requests.getBillDetail(
        '118',
        billType,
        billNumber,
        'subjects',
        signal
      );

      const [fullBillData, summariesData, subjectsData] = await Promise.all([
        fullBillDataPromise,
        summariesDataPromise,
        subjectsDataPromise
      ]);

      return {
        ...fullBillData.bill,
        summary:
          summariesData.summaries.length > 0
            ? DOMPurify.sanitize(
                summariesData.summaries[summariesData.summaries.length - 1].text
              )
            : 'No Summary Available',
        subjects: subjectsData.subjects
      };
    } catch (error) {
      console.error('Failed to fetch bills:', error);
      return null;
    }
  };
  useEffect(() => {
    const controller = new AbortController();

    const fetchBill = async () => {
      if (isNumeric(billNumber)) {
        const bill = await searchForBill(controller.signal);
        setSearchedBill(bill);
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
                onChange={(e) => setBillType(e.target.value)} // Use onChange on the select element
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
                  return setBillNumber(e.target.value);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {searchType === 'hopper' ? (
        <BillCarousel />
      ) : searchedBill ? (
        <BillCard bill={searchedBill} className="searched-bill" />
      ) : !isNumeric(billNumber) && billNumber !== '' ? (
        <h2>{billNumber} is not a valid number</h2>
      ) : (
        <h2>No Bill found</h2>
      )}
    </>
  );
};
export default BillDiscover;
