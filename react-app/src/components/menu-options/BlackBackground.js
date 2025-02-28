import ReactDOM from 'react-dom'

function BlackBackground() {
    return ReactDOM.createPortal(
        <div className="bg-black fixed top-0 left-0 h-full w-full opacity-50 z-50">
        </div>,
        document.getElementById('modal-id')
    )
}

export default BlackBackground