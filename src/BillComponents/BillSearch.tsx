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
  const passedBills = billsToDisplay.filter((bill) =>
    bill.latestAction.text.includes('Became Public Law No:')
  );
  return (
    <>
      <div className="search-subject">
        <div className="selectors">
          {/* This should display the favorited count */}
          <div
            className={`selector ${searchType === 'policy' ? 'active' : ''}`}
            onClick={() => {
              setSearchType('policy');
            }}
          >
            Search by Policy
          </div>

          {/* This should display the unfavorited count */}
          <div
            className={`selector ${
              searchType === 'legislative-term' ? 'active' : ''
            }`}
            onClick={() => {
              setSearchType('legislative-term');
            }}
          >
            Search by Legislative Term
          </div>
          <div
            className={`selector ${
              searchType === 'bill-number' ? 'active' : ''
            }`}
            onClick={() => {
              setSearchType('bill-number');
            }}
          >
            Search by Bill Number
          </div>
        </div>

        <div className="subject-fields">
          {searchType === 'policy' && (
            <select
              disabled={isButtonClicked}
              value={billSubject || 'default'} // Set the selected value here
              onChange={(e) => {
                setBillSubject(e.target.value);
                setIsButtonClicked(true);

                console.log('Bills:', billsToDisplay);
              }}
            >
              <option value="default">
                Select a subject by suggested policy terms
              </option>
              {allPolicies.map((policy) => (
                <option key={policy} value={policy}>
                  {policy}
                </option>
              ))}
            </select>
          )}
          {searchType === 'legislative-term' && (
            <div className="legislative-term">
              <div id="leg-term">
                <input
                  type="text"
                  placeholder="Search for bills by legislative term"
                  disabled={isButtonClicked}
                  onChange={(e) => {
                    setBillSubject(e.target.value);
                  }}
                ></input>

                <a href="https://www.congress.gov/advanced-search/legislative-subject-terms?congresses%5B%5D=118">
                  List of Acceptable Terms
                </a>
                <button
                  disabled={isButtonClicked}
                  onClick={() => {
                    setIsButtonClicked(true);
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
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
            {subjectOffset}
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
