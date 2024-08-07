import { useState } from 'react';
import { useDisplayBills } from '../Providers/BillProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { allPolicies } from '../Utils/policy-terms';
import React from 'react';
export const BillSearch = () => {
  const {
    billsToDisplay,
    billSubject,
    setBillSubject,
    isButtonClicked,
    setIsButtonClicked,
    offset,
    setOffset,
    filterPassedBills,
    setFilterPassedBills,
    currentIndex
  } = useDisplayBills();
  const [searchType, setSearchType] = useState('');

  return (
    <>
      <div className="subject-banner">
        <button
          disabled={isButtonClicked}
          onClick={() => setFilterPassedBills(!filterPassedBills)}
        >
          {filterPassedBills ? 'Show All Bills' : 'Filter Passed Bills'}
        </button>
        {isButtonClicked ? (
          <div>Loading...</div>
        ) : billsToDisplay.length === 0 && billSubject !== '' ? (
          <div>Couldn't fulfill request at this time</div>
        ) : billSubject === '' ? (
          <h2>{`Most Recent Bills ${currentIndex + 1} of ${billsToDisplay.length}`}</h2>
        ) : (
          <h2>
            House Bills: {billSubject}
            {offset}
          </h2>
        )}
      </div>

      <div className="congressional-efficacy">
        {/* upload bills for entire session */}
        <em>
          <b>
            Congressional Bills made into law this session:
            {
              billsToDisplay.filter((bill) =>
                bill.latestAction.text.includes('Became Public Law No:')
              ).length
            }
          </b>
        </em>
      </div>
    </>
  );
};
