// This is a thin draggable bar that lets the user resize a panel next to it
// side can be "left" or "right" - it tells us which direction dragging should grow the panel

import { useRef } from "react"

function Resizer({ onResize, side }) {
    const isDragging = useRef(false)

    function handleMouseDown(event) {
        isDragging.current = true

        // Prevent text from getting selected while dragging
        event.preventDefault()

        // Listen for mouse movement and mouse release on the whole page,
        // not just on this small bar, so dragging still works even if
        // the mouse moves faster than the bar's width
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    function handleMouseMove(event) {
        if (!isDragging.current) {
            return
        }

        // movementX tells us how many pixels the mouse moved since the last event
        // If this resizer is on the "right" side of a panel, dragging right should grow it
        // If it's on the "left" side, dragging right should shrink it
        const delta = side === "right" ? event.movementX : -event.movementX

        onResize(delta)
    }

    function handleMouseUp() {
        isDragging.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    return (
        <div
            onMouseDown={handleMouseDown}
            className="w-1 cursor-col-resize bg-fog hover:bg-highlight active:bg-highlight h-screen flex-shrink-0"
        ></div>
    )
}

export default Resizer