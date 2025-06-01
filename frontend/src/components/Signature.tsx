import githubLogo from '../assets/github-mark.png';

const Signature = () => {
    return (
        <a
            className='fixed bottom-2 h-[1rem] right-2 bg-white/70 px-3 py-3 rounded text-md text-gray-700 shadow flex flex-row justify-center items-center gap-1'
            href='https://github.com/yihli'
            target="_blank"
            rel="noopener noreferrer"
        >

            Made with ♡ by
            <img className='h-[1rem]' src={githubLogo}></img>
            yihli
        </a>
    );
};

export default Signature;