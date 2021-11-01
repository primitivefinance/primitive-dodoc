import { CompilerOutputContract } from 'hardhat/types';

interface ErrorDevdocArrayItem {
  details?: string;
  params?: {
    [key: string]: string;
  }
}
interface ErrorUserdocArrayItem {
  notice?: string;
}

export interface CompilerOutputContractWithDocumentation extends CompilerOutputContract {
  devdoc?: {
    author?: string;
    details?: string;
    title?: string;
    errors?: {
      [key: string]: ErrorDevdocArrayItem[]
    }
    events?: {
      [key: string]: {
        details: string;
        params: {
          [key: string]: string;
        }
      }
    }
    methods?: {
      [key: string]: {
        details?: string;
        params: {
          [key: string]: string;
        },
        returns: {
          [key: string]: string;
        }
      }
    },
    returns?: {
      [key: string]: {
        details?: string;
        params: {
          [key: string]: string;
        }
      }
    }
  },
  userdoc?: {
    errors?: {
      [key: string]: ErrorUserdocArrayItem[]
    },
    events?: {
      [key: string]: {
        notice: string;
      },
    },
    methods?: {
      [key: string]: {
        notice: string;
      },
    },
    notice?: string;
  }
}

export interface Error {
  sig: string;
  code?: string;
  notice?: string;
  details?: string;
  params?: {
    [key: string]: {
      description: string;
      type: string;
    }
  }
}

export interface Errors {
  [key: string]: Error;
}

export interface Event {
  sig: string;
  code?: string;
  notice?: string;
  details?: string;
  params?: {
    [key: string]: {
      type?: string;
      indexed: boolean;
      description?: string;
    }
  }
}

export interface Events {
  [key: string]: Event;
}

export interface Method {
  sig: string;
  code?: string;
  stateMutability?: string;
  notice?: string;
  details?: string;
  params?: {
    [key: string]: {
      type?: string;
      description?: string;
    }
  };
  returns?: {
    [key: string]: {
      type?: string;
      description?: string;
    }
  };
}

export interface Methods {
  [key: string]: Method;
}

export interface ContractDocumentation {
  name: string;
  title?: string;
  author?: string;
  notice?: string;
  details?: string;
  methods?: Methods;
  events?: Events;
  errors?: Errors;
}

export interface AbiElementPut {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean;
}

export interface AbiElement {
  type: 'function' | 'event' | 'error';
  name: string;
  stateMutability?: string;
  inputs?: AbiElementPut[];
  outputs?: AbiElementPut[];
}
