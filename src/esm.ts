/**
 * https://esm.sh/#docs
 */
export interface ESMOptions {
  pin?: string;
  esbuild?: {
    target?: "es2015" | "es2022" | "esnext" | "deno" | "denonext";
    keepNames?: boolean;
    ignoreAnnotations?: boolean;
  };
  deps?: string[];
  /**
   * A list of dependencies to externalize
   * if true, all dependencies will be externalized
   */
  external?: string[] | boolean;
  /**
   * A list of modules to alias to other modules
   */
  alias?: Record<string, string>;
  /**
   * To enable tree shaking, you need to specify the list of exports to keep
   */
  treeShake?: string[];
  /**
   * Bundle
   */
  bundle?: boolean;

  /**
   * Development Mode
   */
  dev?: boolean;

  /**
   * Worker Mode
   */
  worker?: boolean;
}

export async function resolveESM(module: string, options?: ESMOptions) {
  try {
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
