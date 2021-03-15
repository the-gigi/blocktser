import Shape from "~/game/Shape";

export default interface ShapeDragHandler {
    onDragStart: (shape: Shape) => void
    onDragEnd: (shape: Shape) => void
    onDragging: (shape: Shape) => void
}

export default interface MainEventHandler {
    onDrop: (shape: Shape, ok: boolean) => void
}