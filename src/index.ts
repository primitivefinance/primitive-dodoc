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

import { CompilerOutputContractWithDocumentation, Doc } from './dodocTypes';
import { decodeAbi } from './abiDecoder';
import './type-extensions';

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  // eslint-disable-next-line no-param-reassign
  config.dodoc = {
    include: userConfig.dodoc?.include || [],
    exclude: userConfig.dodoc?.exclude || [],
    runOnCompile: userConfig.dodoc?.runOnCompile || true,
    testMode: userConfig.dodoc?.testMode || false,
    outputDir: userConfig.dodoc?.outputDir || './docs',
    templatePath: userConfig.dodoc?.templatePath || path.join(__dirname, './template.sqrl'),
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

  const docs: Doc[] = [];

  const qualifiedNames = await hre.artifacts.getAllFullyQualifiedNames();

  // Loops through all the qualified names to get all the compiled contracts
  for (const qualifiedName of qualifiedNames) {
    const [source, name] = qualifiedName.split(':');

    // Checks if the documentation has to be generated for this contract
    if ((config.include.length === 0 || config.include.includes(name)) && !config.exclude.includes(name)) {
      const buildInfo = await hre.artifacts.getBuildInfo(qualifiedName);
      const info = buildInfo?.output.contracts[source][name] as CompilerOutputContractWithDocumentation;

      if (config.testMode) {
        console.log('ABI:\n');
        console.log(JSON.stringify(info.abi, null, 4));
        console.log('\n\n');
        console.log('User doc:\n');
        console.log(JSON.stringify(info.userdoc, null, 4));
        console.log('\n\n');
        console.log('Dev doc:\n');
        console.log(JSON.stringify(info.devdoc, null, 4));
      }

      const doc = decodeAbi(info.abi);

      // Fetches info from userdoc
      for (const errorSig in info.userdoc?.errors) {
        const [errorName] = errorSig.split('(');
        const error = info.userdoc?.errors[errorSig][0];

        if (doc.errors[errorName] !== undefined) doc.errors[errorName].notice = error?.notice;
      }

      for (const eventSig in info.userdoc?.events) {
        const [eventName] = eventSig.split('(');
        const event = info.userdoc?.events[eventSig];

        if (doc.events[eventName] !== undefined) doc.events[eventName].notice = event?.notice;
      }

      for (const methodSig in info.userdoc?.methods) {
        const [methodName] = methodSig.split('(');
        const method = info.userdoc?.methods[methodSig];

        if (doc.methods[methodName] !== undefined) doc.methods[methodName].notice = method?.notice;
      }

      // Fetches info from devdoc
      for (const errorSig in info.devdoc?.errors) {
        const [errorName] = errorSig.split('(');
        const error = info.devdoc?.errors[errorSig][0];

        if (doc.errors[errorName] !== undefined) doc.errors[errorName].details = error?.details;

        for (const param in error?.params) {
          if (doc.errors[errorName].inputs[param]) doc.errors[errorName].inputs[param].description = error?.params[param];
        }
      }

      for (const eventSig in info.devdoc?.events) {
        const [eventName] = eventSig.split('(');
        const event = info.devdoc?.events[eventSig];

        if (doc.events[eventName] !== undefined) doc.events[eventName].details = event?.details;

        for (const param in event?.params) {
          if (doc.events[eventName].inputs[param]) doc.events[eventName].inputs[param].description = event?.params[param];
        }
      }

      for (const methodSig in info.devdoc?.methods) {
        const [methodName] = methodSig.split('(');
        const method = info.devdoc?.methods[methodSig];

        if (doc.methods[methodName] !== undefined && methodName !== 'constructor') {
          doc.methods[methodName].details = method?.details;

          for (const param in method?.params) {
            if (doc.methods[methodName].inputs[param]) doc.methods[methodName].inputs[param].description = method?.params[param];
          }

          for (const output in method?.returns) {
            if (doc.methods[methodName].outputs[output]) doc.methods[methodName].outputs[output].description = method?.returns[output];
          }
        }
      }

      for (const varName in info.devdoc?.stateVariables) {
        const variable = info.devdoc?.stateVariables[varName];

        if (doc.methods[varName]) doc.methods[varName].details = variable?.details;

        for (const param in variable?.params) {
          if (doc.methods[varName].inputs[param]) doc.methods[varName].inputs[param].description = variable?.params[param];
        }

        for (const output in variable?.returns) {
          if (doc.methods[varName].outputs[output]) doc.methods[varName].outputs[output].description = variable?.returns[output];
        }
      }

      // Fetches global info
      if (info.devdoc?.title) doc.title = info.devdoc.title;
      if (info.userdoc?.notice) doc.notice = info.userdoc.notice;
      if (info.devdoc?.details) doc.details = info.devdoc.details;
      if (info.devdoc?.author) doc.author = info.devdoc.author;

      doc.name = name;
      docs.push(doc);
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
