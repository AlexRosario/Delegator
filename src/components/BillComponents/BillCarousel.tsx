import React, { useEffect, useState, useRef } from 'react';
import { useDisplayBills } from '../../providers/BillProvider';
import { BillCard } from './BillCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faAngleLeft,
  faHourglass2
} from '@fortawesome/free-solid-svg-icons';
import { Bill } from '../../types';

export const BillCarousel = () => {
  const {
    billsToDisplay,
    activeBillTab,
    setCurrentIndex,
    currentIndex,
    setActiveBillTab,
    filterPassedBills
  } = useDisplayBills();
  const {} = useDisplayBills();

  const next = currentIndex < billsToDisplay.length - 1 ? currentIndex + 1 : 0;
  const prev = currentIndex > 0 ? currentIndex - 1 : billsToDisplay.length - 1;
  const isLoading = billsToDisplay.length === 0 ? true : false;

  useEffect(() => {
    updateSlides();
  }, [currentIndex]);

  const updateSlides = () => {
    document.querySelectorAll('.bill-card').forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      if (index === currentIndex) slide.classList.add('active');
      if (index === prev) slide.classList.add('prev');
      if (index === next) slide.classList.add('next');
    });
  };

  const goToNum = (number: number) => {
    setCurrentIndex(number);
  };

  const goToNext = () => {
    currentIndex < billsToDisplay.length - 1
      ? goToNum(currentIndex + 1)
      : goToNum(0);
  };

  const goToPrev = () => {
    currentIndex > 0
      ? goToNum(currentIndex - 1)
      : goToNum(billsToDisplay.length - 1);
  };

  return (
    <>
      <div className="carousel-container">
        <FontAwesomeIcon
          icon={faAngleLeft}
          onClick={goToPrev}
          className="arrows-carousel"
        />
        <div className="carousel">
          {!isLoading ? (
            billsToDisplay
              .filter((bill) => {
                return filterPassedBills
                  ? bill.latestAction.text.includes('Became Public Law No:')
                  : !bill.latestAction.text.includes('Became Public Law No:');
              })
              .map((bill, index) => (
                <BillCard
                  bill={bill}
                  key={index}
                  className={`bill-card ${index === currentIndex ? 'active' : ''} ${index === prev ? 'prev' : ''} ${index === next ? 'next' : ''}`}
                  onClick={
                    index === prev
                      ? goToPrev
                      : index === next
                        ? goToNext
                        : undefined
                  }
                ></BillCard>
              ))
          ) : (
            <svg
              width="100"
              height="100"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="iconGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="50%"
                >
                  <stop offset="0%" stopColor="#ffe08a" />
                  <stop offset="33%" stopColor=" #bdf0b3" />
                  <stop offset="67%" stopColor="#3c6838" />
                  <stop offset="100%" stopColor="#735c0c" />

                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-1 0"
                    to="1 0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
              <path
                fill="url(#iconGradient)"
                d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"
              />
            </svg>
          )}
        </div>
        <FontAwesomeIcon
          icon={faAngleRight}
          onClick={goToNext}
          className="arrows-carousel"
        />
      </div>
    </>
  );
};
