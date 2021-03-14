import Shape from "~/game/Shape";

export default interface ShapeDragHandler {
    onDragStart: (shape: Shape) => void
    onDragEnd: (shape: Shape) => void
    onDragging: (shape: Shape) => void
}
