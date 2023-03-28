export interface ESMOptions {
  pin?: string;
  esbuild?: {
    target?: "es2015" | "es2022" | "esnext" | "deno" | "denonext";
    keepNames?: boolean;
    ignoreAnnotations?: boolean;
  };
}

export async function resolveESM(module: string, options?: ESMOptions) {
  try {
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
