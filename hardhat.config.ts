import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import './src';

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    sources: './examples/contracts/',
  },
  dodoc: {
    debugMode: true,
    outputDir: './examples/docs',
    exclude: ['excluded'],
    runOnCompile: true,
    tableOfContents: true,
  },
};

export default config;
