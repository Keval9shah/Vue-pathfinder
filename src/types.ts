export interface Coordinates {
    x: number;
    y: number;
    exists?: boolean;
}

export enum NodeType {
    blank = "blank",
    obstacle = "obstacle",
    source = "source",
    destination = "destination",
    path = "path",
}

export interface GridNode extends Coordinates {
    visited: boolean;
    type: NodeType;
    hCost: number;
    gCost: number;
    fCost: number;
    parent: GridNode | null;
}

export type AstarFile = {
    Title: string,
    Author: string,
    nodes: GridNode[][],
    source: GridNode,
    destination: GridNode,
}