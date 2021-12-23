import {
  AbiElement, Doc, Method, Error, Event,
} from './dodocTypes';

export function getCodeFromAbi(element: AbiElement): string {
  let code;

  if (element.type === 'constructor') {
    code = 'constructor(';
  } else {
    code = `${element.type} ${element.name}(`;
  }

  if (element.inputs) {
    for (let i = 0; i < element.inputs.length; i += 1) {
      if (element.inputs[i].internalType.includes('struct')) {
        code += element.inputs[i].internalType.substr(7);
      } else {
        code += element.inputs[i].internalType;
      }

      if (element.inputs[i].name) code += ' ';

      if (element.type === 'event' && element.inputs[i].indexed) {
        code += 'indexed ';
      }

      code += element.inputs[i].name;

      if (i + 1 < element.inputs.length) code += ', ';
    }
  }

  code += ')';

  if (element.type === 'function') {
    code += ` external ${element.stateMutability}`;
  }

  if (element.outputs && element.outputs.length > 0) {
    code += ' returns (';

    for (let i = 0; i < element.outputs.length; i += 1) {
      code += element.outputs[i].internalType;

      if (element.outputs[i].name) code += ' ';

      code += element.outputs[i].name;

      if (i + 1 < element.outputs.length) code += ', ';
    }

    code += ')';
  }

  return code;
}

export function decodeAbi(abi: AbiElement[]): Doc {
  const doc: Doc = {
    methods: {},
    events: {},
    errors: {},
  };

  for (let i = 0; i < abi.length; i += 1) {
    const el = abi[i];

    /*
    if (el.type === 'constructor') {
      const func: Method = {
        stateMutability: el.stateMutability,
        code: getCodeFromAbi(el),
        inputs: {},
        outputs: {},
      };

      el.inputs.forEach((input, index) => {
        const name = input.name.length !== 0 ? input.name : `_${index}`;

        func.inputs[name] = {
          type: input.internalType.includes('struct') ? input.internalType.substr(7) : input.internalType,
        };
      });

      doc.methods['constructor'] = func;
    }
    */

    if (el.type === 'function') {
      const func: Method = {
        stateMutability: el.stateMutability,
        code: getCodeFromAbi(el),
        inputs: {},
        outputs: {},
      };

      el.inputs.forEach((input, index) => {
        const name = input.name.length !== 0 ? input.name : `_${index}`;

        func.inputs[name] = {
          type: input.internalType.includes('struct') ? input.internalType.substr(7) : input.internalType,
        };
      });

      el.outputs.forEach((output, index) => {
        const name = output.name.length !== 0 ? output.name : `_${index}`;

        func.outputs[name] = {
          type: output.internalType.includes('struct') ? output.internalType.substr(7) : output.internalType,
        };
      });

      doc.methods[`${el.name}(${
        el.inputs ? el.inputs.map((inp) => inp.type).join(',') : ''
      })`] = func;
    }

    if (el.type === 'event') {
      const event: Event = {
        code: getCodeFromAbi(el),
        inputs: {},
      };

      el.inputs.forEach((input, index) => {
        const name = input.name.length !== 0 ? input.name : `_${index}`;

        event.inputs[name] = {
          type: input.internalType.includes('struct') ? input.internalType.substr(7) : input.internalType,
          indexed: input.indexed,
        };
      });

      doc.events[el.name] = event;
    }

    if (el.type === 'error') {
      const error: Error = {
        code: getCodeFromAbi(el),
        inputs: {},
      };

      el.inputs.forEach((input, index) => {
        const name = input.name.length !== 0 ? input.name : `_${index}`;

        error.inputs[name] = {
          type: input.internalType.includes('struct') ? input.internalType.substr(7) : input.internalType,
        };
      });

      doc.errors[el.name] = error;
    }
  }

  return doc;
}
