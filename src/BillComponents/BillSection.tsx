import { BillSearch } from './BillSearch.tsx';
import { BillCarousel } from './BillCarousel.tsx';
import { useDisplayBills } from '../Providers/BillProvider.tsx';

export const BillSection = () => {
    const { activeBillTab, setActiveBillTab } = useDisplayBills(); 
	return (
		<section className='bill-section'>
            <button className={`bill-list-button ${ activeBillTab === 'all'?'selected':''}`} onClick={()=>{setActiveBillTab('all'); }}>All Bills</button>
            <button className={`bill-list-button ${ activeBillTab === 'new'?'selected':''}`} onClick={()=>{setActiveBillTab('new')}}>New Bills</button>
            <button className={`bill-list-button ${ activeBillTab === 'voted'?'selected':''}`} onClick={()=>{setActiveBillTab('voted')}}>Voted Bills</button>
			<div className='bill-container'>
				<BillSearch />
				<BillCarousel />
			</div>
		</section>
	);
};