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

export type TypeMap = {
    [key in NodeType] : string;
}

export interface GridNode extends Coordinates {
    visited: boolean;
    type: NodeType;
    hDist?: number;
    gDist?: number;
    fDist?: number;
}

export const colors: TypeMap = {
    blank: "white",
    obstacle: "black",
    step: "#008000",
    source: "#b6cec7",
    destination: "#b6cec7",
    destinationFound: "#ffd700"
}

export const typeToText: TypeMap = {
    blank: '',
    obstacle: '',
    step: '',
    source: 'src',
    destination: 'dest',
    destinationFound: 'dest'
}