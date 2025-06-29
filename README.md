# newcode-algo

A lightweight Node.js-based code runner/compiler that leverages the `child_process.spawn` method to securely and efficiently execute user-submitted code. This project is designed for educational or competitive programming platforms where running custom user code with input/output is essential.

---

## 🚀 Features

- **Node.js Backend**: Fast and efficient code runner built on top of Node.js.
- **Child Process Execution**: Uses `child_process.spawn` to run code safely in a separate process.
- **Supports Custom Input/Output**: Accepts user-defined input and returns standard output or error.
- **Asynchronous Execution**: Non-blocking I/O thanks to the spawn method, allowing scalable execution.
- **Extensible Architecture**: Can be extended to support multiple languages.

---

## 🧠 Why Use `child_process.spawn`?

The Node.js `child_process` module allows executing shell commands or external programs. There are two primary ways:
- `exec`: Buffers the entire output in memory.
- `spawn`: Streams data in and out, ideal for large outputs or long-running processes.

This project uses **`spawn`** because:

- **Streaming I/O**: It allows streaming input/output, which is more memory-efficient.
- **Real-time Data Handling**: Enables capturing stdout/stderr in real time.
- **Better Performance**: Especially for large-scale or long-running executions.
- **Security**: Running code in a separate process avoids blocking the Node.js event loop and isolates potential crashes.

---

