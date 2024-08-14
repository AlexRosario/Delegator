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
    filterPassedBills,
    setFilterPassedBills,
    currentIndex,
    activeBillTab
  } = useDisplayBills();

  return (
    <>
      <div className="subject-banner">
        {billsToDisplay.length === 0 ? (
          <div className="animate-text">...Loading</div>
        ) : billsToDisplay.length === 0 && billSubject !== '' ? (
          <div>Couldn't fulfill request at this time</div>
        ) : activeBillTab === 'discover-bills' ? (
          <h2>{`Most Recent Bills ${currentIndex + 1} of ${billsToDisplay.length}`}</h2>
        ) : (
          <h2>
            {`${billSubject ? billSubject : 'All'} Bills:`}
            {billsToDisplay.length}
          </h2>
        )}
      </div>

      <div className="congressional-efficacy">
        <button
          disabled={billsToDisplay.length < 20}
          onClick={() => setFilterPassedBills(!filterPassedBills)}
        >
          {filterPassedBills ? 'Show All Bills' : 'Filter Passed Bills'}
        </button>
        <em>
          <b>
            Congressional Bills made into law in this collection:
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
