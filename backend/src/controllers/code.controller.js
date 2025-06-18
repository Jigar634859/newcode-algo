import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const executeCode = asyncHandler(async (req, res) => {
    const { code, language, input } = req.body;

    if (!code || !language) {
        throw new ApiError(400, "Code and language are required");
    }

    // Create a temporary directory for code execution
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });

    let fileName, command, args;
    const timestamp = Date.now();

    switch (language.toLowerCase()) {
        case 'python':
            fileName = `temp_${timestamp}.py`;
            command = 'python3';
            args = [path.join(tempDir, fileName)];
            break;
        case 'javascript':
            fileName = `temp_${timestamp}.js`;
            command = 'node';
            args = [path.join(tempDir, fileName)];
            break;
        case 'java':
            fileName = `Main_${timestamp}.java`;
            command = 'javac';
            args = [path.join(tempDir, fileName)];
            break;
        case 'cpp':
            fileName = `temp_${timestamp}.cpp`;
            const outputName = `temp_${timestamp}`;
            const compileCommand = 'g++';
            const compileArgs = ['-std=c++17', '-Wall', path.join(tempDir, fileName), '-o', path.join(tempDir, outputName)];
            
            try {
                // Write code to file first
                const filePath = path.join(tempDir, fileName);
                console.log('Writing C++ code to file:', filePath);
                await fs.writeFile(filePath, code);

                // Compile the code
                console.log('Compiling C++ code');
                const compileProcess = spawn(compileCommand, compileArgs);
                
                let compileOutput = '';
                let compileError = '';

                compileProcess.stdout.on('data', (data) => {
                    compileOutput += data.toString();
                });

                compileProcess.stderr.on('data', (data) => {
                    compileError += data.toString();
                });

                await new Promise((resolve, reject) => {
                    compileProcess.on('close', (code) => {
                        if (code !== 0) {
                            reject(new Error(compileError || 'Compilation failed'));
                        } else {
                            resolve();
                        }
                    });
                });

                // Run the compiled code
                console.log('Running compiled code with input:', input);
                const runProcess = spawn(path.join(tempDir, outputName));
                
                let runOutput = '';
                let runError = '';

                runProcess.stdout.on('data', (data) => {
                    runOutput += data.toString();
                });

                runProcess.stderr.on('data', (data) => {
                    runError += data.toString();
                });

                // Write input to the process
                if (input) {
                    runProcess.stdin.write(input);
                    runProcess.stdin.end();
                }

                await new Promise((resolve, reject) => {
                    runProcess.on('close', (code) => {
                        if (code !== 0) {
                            reject(new Error(runError || 'Runtime error'));
                        } else {
                            resolve();
                        }
                    });
                });

                return res.status(200).json(
                    new ApiResponse(200, { output: runOutput, error: false }, "Code executed successfully")
                );
            } catch (error) {
                console.error('C++ execution error:', error);
                return res.status(200).json(
                    new ApiResponse(200, { output: error.message, error: true }, "Error executing C++ code")
                );
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
            
            const process = spawn(command, args);
            
            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            // Write input to the process
            if (input) {
                process.stdin.write(input);
                process.stdin.end();
            }

            await new Promise((resolve, reject) => {
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(error || 'Runtime error'));
                    } else {
                        resolve();
                    }
                });
            });

            return res.status(200).json(
                new ApiResponse(200, { output, error: false }, "Code executed successfully")
            );
        } catch (error) {
            console.error('Code execution error:', error);
            return res.status(200).json(
                new ApiResponse(200, { output: error.message, error: true }, "Error executing code")
            );
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
