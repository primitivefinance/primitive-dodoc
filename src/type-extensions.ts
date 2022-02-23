import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    dodoc?: {
      include?: string[];
      exclude?: string[];
      runOnCompile?: boolean;
      testMode?: boolean;
      templatePath?: string;
      outputDir?: string;
      reproDirStruct?: boolean;
    }
  }

  export interface HardhatConfig {
    dodoc: {
      include: string[];
      exclude: string[];
      runOnCompile: boolean;
      testMode: boolean;
      templatePath: string;
      outputDir: string;
      reproDirStruct: boolean;
    }
  }
}
