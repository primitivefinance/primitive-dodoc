import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    dodoc?: {
      include?: string[];
      exclude?: string[];
      runOnCompile?: boolean;
    }
  }

  export interface HardhatConfig {
    dodoc: {
      include: string[];
      exclude: string[];
      runOnCompile: boolean;
    }
  }
}
