import React, { useState } from 'react';
import { useDisplayBills } from '../Providers/BillProvider';
import BillCard from './BillCard';
import { allPolicies } from '../Utils/policy-terms';

export const BillCollection = () => {
  const {
    billsToDisplay,
    billSubject,
    setBillSubject,
    isButtonClicked,
    setIsButtonClicked
  } = useDisplayBills();
  const [searchType, setSearchType] = useState('all');
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="bill-collection-container">
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
          <div
            className={`selector ${searchType === 'all' ? 'active' : ''}`}
            onClick={() => {
              setSearchType('all');
              setBillSubject('');
            }}
          >
            All
          </div>
        </div>

        <div className="subject-fields">
          {searchType === 'policy' && (
            <select
              value={billSubject || 'default'} // Set the selected value here
              onChange={(e) => {
                setBillSubject(e.target.value);
                setIsButtonClicked(true);
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
                  onChange={(e) => {
                    setBillSubject(e.target.value);
                  }}
                ></input>

                <a href="https://www.congress.gov/advanced-search/legislative-subject-terms?congresses%5B%5D=118">
                  List of Acceptable Terms
                </a>
              </div>
            </div>
          )}
          {searchType === 'bill-number' && (
            <div className="bill-number">
              <div id="bill-num">
                <input
                  type="text"
                  placeholder="Search for bills by number"
                  onChange={(e) => {
                    setBillSubject(e.target.value);
                  }}
                ></input>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bill-collection">
        {billSubject === '' &&
          allPolicies.map((policy) => {
            const policyBills = billsToDisplay.filter(
              (bill) => bill.policyArea?.name === policy
            );
            return (
              policyBills.length > 0 && (
                <div key={policy}>
                  <b>{policy}:</b>
                  <div className="policy-row">
                    {policyBills.map((bill, index) => (
                      <BillCard
                        bill={bill}
                        key={index}
                        className="bill-collection-card"
                      />
                    ))}
                  </div>
                </div>
              )
            );
          })}
        <b>{`${billSubject !== '' ? `${billSubject}:` : 'All bills:'}`}</b>
        <div className="policy-grid">
          {billSubject !== ''
            ? billsToDisplay
                .filter(
                  (bill) =>
                    bill.subjects.policyArea?.name
                      .toLowerCase()
                      .includes(billSubject.toLowerCase()) ||
                    bill.subjects.policyArea?.name
                      .toLowerCase()
                      .includes(billSubject.toLowerCase())
                )
                .map((bill, index) => (
                  <BillCard
                    bill={bill}
                    key={index}
                    className="bill-collection-card"
                  />
                ))
            : billsToDisplay.map((bill, index) => (
                <BillCard
                  bill={bill}
                  key={index}
                  className="bill-collection-card"
                />
              ))}
        </div>
      </div>
    </div>
  );
};
