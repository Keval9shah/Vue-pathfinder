export interface Coordinates {
    x: number;
    y: number;
    exists?: boolean;
}

export enum NodeType {
    blank = "blank",
    obstacle = "obstacle",
    step = "step",
    source = "source",
    destination = "destination",
}

export interface GridNode extends Coordinates {
    visited: boolean;
    type: NodeType;
    hDist?: number;
    gDist?: number;
    fDist?: number;
}