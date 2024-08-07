import React, { useEffect, useState } from "react";
import { BillCarousel } from "./BillCarousel";
import { useDisplayBills } from "../Providers/BillProvider";
import BillCard from "./BillCard";
import { Requests } from "../api";
import DOMPurify from "dompurify";

export const BillDiscover =()=>{
const [searchType, setSearchType] = useState('hopper');
const [searchedBill, setSearchedBill] = useState({});
const [billId, setBillId] = useState('');

function separateLettersAndNumbers(billId:string) {

  const letters = billId.match(/[A-Za-z]+/g).join('');
  const numbers = billId.match(/\d+/g).join('');
  return { letters, numbers };
}


const searchForBill=async(billId: string)=>{
     const letters = billId.match(/[A-Za-z]+/g).join('');
  const numbers = billId.match(/\d+/g).join('');

    try{    
        if(letters!==null && numbers!==null)
        const fullBillData = await Requests.getFullBill(
          '118',
          letters.toLowerCase(),
          numbers
        );
        const summariesData = await Requests.getBillDetail(
          '118',
          letters.toLowerCase(),
          numbers,
          'summaries'
        );
        const subjectsData = await Requests.getBillDetail(
          '118',
          letters.toLowerCase(),
          numbers,
          'subjects');
                  return {
          
          ...fullBillData.bill,
          summary:
            summariesData.summaries.length > 0
              ? DOMPurify.sanitize(
                  summariesData.summaries[summariesData.summaries.length - 1]
                    .text
                )
              : 'No Summary Available',
          subjects: subjectsData.subjects
        };
        }
      catch (error) {
      console.error('Failed to fetch bills:', error);
    } 
}
useEffect(()=>{
const bill= searchForBill(billId);
setSearchedBill(bill);
},[billId])

return (
  <>
        <div className="search-subject">
        <div className="selectors">
          {/* This should display the favorited count */}
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
            className={`selector ${searchType === 'hopper' ? 'active' : ''}`}
            onClick={() => {
              setSearchType('hopper');
             
            }}
          >
            All
          </div>
        </div>
                  {searchType === 'bill-number' && (
            <div className="bill-number">
              <div id="bill-num">
                <input
                  type="text"
                  placeholder="Search for bills by number"
                  onChange={(e) => {
                    setBillId(e.target.value);
                  }}
                ></input>
                <button onClick={()=>{const bill =searchForBill(billId);
setSearchedBill(bill);}}>search</button>
              </div>
            </div>
          )}
        </div>
        {
            searchType ==='all' ?
            (<BillCarousel />) :
            (<BillCard
               bill={searchedBill}
    className= {'searched-bill'} 
    onCLick={void}/>)
        }
   
  </>
);


}
export default BillDiscover;