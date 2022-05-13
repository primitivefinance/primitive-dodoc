import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    dodoc?: {
      include?: string[];
      exclude?: string[];
      runOnCompile?: boolean;
      debugMode?: boolean;
      templatePath?: string;
      outputDir?: string;
      keepFileStructure?: boolean;
      freshOutput?: boolean;
      tableOfContents?: boolean;
    }
  }

  export interface HardhatConfig {
    dodoc: {
      include: string[];
      exclude: string[];
      runOnCompile: boolean;
      debugMode: boolean;
      templatePath: string;
      outputDir: string;
      keepFileStructure: boolean;
      freshOutput: boolean;
      tableOfContents: boolean;
    }
  }
}
