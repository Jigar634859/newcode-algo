import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const executeCode = asyncHandler(async (req, res) => {
    const { code, language, input } = req.body;

    if (!code || !language) {
        throw new ApiError(400, "Code and language are required");
    }

    // Create a temporary directory for code execution
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });

    let fileName, command;
    const timestamp = Date.now();

    switch (language.toLowerCase()) {
        case 'python':
            fileName = `temp_${timestamp}.py`;
            command = `python3 ${path.join(tempDir, fileName)}`;
            break;
        case 'javascript':
            fileName = `temp_${timestamp}.js`;
            command = `node ${path.join(tempDir, fileName)}`;
            break;
        case 'java':
            fileName = `Main_${timestamp}.java`;
            command = `cd ${tempDir} && javac ${fileName} && java Main_${timestamp}`;
            break;
        case 'cpp':
            fileName = `temp_${timestamp}.cpp`;
            const outputName = `temp_${timestamp}`;
            const compileCommand = `cd ${tempDir} && g++ -std=c++17 -Wall ${fileName} -o ${outputName}`;
            
            try {
                // Write code to file first
                const filePath = path.join(tempDir, fileName);
                console.log('Writing C++ code to file:', filePath);
                await fs.writeFile(filePath, code);

                // Then compile
                console.log('Compiling C++ code:', compileCommand);
                const { stdout: compileStdout, stderr: compileStderr } = await execAsync(compileCommand);
                if (compileStderr) {
                    console.error('Compilation errors:', compileStderr);
                    return res.status(200).json(
                        new ApiResponse(200, { output: compileStderr, error: true }, "Compilation failed")
                    );
                }
                
                // Then run with input
                console.log('Running compiled code with input:', input);
                const runCommand = `cd ${tempDir} && echo "${input}" | ./${outputName}`;
                const { stdout: runStdout, stderr: runStderr } = await execAsync(runCommand, {
                    timeout: 5000
                });
                
                if (runStderr) {
                    console.error('Runtime errors:', runStderr);
                    return res.status(200).json(
                        new ApiResponse(200, { output: runStderr, error: true }, "Runtime error")
                    );
                }
                
                return res.status(200).json(
                    new ApiResponse(200, { output: runStdout, error: false }, "Code executed successfully")
                );
            } catch (error) {
                console.error('C++ execution error:', error);
                throw new ApiError(500, error.message || "Error executing C++ code");
            } finally {
                // Clean up files
                try {
                    await fs.unlink(path.join(tempDir, fileName));
                    await fs.unlink(path.join(tempDir, outputName));
                } catch (cleanupError) {
                    console.error('Error cleaning up files:', cleanupError);
                }
            }
            break;
        default:
            throw new ApiError(400, "Unsupported language");
    }

    // For non-C++ languages
    if (language.toLowerCase() !== 'cpp') {
        try {
            const filePath = path.join(tempDir, fileName);
            await fs.writeFile(filePath, code);
            
            const { stdout, stderr } = await execAsync(command, {
                input,
                timeout: 5000
            });

            if (stderr) {
                return res.status(200).json(
                    new ApiResponse(200, { output: stderr, error: true }, "Runtime error")
                );
            }

            return res.status(200).json(
                new ApiResponse(200, { output: stdout, error: false }, "Code executed successfully")
            );
        } catch (error) {
            console.error('Code execution error:', error);
            throw new ApiError(500, error.message || "Error executing code");
        } finally {
            try {
                await fs.unlink(path.join(tempDir, fileName));
            } catch (cleanupError) {
                console.error('Error cleaning up files:', cleanupError);
            }
        }
    }
});

export { executeCode }; 