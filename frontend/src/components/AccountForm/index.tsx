import spotifyLogo from '../../assets/spotify-logo.png';
import ateezDance from '../../assets/ateez-dance.gif';

interface Props {
	loginSpotify: () => void
}

const AccountForm = ({ loginSpotify }: Props) => {
	return (
		<div className="
			bg-gray-500
			lg:flex lg:flex-row lg:w-[60rem] lg:h-[35rem]
			">
			<div className="image 
				lg:h-full lg:w-[21rem] bg-black">
					<img className="lg:h-full lg:w-full lg:object-cover lg:brightness-75" src={ateezDance}></img>
			</div>
			<div className="formside 
				bg-gray-400 
				lg:flex-1 lg:flex lg:flex-row lg:items-center lg:justify-center lg:p-[3rem]">
				<div className="inputandsigninmethods 
					lg:w-full lg:h-full lg:flex lg:flex-col lg: gap-3">
					<div className="lg:w-full lg:text-3xl">Log In</div>
					<div className="lg:w-full">
						<div className="lg:w-full lg:text-[0.75rem]">Email</div>
						<input className="lg:w-full bg-white" />
					</div>
					<div className="lg:w-full">
						<div className="lg:w-full lg:text-[0.75rem]">Password</div>
						<input className="lg:w-full bg-white" />
						<div className="lg:w-full lg:text-right lg:text-[0.75rem]">Forgot password?</div>
						<div className="submit+switchregisterform
							lg:flex lg:flex-row lg:items-center lg:h-[1.75rem] lg:lg:gap-3
						">
							<button className="loginbutton
								bg-green-200
								lg:w-[5rem] lg:h-full lg:rounded-md">Login</button>
							<div className="lg:text-[0.75rem]">New user? Sign up</div>
						</div>
						<div className="othersigninmethods
							lg:flex lg:flex-col lg:w-full lg:items-center lg:gap-2 lg:mt-4
						">
							<div className="lg:text-[0.75rem]">--- Or Login With ---</div>
							<div className="buttonsholder
							lg:h-[1.75rem]
							">
								<button className="spotifybutton
									lg:w-[5rem] lg:rounded-md lg:h-full lg:text-sm lg:bg-black lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-1 lg:text-white "
									onClick={loginSpotify}>
									<img className="lg:w-auto lg:h-3/5" src={spotifyLogo} />spotify</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AccountForm;