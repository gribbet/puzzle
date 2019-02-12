import * as React from "react";
import { Component } from "react";
import {
    add,
    dot,
    length,
    normalizeAngle,
    perpendicular,
    rotate,
    subtract,
    toDegrees
} from "../math";
import { Point } from "../model";
import { screenToLocal } from "../svg";

export interface IDraggableProps {
    position: Point;
    rotation: number;
    center: Point;
    radius: number;
    onMove: (_: { position: Point; rotation: number }) => void;
}

export class Draggable extends Component<IDraggableProps> {
    private gRef?: SVGGElement;
    private dragging?: Point;

    public componentWillMount() {
        window.addEventListener("mousemove", this.onMouseMove);
    }

    public componentWillUnmount() {
        window.removeEventListener("mousemove", this.onMouseMove);
    }

    public render() {
        const { position, rotation, children } = this.props;
        const [x, y] = position;

        return (
            <g
                ref={_ => (this.gRef = _ || undefined)}
                transform={`rotate(${rotation}) translate(${x} ${y})`}
                onMouseDown={this.onMouseDown}
            >
                {children}
            </g>
        );
    }

    private onMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        const { clientX, clientY } = event;
        this.dragging = screenToLocal(this.gRef!, [clientX, clientY]);
    };

    private onMouseMove = (event: MouseEvent) => {
        if (!event.buttons) {
            this.dragging = undefined;
        }

        if (this.dragging === undefined || !this.gRef) {
            return;
        }

        const { position, rotation, center, radius, onMove } = this.props;
        const { clientX, clientY, movementX, movementY } = event;

        const client: Point = [clientX, clientY];
        const movement: Point = [movementX, movementY];
        const dragging = subtract(this.dragging, center);

        const x0 = screenToLocal(this.gRef, subtract(client, movement));
        const x = screenToLocal(this.gRef, client);
        const dr =
            toDegrees(
                dot(subtract(x, x0), perpendicular(dragging)) / radius / radius / radius
            ) * length(dragging);

        onMove({
            position: subtract(rotate(add(x, position), -dr), add(center, dragging)),
            rotation: normalizeAngle(rotation + dr)
        });
    };
}
