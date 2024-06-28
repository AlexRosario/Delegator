import './App.css';
import { Header } from './HeaderComponent.tsx';

import { BillSection } from './BillComponents/BillSection.tsx';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './fonts/BarlowCondensed-SemiBold.ttf';

function App() {
	return (
		<>
			<Header />
			<BillSection />
		</>
	);
}

export default App;