import  { useEffect, useState } from 'react';
import { useDisplayBills } from '../Providers/BillProvider.tsx';
import { BillCard } from './BillCard.tsx';

export const BillCarousel = () => {
const { billsToDisplay,activeBillTab } = useDisplayBills();
const [activeIndex, setActiveIndex] = useState(0);
const activeBill= billsToDisplay[activeIndex];

const nextSlide = () => {
    setActiveIndex((prevIndex) => 
       prevIndex=== billsToDisplay.length - 1 ? 0 : prevIndex + 1
    );
};

const prevSlide = () => {
    setActiveIndex((prevIndex) => 
        prevIndex === 0 ? billsToDisplay.length - 1 : prevIndex - 1  
    );
};

useEffect(() => {setActiveIndex(0);}, [activeBillTab]);

return(
    <div className='carousel'>
        <button onClick={prevSlide}>Prev</button>
        <BillCard bill= {activeBill}/>
            <button onClick={nextSlide}>Next</button>
    </div>


);


};