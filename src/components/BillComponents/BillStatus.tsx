import { useDisplayBills } from '../../providers/BillProvider';
import React from 'react';

export const BillStatus = () => {
  const {
    billsToDisplay,
    voteLog,
    billSubject,
    filterPassedBills,
    setFilterPassedBills,
    currentIndex,
    activeBillTab
  } = useDisplayBills();

  const noDiscoverBillsToDisplay =
    activeBillTab === 'discover-bills' && billsToDisplay.length === 0;
  const noVotedBillsToDisplay =
    activeBillTab === 'voted-bills' && billsToDisplay.length === 0;
  const billSubjectIsEmpty =
    billSubject !== '' &&
    activeBillTab === 'voted-bills' &&
    billsToDisplay.length === 0;
  const discoverBillsIsPopulated =
    activeBillTab === 'discover-bills' && billsToDisplay.length !== 0;
  const votedBillsIsPopulated =
    activeBillTab === 'voted-bills' && billsToDisplay.length !== 0;

  return (
    <>
      <div className="bills-status">
        {noDiscoverBillsToDisplay && (
          <div className="animate-text">Loading...</div>
        )}
        {noVotedBillsToDisplay && <div>No Bills in Collection</div>}
        {billSubjectIsEmpty && <div>Couldn't fulfill request at this time</div>}
        {discoverBillsIsPopulated && (
          <h2>{`Most Recent Bills ${currentIndex + 1} of ${billsToDisplay.length}`}</h2>
        )}
        {votedBillsIsPopulated && (
          <h2>{`${billSubject ? billSubject : 'All'} Bills`} </h2>
        )}
      </div>

      {activeBillTab === 'discover-bills' && (
        <div className="congressional-efficacy">
          <button
            disabled={billsToDisplay.length < 20}
            onClick={() => setFilterPassedBills(!filterPassedBills)}
          >
            {filterPassedBills ? 'Show All Bills' : 'Filter Passed Bills'}
          </button>
          <div>
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
        </div>
      )}
    </>
  );
};
