import spotifyLogo from '../../assets/spotify-logo.png';
import ateezDance from '../../assets/ateez-dance.gif';
import { useState } from 'react';

interface Props {
	loginSpotify: () => void
}

const LoginForm = (loginSpotify: () => void, setCurrentForm: (str: string) => void) => {
	return (
		<div className="inputandsigninmethods 
				w-full h-full flex flex-col gap-3 p-[2rem]
				lg:w-full lg:h-full lg:flex lg:flex-col lg:gap-3 lg:p-0">
			<div className="w-full text-center text-2xl lg:w-full lg:text-left lg:text-3xl">Log In</div>
			<div className="w-full lg:w-full">
				<div className="lg:w-full lg:text-[0.75rem]">Email</div>
				<input className="w-full h-[3rem] lg:w-full lg:h-auto  bg-white" />
			</div>
			<div className="w-full lg:w-full">
				<div className="lg:w-full lg:text-[0.75rem]">Password</div>
				<input className="w-full h-[3rem] lg:w-full lg:h-auto  bg-white" />
				<div className="lg:w-full lg:text-right lg:text-[0.75rem]">Forgot password?</div>
				<div className="submit+switchregisterform
							flex flex-col items-center justify-center gap-3
							lg:flex lg:flex-row lg:items-center lg:justify-start lg:h-[1.75rem] lg:lg:gap-3
						">
					<button className="loginbutton
							bg-green-200
							w-full h-[3rem] rounded-md mt-[1rem]
							lg:w-[5rem] lg:h-full lg:rounded-md lg:mt-0">Login</button>
					<div className="lg:text-[0.75rem]">New user? <a onClick={() => setCurrentForm('register')}>Sign up</a></div>
				</div>
				<div className="othersigninmethods
					flex flex-col w-full items-center gap-2 mt-4
					lg:flex lg:flex-col lg:w-full lg:items-center lg:gap-2 lg:mt-4
						">
					<div className="lg:text-[0.75rem]">--- Or Login With ---</div>
					<div className="buttonsholder
							w-full h-[3rem] lg:h-[1.75rem] lg:w-auto
							">
						<button className="spotifybutton
							w-full rounded-md h-full text-sm bg-black flex flex-row items-center justify-center gap-1 text-white
									lg:w-[5rem] lg:rounded-md lg:h-full lg:text-sm lg:bg-black lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-1 lg:text-white "
							onClick={loginSpotify}>
							<img className="w-auto h-3/5 lg:w-auto lg:h-3/5" src={spotifyLogo} />
							spotify</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const RegisterForm = (setCurrentForm: (str: string) => void) => {
	return (
		<div className="inputandsigninmethods 
				w-full h-full flex flex-col gap-3 p-[2rem]
				lg:w-full lg:h-full lg:flex lg:flex-col lg:gap-3 lg:p-0">
			<div className="w-full text-2xl text-center lg:w-full lg:text-3xl lg:text-left">Sign Up</div>
			<div className="w-full lg:w-full">
				<div className="lg:w-full lg:text-[0.75rem]">Username</div>
				<input className="w-full h-[3rem] lg:w-full lg:h-auto bg-white" />
			</div>
			<div className="w-full lg:w-full">
				<div className="lg:w-full lg:text-[0.75rem]">Email</div>
				<input className="w-full h-[3rem] lg:w-full lg:h-auto bg-white" />
			</div>
			<div className="w-full lg:w-full">
				<div className="lg:w-full lg:text-[0.75rem]">Password</div>
				<input className="w-full h-[3rem] lg:w-full lg:h-auto  bg-white" />
			</div>
			<div className="w-full lg:w-full">
				<div className="lg:w-full lg:text-[0.75rem]">Confirm Password</div>
				<input className="w-full h-[3rem] lg:w-full lg:h-auto bg-white" />

			</div>
			<div className="submit+switchregisterform
					flex flex-col items-center justify-center gap-3
					lg:flex lg:flex-row lg:items-center lg:justify-start lg:h-[1.75rem] lg:gap-3
				">
				<button className="registerbutton
								bg-green-200
								w-full h-[3rem] rounded-md mt-[1rem]
								lg:w-[5rem] lg:h-full lg:rounded-md lg:mt-0">Register</button>
				<div className="lg:text-[0.75rem]">Existing account? <a onClick={() => setCurrentForm('login')}>Log in</a></div>
			</div>
		</div>
	)
}

const AccountForm = ({ loginSpotify }: Props) => {
	const [currentForm, setCurrentForm] = useState<string>('login');
	const forms: Object<string> = {
		'login': LoginForm(loginSpotify, setCurrentForm),
		'register': RegisterForm(setCurrentForm)
	}
	return (
		<div className="
			bg-gray-500
			h-full
			lg:flex lg:flex-row lg:w-[60rem] lg:h-[35rem]
			">
			<div className="image 
				hidden 
				lg:block lg:h-full lg:w-[21rem] lg:bg-black">
				<img className="lg:h-full lg:w-full lg:object-cover lg:brightness-75" src={ateezDance}></img>
			</div>
			<div className="formside 
				navbar-bg 
				h-full flex-1 flex flex-col items-center p-0
				lg:flex-1 lg:flex lg:flex-row lg:items-center lg:justify-center lg:p-[3rem]">
				{forms[currentForm]}
			</div>
		</div>
	)
}

export default AccountForm;