import { createSealedContext } from './seal';

interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
}

export async function executeSnapScript(
  scriptCode: string, 
  inputData: any
): Promise<ExecutionResult> {
  const start = performance.now();
  const context = createSealedContext(inputData);

  try {
    // Scripti bir fonksiyon içine hapsediyoruz
    // Sadece context içindeki değişkenleri 'this' ve argüman olarak kullanabilir
    const sandboxFunction = new Function('context', `
      with(context) {
        ${scriptCode}
        return data; 
      }
    `);

    // 🔥 TIMEOUT KONTROLÜ (Promise.race ile)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SnapScript Zaman Aşımı: Script 500ms limitini aştı.')), 500)
    );

    const executionPromise = Promise.resolve().then(() => sandboxFunction(context));

    const result = await Promise.race([executionPromise, timeoutPromise]);

    return {
      success: true,
      data: result,
      duration: performance.now() - start
    };

  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      duration: performance.now() - start
    };
  }
}
