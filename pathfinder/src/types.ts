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
    destinationFound = "destinationFound"
}

export type Colors = {
    [key in NodeType] : string;
}

export interface GridNode extends Coordinates {
    visited: boolean;
    color: string;
    type: NodeType;
}

export const colors: Colors = {
    blank: "white",
    obstacle: "black",
    step: "#008000",
    source: "#b6cec7",
    destination: "#b6cec7",
    destinationFound: "#ffd700"
}