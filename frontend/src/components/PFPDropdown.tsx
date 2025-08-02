import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
    pfpUrl: string;
    logoutSpotify: () => void;
}

interface CoordsObject {
    top: number;
    left: number;
}

const PfpDropdown = ({ pfpUrl, logoutSpotify }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const buttonRef = useRef(null);
    const [coords, setCoords] = useState<CoordsObject>({ top: 0, left: 0 });

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // adjust how wide the dropdown menu is
            const extraWidth = 75;
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX - extraWidth,
            });
        }
    }, [open])


    return (
        <div className='hamburgermenu
        relative  h-full w-auto p-4 z-[9999]'
            ref={buttonRef}>
            <img className='h-[2.5rem] rounded-4xl' onClick={() => { setOpen(!open); console.log(open) }} src={pfpUrl} alt='pfp'></img>

            {open && createPortal(
                // style only for positioning
                <div 
                    className="z-[99] bg-green-300 flex flex-col" 
                    style={{ top: `${coords.top}px`, left: `${coords.left}px`, position: 'absolute', width: `calc(100vw - ${coords.left}px)` }}>
                    <div className="p-2 border-1">Settings</div>
                    <div className="p-2 border-1" onClick={() => logoutSpotify()}>Logout</div>
                </div>
            ,document.body)}

        </div>
    );
}

export default PfpDropdown;