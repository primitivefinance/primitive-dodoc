/* eslint-disable guard-for-in, max-len, no-await-in-loop, no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import {
  extendConfig,
  task,
} from 'hardhat/config';
import {
  TASK_COMPILE,
} from 'hardhat/builtin-tasks/task-names';
import { HardhatConfig, HardhatUserConfig } from 'hardhat/types';
import * as Sqrl from 'squirrelly';

import {
  CompilerOutputContractWithDocumentation,
  Events,
  Methods,
  ContractDocumentation,
  AbiElement,
  Errors,
} from './dodocTypes';
import './type-extensions';

function getCodeFromAbi(element: AbiElement): string {
  let code = `${element.type} ${element.name}(`;

  if (element.inputs) {
    for (let i = 0; i < element.inputs.length; i += 1) {
      code += element.inputs[i].type;

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
      code += element.outputs[i].type;

      if (element.outputs[i].name) code += ' ';

      code += element.outputs[i].name;

      if (i + 1 < element.outputs.length) code += ', ';
    }

    code += ')';
  }

  return code;
}

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  // eslint-disable-next-line no-param-reassign
  config.dodoc = {
    include: userConfig.dodoc?.include || [],
    exclude: userConfig.dodoc?.exclude || [],
    runOnCompile: userConfig.dodoc?.runOnCompile || true,
    testMode: userConfig.dodoc?.testMode || false,
    outputDir: userConfig.dodoc?.outputDir || './docs',
    templatePath: userConfig.dodoc?.templatePath || './src/template.sqrl',
  };
});

// Custom task triggered when COMPILE is called
task(TASK_COMPILE, async (args, hre, runSuper) => {
  const config = hre.config.dodoc;

  // Updates the compiler settings
  for (const compiler of hre.config.solidity.compilers) {
    compiler.settings.outputSelection['*']['*'].push('devdoc');
    compiler.settings.outputSelection['*']['*'].push('userdoc');
  }

  // Calls the actual COMPILE task
  await runSuper();

  if (!config.runOnCompile) {
    return;
  }

  const docs: ContractDocumentation[] = [];

  const qualifiedNames = await hre.artifacts.getAllFullyQualifiedNames();

  // Loops through all the qualified names to get all the compiled contracts
  for (const qualifiedName of qualifiedNames) {
    const [source, name] = qualifiedName.split(':');

    // Checks if the documentation has to be generated for this contract
    if ((config.include.length === 0 || config.include.includes(name)) && !config.exclude.includes(name)) {
      const contractDocumentation: ContractDocumentation = {
        name,
      };

      // console.log(`📝 Generating documentation for contract ${name}...`);

      const buildInfo = await hre.artifacts.getBuildInfo(qualifiedName);
      const info = buildInfo?.output.contracts[source][name] as CompilerOutputContractWithDocumentation;

      // Deals with the errors

      // Temporary variable to stores the errors
      const errors: Errors = {};

      // Checks the errors in devdoc
      for (const errorSig in info?.devdoc?.errors) {
        const [errorName] = errorSig.split('(');

        errors[errorName] = {
          sig: errorSig,
        };

        const error = info?.devdoc?.errors[errorSig][0];

        if (error?.details) errors[errorName].details = error.details;

        if (error?.params) {
          const errorArgTypes = errorSig.split('(')[1].split(')')[0].split(',');

          errors[errorName].params = {};

          const paramNames = Object.keys(error?.params);

          for (let i = 0; i < paramNames.length; i += 1) {
            errors[errorName].params![paramNames[i]] = {
              type: errorArgTypes[i],
              description: error.params[paramNames[i]],
            };
          }
        }
      }

      for (const errorSig in info?.userdoc?.errors) {
        const [errorName] = errorSig.split('(');

        if (!errors[errorName]) {
          errors[errorName] = {
            sig: errorSig,
          };
        }

        const error = info?.userdoc?.errors[errorSig][0];

        if (error?.notice) errors[errorName].notice = error.notice;
      }

      // Deals with the events

      // Temporary variable to store the events
      const events: Events = {};

      // Checks the events in devdoc
      for (const eventSig in info?.devdoc?.events) {
        // Gets the event name using the sig
        const [eventName] = eventSig.split('(');

        // Adds the event
        events[eventName] = {
          sig: eventSig,
        };

        const event = info?.devdoc?.events[eventSig];

        // Adds the details if they exist
        if (event?.details) events[eventName].details = event.details;

        // Checks if the event has parameters
        if (event?.params) {
          // Gets the argument types from the event sig
          const eventArgTypes = eventSig.split('(')[1].split(')')[0].split(',');

          events[eventName].params = {};

          const paramNames = Object.keys(event?.params);

          // Loops through all the parameters
          for (let i = 0; i < paramNames.length; i += 1) {
            events[eventName].params![paramNames[i]] = {
              type: eventArgTypes[i],
              indexed: false,
              description: event.params[paramNames[i]],
            };
          }
        }
      }

      // Checks the events in the userdoc
      for (const eventSig in info?.userdoc?.events) {
        // Gets the event name using the sig
        const [eventName] = eventSig.split('(');

        // If event doesn't exist we add it
        if (!events[eventName]) {
          events[eventName] = {
            sig: eventSig,
          };
        }

        const event = info?.userdoc?.events[eventSig];
        if (event?.notice) events[eventName].notice = event.notice;
      }

      // Deals with the methods

      // Temporary variable to store the methods
      const methods: Methods = {};

      // Checks the methods in devdoc
      for (const methodSig in info?.devdoc?.methods) {
        if (methodSig !== 'constructor') {
          // Gets the method name using the sig
          const [methodName] = methodSig.split('(');

          // Adds the method
          methods[methodName] = {
            sig: methodSig,
          };

          const method = info?.devdoc?.methods[methodSig];

          if (method?.details) methods[methodName].details = method.details;

          if (method?.params) {
            const methodArgTypes = methodSig.split('(')[1].split(')')[0].split(',');
            methods[methodName].params = {};
            const paramNames = Object.keys(method?.params);

            for (let i = 0; i < paramNames.length; i += 1) {
              methods[methodName].params![paramNames[i]] = {
                type: methodArgTypes[i],
                description: method.params[paramNames[i]],
              };
            }
          }

          if (method?.returns) {
            methods[methodName].returns = {};

            const returnNames = Object.keys(method?.returns);

            for (let i = 0; i < returnNames.length; i += 1) {
              methods[methodName].returns![returnNames[i]] = {
                type: '?',
                description: method.returns[returnNames[i]],
              };
            }
          }
        }
      }

      // Checks the methods in userdoc
      for (const methodSig in info?.userdoc?.methods) {
        // Gets the method name using the sig
        const [methodName] = methodSig.split('(');

        // Adds the method if it wasn't added
        if (!methods[methodName]) {
          methods[methodName] = {
            sig: methodSig,
          };
        }

        const method = info?.userdoc?.methods[methodSig];

        if (method?.notice) methods[methodName].notice = method.notice;
      }

      // Gets additional information from the ABI
      const abi = info.abi as AbiElement[];

      for (let i = 0; i < abi.length; i += 1) {
        const abiElement = abi[i];
        const code = getCodeFromAbi(abiElement);

        if (abiElement.type === 'function' && methods[abiElement.name]) {
          methods[abiElement.name].code = code;
          methods[abiElement.name].stateMutability = abiElement.stateMutability;

          if (abiElement.outputs) {
            for (let j = 0; j < abiElement.outputs.length; j += 1) {
              const output = abiElement.outputs[j];
              const outputName = output.name.length > 0 ? output.name : `_${j}`;

              if (methods[abiElement.name].returns) {
                // @ts-ignore
                methods[abiElement.name].returns[outputName].type = output.type;
              } else {
                methods[abiElement.name].returns = {};
                // @ts-ignore
                methods[abiElement.name].returns[outputName] = {
                  type: output.type,
                  description: '',
                };
              }
            }
          }
        }

        if (abiElement.type === 'event' && events[abiElement.name]) {
          events[abiElement.name].code = code;
          if (abiElement.inputs) {
            for (let j = 0; j < abiElement.inputs.length; j += 1) {
              const input = abiElement.inputs[j];
              const inputName = input.name.length > 0 ? input.name : `_${j}`;

              if (events[abiElement.name].params) {
                // @ts-ignore
                if (events[abiElement.name].params[inputName]) {
                  // @ts-ignore
                  events[abiElement.name].params[inputName].indexed = input.indexed as boolean;
                }
              }
            }
          }
        }

        if (abiElement.type === 'error' && errors[abiElement.name]) {
          errors[abiElement.name].code = code;
        }
      }

      // Saves general information
      contractDocumentation.author = info?.devdoc?.author || undefined;
      contractDocumentation.title = info?.devdoc?.title || undefined;
      contractDocumentation.details = info?.devdoc?.details || undefined;
      contractDocumentation.notice = info?.userdoc?.notice || undefined;

      if (Object.keys(methods).length > 0) contractDocumentation.methods = methods;
      if (Object.keys(events).length > 0) contractDocumentation.events = events;
      if (Object.keys(errors).length > 0) contractDocumentation.errors = errors;

      docs.push(contractDocumentation);
    }
  }

  try {
    await fs.promises.access(config.outputDir);
  } catch (e) {
    await fs.promises.mkdir(config.outputDir);
  }

  const template = await fs.promises.readFile(config.templatePath, {
    encoding: 'utf-8',
  });

  for (let i = 0; i < docs.length; i += 1) {
    const result = Sqrl.render(template, docs[i]);

    await fs.promises.writeFile(
      path.join(config.outputDir, `${docs[i].name}.md`),
      result, {
        encoding: 'utf-8',
      },
    );

    if (config.testMode) {
      await fs.promises.writeFile(
        path.join(config.outputDir, `${docs[i].name}.json`),
        JSON.stringify(docs[i], null, 4), {
          encoding: 'utf-8',
        },
      );
    }
  }

  console.log('✅ Generated documentation for', docs.length, docs.length > 1 ? 'contracts' : 'contract');
});
