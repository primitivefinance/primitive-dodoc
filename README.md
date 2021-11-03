# Dodoc

Zero-config Hardhat plugin to generate documentation for all your Solidity contracts.

- 🤪 Zero-configuration required
- ✅ Compatible with latest Solidity versions
- 🔍 Supports events, errors and external / public functions
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

And you're done! Documentation will be automatically generated on the next compilation.

## 📝 Usage

The only thing you have to do is to comment your Solidity contracts using [NatSpec](https://docs.soliditylang.org/en/v0.8.9/natspec-format.html) format. For example, given the following function:

```solidity
/// @notice Does another thing when the function is called.
/// @dev More info about doing another thing when the function is called.
/// @param num A random number
/// @return A random variable
function anotherThing(uint256 num) external pure returns (uint256);
```

Dodoc will take care of everything and will generate the following output:

> ## Methods
>
> ### anotherThing
>
> ```solidity
> function anotherThing(uint256 num) external pure returns (uint256)
> ```
>
> Does another thing when the function is called.
>
> *More info about doing another thing when the function is called.*
>
> #### Parameters
>
> | Name | Type | Description |
> |---|---|---|
> | num | uint256 | A random number
>
> #### Returns
>
> | Name | Type | Description |
> |---|---|---|
> | _0 | uint256 | A random variable

Dodoc is compatible with all the NatSpec tags (except custom ones), and can generate documentation for all the events, custom errors and all the external / public functions.

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

Here are all the configuration parameters that are currently available, but as said above, all of them are entirely optional:

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

You can checkout the [default Markdown template](https://) to get some inspiration, as well as [SquirrellyJS documentation](https://squirrelly.js.org/docs) to learn more about it. Feel free to be creative, any kind of output such as Markdown, HTML or even JSON is supported!

Once you're satisfied, simply refer to your template using the `templatePath` parameter in your configuration and Dodoc will use it to output the documentation!

## ⛑ Help

Feel free to open an issue if you need help or if you encounter a problem! Here are some already known problems though:
- Due to some technical limitations, the documentation of `private` and `internal` functions is not rendered
- Functions that are not commented at all might not be rendered either
- Special functions such as `constructor`, `fallback` and `receive` might not be rendered
