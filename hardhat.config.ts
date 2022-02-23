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
    testMode: true,
    outputDir: './docs',
    reproDirStruct: true,
  },
};

export default config;
