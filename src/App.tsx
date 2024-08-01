import './App.css';
import { Header } from './HeaderComponent.tsx';

import { BillSection } from './BillComponents/BillSection.tsx';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './fonts/BarlowCondensed-SemiBold.ttf';
import { BillProvider } from './Providers/BillProvider.tsx';

function App() {
	return (
		<>
			<Header />
			<BillProvider>
				<BillSection />
			</BillProvider>
		</>
	);
}

export default App;