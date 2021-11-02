# Dodoc

Zero-config Hardhat plugin to generate documentation for all your Solidity contracts.

- 🤪 Zero-configuration required
- ✅ Compatible with Solidity >= 0.7.0
- 📖 Default output to Markdown
- 🔧 Extendable using custom templates

## 📦 Installation

First thing to do is to install the plugin in your Hardhat project:

```bash
# Using yarn
yarn add @primitivefinance/dodoc

# Or using npm
npm i @primitivefinance/dodoc
```

Next step is simply to include the plugin into your `hardhat.config.js` or `hardhat.config.ts` file:

```typescript
// Using JavaScript
require('@primitivefinance/dodoc');

// Using ES6 or TypeScript
import '@primitivefinance/dodoc';
```

And you're done! Now you just need to run `npx hardhat compile` to generate the documentation of all your contracts.

## 🔧 Config

Dodoc comes with a default configuration but you can still tweak some parameters. To do it, change your Hardhat config file like this:

```typescript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@primitivefinance-dodoc';

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  dodoc: {
    // Put your configuration here
    runOnCompile: true,
    testMode: true,
  },
};

export default config;
```

Here are all the configuration parameters that are currently available, as said above, all of them are entirely optional:

| Parameter | Description | Default value |
| -------- | -------- | -------- |
| `runOnCompile`     | True if the plugin should generate the documentation on every compilation | `true`     |
| `include` | List of all the contract names to include in the documentation generation. An empty array will generate documentation for all the contracts | `[]` |
| `exclude` | List of all the contract names to exclude from the documentation generation | `[]` |
| `outputDir` | Output directory of the documentation | `docs` |
| `templatePath` | Path to the documentation template | `./template.sqrl`|
| `testMode` | Test mode generating additional JSON files used for debugging | `false` |

## 💅 Customize

Dodoc integrates a super cool template engine called [SquirrellyJS](https://github.com/squirrellyjs/squirrelly), allowing anyone to create new output formats easily.

You can checkout the [default Markdown template](https://) to get some inspiration as well as [SquirrellyJS documentation](https://squirrelly.js.org/docs). Feel free to be creative, any kind of output such as Markdown, HTML or even JSON is supported!

Once you're satisfied, simply refer to your template using the `templatePath` in your configuration and Dodoc will use it to output the documentation!
