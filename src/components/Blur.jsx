export default function Blur({ children, type }) {
    function handleTaskMenuClose(ev) {
        ev.stopPropagation();
        ev.target.classList.remove('active');
        document.body.style.overflowY = 'auto';
    }

    return (
        <div data-id={type} className="blur-bg bg-white bg-opacity-70 fixed top-0 left-0 h-full w-full z-10
        transition-all duration-300 ease-linear cursor-default flex justify-center items-start" onClick={handleTaskMenuClose} >
            { children }
        </div>
    )
}