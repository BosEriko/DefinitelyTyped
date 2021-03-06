declare module "child_process" {
    import * as events from "events";
    import * as net from "net";
    import { Writable, Readable, Stream, Pipe } from "stream";

    interface ChildProcess extends events.EventEmitter {
        stdin: Writable | null;
        stdout: Readable | null;
        stderr: Readable | null;
        readonly channel?: Pipe | null;
        readonly stdio: [
            Writable | null, // stdin
            Readable | null, // stdout
            Readable | null, // stderr
            Readable | Writable | null | undefined, // extra
            Readable | Writable | null | undefined // extra
        ];
        readonly killed: boolean;
        readonly pid: number;
        readonly connected: boolean;
        kill(signal?: string): void;
        send(message: any, callback?: (error: Error | null) => void): boolean;
        send(message: any, sendHandle?: net.Socket | net.Server, callback?: (error: Error | null) => void): boolean;
        send(message: any, sendHandle?: net.Socket | net.Server, options?: MessageOptions, callback?: (error: Error | null) => void): boolean;
        disconnect(): void;
        unref(): void;
        ref(): void;

        /**
         * events.EventEmitter
         * 1. close
         * 2. disconnect
         * 3. error
         * 4. exit
         * 5. message
         */

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "close", listener: (code: number, signal: string) => void): this;
        addListener(event: "disconnect", listener: () => void): this;
        addListener(event: "error", listener: (err: Error) => void): this;
        addListener(event: "exit", listener: (code: number | null, signal: string | null) => void): this;
        addListener(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "close", code: number, signal: string): boolean;
        emit(event: "disconnect"): boolean;
        emit(event: "error", err: Error): boolean;
        emit(event: "exit", code: number | null, signal: string | null): boolean;
        emit(event: "message", message: any, sendHandle: net.Socket | net.Server): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "close", listener: (code: number, signal: string) => void): this;
        on(event: "disconnect", listener: () => void): this;
        on(event: "error", listener: (err: Error) => void): this;
        on(event: "exit", listener: (code: number | null, signal: string | null) => void): this;
        on(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "close", listener: (code: number, signal: string) => void): this;
        once(event: "disconnect", listener: () => void): this;
        once(event: "error", listener: (err: Error) => void): this;
        once(event: "exit", listener: (code: number | null, signal: string | null) => void): this;
        once(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "close", listener: (code: number, signal: string) => void): this;
        prependListener(event: "disconnect", listener: () => void): this;
        prependListener(event: "error", listener: (err: Error) => void): this;
        prependListener(event: "exit", listener: (code: number | null, signal: string | null) => void): this;
        prependListener(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "close", listener: (code: number, signal: string) => void): this;
        prependOnceListener(event: "disconnect", listener: () => void): this;
        prependOnceListener(event: "error", listener: (err: Error) => void): this;
        prependOnceListener(event: "exit", listener: (code: number | null, signal: string | null) => void): this;
        prependOnceListener(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;
    }

    // return this object when stdio option is undefined or not specified
    interface ChildProcessWithoutNullStreams extends ChildProcess {
        stdin: Writable;
        stdout: Readable;
        stderr: Readable;
        readonly stdio: [
            Writable, // stdin
            Readable, // stdout
            Readable, // stderr
            Readable | Writable | null | undefined, // extra, no modification
            Readable | Writable | null | undefined // extra, no modification
        ];
    }

    interface MessageOptions {
        keepOpen?: boolean;
    }

    type StdioOptions = "pipe" | "ignore" | "inherit" | Array<("pipe" | "ipc" | "ignore" | "inherit" | Stream | number | null | undefined)>;

    interface ProcessEnvOptions {
        uid?: number;
        gid?: number;
        cwd?: string;
        env?: NodeJS.ProcessEnv;
    }

    interface CommonOptions extends ProcessEnvOptions {
        /**
         * @default true
         */
        windowsHide?: boolean;
        /**
         * @default 0
         */
        timeout?: number;
    }

    interface SpawnOptions extends CommonOptions {
        argv0?: string;
        stdio?: StdioOptions;
        detached?: boolean;
        shell?: boolean | string;
        windowsVerbatimArguments?: boolean;
    }

    interface SpawnOptionsWithoutStdio extends SpawnOptions {
        stdio?: 'pipe' | Array<null | undefined | 'pipe'>;
    }

    function spawn(command: string, options?: SpawnOptionsWithoutStdio): ChildProcessWithoutNullStreams;
    function spawn(command: string, options: SpawnOptions): ChildProcess;
    function spawn(command: string, args?: ReadonlyArray<string>, options?: SpawnOptionsWithoutStdio): ChildProcessWithoutNullStreams;
    function spawn(command: string, args: ReadonlyArray<string>, options: SpawnOptions): ChildProcess;

    interface ExecOptions extends CommonOptions {
        shell?: string;
        maxBuffer?: number;
        killSignal?: string;
    }

    interface ExecOptionsWithStringEncoding extends ExecOptions {
        encoding: BufferEncoding;
    }

    interface ExecOptionsWithBufferEncoding extends ExecOptions {
        encoding: string | null; // specify `null`.
    }

    interface ExecException extends Error {
        cmd?: string;
        killed?: boolean;
        code?: number;
        signal?: string;
    }

    // no `options` definitely means stdout/stderr are `string`.
    function exec(command: string, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;

    // `options` with `"buffer"` or `null` for `encoding` means stdout/stderr are definitely `Buffer`.
    function exec(command: string, options: { encoding: "buffer" | null } & ExecOptions, callback?: (error: ExecException | null, stdout: Buffer, stderr: Buffer) => void): ChildProcess;

    // `options` with well known `encoding` means stdout/stderr are definitely `string`.
    function exec(command: string, options: { encoding: BufferEncoding } & ExecOptions, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;

    // `options` with an `encoding` whose type is `string` means stdout/stderr could either be `Buffer` or `string`.
    // There is no guarantee the `encoding` is unknown as `string` is a superset of `BufferEncoding`.
    function exec(command: string, options: { encoding: string } & ExecOptions, callback?: (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void): ChildProcess;

    // `options` without an `encoding` means stdout/stderr are definitely `string`.
    function exec(command: string, options: ExecOptions, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;

    // fallback if nothing else matches. Worst case is always `string | Buffer`.
    function exec(
        command: string,
        options: ({ encoding?: string | null } & ExecOptions) | undefined | null,
        callback?: (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void,
    ): ChildProcess;

    // NOTE: This namespace provides design-time support for util.promisify. Exported members do not exist at runtime.
    namespace exec {
        function __promisify__(command: string): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(command: string, options: { encoding: "buffer" | null } & ExecOptions): Promise<{ stdout: Buffer, stderr: Buffer }>;
        function __promisify__(command: string, options: { encoding: BufferEncoding } & ExecOptions): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(command: string, options: ExecOptions): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(command: string, options?: ({ encoding?: string | null } & ExecOptions) | null): Promise<{ stdout: string | Buffer, stderr: string | Buffer }>;
    }

    interface ExecFileOptions extends CommonOptions {
        maxBuffer?: number;
        killSignal?: string;
        windowsVerbatimArguments?: boolean;
        shell?: boolean | string;
    }
    interface ExecFileOptionsWithStringEncoding extends ExecFileOptions {
        encoding: BufferEncoding;
    }
    interface ExecFileOptionsWithBufferEncoding extends ExecFileOptions {
        encoding: 'buffer' | null;
    }
    interface ExecFileOptionsWithOtherEncoding extends ExecFileOptions {
        encoding: string;
    }

    function execFile(file: string): ChildProcess;
    function execFile(file: string, options: ({ encoding?: string | null } & ExecFileOptions) | undefined | null): ChildProcess;
    function execFile(file: string, args?: ReadonlyArray<string> | null): ChildProcess;
    function execFile(file: string, args: ReadonlyArray<string> | undefined | null, options: ({ encoding?: string | null } & ExecFileOptions) | undefined | null): ChildProcess;

    // no `options` definitely means stdout/stderr are `string`.
    function execFile(file: string, callback: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess;
    function execFile(file: string, args: ReadonlyArray<string> | undefined | null, callback: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess;

    // `options` with `"buffer"` or `null` for `encoding` means stdout/stderr are definitely `Buffer`.
    function execFile(file: string, options: ExecFileOptionsWithBufferEncoding, callback: (error: Error | null, stdout: Buffer, stderr: Buffer) => void): ChildProcess;
    function execFile(
        file: string,
        args: ReadonlyArray<string> | undefined | null,
        options: ExecFileOptionsWithBufferEncoding,
        callback: (error: Error | null, stdout: Buffer, stderr: Buffer) => void,
    ): ChildProcess;

    // `options` with well known `encoding` means stdout/stderr are definitely `string`.
    function execFile(file: string, options: ExecFileOptionsWithStringEncoding, callback: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess;
    function execFile(
        file: string,
        args: ReadonlyArray<string> | undefined | null,
        options: ExecFileOptionsWithStringEncoding,
        callback: (error: Error | null, stdout: string, stderr: string) => void,
    ): ChildProcess;

    // `options` with an `encoding` whose type is `string` means stdout/stderr could either be `Buffer` or `string`.
    // There is no guarantee the `encoding` is unknown as `string` is a superset of `BufferEncoding`.
    function execFile(
        file: string,
        options: ExecFileOptionsWithOtherEncoding,
        callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void,
    ): ChildProcess;
    function execFile(
        file: string,
        args: ReadonlyArray<string> | undefined | null,
        options: ExecFileOptionsWithOtherEncoding,
        callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void,
    ): ChildProcess;

    // `options` without an `encoding` means stdout/stderr are definitely `string`.
    function execFile(file: string, options: ExecFileOptions, callback: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess;
    function execFile(file: string, args: ReadonlyArray<string> | undefined | null, options: ExecFileOptions, callback: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess;

    // fallback if nothing else matches. Worst case is always `string | Buffer`.
    function execFile(
        file: string,
        options: ({ encoding?: string | null } & ExecFileOptions) | undefined | null,
        callback: ((error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void) | undefined | null,
    ): ChildProcess;
    function execFile(
        file: string,
        args: ReadonlyArray<string> | undefined | null,
        options: ({ encoding?: string | null } & ExecFileOptions) | undefined | null,
        callback: ((error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void) | undefined | null,
    ): ChildProcess;

    // NOTE: This namespace provides design-time support for util.promisify. Exported members do not exist at runtime.
    namespace execFile {
        function __promisify__(file: string): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(file: string, args: ReadonlyArray<string> | undefined | null): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(file: string, options: ExecFileOptionsWithBufferEncoding): Promise<{ stdout: Buffer, stderr: Buffer }>;
        function __promisify__(file: string, args: ReadonlyArray<string> | undefined | null, options: ExecFileOptionsWithBufferEncoding): Promise<{ stdout: Buffer, stderr: Buffer }>;
        function __promisify__(file: string, options: ExecFileOptionsWithStringEncoding): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(file: string, args: ReadonlyArray<string> | undefined | null, options: ExecFileOptionsWithStringEncoding): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(file: string, options: ExecFileOptionsWithOtherEncoding): Promise<{ stdout: string | Buffer, stderr: string | Buffer }>;
        function __promisify__(file: string, args: ReadonlyArray<string> | undefined | null, options: ExecFileOptionsWithOtherEncoding): Promise<{ stdout: string | Buffer, stderr: string | Buffer }>;
        function __promisify__(file: string, options: ExecFileOptions): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(file: string, args: ReadonlyArray<string> | undefined | null, options: ExecFileOptions): Promise<{ stdout: string, stderr: string }>;
        function __promisify__(file: string, options: ({ encoding?: string | null } & ExecFileOptions) | undefined | null): Promise<{ stdout: string | Buffer, stderr: string | Buffer }>;
        function __promisify__(
            file: string,
            args: ReadonlyArray<string> | undefined | null,
            options: ({ encoding?: string | null } & ExecFileOptions) | undefined | null,
        ): Promise<{ stdout: string | Buffer, stderr: string | Buffer }>;
    }

    interface ForkOptions extends ProcessEnvOptions {
        execPath?: string;
        execArgv?: string[];
        silent?: boolean;
        stdio?: StdioOptions;
        detached?: boolean;
        windowsVerbatimArguments?: boolean;
    }
    function fork(modulePath: string, options?: ForkOptions): ChildProcess;
    function fork(modulePath: string, args?: ReadonlyArray<string>, options?: ForkOptions): ChildProcess;

    interface SpawnSyncOptions extends CommonOptions {
        argv0?: string; // Not specified in the docs
        input?: string | Buffer | NodeJS.TypedArray | DataView;
        stdio?: StdioOptions;
        killSignal?: string | number;
        maxBuffer?: number;
        encoding?: string;
        shell?: boolean | string;
        windowsVerbatimArguments?: boolean;
    }
    interface SpawnSyncOptionsWithStringEncoding extends SpawnSyncOptions {
        encoding: BufferEncoding;
    }
    interface SpawnSyncOptionsWithBufferEncoding extends SpawnSyncOptions {
        encoding: string; // specify `null`.
    }
    interface SpawnSyncReturns<T> {
        pid: number;
        output: string[];
        stdout: T;
        stderr: T;
        status: number | null;
        signal: string | null;
        error?: Error;
    }
    function spawnSync(command: string): SpawnSyncReturns<Buffer>;
    function spawnSync(command: string, options?: SpawnSyncOptionsWithStringEncoding): SpawnSyncReturns<string>;
    function spawnSync(command: string, options?: SpawnSyncOptionsWithBufferEncoding): SpawnSyncReturns<Buffer>;
    function spawnSync(command: string, options?: SpawnSyncOptions): SpawnSyncReturns<Buffer>;
    function spawnSync(command: string, args?: ReadonlyArray<string>, options?: SpawnSyncOptionsWithStringEncoding): SpawnSyncReturns<string>;
    function spawnSync(command: string, args?: ReadonlyArray<string>, options?: SpawnSyncOptionsWithBufferEncoding): SpawnSyncReturns<Buffer>;
    function spawnSync(command: string, args?: ReadonlyArray<string>, options?: SpawnSyncOptions): SpawnSyncReturns<Buffer>;

    interface ExecSyncOptions extends CommonOptions {
        input?: string | Buffer | Uint8Array;
        stdio?: StdioOptions;
        shell?: string;
        killSignal?: string | number;
        maxBuffer?: number;
        encoding?: string;
    }
    interface ExecSyncOptionsWithStringEncoding extends ExecSyncOptions {
        encoding: BufferEncoding;
    }
    interface ExecSyncOptionsWithBufferEncoding extends ExecSyncOptions {
        encoding: string; // specify `null`.
    }
    function execSync(command: string): Buffer;
    function execSync(command: string, options?: ExecSyncOptionsWithStringEncoding): string;
    function execSync(command: string, options?: ExecSyncOptionsWithBufferEncoding): Buffer;
    function execSync(command: string, options?: ExecSyncOptions): Buffer;

    interface ExecFileSyncOptions extends CommonOptions {
        input?: string | Buffer | NodeJS.TypedArray | DataView;
        stdio?: StdioOptions;
        killSignal?: string | number;
        maxBuffer?: number;
        encoding?: string;
        shell?: boolean | string;
    }
    interface ExecFileSyncOptionsWithStringEncoding extends ExecFileSyncOptions {
        encoding: BufferEncoding;
    }
    interface ExecFileSyncOptionsWithBufferEncoding extends ExecFileSyncOptions {
        encoding: string; // specify `null`.
    }
    function execFileSync(command: string): Buffer;
    function execFileSync(command: string, options?: ExecFileSyncOptionsWithStringEncoding): string;
    function execFileSync(command: string, options?: ExecFileSyncOptionsWithBufferEncoding): Buffer;
    function execFileSync(command: string, options?: ExecFileSyncOptions): Buffer;
    function execFileSync(command: string, args?: ReadonlyArray<string>, options?: ExecFileSyncOptionsWithStringEncoding): string;
    function execFileSync(command: string, args?: ReadonlyArray<string>, options?: ExecFileSyncOptionsWithBufferEncoding): Buffer;
    function execFileSync(command: string, args?: ReadonlyArray<string>, options?: ExecFileSyncOptions): Buffer;
}
