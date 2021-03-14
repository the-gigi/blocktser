import Shape from "~/game/Shape";

export default interface ShapeDragHandler {
    onDragStart: (shape: Shape) => void
    onDragEnd: (shape: Shape) => void
    onDragging: (shape: Shape) => void
}

export class NoopHandler implements ShapeDragHandler {
    onDragStart(shape: Shape) {}
    onDragEnd(shape: Shape) {}
    onDragging(shape: Shape) {
        console.log('ARGHHHHH!!!!!')
    }
}
