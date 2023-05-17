import { CompilerOutputContract } from "hardhat/types";

export type CustomTag<T extends string> = `custom:${T}`;

export interface ErrorDevdocArrayItem {
    details?: string;
    params?: {
        [key: string]: string;
    };
    [key: CustomTag<string>]: string
}

declare interface ErrorUserdocArrayItem {
    notice?: string;
}

export interface CompilerOutputContractWithDocumentation extends CompilerOutputContract {
    devdoc?: {
        author?: string;
        details?: string;
        title?: string;
        errors?: {
            [key: string]: ErrorDevdocArrayItem[];
        };
        events?: {
            [key: string]: {
                details: string;
                params: {
                    [key: string]: string;
                };
                [key: CustomTag<string>]: string
            };
        };
        methods?: {
            [key: string]: {
                details?: string;
                params: {
                    [key: string]: string;
                };
                returns: {
                    [key: string]: string;
                };
                [key: CustomTag<string>]: string
            };
        };
        returns?: {
            [key: string]: {
                details?: string;
                params: {
                    [key: string]: string;
                };
            };
        };
        stateVariables?: {
            [key: string]: {
                details?: string;
                params: {
                    [key: string]: string;
                };
                returns: {
                    [key: string]: string;
                };
            };
        };
        [key: CustomTag<string>]: string;
    };
    userdoc?: {
        errors?: {
            [key: string]: ErrorUserdocArrayItem[];
        };
        events?: {
            [key: string]: {
                notice: string;
            };
        };
        methods?: {
            [key: string]: {
                notice: string;
            };
        };
        notice?: string;
    };
}

export interface AbiElementPut {
    internalType: string;
    name: string;
    type: string;
    indexed?: boolean;
}

export interface AbiElement {
    type: 'constructor' | 'function' | 'event' | 'error';
    name: string;
    stateMutability?: string;
    inputs: AbiElementPut[];
    outputs: AbiElementPut[];
}

export interface Param {
    type?: string;
    description?: string;
    indexed?: boolean;
}

export interface Method {
    code?: string;
    stateMutability?: string;
    notice?: string;
    details?: string;
    inputs: {
        [key: string]: Param;
    };
    outputs: {
        [key: string]: Param;
    };
    [key: CustomTag<string>]: string
}

export interface Event {
    code?: string;
    notice?: string;
    details?: string;
    inputs: {
        [key: string]: Param;
    };
    [key: CustomTag<string>]: string
}

export interface Error {
    code?: string;
    notice?: string;
    details?: string;
    inputs: {
        [key: string]: Param;
    };
    [key: CustomTag<string>]: string
}

export interface Doc {
    path?: string;
    name?: string;
    title?: string;
    notice?: string;
    details?: string;
    author?: string;
    [key: CustomTag<string>]: string;
    methods: {
        [key: string]: Method;
    };
    events: {
        [key: string]: Event;
    };
    errors: {
        [key: string]: Error;
    };
}
