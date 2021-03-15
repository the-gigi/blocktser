import Shape from "~/game/Shape";

export default interface ShapeDragHandler {
    onDragStart: (shape: Shape) => void
    onDragEnd: (shape: Shape) => void
    onDragging: (shape: Shape) => void
}

export default interface ShapeEventHandler {
    onDrop: (shape: Shape, ok: boolean) => void
}