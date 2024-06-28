import { Link } from 'react-router-dom';

import { SignIn } from './SignIn.tsx';

export const Home = () => {
	return (
		<>
			<div className='home'>
				<div className='home-left'>
					<h1>
						<span>DE</span>
						<span>LEGATOR</span>
					</h1>
				</div>
				<div className='home-right'>
					<SignIn />

					<div className='home-register'>
						<hr></hr>
						<Link to='/Register'>
							<button type='submit'>Register</button>
						</Link>

						<Link to='/Register'>Not a member yet?</Link>
					</div>
				</div>
				<div className='contact'></div>
			</div>
		</>
	);
};