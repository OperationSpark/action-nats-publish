/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1954:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Copyright 2013-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


module.exports = __nccwpck_require__(1617);


/***/ }),

/***/ 5718:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderedPullConsumerImpl = exports.PullConsumerImpl = exports.OrderedConsumerMessages = exports.PullConsumerMessagesImpl = exports.ConsumerDebugEvents = exports.ConsumerEvents = void 0;
/*
 * Copyright 2022-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const util_1 = __nccwpck_require__(4812);
const nuid_1 = __nccwpck_require__(6146);
const jsutil_1 = __nccwpck_require__(1186);
const queued_iterator_1 = __nccwpck_require__(8450);
const core_1 = __nccwpck_require__(9498);
const core = __nccwpck_require__(2529);
const jsmsg_1 = __nccwpck_require__(2188);
const jsapi_types_1 = __nccwpck_require__(4399);
const types_1 = __nccwpck_require__(165);
var PullConsumerType;
(function (PullConsumerType) {
    PullConsumerType[PullConsumerType["Unset"] = -1] = "Unset";
    PullConsumerType[PullConsumerType["Consume"] = 0] = "Consume";
    PullConsumerType[PullConsumerType["Fetch"] = 1] = "Fetch";
})(PullConsumerType || (PullConsumerType = {}));
/**
 * ConsumerEvents are informational notifications emitted by ConsumerMessages
 * that may be of interest to a client.
 */
var ConsumerEvents;
(function (ConsumerEvents) {
    /**
     * Notification that heartbeats were missed. This notification is informational.
     * The `data` portion of the status, is a number indicating the number of missed heartbeats.
     * Note that when a client disconnects, heartbeat tracking is paused while
     * the client is disconnected.
     */
    ConsumerEvents["HeartbeatsMissed"] = "heartbeats_missed";
})(ConsumerEvents || (exports.ConsumerEvents = ConsumerEvents = {}));
/**
 * These events represent informational notifications emitted by ConsumerMessages
 * that can be safely ignored by clients.
 */
var ConsumerDebugEvents;
(function (ConsumerDebugEvents) {
    /**
     * DebugEvents are effectively statuses returned by the server that were ignored
     * by the client. The `data` portion of the
     * status is just a string indicating the code/message of the status.
     */
    ConsumerDebugEvents["DebugEvent"] = "debug";
    /**
     * Requests for messages can be terminated by the server, these notifications
     * provide information on the number of messages and/or bytes that couldn't
     * be satisfied by the consumer request. The `data` portion of the status will
     * have the format of `{msgsLeft: number, bytesLeft: number}`.
     */
    ConsumerDebugEvents["Discard"] = "discard";
    /**
     * Notifies whenever there's a request for additional messages from the server.
     * This notification telegraphs the request options, which should be treated as
     * read-only. This notification is only useful for debugging. Data is PullOptions.
     */
    ConsumerDebugEvents["Next"] = "next";
})(ConsumerDebugEvents || (exports.ConsumerDebugEvents = ConsumerDebugEvents = {}));
class PullConsumerMessagesImpl extends queued_iterator_1.QueuedIteratorImpl {
    // callback: ConsumerCallbackFn;
    constructor(c, opts, refilling = false) {
        super();
        this.consumer = c;
        this.opts = this.parseOptions(opts, refilling);
        this.callback = opts.callback || null;
        this.noIterator = typeof this.callback === "function";
        this.monitor = null;
        this.pong = null;
        this.pending = { msgs: 0, bytes: 0, requests: 0 };
        this.refilling = refilling;
        this.stack = new Error().stack.split("\n").slice(1).join("\n");
        this.timeout = null;
        this.inbox = (0, core_1.createInbox)(c.api.nc.options.inboxPrefix);
        this.listeners = [];
        const { max_messages, max_bytes, idle_heartbeat, threshold_bytes, threshold_messages, } = this.opts;
        // ordered consumer requires the ability to reset the
        // source pull consumer, if promise is registered and
        // close is called, the pull consumer will emit a close
        // which will close the ordered consumer, by registering
        // the close with a handler, we can replace it.
        this.closed().then(() => {
            if (this.cleanupHandler) {
                try {
                    this.cleanupHandler();
                }
                catch (_err) {
                    // nothing
                }
            }
        });
        const { sub } = this;
        if (sub) {
            sub.unsubscribe();
        }
        this.sub = c.api.nc.subscribe(this.inbox, {
            callback: (err, msg) => {
                var _a, _b, _c, _d;
                if (err) {
                    // this is possibly only a permissions error which means
                    // that the server rejected (eliminating the sub)
                    // or the client never had permissions to begin with
                    // so this is terminal
                    this.stop();
                    return;
                }
                (_a = this.monitor) === null || _a === void 0 ? void 0 : _a.work();
                const isProtocol = msg.subject === this.inbox;
                if (isProtocol) {
                    if ((0, jsutil_1.isHeartbeatMsg)(msg)) {
                        return;
                    }
                    const code = (_b = msg.headers) === null || _b === void 0 ? void 0 : _b.code;
                    const description = ((_d = (_c = msg.headers) === null || _c === void 0 ? void 0 : _c.description) === null || _d === void 0 ? void 0 : _d.toLowerCase()) ||
                        "unknown";
                    const { msgsLeft, bytesLeft } = this.parseDiscard(msg.headers);
                    if (msgsLeft > 0 || bytesLeft > 0) {
                        this.pending.msgs -= msgsLeft;
                        this.pending.bytes -= bytesLeft;
                        this.pending.requests--;
                        this.notify(ConsumerDebugEvents.Discard, { msgsLeft, bytesLeft });
                    }
                    else {
                        // FIXME: 408 can be a Timeout or bad request,
                        //  or it can be sent if a nowait request was
                        //  sent when other waiting requests are pending
                        //  "Requests Pending"
                        // FIXME: 400 bad request Invalid Heartbeat or Unmarshalling Fails
                        //  these are real bad values - so this is bad request
                        //  fail on this
                        const toErr = () => {
                            const err = new core_1.NatsError(description, `${code}`);
                            err.stack += `\n\n${this.stack}`;
                            return err;
                        };
                        // we got a bad request - no progress here
                        if (code === 400) {
                            const error = toErr();
                            //@ts-ignore: fn
                            this._push(() => {
                                this.stop(error);
                            });
                        }
                        else if (code === 409 && description === "consumer deleted") {
                            const error = toErr();
                            this.stop(error);
                        }
                        else {
                            this.notify(ConsumerDebugEvents.DebugEvent, `${code} ${description}`);
                        }
                    }
                }
                else {
                    // push the user message
                    this._push((0, jsmsg_1.toJsMsg)(msg));
                    this.received++;
                    if (this.pending.msgs) {
                        this.pending.msgs--;
                    }
                    if (this.pending.bytes) {
                        this.pending.bytes -= msg.size();
                    }
                }
                // if we don't have pending bytes/messages we are done or starving
                if (this.pending.msgs === 0 && this.pending.bytes === 0) {
                    this.pending.requests = 0;
                }
                if (this.refilling) {
                    // FIXME: this could result in  1/4 = 0
                    if ((max_messages &&
                        this.pending.msgs <= threshold_messages) ||
                        (max_bytes && this.pending.bytes <= threshold_bytes)) {
                        const batch = this.pullOptions();
                        // @ts-ignore: we are pushing the pull fn
                        this.pull(batch);
                    }
                }
                else if (this.pending.requests === 0) {
                    // @ts-ignore: we are pushing the pull fn
                    this._push(() => {
                        this.stop();
                    });
                }
            },
        });
        this.sub.closed.then(() => {
            // for ordered consumer we cannot break the iterator
            if (this.sub.draining) {
                // @ts-ignore: we are pushing the pull fn
                this._push(() => {
                    this.stop();
                });
            }
        });
        if (idle_heartbeat) {
            this.monitor = new core.IdleHeartbeat(idle_heartbeat, (data) => {
                // for the pull consumer - missing heartbeats may be corrected
                // on the next pull etc - the only assumption here is we should
                // reset and check if the consumer was deleted from under us
                this.notify(ConsumerEvents.HeartbeatsMissed, data);
                this.resetPending()
                    .then(() => {
                })
                    .catch(() => {
                });
                return false;
            }, { maxOut: 2 });
        }
        // now if we disconnect, the consumer could be gone
        // or we were slow consumer'ed by the server
        (() => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d;
            const status = c.api.nc.status();
            this.statusIterator = status;
            try {
                for (var _e = true, status_1 = __asyncValues(status), status_1_1; status_1_1 = yield status_1.next(), _a = status_1_1.done, !_a; _e = true) {
                    _c = status_1_1.value;
                    _e = false;
                    const s = _c;
                    switch (s.type) {
                        case core_1.Events.Disconnect:
                            // don't spam hb errors if we are disconnected
                            // @ts-ignore: optional chaining
                            (_d = this.monitor) === null || _d === void 0 ? void 0 : _d.cancel();
                            break;
                        case core_1.Events.Reconnect:
                            // do some sanity checks and reset
                            // if that works resume the monitor
                            this.resetPending()
                                .then((ok) => {
                                var _a;
                                if (ok) {
                                    // @ts-ignore: optional chaining
                                    (_a = this.monitor) === null || _a === void 0 ? void 0 : _a.restart();
                                }
                            })
                                .catch(() => {
                                // ignored - this should have fired elsewhere
                            });
                            break;
                        default:
                        // ignored
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = status_1.return)) yield _b.call(status_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }))();
        // this is the initial pull
        this.pull(this.pullOptions());
    }
    _push(r) {
        if (!this.callback) {
            super.push(r);
        }
        else {
            const fn = typeof r === "function" ? r : null;
            try {
                if (!fn) {
                    this.callback(r);
                }
                else {
                    fn();
                }
            }
            catch (err) {
                this.stop(err);
            }
        }
    }
    notify(type, data) {
        if (this.listeners.length > 0) {
            (() => {
                this.listeners.forEach((l) => {
                    if (!l.done) {
                        l.push({ type, data });
                    }
                });
            })();
        }
    }
    resetPending() {
        // check we exist
        return this.consumer.info()
            .then((_ci) => {
            // we exist, so effectively any pending state is gone
            // so reset and re-pull
            this.pending.msgs = 0;
            this.pending.bytes = 0;
            this.pending.requests = 0;
            this.pull(this.pullOptions());
            return true;
        })
            .catch((err) => {
            // game over
            if (err.message === "consumer not found") {
                this.stop(err);
            }
            return false;
        });
    }
    pull(opts) {
        var _a, _b;
        this.pending.bytes += (_a = opts.max_bytes) !== null && _a !== void 0 ? _a : 0;
        this.pending.msgs += (_b = opts.batch) !== null && _b !== void 0 ? _b : 0;
        this.pending.requests++;
        const nc = this.consumer.api.nc;
        //@ts-ignore: iterator will pull
        this._push(() => {
            nc.publish(`${this.consumer.api.prefix}.CONSUMER.MSG.NEXT.${this.consumer.stream}.${this.consumer.name}`, this.consumer.api.jc.encode(opts), { reply: this.inbox });
            this.notify(ConsumerDebugEvents.Next, opts);
        });
    }
    pullOptions() {
        const batch = this.opts.max_messages - this.pending.msgs;
        const max_bytes = this.opts.max_bytes - this.pending.bytes;
        const idle_heartbeat = (0, jsutil_1.nanos)(this.opts.idle_heartbeat);
        const expires = (0, jsutil_1.nanos)(this.opts.expires);
        return { batch, max_bytes, idle_heartbeat, expires };
    }
    parseDiscard(headers) {
        const discard = {
            msgsLeft: 0,
            bytesLeft: 0,
        };
        const msgsLeft = headers === null || headers === void 0 ? void 0 : headers.get(types_1.JsHeaders.PendingMessagesHdr);
        if (msgsLeft) {
            discard.msgsLeft = parseInt(msgsLeft);
        }
        const bytesLeft = headers === null || headers === void 0 ? void 0 : headers.get(types_1.JsHeaders.PendingBytesHdr);
        if (bytesLeft) {
            discard.bytesLeft = parseInt(bytesLeft);
        }
        return discard;
    }
    trackTimeout(t) {
        this.timeout = t;
    }
    close() {
        this.stop();
        return this.iterClosed;
    }
    closed() {
        return this.iterClosed;
    }
    clearTimers() {
        var _a, _b;
        (_a = this.monitor) === null || _a === void 0 ? void 0 : _a.cancel();
        this.monitor = null;
        (_b = this.timeout) === null || _b === void 0 ? void 0 : _b.cancel();
        this.timeout = null;
    }
    setCleanupHandler(fn) {
        this.cleanupHandler = fn;
    }
    stop(err) {
        var _a, _b;
        (_a = this.sub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this.clearTimers();
        (_b = this.statusIterator) === null || _b === void 0 ? void 0 : _b.stop();
        //@ts-ignore: fn
        this._push(() => {
            super.stop(err);
            this.listeners.forEach((n) => {
                n.stop();
            });
        });
    }
    parseOptions(opts, refilling = false) {
        const args = (opts || {});
        args.max_messages = args.max_messages || 0;
        args.max_bytes = args.max_bytes || 0;
        if (args.max_messages !== 0 && args.max_bytes !== 0) {
            throw new Error(`only specify one of max_messages or max_bytes`);
        }
        // we must have at least one limit - default to 100 msgs
        // if they gave bytes but no messages, we will clamp
        // if they gave byte limits, we still need a message limit
        // or the server will send a single message and close the
        // request
        if (args.max_messages === 0) {
            // FIXME: if the server gives end pull completion, then this is not
            //   needed - the client will get 1 message but, we'll know that it
            //   worked - but we'll add a lot of latency, since all requests
            //   will end after one message
            args.max_messages = 100;
        }
        args.expires = args.expires || 30000;
        if (args.expires < 1000) {
            throw new Error("expires should be at least 1000ms");
        }
        // require idle_heartbeat
        args.idle_heartbeat = args.idle_heartbeat || args.expires / 2;
        args.idle_heartbeat = args.idle_heartbeat > 30000
            ? 30000
            : args.idle_heartbeat;
        if (refilling) {
            const minMsgs = Math.round(args.max_messages * .75) || 1;
            args.threshold_messages = args.threshold_messages || minMsgs;
            const minBytes = Math.round(args.max_bytes * .75) || 1;
            args.threshold_bytes = args.threshold_bytes || minBytes;
        }
        return args;
    }
    status() {
        const iter = new queued_iterator_1.QueuedIteratorImpl();
        this.listeners.push(iter);
        return Promise.resolve(iter);
    }
}
exports.PullConsumerMessagesImpl = PullConsumerMessagesImpl;
class OrderedConsumerMessages extends queued_iterator_1.QueuedIteratorImpl {
    constructor() {
        super();
    }
    setSource(src) {
        if (this.src) {
            this.src.setCleanupHandler();
            this.src.stop();
        }
        this.src = src;
        this.src.setCleanupHandler(() => {
            this.close().catch();
        });
    }
    stop(err) {
        var _a;
        (_a = this.src) === null || _a === void 0 ? void 0 : _a.stop(err);
        super.stop(err);
    }
    close() {
        this.stop();
        return this.iterClosed;
    }
    status() {
        return Promise.reject(new Error("ordered consumers don't report consumer status"));
    }
}
exports.OrderedConsumerMessages = OrderedConsumerMessages;
class PullConsumerImpl {
    constructor(api, info) {
        this.api = api;
        this._info = info;
        this.stream = info.stream_name;
        this.name = info.name;
    }
    consume(opts = {
        max_messages: 100,
        expires: 30000,
    }) {
        return Promise.resolve(new PullConsumerMessagesImpl(this, opts, true));
    }
    fetch(opts = {
        max_messages: 100,
        expires: 30000,
    }) {
        const m = new PullConsumerMessagesImpl(this, opts, false);
        // FIXME: need some way to pad this correctly
        const to = Math.round(m.opts.expires * 1.05);
        const timer = (0, util_1.timeout)(to);
        m.closed().then(() => {
            timer.cancel();
        });
        timer.catch(() => {
            m.close().catch();
        });
        m.trackTimeout(timer);
        return Promise.resolve(m);
    }
    next(opts = { expires: 30000 }) {
        const d = (0, util_1.deferred)();
        const fopts = opts;
        fopts.max_messages = 1;
        const iter = new PullConsumerMessagesImpl(this, fopts, false);
        // FIXME: need some way to pad this correctly
        const to = Math.round(iter.opts.expires * 1.05);
        // watch the messages for heartbeats missed
        if (to >= 60000) {
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a, e_2, _b, _c;
                try {
                    for (var _d = true, _e = __asyncValues(yield iter.status()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const s = _c;
                        if (s.type === ConsumerEvents.HeartbeatsMissed &&
                            s.data >= 2) {
                            d.reject(new Error("consumer missed heartbeats"));
                            break;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }))().catch();
        }
        (() => __awaiter(this, void 0, void 0, function* () {
            var _g, e_3, _h, _j;
            try {
                for (var _k = true, iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield iter_1.next(), _g = iter_1_1.done, !_g; _k = true) {
                    _j = iter_1_1.value;
                    _k = false;
                    const m = _j;
                    d.resolve(m);
                    break;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_k && !_g && (_h = iter_1.return)) yield _h.call(iter_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }))().catch();
        const timer = (0, util_1.timeout)(to);
        iter.closed().then(() => {
            d.resolve(null);
            timer.cancel();
        }).catch((err) => {
            d.reject(err);
        });
        timer.catch((_err) => {
            d.resolve(null);
            iter.close().catch();
        });
        iter.trackTimeout(timer);
        return d;
    }
    delete() {
        const { stream_name, name } = this._info;
        return this.api.delete(stream_name, name);
    }
    info(cached = false) {
        if (cached) {
            return Promise.resolve(this._info);
        }
        const { stream_name, name } = this._info;
        return this.api.info(stream_name, name)
            .then((ci) => {
            this._info = ci;
            return this._info;
        });
    }
}
exports.PullConsumerImpl = PullConsumerImpl;
class OrderedPullConsumerImpl {
    constructor(api, stream, opts = {}) {
        this.api = api;
        this.stream = stream;
        this.cursor = { stream_seq: 1, deliver_seq: 0 };
        this.namePrefix = nuid_1.nuid.next();
        this.serial = 0;
        this.currentConsumer = null;
        this.userCallback = null;
        this.iter = null;
        this.type = PullConsumerType.Unset;
        this.consumerOpts = opts;
        // to support a random start sequence we need to update the cursor
        this.startSeq = this.consumerOpts.opt_start_seq || 0;
        this.cursor.stream_seq = this.startSeq > 0 ? this.startSeq - 1 : 0;
    }
    getConsumerOpts(seq) {
        // change the serial - invalidating any callback not
        // matching the serial
        this.serial++;
        const name = `${this.namePrefix}_${this.serial}`;
        seq = seq === 0 ? 1 : seq;
        const config = {
            name,
            deliver_policy: jsapi_types_1.DeliverPolicy.StartSequence,
            opt_start_seq: seq,
            ack_policy: jsapi_types_1.AckPolicy.None,
            inactive_threshold: (0, jsutil_1.nanos)(5 * 60 * 1000),
            num_replicas: 1,
        };
        if (this.consumerOpts.headers_only === true) {
            config.headers_only = true;
        }
        if (Array.isArray(this.consumerOpts.filterSubjects)) {
            config.filter_subjects = this.consumerOpts.filterSubjects;
        }
        if (typeof this.consumerOpts.filterSubjects === "string") {
            config.filter_subject = this.consumerOpts.filterSubjects;
        }
        // this is the initial request - tweak some options
        if (seq === this.startSeq + 1) {
            config.deliver_policy = this.consumerOpts.deliver_policy ||
                jsapi_types_1.DeliverPolicy.StartSequence;
            if (this.consumerOpts.deliver_policy === jsapi_types_1.DeliverPolicy.LastPerSubject ||
                this.consumerOpts.deliver_policy === jsapi_types_1.DeliverPolicy.New ||
                this.consumerOpts.deliver_policy === jsapi_types_1.DeliverPolicy.Last) {
                delete config.opt_start_seq;
                config.deliver_policy = this.consumerOpts.deliver_policy;
            }
            // this requires a filter subject - we only set if they didn't
            // set anything, and to be pre-2.10 we set it as filter_subject
            if (config.deliver_policy === jsapi_types_1.DeliverPolicy.LastPerSubject) {
                if (typeof config.filter_subjects === "undefined" &&
                    typeof config.filter_subject === "undefined") {
                    config.filter_subject = ">";
                }
            }
            if (this.consumerOpts.opt_start_time) {
                delete config.opt_start_seq;
                config.deliver_policy = jsapi_types_1.DeliverPolicy.StartTime;
                config.opt_start_time = this.consumerOpts.opt_start_time;
            }
            if (this.consumerOpts.inactive_threshold) {
                config.inactive_threshold = (0, jsutil_1.nanos)(this.consumerOpts.inactive_threshold);
            }
        }
        return config;
    }
    resetConsumer(seq = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            // try to delete the consumer
            if (this.consumer) {
                // FIXME: this needs to be a standard request option to retry
                while (true) {
                    try {
                        yield this.delete();
                        break;
                    }
                    catch (err) {
                        if (err.message !== "TIMEOUT") {
                            throw err;
                        }
                    }
                }
            }
            seq = seq === 0 ? 1 : seq;
            // reset the consumer sequence as JetStream will renumber from 1
            this.cursor.deliver_seq = 0;
            const config = this.getConsumerOpts(seq);
            config.max_deliver = 1;
            config.mem_storage = true;
            let ci;
            // FIXME: replace with general jetstream retry logic
            while (true) {
                try {
                    ci = yield this.api.add(this.stream, config);
                    break;
                }
                catch (err) {
                    if (err.message !== "TIMEOUT") {
                        throw err;
                    }
                }
            }
            return ci;
        });
    }
    internalHandler(serial) {
        // this handler will be noop if the consumer's serial changes
        return (m) => {
            var _a;
            if (this.serial !== serial) {
                return;
            }
            const dseq = m.info.deliverySequence;
            if (dseq !== this.cursor.deliver_seq + 1) {
                this.reset(this.opts);
                return;
            }
            this.cursor.deliver_seq = dseq;
            this.cursor.stream_seq = m.info.streamSequence;
            if (this.userCallback) {
                this.userCallback(m);
            }
            else {
                (_a = this.iter) === null || _a === void 0 ? void 0 : _a.push(m);
            }
        };
    }
    reset(opts = {
        max_messages: 100,
        expires: 30000,
    }, fromFetch = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentConsumer = yield this.resetConsumer(this.cursor.stream_seq + 1);
            if (this.iter === null) {
                this.iter = new OrderedConsumerMessages();
            }
            this.consumer = new PullConsumerImpl(this.api, this.currentConsumer);
            const copts = opts;
            copts.callback = this.internalHandler(this.serial);
            let msgs = null;
            if (this.type === PullConsumerType.Fetch && fromFetch) {
                // we only repull if client initiates
                msgs = yield this.consumer.fetch(opts);
            }
            else if (this.type === PullConsumerType.Consume) {
                msgs = yield this.consumer.consume(opts);
            }
            else {
                return Promise.reject("reset called with unset consumer type");
            }
            this.iter.setSource(msgs);
            return this.iter;
        });
    }
    consume(opts = {
        max_messages: 100,
        expires: 30000,
    }) {
        if (this.type === PullConsumerType.Fetch) {
            return Promise.reject(new Error("ordered consumer initialized as fetch"));
        }
        if (this.type === PullConsumerType.Consume) {
            return Promise.reject(new Error("ordered consumer doesn't support concurrent consume"));
        }
        const { callback } = opts;
        if (callback) {
            this.userCallback = callback;
        }
        this.type = PullConsumerType.Consume;
        this.opts = opts;
        return this.reset(opts);
    }
    fetch(opts = { max_messages: 100, expires: 30000 }) {
        var _a;
        if (this.type === PullConsumerType.Consume) {
            return Promise.reject(new Error("ordered consumer already initialized as consume"));
        }
        if (((_a = this.iter) === null || _a === void 0 ? void 0 : _a.done) === false) {
            return Promise.reject(new Error("ordered consumer doesn't support concurrent fetch"));
        }
        //@ts-ignore: allow this for tests - api doesn't use it because
        // iterator close is the user signal that the pull is done.
        const { callback } = opts;
        if (callback) {
            this.userCallback = callback;
        }
        this.type = PullConsumerType.Fetch;
        this.opts = opts;
        this.iter = new OrderedConsumerMessages();
        return this.reset(opts, true);
    }
    next(opts = { expires: 30000 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const d = (0, util_1.deferred)();
            const copts = opts;
            copts.max_messages = 1;
            copts.callback = (m) => {
                // we can clobber the callback, because they are not supported
                // except on consume, which will fail when we try to fetch
                this.userCallback = null;
                d.resolve(m);
            };
            const iter = yield this.fetch(copts);
            iter.iterClosed
                .then(() => {
                d.resolve(null);
            })
                .catch((err) => {
                d.reject(err);
            });
            return d;
        });
    }
    delete() {
        if (!this.currentConsumer) {
            return Promise.resolve(false);
        }
        return this.api.delete(this.stream, this.currentConsumer.name)
            .then((tf) => {
            return Promise.resolve(tf);
        })
            .catch((err) => {
            return Promise.reject(err);
        })
            .finally(() => {
            this.currentConsumer = null;
        });
    }
    info(cached) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentConsumer == null) {
                this.currentConsumer = yield this.resetConsumer(this.serial);
                return Promise.resolve(this.currentConsumer);
            }
            if (cached && this.currentConsumer) {
                return Promise.resolve(this.currentConsumer);
            }
            return this.api.info(this.stream, this.currentConsumer.name);
        });
    }
}
exports.OrderedPullConsumerImpl = OrderedPullConsumerImpl;
//# sourceMappingURL=consumer.js.map

/***/ }),

/***/ 6260:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsumerEvents = exports.ConsumerDebugEvents = exports.StorageType = exports.RetentionPolicy = exports.ReplayPolicy = exports.DiscardPolicy = exports.DeliverPolicy = exports.AckPolicy = exports.RepublishHeaders = exports.JsHeaders = exports.isConsumerOptsBuilder = exports.DirectMsgHeaders = exports.consumerOpts = exports.AdvisoryKind = exports.nanos = exports.millis = exports.isHeartbeatMsg = exports.isFlowControlMsg = exports.checkJsError = void 0;
/*
 * Copyright 2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var jsutil_1 = __nccwpck_require__(1186);
Object.defineProperty(exports, "checkJsError", ({ enumerable: true, get: function () { return jsutil_1.checkJsError; } }));
Object.defineProperty(exports, "isFlowControlMsg", ({ enumerable: true, get: function () { return jsutil_1.isFlowControlMsg; } }));
Object.defineProperty(exports, "isHeartbeatMsg", ({ enumerable: true, get: function () { return jsutil_1.isHeartbeatMsg; } }));
Object.defineProperty(exports, "millis", ({ enumerable: true, get: function () { return jsutil_1.millis; } }));
Object.defineProperty(exports, "nanos", ({ enumerable: true, get: function () { return jsutil_1.nanos; } }));
var types_1 = __nccwpck_require__(165);
Object.defineProperty(exports, "AdvisoryKind", ({ enumerable: true, get: function () { return types_1.AdvisoryKind; } }));
Object.defineProperty(exports, "consumerOpts", ({ enumerable: true, get: function () { return types_1.consumerOpts; } }));
Object.defineProperty(exports, "DirectMsgHeaders", ({ enumerable: true, get: function () { return types_1.DirectMsgHeaders; } }));
Object.defineProperty(exports, "isConsumerOptsBuilder", ({ enumerable: true, get: function () { return types_1.isConsumerOptsBuilder; } }));
Object.defineProperty(exports, "JsHeaders", ({ enumerable: true, get: function () { return types_1.JsHeaders; } }));
Object.defineProperty(exports, "RepublishHeaders", ({ enumerable: true, get: function () { return types_1.RepublishHeaders; } }));
var jsapi_types_1 = __nccwpck_require__(4399);
Object.defineProperty(exports, "AckPolicy", ({ enumerable: true, get: function () { return jsapi_types_1.AckPolicy; } }));
Object.defineProperty(exports, "DeliverPolicy", ({ enumerable: true, get: function () { return jsapi_types_1.DeliverPolicy; } }));
Object.defineProperty(exports, "DiscardPolicy", ({ enumerable: true, get: function () { return jsapi_types_1.DiscardPolicy; } }));
Object.defineProperty(exports, "ReplayPolicy", ({ enumerable: true, get: function () { return jsapi_types_1.ReplayPolicy; } }));
Object.defineProperty(exports, "RetentionPolicy", ({ enumerable: true, get: function () { return jsapi_types_1.RetentionPolicy; } }));
Object.defineProperty(exports, "StorageType", ({ enumerable: true, get: function () { return jsapi_types_1.StorageType; } }));
var consumer_1 = __nccwpck_require__(5718);
Object.defineProperty(exports, "ConsumerDebugEvents", ({ enumerable: true, get: function () { return consumer_1.ConsumerDebugEvents; } }));
Object.defineProperty(exports, "ConsumerEvents", ({ enumerable: true, get: function () { return consumer_1.ConsumerEvents; } }));
//# sourceMappingURL=internal_mod.js.map

/***/ }),

/***/ 4399:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultConsumer = exports.ConsumerApiAction = exports.StoreCompression = exports.ReplayPolicy = exports.AckPolicy = exports.DeliverPolicy = exports.StorageType = exports.DiscardPolicy = exports.RetentionPolicy = void 0;
const jsutil_1 = __nccwpck_require__(1186);
var RetentionPolicy;
(function (RetentionPolicy) {
    /**
     * Retain messages until the limits are reached, then trigger the discard policy.
     */
    RetentionPolicy["Limits"] = "limits";
    /**
     * Retain messages while there is consumer interest on the particular subject.
     */
    RetentionPolicy["Interest"] = "interest";
    /**
     * Retain messages until acknowledged
     */
    RetentionPolicy["Workqueue"] = "workqueue";
})(RetentionPolicy || (exports.RetentionPolicy = RetentionPolicy = {}));
var DiscardPolicy;
(function (DiscardPolicy) {
    /**
     * Discard old messages to make room for the new ones
     */
    DiscardPolicy["Old"] = "old";
    /**
     * Discard the new messages
     */
    DiscardPolicy["New"] = "new";
})(DiscardPolicy || (exports.DiscardPolicy = DiscardPolicy = {}));
var StorageType;
(function (StorageType) {
    /**
     * Store persistently on files
     */
    StorageType["File"] = "file";
    /**
     * Store in server memory - doesn't survive server restarts
     */
    StorageType["Memory"] = "memory";
})(StorageType || (exports.StorageType = StorageType = {}));
var DeliverPolicy;
(function (DeliverPolicy) {
    /**
     * Deliver all messages
     */
    DeliverPolicy["All"] = "all";
    /**
     * Deliver starting with the last message
     */
    DeliverPolicy["Last"] = "last";
    /**
     * Deliver starting with new messages
     */
    DeliverPolicy["New"] = "new";
    /**
     * Deliver starting with the specified sequence
     */
    DeliverPolicy["StartSequence"] = "by_start_sequence";
    /**
     * Deliver starting with the specified time
     */
    DeliverPolicy["StartTime"] = "by_start_time";
    /**
     * Deliver starting with the last messages for every subject
     */
    DeliverPolicy["LastPerSubject"] = "last_per_subject";
})(DeliverPolicy || (exports.DeliverPolicy = DeliverPolicy = {}));
var AckPolicy;
(function (AckPolicy) {
    /**
     * Messages don't need to be Ack'ed.
     */
    AckPolicy["None"] = "none";
    /**
     * Ack, acknowledges all messages with a lower sequence
     */
    AckPolicy["All"] = "all";
    /**
     * All sequences must be explicitly acknowledged
     */
    AckPolicy["Explicit"] = "explicit";
    /**
     * @ignore
     */
    AckPolicy["NotSet"] = "";
})(AckPolicy || (exports.AckPolicy = AckPolicy = {}));
var ReplayPolicy;
(function (ReplayPolicy) {
    /**
     * Replays messages as fast as possible
     */
    ReplayPolicy["Instant"] = "instant";
    /**
     * Replays messages following the original delay between messages
     */
    ReplayPolicy["Original"] = "original";
})(ReplayPolicy || (exports.ReplayPolicy = ReplayPolicy = {}));
var StoreCompression;
(function (StoreCompression) {
    /**
     * No compression
     */
    StoreCompression["None"] = "none";
    /**
     * S2 compression
     */
    StoreCompression["S2"] = "s2";
})(StoreCompression || (exports.StoreCompression = StoreCompression = {}));
var ConsumerApiAction;
(function (ConsumerApiAction) {
    ConsumerApiAction["CreateOrUpdate"] = "";
    ConsumerApiAction["Update"] = "update";
    ConsumerApiAction["Create"] = "create";
})(ConsumerApiAction || (exports.ConsumerApiAction = ConsumerApiAction = {}));
function defaultConsumer(name, opts = {}) {
    return Object.assign({
        name: name,
        deliver_policy: DeliverPolicy.All,
        ack_policy: AckPolicy.Explicit,
        ack_wait: (0, jsutil_1.nanos)(30 * 1000),
        replay_policy: ReplayPolicy.Instant,
    }, opts);
}
exports.defaultConsumer = defaultConsumer;
//# sourceMappingURL=jsapi_types.js.map

/***/ }),

/***/ 7444:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseApiClient = exports.defaultJsOptions = void 0;
const encoders_1 = __nccwpck_require__(5450);
const codec_1 = __nccwpck_require__(2524);
const util_1 = __nccwpck_require__(4812);
const jsutil_1 = __nccwpck_require__(1186);
const defaultPrefix = "$JS.API";
const defaultTimeout = 5000;
function defaultJsOptions(opts) {
    opts = opts || {};
    if (opts.domain) {
        opts.apiPrefix = `$JS.${opts.domain}.API`;
        delete opts.domain;
    }
    return (0, util_1.extend)({ apiPrefix: defaultPrefix, timeout: defaultTimeout }, opts);
}
exports.defaultJsOptions = defaultJsOptions;
class BaseApiClient {
    constructor(nc, opts) {
        this.nc = nc;
        this.opts = defaultJsOptions(opts);
        this._parseOpts();
        this.prefix = this.opts.apiPrefix;
        this.timeout = this.opts.timeout;
        this.jc = (0, codec_1.JSONCodec)();
    }
    getOptions() {
        return Object.assign({}, this.opts);
    }
    _parseOpts() {
        let prefix = this.opts.apiPrefix;
        if (!prefix || prefix.length === 0) {
            throw new Error("invalid empty prefix");
        }
        const c = prefix[prefix.length - 1];
        if (c === ".") {
            prefix = prefix.substr(0, prefix.length - 1);
        }
        this.opts.apiPrefix = prefix;
    }
    _request(subj, data = null, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts = opts || {};
            opts.timeout = this.timeout;
            let a = encoders_1.Empty;
            if (data) {
                a = this.jc.encode(data);
            }
            const m = yield this.nc.request(subj, a, opts);
            return this.parseJsResponse(m);
        });
    }
    findStream(subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = { subject };
            const r = yield this._request(`${this.prefix}.STREAM.NAMES`, q);
            const names = r;
            if (!names.streams || names.streams.length !== 1) {
                throw new Error("no stream matches subject");
            }
            return names.streams[0];
        });
    }
    getConnection() {
        return this.nc;
    }
    parseJsResponse(m) {
        const v = this.jc.decode(m.data);
        const r = v;
        if (r.error) {
            const err = (0, jsutil_1.checkJsErrorCode)(r.error.code, r.error.description);
            if (err !== null) {
                err.api_error = r.error;
                throw err;
            }
        }
        return v;
    }
}
exports.BaseApiClient = BaseApiClient;
//# sourceMappingURL=jsbaseclient_api.js.map

/***/ }),

/***/ 3101:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2022-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JetStreamSubscriptionImpl = exports.JetStreamClientImpl = exports.PubHeaders = void 0;
const types_1 = __nccwpck_require__(3829);
const jsbaseclient_api_1 = __nccwpck_require__(7444);
const jsutil_1 = __nccwpck_require__(1186);
const jsmconsumer_api_1 = __nccwpck_require__(2730);
const jsmsg_1 = __nccwpck_require__(2188);
const typedsub_1 = __nccwpck_require__(5916);
const queued_iterator_1 = __nccwpck_require__(8450);
const util_1 = __nccwpck_require__(4812);
const headers_1 = __nccwpck_require__(24);
const kv_1 = __nccwpck_require__(7249);
const semver_1 = __nccwpck_require__(6511);
const objectstore_1 = __nccwpck_require__(6636);
const idleheartbeat_1 = __nccwpck_require__(2529);
const jsmstream_api_1 = __nccwpck_require__(1287);
const types_2 = __nccwpck_require__(165);
const core_1 = __nccwpck_require__(9498);
const jsapi_types_1 = __nccwpck_require__(4399);
var PubHeaders;
(function (PubHeaders) {
    PubHeaders["MsgIdHdr"] = "Nats-Msg-Id";
    PubHeaders["ExpectedStreamHdr"] = "Nats-Expected-Stream";
    PubHeaders["ExpectedLastSeqHdr"] = "Nats-Expected-Last-Sequence";
    PubHeaders["ExpectedLastMsgIdHdr"] = "Nats-Expected-Last-Msg-Id";
    PubHeaders["ExpectedLastSubjectSequenceHdr"] = "Nats-Expected-Last-Subject-Sequence";
})(PubHeaders || (exports.PubHeaders = PubHeaders = {}));
class ViewsImpl {
    constructor(js) {
        this.js = js;
    }
    kv(name, opts = {}) {
        const jsi = this.js;
        const { ok, min } = jsi.nc.features.get(semver_1.Feature.JS_KV);
        if (!ok) {
            return Promise.reject(new Error(`kv is only supported on servers ${min} or better`));
        }
        if (opts.bindOnly) {
            return kv_1.Bucket.bind(this.js, name);
        }
        return kv_1.Bucket.create(this.js, name, opts);
    }
    os(name, opts = {}) {
        var _a;
        if (typeof ((_a = crypto === null || crypto === void 0 ? void 0 : crypto.subtle) === null || _a === void 0 ? void 0 : _a.digest) !== "function") {
            return Promise.reject(new Error("objectstore: unable to calculate hashes - crypto.subtle.digest with sha256 support is required"));
        }
        const jsi = this.js;
        const { ok, min } = jsi.nc.features.get(semver_1.Feature.JS_OBJECTSTORE);
        if (!ok) {
            return Promise.reject(new Error(`objectstore is only supported on servers ${min} or better`));
        }
        return objectstore_1.ObjectStoreImpl.create(this.js, name, opts);
    }
}
class JetStreamClientImpl extends jsbaseclient_api_1.BaseApiClient {
    constructor(nc, opts) {
        super(nc, opts);
        this.consumerAPI = new jsmconsumer_api_1.ConsumerAPIImpl(nc, opts);
        this.streamAPI = new jsmstream_api_1.StreamAPIImpl(nc, opts);
        this.consumers = new jsmstream_api_1.ConsumersImpl(this.consumerAPI);
        this.streams = new jsmstream_api_1.StreamsImpl(this.streamAPI);
    }
    jetstreamManager() {
        return this.nc.jetstreamManager(this.opts);
    }
    get apiPrefix() {
        return this.prefix;
    }
    get views() {
        return new ViewsImpl(this);
    }
    publish(subj, data = types_1.Empty, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts = opts || {};
            opts.expect = opts.expect || {};
            const mh = (opts === null || opts === void 0 ? void 0 : opts.headers) || (0, headers_1.headers)();
            if (opts) {
                if (opts.msgID) {
                    mh.set(PubHeaders.MsgIdHdr, opts.msgID);
                }
                if (opts.expect.lastMsgID) {
                    mh.set(PubHeaders.ExpectedLastMsgIdHdr, opts.expect.lastMsgID);
                }
                if (opts.expect.streamName) {
                    mh.set(PubHeaders.ExpectedStreamHdr, opts.expect.streamName);
                }
                if (typeof opts.expect.lastSequence === "number") {
                    mh.set(PubHeaders.ExpectedLastSeqHdr, `${opts.expect.lastSequence}`);
                }
                if (typeof opts.expect.lastSubjectSequence === "number") {
                    mh.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.expect.lastSubjectSequence}`);
                }
            }
            const to = opts.timeout || this.timeout;
            const ro = {};
            if (to) {
                ro.timeout = to;
            }
            if (opts) {
                ro.headers = mh;
            }
            let { retries, retry_delay } = opts;
            retries = retries || 1;
            retry_delay = retry_delay || 250;
            let r;
            for (let i = 0; i < retries; i++) {
                try {
                    r = yield this.nc.request(subj, data, ro);
                    // if here we succeeded
                    break;
                }
                catch (err) {
                    const ne = err;
                    if (ne.code === "503" && i + 1 < retries) {
                        yield (0, util_1.delay)(retry_delay);
                    }
                    else {
                        throw err;
                    }
                }
            }
            const pa = this.parseJsResponse(r);
            if (pa.stream === "") {
                throw types_1.NatsError.errorForCode(core_1.ErrorCode.JetStreamInvalidAck);
            }
            pa.duplicate = pa.duplicate ? pa.duplicate : false;
            return pa;
        });
    }
    pull(stream, durable, expires = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            (0, jsutil_1.validateDurableName)(durable);
            let timeout = this.timeout;
            if (expires > timeout) {
                timeout = expires;
            }
            expires = expires < 0 ? 0 : (0, jsutil_1.nanos)(expires);
            const pullOpts = {
                batch: 1,
                no_wait: expires === 0,
                expires,
            };
            const msg = yield this.nc.request(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode(pullOpts), { noMux: true, timeout });
            const err = (0, jsutil_1.checkJsError)(msg);
            if (err) {
                throw err;
            }
            return (0, jsmsg_1.toJsMsg)(msg);
        });
    }
    /*
     * Returns available messages upto specified batch count.
     * If expires is set the iterator will wait for the specified
     * amount of millis before closing the subscription.
     * If no_wait is specified, the iterator will return no messages.
     * @param stream
     * @param durable
     * @param opts
     */
    fetch(stream, durable, opts = {}) {
        var _a;
        (0, jsutil_1.validateStreamName)(stream);
        (0, jsutil_1.validateDurableName)(durable);
        let timer = null;
        const trackBytes = ((_a = opts.max_bytes) !== null && _a !== void 0 ? _a : 0) > 0;
        let receivedBytes = 0;
        const max_bytes = trackBytes ? opts.max_bytes : 0;
        let monitor = null;
        const args = {};
        args.batch = opts.batch || 1;
        if (max_bytes) {
            const fv = this.nc.features.get(semver_1.Feature.JS_PULL_MAX_BYTES);
            if (!fv.ok) {
                throw new Error(`max_bytes is only supported on servers ${fv.min} or better`);
            }
            args.max_bytes = max_bytes;
        }
        args.no_wait = opts.no_wait || false;
        if (args.no_wait && args.expires) {
            args.expires = 0;
        }
        const expires = opts.expires || 0;
        if (expires) {
            args.expires = (0, jsutil_1.nanos)(expires);
        }
        if (expires === 0 && args.no_wait === false) {
            throw new Error("expires or no_wait is required");
        }
        const hb = opts.idle_heartbeat || 0;
        if (hb) {
            args.idle_heartbeat = (0, jsutil_1.nanos)(hb);
            //@ts-ignore: for testing
            if (opts.delay_heartbeat === true) {
                //@ts-ignore: test option
                args.idle_heartbeat = (0, jsutil_1.nanos)(hb * 4);
            }
        }
        const qi = new queued_iterator_1.QueuedIteratorImpl();
        const wants = args.batch;
        let received = 0;
        qi.protocolFilterFn = (jm, _ingest = false) => {
            const jsmi = jm;
            if ((0, jsutil_1.isHeartbeatMsg)(jsmi.msg)) {
                monitor === null || monitor === void 0 ? void 0 : monitor.work();
                return false;
            }
            return true;
        };
        // FIXME: this looks weird, we want to stop the iterator
        //   but doing it from a dispatchedFn...
        qi.dispatchedFn = (m) => {
            if (m) {
                if (trackBytes) {
                    receivedBytes += m.data.length;
                }
                received++;
                if (timer && m.info.pending === 0) {
                    // the expiration will close it
                    return;
                }
                // if we have one pending and we got the expected
                // or there are no more stop the iterator
                if (qi.getPending() === 1 && m.info.pending === 0 || wants === received ||
                    (max_bytes > 0 && receivedBytes >= max_bytes)) {
                    qi.stop();
                }
            }
        };
        const inbox = (0, core_1.createInbox)(this.nc.options.inboxPrefix);
        const sub = this.nc.subscribe(inbox, {
            max: opts.batch,
            callback: (err, msg) => {
                if (err === null) {
                    err = (0, jsutil_1.checkJsError)(msg);
                }
                if (err !== null) {
                    if (timer) {
                        timer.cancel();
                        timer = null;
                    }
                    if ((0, core_1.isNatsError)(err)) {
                        qi.stop(hideNonTerminalJsErrors(err) === null ? undefined : err);
                    }
                    else {
                        qi.stop(err);
                    }
                }
                else {
                    // if we are doing heartbeats, message resets
                    monitor === null || monitor === void 0 ? void 0 : monitor.work();
                    qi.received++;
                    qi.push((0, jsmsg_1.toJsMsg)(msg));
                }
            },
        });
        // timer on the client  the issue is that the request
        // is started on the client, which means that it will expire
        // on the client first
        if (expires) {
            timer = (0, util_1.timeout)(expires);
            timer.catch(() => {
                if (!sub.isClosed()) {
                    sub.drain()
                        .catch(() => { });
                    timer = null;
                }
                if (monitor) {
                    monitor.cancel();
                }
            });
        }
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                if (hb) {
                    monitor = new idleheartbeat_1.IdleHeartbeat(hb, (v) => {
                        //@ts-ignore: pushing a fn
                        qi.push(() => {
                            // this will terminate the iterator
                            qi.err = new types_1.NatsError(`${jsutil_1.Js409Errors.IdleHeartbeatMissed}: ${v}`, core_1.ErrorCode.JetStreamIdleHeartBeat);
                        });
                        return true;
                    });
                }
            }
            catch (_err) {
                // ignore it
            }
            // close the iterator if the connection or subscription closes unexpectedly
            yield sub.closed;
            if (timer !== null) {
                timer.cancel();
                timer = null;
            }
            if (monitor) {
                monitor.cancel();
            }
            qi.stop();
        }))().catch();
        this.nc.publish(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode(args), { reply: inbox });
        return qi;
    }
    pullSubscribe(subject, opts = (0, types_2.consumerOpts)()) {
        return __awaiter(this, void 0, void 0, function* () {
            const cso = yield this._processOptions(subject, opts);
            if (cso.ordered) {
                throw new Error("pull subscribers cannot be be ordered");
            }
            if (cso.config.deliver_subject) {
                throw new Error("consumer info specifies deliver_subject - pull consumers cannot have deliver_subject set");
            }
            const ackPolicy = cso.config.ack_policy;
            if (ackPolicy === jsapi_types_1.AckPolicy.None || ackPolicy === jsapi_types_1.AckPolicy.All) {
                throw new Error("ack policy for pull consumers must be explicit");
            }
            const so = this._buildTypedSubscriptionOpts(cso);
            const sub = new JetStreamPullSubscriptionImpl(this, cso.deliver, so);
            sub.info = cso;
            try {
                yield this._maybeCreateConsumer(cso);
            }
            catch (err) {
                sub.unsubscribe();
                throw err;
            }
            return sub;
        });
    }
    subscribe(subject, opts = (0, types_2.consumerOpts)()) {
        return __awaiter(this, void 0, void 0, function* () {
            const cso = yield this._processOptions(subject, opts);
            // this effectively requires deliver subject to be specified
            // as an option otherwise we have a pull consumer
            if (!cso.isBind && !cso.config.deliver_subject) {
                throw new Error("push consumer requires deliver_subject");
            }
            const so = this._buildTypedSubscriptionOpts(cso);
            const sub = new JetStreamSubscriptionImpl(this, cso.deliver, so);
            sub.info = cso;
            try {
                yield this._maybeCreateConsumer(cso);
            }
            catch (err) {
                sub.unsubscribe();
                throw err;
            }
            sub._maybeSetupHbMonitoring();
            return sub;
        });
    }
    _processOptions(subject, opts = (0, types_2.consumerOpts)()) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const jsi = ((0, types_2.isConsumerOptsBuilder)(opts)
                ? opts.getOpts()
                : opts);
            jsi.isBind = (0, types_2.isConsumerOptsBuilder)(opts) ? opts.isBind : false;
            jsi.flow_control = {
                heartbeat_count: 0,
                fc_count: 0,
                consumer_restarts: 0,
            };
            if (jsi.ordered) {
                jsi.ordered_consumer_sequence = { stream_seq: 0, delivery_seq: 0 };
                if (jsi.config.ack_policy !== jsapi_types_1.AckPolicy.NotSet &&
                    jsi.config.ack_policy !== jsapi_types_1.AckPolicy.None) {
                    throw new types_1.NatsError("ordered consumer: ack_policy can only be set to 'none'", core_1.ErrorCode.ApiError);
                }
                if (jsi.config.durable_name && jsi.config.durable_name.length > 0) {
                    throw new types_1.NatsError("ordered consumer: durable_name cannot be set", core_1.ErrorCode.ApiError);
                }
                if (jsi.config.deliver_subject && jsi.config.deliver_subject.length > 0) {
                    throw new types_1.NatsError("ordered consumer: deliver_subject cannot be set", core_1.ErrorCode.ApiError);
                }
                if (jsi.config.max_deliver !== undefined && jsi.config.max_deliver > 1) {
                    throw new types_1.NatsError("ordered consumer: max_deliver cannot be set", core_1.ErrorCode.ApiError);
                }
                if (jsi.config.deliver_group && jsi.config.deliver_group.length > 0) {
                    throw new types_1.NatsError("ordered consumer: deliver_group cannot be set", core_1.ErrorCode.ApiError);
                }
                jsi.config.deliver_subject = (0, core_1.createInbox)(this.nc.options.inboxPrefix);
                jsi.config.ack_policy = jsapi_types_1.AckPolicy.None;
                jsi.config.max_deliver = 1;
                jsi.config.flow_control = true;
                jsi.config.idle_heartbeat = jsi.config.idle_heartbeat || (0, jsutil_1.nanos)(5000);
                jsi.config.ack_wait = (0, jsutil_1.nanos)(22 * 60 * 60 * 1000);
                jsi.config.mem_storage = true;
                jsi.config.num_replicas = 1;
            }
            if (jsi.config.ack_policy === jsapi_types_1.AckPolicy.NotSet) {
                jsi.config.ack_policy = jsapi_types_1.AckPolicy.All;
            }
            jsi.api = this;
            jsi.config = jsi.config || {};
            jsi.stream = jsi.stream ? jsi.stream : yield this.findStream(subject);
            jsi.attached = false;
            if (jsi.config.durable_name) {
                try {
                    const info = yield this.consumerAPI.info(jsi.stream, jsi.config.durable_name);
                    if (info) {
                        if (info.config.filter_subject && info.config.filter_subject !== subject) {
                            throw new Error("subject does not match consumer");
                        }
                        // check if server returned push_bound, but there's no qn
                        const qn = (_a = jsi.config.deliver_group) !== null && _a !== void 0 ? _a : "";
                        if (qn === "" && info.push_bound === true) {
                            throw new Error(`duplicate subscription`);
                        }
                        const rqn = (_b = info.config.deliver_group) !== null && _b !== void 0 ? _b : "";
                        if (qn !== rqn) {
                            if (rqn === "") {
                                throw new Error(`durable requires no queue group`);
                            }
                            else {
                                throw new Error(`durable requires queue group '${rqn}'`);
                            }
                        }
                        jsi.last = info;
                        jsi.config = info.config;
                        jsi.attached = true;
                        // if not a durable capture the name of the ephemeral so
                        // that consumerInfo from the sub will work
                        if (!jsi.config.durable_name) {
                            jsi.name = info.name;
                        }
                    }
                }
                catch (err) {
                    //consumer doesn't exist
                    if (err.code !== "404") {
                        throw err;
                    }
                }
            }
            if (!jsi.attached && jsi.config.filter_subject === undefined &&
                jsi.config.filter_subjects === undefined) {
                // if no filter specified, we set the subject as the filter
                jsi.config.filter_subject = subject;
            }
            jsi.deliver = jsi.config.deliver_subject ||
                (0, core_1.createInbox)(this.nc.options.inboxPrefix);
            return jsi;
        });
    }
    _buildTypedSubscriptionOpts(jsi) {
        const so = {};
        so.adapter = msgAdapter(jsi.callbackFn === undefined);
        so.ingestionFilterFn = JetStreamClientImpl.ingestionFn(jsi.ordered);
        so.protocolFilterFn = (jm, ingest = false) => {
            const jsmi = jm;
            if ((0, jsutil_1.isFlowControlMsg)(jsmi.msg)) {
                if (!ingest) {
                    jsmi.msg.respond();
                }
                return false;
            }
            return true;
        };
        if (!jsi.mack && jsi.config.ack_policy !== jsapi_types_1.AckPolicy.None) {
            so.dispatchedFn = autoAckJsMsg;
        }
        if (jsi.callbackFn) {
            so.callback = jsi.callbackFn;
        }
        so.max = jsi.max || 0;
        so.queue = jsi.queue;
        return so;
    }
    _maybeCreateConsumer(jsi) {
        return __awaiter(this, void 0, void 0, function* () {
            if (jsi.attached) {
                return;
            }
            if (jsi.isBind) {
                throw new Error(`unable to bind - durable consumer ${jsi.config.durable_name} doesn't exist in ${jsi.stream}`);
            }
            jsi.config = Object.assign({
                deliver_policy: jsapi_types_1.DeliverPolicy.All,
                ack_policy: jsapi_types_1.AckPolicy.Explicit,
                ack_wait: (0, jsutil_1.nanos)(30 * 1000),
                replay_policy: jsapi_types_1.ReplayPolicy.Instant,
            }, jsi.config);
            const ci = yield this.consumerAPI.add(jsi.stream, jsi.config);
            if (Array.isArray(jsi.config.filter_subjects && !Array.isArray(ci.config.filter_subjects))) {
                // server didn't honor `filter_subjects`
                throw new Error(`jetstream server doesn't support consumers with multiple filter subjects`);
            }
            jsi.name = ci.name;
            jsi.config = ci.config;
            jsi.last = ci;
        });
    }
    static ingestionFn(ordered) {
        return (jm, ctx) => {
            var _a;
            // ctx is expected to be the iterator (the JetstreamSubscriptionImpl)
            const jsub = ctx;
            // this shouldn't happen
            if (!jm)
                return { ingest: false, protocol: false };
            const jmi = jm;
            if (!(0, jsutil_1.checkJsError)(jmi.msg)) {
                (_a = jsub.monitor) === null || _a === void 0 ? void 0 : _a.work();
            }
            if ((0, jsutil_1.isHeartbeatMsg)(jmi.msg)) {
                const ingest = ordered ? jsub._checkHbOrderConsumer(jmi.msg) : true;
                if (!ordered) {
                    jsub.info.flow_control.heartbeat_count++;
                }
                return { ingest, protocol: true };
            }
            else if ((0, jsutil_1.isFlowControlMsg)(jmi.msg)) {
                jsub.info.flow_control.fc_count++;
                return { ingest: true, protocol: true };
            }
            const ingest = ordered ? jsub._checkOrderedConsumer(jm) : true;
            return { ingest, protocol: false };
        };
    }
}
exports.JetStreamClientImpl = JetStreamClientImpl;
class JetStreamSubscriptionImpl extends typedsub_1.TypedSubscription {
    constructor(js, subject, opts) {
        super(js.nc, subject, opts);
        this.js = js;
        this.monitor = null;
        this.sub.closed.then(() => {
            if (this.monitor) {
                this.monitor.cancel();
            }
        });
    }
    set info(info) {
        this.sub.info = info;
    }
    get info() {
        return this.sub.info;
    }
    _resetOrderedConsumer(sseq) {
        if (this.info === null || this.sub.isClosed()) {
            return;
        }
        const newDeliver = (0, core_1.createInbox)(this.js.nc.options.inboxPrefix);
        const nci = this.js.nc;
        nci._resub(this.sub, newDeliver);
        const info = this.info;
        info.ordered_consumer_sequence.delivery_seq = 0;
        info.flow_control.heartbeat_count = 0;
        info.flow_control.fc_count = 0;
        info.flow_control.consumer_restarts++;
        info.deliver = newDeliver;
        info.config.deliver_subject = newDeliver;
        info.config.deliver_policy = jsapi_types_1.DeliverPolicy.StartSequence;
        info.config.opt_start_seq = sseq;
        // put the stream name
        const req = {};
        req.stream_name = this.info.stream;
        req.config = info.config;
        const subj = `${info.api.prefix}.CONSUMER.CREATE.${info.stream}`;
        this.js._request(subj, req)
            .then((v) => {
            const ci = v;
            this.info.config = ci.config;
            this.info.name = ci.name;
        })
            .catch((err) => {
            // to inform the subscription we inject an error this will
            // be at after the last message if using an iterator.
            const nerr = new types_1.NatsError(`unable to recreate ordered consumer ${info.stream} at seq ${sseq}`, core_1.ErrorCode.RequestError, err);
            this.sub.callback(nerr, {});
        });
    }
    // this is called by push subscriptions, to initialize the monitoring
    // if configured on the consumer
    _maybeSetupHbMonitoring() {
        var _a, _b;
        const ns = ((_b = (_a = this.info) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.idle_heartbeat) || 0;
        if (ns) {
            this._setupHbMonitoring((0, jsutil_1.millis)(ns));
        }
    }
    _setupHbMonitoring(millis, cancelAfter = 0) {
        const opts = { cancelAfter: 0, maxOut: 2 };
        if (cancelAfter) {
            opts.cancelAfter = cancelAfter;
        }
        const sub = this.sub;
        const handler = (v) => {
            var _a, _b, _c;
            const msg = (0, jsutil_1.newJsErrorMsg)(409, `${jsutil_1.Js409Errors.IdleHeartbeatMissed}: ${v}`, this.sub.subject);
            const ordered = (_a = this.info) === null || _a === void 0 ? void 0 : _a.ordered;
            // non-ordered consumers are always notified of the condition
            // as they need to try and recover
            if (!ordered) {
                this.sub.callback(null, msg);
            }
            else {
                if (!this.js.nc.protocol.connected) {
                    // we are not connected don't do anything
                    return false;
                }
                // reset the consumer
                const seq = ((_c = (_b = this.info) === null || _b === void 0 ? void 0 : _b.ordered_consumer_sequence) === null || _c === void 0 ? void 0 : _c.stream_seq) || 0;
                this._resetOrderedConsumer(seq + 1);
                // if we are ordered, we will reset the consumer and keep
                // feeding the iterator or callback - we are not stopping
                return false;
            }
            // let the hb monitor know if we are stopping for callbacks
            // we don't as we deliver the errors via the cb.
            return !sub.noIterator;
        };
        // this only applies for push subscriptions
        this.monitor = new idleheartbeat_1.IdleHeartbeat(millis, handler, opts);
    }
    _checkHbOrderConsumer(msg) {
        const rm = msg.headers.get(types_2.JsHeaders.ConsumerStalledHdr);
        if (rm !== "") {
            const nci = this.js.nc;
            nci.publish(rm);
        }
        const lastDelivered = parseInt(msg.headers.get(types_2.JsHeaders.LastConsumerSeqHdr), 10);
        const ordered = this.info.ordered_consumer_sequence;
        this.info.flow_control.heartbeat_count++;
        if (lastDelivered !== ordered.delivery_seq) {
            this._resetOrderedConsumer(ordered.stream_seq + 1);
        }
        return false;
    }
    _checkOrderedConsumer(jm) {
        const ordered = this.info.ordered_consumer_sequence;
        const sseq = jm.info.streamSequence;
        const dseq = jm.info.deliverySequence;
        if (dseq != ordered.delivery_seq + 1) {
            this._resetOrderedConsumer(ordered.stream_seq + 1);
            return false;
        }
        ordered.delivery_seq = dseq;
        ordered.stream_seq = sseq;
        return true;
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isClosed()) {
                yield this.drain();
            }
            const jinfo = this.sub.info;
            const name = jinfo.config.durable_name || jinfo.name;
            const subj = `${jinfo.api.prefix}.CONSUMER.DELETE.${jinfo.stream}.${name}`;
            yield jinfo.api._request(subj);
        });
    }
    consumerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const jinfo = this.sub.info;
            const name = jinfo.config.durable_name || jinfo.name;
            const subj = `${jinfo.api.prefix}.CONSUMER.INFO.${jinfo.stream}.${name}`;
            const ci = yield jinfo.api._request(subj);
            jinfo.last = ci;
            return ci;
        });
    }
}
exports.JetStreamSubscriptionImpl = JetStreamSubscriptionImpl;
class JetStreamPullSubscriptionImpl extends JetStreamSubscriptionImpl {
    constructor(js, subject, opts) {
        super(js, subject, opts);
    }
    pull(opts = { batch: 1 }) {
        var _a, _b;
        const { stream, config, name } = this.sub.info;
        const consumer = (_a = config.durable_name) !== null && _a !== void 0 ? _a : name;
        const args = {};
        args.batch = opts.batch || 1;
        args.no_wait = opts.no_wait || false;
        if (((_b = opts.max_bytes) !== null && _b !== void 0 ? _b : 0) > 0) {
            const fv = this.js.nc.features.get(semver_1.Feature.JS_PULL_MAX_BYTES);
            if (!fv.ok) {
                throw new Error(`max_bytes is only supported on servers ${fv.min} or better`);
            }
            args.max_bytes = opts.max_bytes;
        }
        let expires = 0;
        if (opts.expires && opts.expires > 0) {
            expires = opts.expires;
            args.expires = (0, jsutil_1.nanos)(expires);
        }
        let hb = 0;
        if (opts.idle_heartbeat && opts.idle_heartbeat > 0) {
            hb = opts.idle_heartbeat;
            args.idle_heartbeat = (0, jsutil_1.nanos)(hb);
        }
        if (hb && expires === 0) {
            throw new Error("idle_heartbeat requires expires");
        }
        if (hb > expires) {
            throw new Error("expires must be greater than idle_heartbeat");
        }
        if (this.info) {
            if (this.monitor) {
                this.monitor.cancel();
            }
            if (expires && hb) {
                if (!this.monitor) {
                    this._setupHbMonitoring(hb, expires);
                }
                else {
                    this.monitor._change(hb, expires);
                }
            }
            const api = this.info.api;
            const subj = `${api.prefix}.CONSUMER.MSG.NEXT.${stream}.${consumer}`;
            const reply = this.sub.subject;
            api.nc.publish(subj, api.jc.encode(args), { reply: reply });
        }
    }
}
function msgAdapter(iterator) {
    if (iterator) {
        return iterMsgAdapter;
    }
    else {
        return cbMsgAdapter;
    }
}
function cbMsgAdapter(err, msg) {
    if (err) {
        return [err, null];
    }
    err = (0, jsutil_1.checkJsError)(msg);
    if (err) {
        return [err, null];
    }
    // assuming that the protocolFilterFn is set!
    return [null, (0, jsmsg_1.toJsMsg)(msg)];
}
function iterMsgAdapter(err, msg) {
    if (err) {
        return [err, null];
    }
    // iterator will close if we have an error
    // check for errors that shouldn't close it
    const ne = (0, jsutil_1.checkJsError)(msg);
    if (ne !== null) {
        return [hideNonTerminalJsErrors(ne), null];
    }
    // assuming that the protocolFilterFn is set
    return [null, (0, jsmsg_1.toJsMsg)(msg)];
}
function hideNonTerminalJsErrors(ne) {
    if (ne !== null) {
        switch (ne.code) {
            case core_1.ErrorCode.JetStream404NoMessages:
            case core_1.ErrorCode.JetStream408RequestTimeout:
                return null;
            case core_1.ErrorCode.JetStream409:
                if ((0, jsutil_1.isTerminal409)(ne)) {
                    return ne;
                }
                return null;
            default:
                return ne;
        }
    }
    return null;
}
function autoAckJsMsg(data) {
    if (data) {
        data.ack();
    }
}
//# sourceMappingURL=jsclient.js.map

/***/ }),

/***/ 8406:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListerImpl = void 0;
class ListerImpl {
    constructor(subject, filter, jsm, payload) {
        if (!subject) {
            throw new Error("subject is required");
        }
        this.subject = subject;
        this.jsm = jsm;
        this.offset = 0;
        this.pageInfo = {};
        this.filter = filter;
        this.payload = payload || {};
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.err) {
                return [];
            }
            if (this.pageInfo && this.offset >= this.pageInfo.total) {
                return [];
            }
            const offset = { offset: this.offset };
            if (this.payload) {
                Object.assign(offset, this.payload);
            }
            try {
                const r = yield this.jsm._request(this.subject, offset, { timeout: this.jsm.timeout });
                this.pageInfo = r;
                // offsets are reported in total, so need to count
                // all the entries returned
                this.offset += this.countResponse(r);
                const a = this.filter(r);
                return a;
            }
            catch (err) {
                this.err = err;
                throw err;
            }
        });
    }
    countResponse(r) {
        var _a;
        switch (r === null || r === void 0 ? void 0 : r.type) {
            case "io.nats.jetstream.api.v1.stream_names_response":
            case "io.nats.jetstream.api.v1.stream_list_response":
                return r.streams.length;
            case "io.nats.jetstream.api.v1.consumer_list_response":
                return r.consumers.length;
            default:
                console.error(`jslister.ts: unknown API response for paged output: ${r === null || r === void 0 ? void 0 : r.type}`);
                // has to be a stream...
                return ((_a = r.streams) === null || _a === void 0 ? void 0 : _a.length) || 0;
        }
        return 0;
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            let page = yield __await(this.next());
            while (page.length > 0) {
                for (const item of page) {
                    yield yield __await(item);
                }
                page = yield __await(this.next());
            }
        });
    }
}
exports.ListerImpl = ListerImpl;
//# sourceMappingURL=jslister.js.map

/***/ }),

/***/ 6254:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JetStreamManagerImpl = exports.DirectMsgImpl = exports.DirectStreamAPIImpl = void 0;
const jsbaseclient_api_1 = __nccwpck_require__(7444);
const jsmstream_api_1 = __nccwpck_require__(1287);
const jsmconsumer_api_1 = __nccwpck_require__(2730);
const queued_iterator_1 = __nccwpck_require__(8450);
const types_1 = __nccwpck_require__(165);
const jsutil_1 = __nccwpck_require__(1186);
const encoders_1 = __nccwpck_require__(5450);
const codec_1 = __nccwpck_require__(2524);
class DirectStreamAPIImpl extends jsbaseclient_api_1.BaseApiClient {
    constructor(nc, opts) {
        super(nc, opts);
    }
    getMessage(stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            // if doing a last_by_subj request, we append the subject
            // this allows last_by_subj to be subject to permissions (KV)
            let qq = query;
            const { last_by_subj } = qq;
            if (last_by_subj) {
                qq = null;
            }
            const payload = qq ? this.jc.encode(qq) : encoders_1.Empty;
            const pre = this.opts.apiPrefix || "$JS.API";
            const subj = last_by_subj
                ? `${pre}.DIRECT.GET.${stream}.${last_by_subj}`
                : `${pre}.DIRECT.GET.${stream}`;
            const r = yield this.nc.request(subj, payload);
            // response is not a JS.API response
            const err = (0, jsutil_1.checkJsError)(r);
            if (err) {
                return Promise.reject(err);
            }
            const dm = new DirectMsgImpl(r);
            return Promise.resolve(dm);
        });
    }
}
exports.DirectStreamAPIImpl = DirectStreamAPIImpl;
class DirectMsgImpl {
    constructor(m) {
        if (!m.headers) {
            throw new Error("headers expected");
        }
        this.data = m.data;
        this.header = m.headers;
    }
    get subject() {
        return this.header.get(types_1.DirectMsgHeaders.Subject);
    }
    get seq() {
        const v = this.header.get(types_1.DirectMsgHeaders.Sequence);
        return typeof v === "string" ? parseInt(v) : 0;
    }
    get time() {
        return new Date(Date.parse(this.timestamp));
    }
    get timestamp() {
        return this.header.get(types_1.DirectMsgHeaders.TimeStamp);
    }
    get stream() {
        return this.header.get(types_1.DirectMsgHeaders.Stream);
    }
    json(reviver) {
        return (0, codec_1.JSONCodec)(reviver).decode(this.data);
    }
    string() {
        return encoders_1.TD.decode(this.data);
    }
}
exports.DirectMsgImpl = DirectMsgImpl;
class JetStreamManagerImpl extends jsbaseclient_api_1.BaseApiClient {
    constructor(nc, opts) {
        super(nc, opts);
        this.streams = new jsmstream_api_1.StreamAPIImpl(nc, opts);
        this.consumers = new jsmconsumer_api_1.ConsumerAPIImpl(nc, opts);
        this.direct = new DirectStreamAPIImpl(nc, opts);
    }
    getAccountInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this._request(`${this.prefix}.INFO`);
            return r;
        });
    }
    jetstream() {
        return this.nc.jetstream(this.getOptions());
    }
    advisories() {
        const iter = new queued_iterator_1.QueuedIteratorImpl();
        this.nc.subscribe(`$JS.EVENT.ADVISORY.>`, {
            callback: (err, msg) => {
                if (err) {
                    throw err;
                }
                try {
                    const d = this.parseJsResponse(msg);
                    const chunks = d.type.split(".");
                    const kind = chunks[chunks.length - 1];
                    iter.push({ kind: kind, data: d });
                }
                catch (err) {
                    iter.stop(err);
                }
            },
        });
        return iter;
    }
}
exports.JetStreamManagerImpl = JetStreamManagerImpl;
//# sourceMappingURL=jsm.js.map

/***/ }),

/***/ 2730:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsumerAPIImpl = void 0;
/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const jsbaseclient_api_1 = __nccwpck_require__(7444);
const jslister_1 = __nccwpck_require__(8406);
const jsutil_1 = __nccwpck_require__(1186);
const semver_1 = __nccwpck_require__(6511);
const jsapi_types_1 = __nccwpck_require__(4399);
class ConsumerAPIImpl extends jsbaseclient_api_1.BaseApiClient {
    constructor(nc, opts) {
        super(nc, opts);
    }
    add(stream, cfg, action = jsapi_types_1.ConsumerApiAction.Create) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            if (cfg.deliver_group && cfg.flow_control) {
                throw new Error("jetstream flow control is not supported with queue groups");
            }
            if (cfg.deliver_group && cfg.idle_heartbeat) {
                throw new Error("jetstream idle heartbeat is not supported with queue groups");
            }
            const cr = {};
            cr.config = cfg;
            cr.stream_name = stream;
            cr.action = action;
            if (cr.config.durable_name) {
                (0, jsutil_1.validateDurableName)(cr.config.durable_name);
            }
            const nci = this.nc;
            let { min, ok: newAPI } = nci.features.get(semver_1.Feature.JS_NEW_CONSUMER_CREATE_API);
            const name = cfg.name === "" ? undefined : cfg.name;
            if (name && !newAPI) {
                throw new Error(`consumer 'name' requires server ${min}`);
            }
            if (name) {
                try {
                    (0, jsutil_1.minValidation)("name", name);
                }
                catch (err) {
                    // if we have a cannot contain the message, massage a bit
                    const m = err.message;
                    const idx = m.indexOf("cannot contain");
                    if (idx !== -1) {
                        throw new Error(`consumer 'name' ${m.substring(idx)}`);
                    }
                    throw err;
                }
            }
            let subj;
            let consumerName = "";
            // new api doesn't support multiple filter subjects
            // this delayed until here because the consumer in an update could have
            // been created with the new API, and have a `name`
            if (Array.isArray(cfg.filter_subjects)) {
                const { min, ok } = nci.features.get(semver_1.Feature.JS_MULTIPLE_CONSUMER_FILTER);
                if (!ok) {
                    throw new Error(`consumer 'filter_subjects' requires server ${min}`);
                }
                newAPI = false;
            }
            if (cfg.metadata) {
                const { min, ok } = nci.features.get(semver_1.Feature.JS_STREAM_CONSUMER_METADATA);
                if (!ok) {
                    throw new Error(`consumer 'metadata' requires server ${min}`);
                }
            }
            if (newAPI) {
                consumerName = (_b = (_a = cfg.name) !== null && _a !== void 0 ? _a : cfg.durable_name) !== null && _b !== void 0 ? _b : "";
            }
            if (consumerName !== "") {
                let fs = (_c = cfg.filter_subject) !== null && _c !== void 0 ? _c : undefined;
                if (fs === ">") {
                    fs = undefined;
                }
                subj = fs !== undefined
                    ? `${this.prefix}.CONSUMER.CREATE.${stream}.${consumerName}.${fs}`
                    : `${this.prefix}.CONSUMER.CREATE.${stream}.${consumerName}`;
            }
            else {
                subj = cfg.durable_name
                    ? `${this.prefix}.CONSUMER.DURABLE.CREATE.${stream}.${cfg.durable_name}`
                    : `${this.prefix}.CONSUMER.CREATE.${stream}`;
            }
            const r = yield this._request(subj, cr);
            return r;
        });
    }
    update(stream, durable, cfg) {
        return __awaiter(this, void 0, void 0, function* () {
            const ci = yield this.info(stream, durable);
            const changable = cfg;
            return this.add(stream, Object.assign(ci.config, changable), jsapi_types_1.ConsumerApiAction.Update);
        });
    }
    info(stream, name) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            (0, jsutil_1.validateDurableName)(name);
            const r = yield this._request(`${this.prefix}.CONSUMER.INFO.${stream}.${name}`);
            return r;
        });
    }
    delete(stream, name) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            (0, jsutil_1.validateDurableName)(name);
            const r = yield this._request(`${this.prefix}.CONSUMER.DELETE.${stream}.${name}`);
            const cr = r;
            return cr.success;
        });
    }
    list(stream) {
        (0, jsutil_1.validateStreamName)(stream);
        const filter = (v) => {
            const clr = v;
            return clr.consumers;
        };
        const subj = `${this.prefix}.CONSUMER.LIST.${stream}`;
        return new jslister_1.ListerImpl(subj, filter, this);
    }
}
exports.ConsumerAPIImpl = ConsumerAPIImpl;
//# sourceMappingURL=jsmconsumer_api.js.map

/***/ }),

/***/ 2188:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JsMsgImpl = exports.parseInfo = exports.toJsMsg = exports.ACK = void 0;
/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const databuffer_1 = __nccwpck_require__(2155);
const codec_1 = __nccwpck_require__(2524);
const request_1 = __nccwpck_require__(7008);
const jsutil_1 = __nccwpck_require__(1186);
exports.ACK = Uint8Array.of(43, 65, 67, 75);
const NAK = Uint8Array.of(45, 78, 65, 75);
const WPI = Uint8Array.of(43, 87, 80, 73);
const NXT = Uint8Array.of(43, 78, 88, 84);
const TERM = Uint8Array.of(43, 84, 69, 82, 77);
const SPACE = Uint8Array.of(32);
function toJsMsg(m) {
    return new JsMsgImpl(m);
}
exports.toJsMsg = toJsMsg;
function parseInfo(s) {
    const tokens = s.split(".");
    if (tokens.length === 9) {
        tokens.splice(2, 0, "_", "");
    }
    if ((tokens.length < 11) || tokens[0] !== "$JS" || tokens[1] !== "ACK") {
        throw new Error(`not js message`);
    }
    // old
    // "$JS.ACK.<stream>.<consumer>.<redeliveryCount><streamSeq><deliverySequence>.<timestamp>.<pending>"
    // new
    // $JS.ACK.<domain>.<accounthash>.<stream>.<consumer>.<redeliveryCount>.<streamSeq>.<deliverySequence>.<timestamp>.<pending>.<random>
    const di = {};
    // if domain is "_", replace with blank
    di.domain = tokens[2] === "_" ? "" : tokens[2];
    di.account_hash = tokens[3];
    di.stream = tokens[4];
    di.consumer = tokens[5];
    di.redeliveryCount = parseInt(tokens[6], 10);
    di.redelivered = di.redeliveryCount > 1;
    di.streamSequence = parseInt(tokens[7], 10);
    di.deliverySequence = parseInt(tokens[8], 10);
    di.timestampNanos = parseInt(tokens[9], 10);
    di.pending = parseInt(tokens[10], 10);
    return di;
}
exports.parseInfo = parseInfo;
class JsMsgImpl {
    constructor(msg) {
        this.msg = msg;
        this.didAck = false;
    }
    get subject() {
        return this.msg.subject;
    }
    get sid() {
        return this.msg.sid;
    }
    get data() {
        return this.msg.data;
    }
    get headers() {
        return this.msg.headers;
    }
    get info() {
        if (!this.di) {
            this.di = parseInfo(this.reply);
        }
        return this.di;
    }
    get redelivered() {
        return this.info.redeliveryCount > 1;
    }
    get reply() {
        return this.msg.reply || "";
    }
    get seq() {
        return this.info.streamSequence;
    }
    doAck(payload) {
        if (!this.didAck) {
            // all acks are final with the exception of +WPI
            this.didAck = !this.isWIP(payload);
            this.msg.respond(payload);
        }
    }
    isWIP(p) {
        return p.length === 4 && p[0] === WPI[0] && p[1] === WPI[1] &&
            p[2] === WPI[2] && p[3] === WPI[3];
    }
    // this has to dig into the internals as the message has access
    // to the protocol but not the high-level client.
    ackAck() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.didAck) {
                this.didAck = true;
                if (this.msg.reply) {
                    const mi = this.msg;
                    const proto = mi.publisher;
                    const r = new request_1.RequestOne(proto.muxSubscriptions, this.msg.reply);
                    proto.request(r);
                    try {
                        proto.publish(this.msg.reply, exports.ACK, {
                            reply: `${proto.muxSubscriptions.baseInbox}${r.token}`,
                        });
                    }
                    catch (err) {
                        r.cancel(err);
                    }
                    try {
                        yield Promise.race([r.timer, r.deferred]);
                        return true;
                    }
                    catch (err) {
                        r.cancel(err);
                    }
                }
            }
            return false;
        });
    }
    ack() {
        this.doAck(exports.ACK);
    }
    nak(millis) {
        let payload = NAK;
        if (millis) {
            payload = (0, codec_1.StringCodec)().encode(`-NAK ${JSON.stringify({ delay: (0, jsutil_1.nanos)(millis) })}`);
        }
        this.doAck(payload);
    }
    working() {
        this.doAck(WPI);
    }
    next(subj, opts = { batch: 1 }) {
        const args = {};
        args.batch = opts.batch || 1;
        args.no_wait = opts.no_wait || false;
        if (opts.expires && opts.expires > 0) {
            args.expires = (0, jsutil_1.nanos)(opts.expires);
        }
        const data = (0, codec_1.JSONCodec)().encode(args);
        const payload = databuffer_1.DataBuffer.concat(NXT, SPACE, data);
        const reqOpts = subj ? { reply: subj } : undefined;
        this.msg.respond(payload, reqOpts);
    }
    term() {
        this.doAck(TERM);
    }
    json() {
        return this.msg.json();
    }
    string() {
        return this.msg.string();
    }
}
exports.JsMsgImpl = JsMsgImpl;
//# sourceMappingURL=jsmsg.js.map

/***/ }),

/***/ 1287:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StreamsImpl = exports.StoredMsgImpl = exports.StreamAPIImpl = exports.StreamImpl = exports.ConsumersImpl = exports.convertStreamSourceDomain = void 0;
const types_1 = __nccwpck_require__(3829);
const jsbaseclient_api_1 = __nccwpck_require__(7444);
const jslister_1 = __nccwpck_require__(8406);
const jsutil_1 = __nccwpck_require__(1186);
const headers_1 = __nccwpck_require__(24);
const kv_1 = __nccwpck_require__(7249);
const objectstore_1 = __nccwpck_require__(6636);
const codec_1 = __nccwpck_require__(2524);
const encoders_1 = __nccwpck_require__(5450);
const semver_1 = __nccwpck_require__(6511);
const types_2 = __nccwpck_require__(165);
const consumer_1 = __nccwpck_require__(5718);
const jsmconsumer_api_1 = __nccwpck_require__(2730);
function convertStreamSourceDomain(s) {
    if (s === undefined) {
        return undefined;
    }
    const { domain } = s;
    if (domain === undefined) {
        return s;
    }
    const copy = Object.assign({}, s);
    delete copy.domain;
    if (domain === "") {
        return copy;
    }
    if (copy.external) {
        throw new Error("domain and external are both set");
    }
    copy.external = { api: `$JS.${domain}.API` };
    return copy;
}
exports.convertStreamSourceDomain = convertStreamSourceDomain;
class ConsumersImpl {
    constructor(api) {
        this.api = api;
        this.notified = false;
    }
    checkVersion() {
        const fv = this.api.nc.features.get(semver_1.Feature.JS_SIMPLIFICATION);
        if (!fv.ok) {
            return Promise.reject(new Error(`consumers framework is only supported on servers ${fv.min} or better`));
        }
        return Promise.resolve();
    }
    get(stream, name = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof name === "object") {
                return this.ordered(stream, name);
            }
            // check we have support for pending msgs and header notifications
            yield this.checkVersion();
            return this.api.info(stream, name)
                .then((ci) => {
                if (ci.config.deliver_subject !== undefined) {
                    return Promise.reject(new Error("push consumer not supported"));
                }
                return new consumer_1.PullConsumerImpl(this.api, ci);
            })
                .catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    ordered(stream, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkVersion();
            const impl = this.api;
            const sapi = new StreamAPIImpl(impl.nc, impl.opts);
            return sapi.info(stream)
                .then((_si) => {
                return Promise.resolve(new consumer_1.OrderedPullConsumerImpl(this.api, stream, opts));
            })
                .catch((err) => {
                return Promise.reject(err);
            });
        });
    }
}
exports.ConsumersImpl = ConsumersImpl;
class StreamImpl {
    constructor(api, info) {
        this.api = api;
        this._info = info;
    }
    get name() {
        return this._info.config.name;
    }
    alternates() {
        return this.info()
            .then((si) => {
            return si.alternates ? si.alternates : [];
        });
    }
    best() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.info();
            if (this._info.alternates) {
                const asi = yield this.api.info(this._info.alternates[0].name);
                return new StreamImpl(this.api, asi);
            }
            else {
                return this;
            }
        });
    }
    info(cached = false, opts) {
        if (cached) {
            return Promise.resolve(this._info);
        }
        return this.api.info(this.name, opts)
            .then((si) => {
            this._info = si;
            return this._info;
        });
    }
    getConsumer(name) {
        return new ConsumersImpl(new jsmconsumer_api_1.ConsumerAPIImpl(this.api.nc, this.api.opts))
            .get(this.name, name);
    }
    getMessage(query) {
        return this.api.getMessage(this.name, query);
    }
    deleteMessage(seq, erase) {
        return this.api.deleteMessage(this.name, seq, erase);
    }
}
exports.StreamImpl = StreamImpl;
class StreamAPIImpl extends jsbaseclient_api_1.BaseApiClient {
    constructor(nc, opts) {
        super(nc, opts);
    }
    checkStreamConfigVersions(cfg) {
        const nci = this.nc;
        if (cfg.metadata) {
            const { min, ok } = nci.features.get(semver_1.Feature.JS_STREAM_CONSUMER_METADATA);
            if (!ok) {
                throw new Error(`stream 'metadata' requires server ${min}`);
            }
        }
        if (cfg.first_seq) {
            const { min, ok } = nci.features.get(semver_1.Feature.JS_STREAM_FIRST_SEQ);
            if (!ok) {
                throw new Error(`stream 'first_seq' requires server ${min}`);
            }
        }
        if (cfg.subject_transform) {
            const { min, ok } = nci.features.get(semver_1.Feature.JS_STREAM_SUBJECT_TRANSFORM);
            if (!ok) {
                throw new Error(`stream 'subject_transform' requires server ${min}`);
            }
        }
        if (cfg.compression) {
            const { min, ok } = nci.features.get(semver_1.Feature.JS_STREAM_COMPRESSION);
            if (!ok) {
                throw new Error(`stream 'compression' requires server ${min}`);
            }
        }
        if (cfg.consumer_limits) {
            const { min, ok } = nci.features.get(semver_1.Feature.JS_DEFAULT_CONSUMER_LIMITS);
            if (!ok) {
                throw new Error(`stream 'consumer_limits' requires server ${min}`);
            }
        }
        function validateStreamSource(context, src) {
            var _a;
            const count = ((_a = src.subject_transforms) === null || _a === void 0 ? void 0 : _a.length) || 0;
            if (count > 0) {
                const { min, ok } = nci.features.get(semver_1.Feature.JS_STREAM_SOURCE_SUBJECT_TRANSFORM);
                if (!ok) {
                    throw new Error(`${context} 'subject_transforms' requires server ${min}`);
                }
            }
        }
        if (cfg.sources) {
            cfg.sources.forEach((src) => {
                validateStreamSource("stream sources", src);
            });
        }
        if (cfg.mirror) {
            validateStreamSource("stream mirror", cfg.mirror);
        }
    }
    add(cfg = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.checkStreamConfigVersions(cfg);
            (0, jsutil_1.validateStreamName)(cfg.name);
            cfg.mirror = convertStreamSourceDomain(cfg.mirror);
            //@ts-ignore: the sources are either set or not - so no item should be undefined in the list
            cfg.sources = (_a = cfg.sources) === null || _a === void 0 ? void 0 : _a.map(convertStreamSourceDomain);
            const r = yield this._request(`${this.prefix}.STREAM.CREATE.${cfg.name}`, cfg);
            const si = r;
            this._fixInfo(si);
            return si;
        });
    }
    delete(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            const r = yield this._request(`${this.prefix}.STREAM.DELETE.${stream}`);
            const cr = r;
            return cr.success;
        });
    }
    update(name, cfg = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof name === "object") {
                const sc = name;
                name = sc.name;
                cfg = sc;
                console.trace(`\u001B[33m >> streams.update(config: StreamConfig) api changed to streams.update(name: string, config: StreamUpdateConfig) - this shim will be removed - update your code.  \u001B[0m`);
            }
            this.checkStreamConfigVersions(cfg);
            (0, jsutil_1.validateStreamName)(name);
            const old = yield this.info(name);
            const update = Object.assign(old.config, cfg);
            update.mirror = convertStreamSourceDomain(update.mirror);
            //@ts-ignore: the sources are either set or not - so no item should be undefined in the list
            update.sources = (_a = update.sources) === null || _a === void 0 ? void 0 : _a.map(convertStreamSourceDomain);
            const r = yield this._request(`${this.prefix}.STREAM.UPDATE.${name}`, update);
            const si = r;
            this._fixInfo(si);
            return si;
        });
    }
    info(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(name);
            const subj = `${this.prefix}.STREAM.INFO.${name}`;
            const r = yield this._request(subj, data);
            let si = r;
            let { total, limit } = si;
            // check how many subjects we got in the first request
            let have = si.state.subjects
                ? Object.getOwnPropertyNames(si.state.subjects).length
                : 1;
            // if the response is paged, we have a large list of subjects
            // handle the paging and return a StreamInfo with all of it
            if (total && total > have) {
                const infos = [si];
                const paged = data || {};
                let i = 0;
                // total could change, so it is possible to have collected
                // more that the total
                while (total > have) {
                    i++;
                    paged.offset = limit * i;
                    const r = yield this._request(subj, paged);
                    // update it in case it changed
                    total = r.total;
                    infos.push(r);
                    const count = Object.getOwnPropertyNames(r.state.subjects).length;
                    have += count;
                    // if request returns less than limit it is done
                    if (count < limit) {
                        // done
                        break;
                    }
                }
                // collect all the subjects
                let subjects = {};
                for (let i = 0; i < infos.length; i++) {
                    si = infos[i];
                    if (si.state.subjects) {
                        subjects = Object.assign(subjects, si.state.subjects);
                    }
                }
                // don't give the impression we paged
                si.offset = 0;
                si.total = 0;
                si.limit = 0;
                si.state.subjects = subjects;
            }
            this._fixInfo(si);
            return si;
        });
    }
    list(subject = "") {
        const payload = (subject === null || subject === void 0 ? void 0 : subject.length) ? { subject } : {};
        const listerFilter = (v) => {
            const slr = v;
            slr.streams.forEach((si) => {
                this._fixInfo(si);
            });
            return slr.streams;
        };
        const subj = `${this.prefix}.STREAM.LIST`;
        return new jslister_1.ListerImpl(subj, listerFilter, this, payload);
    }
    // FIXME: init of sealed, deny_delete, deny_purge shouldn't be necessary
    //  https://github.com/nats-io/nats-server/issues/2633
    _fixInfo(si) {
        si.config.sealed = si.config.sealed || false;
        si.config.deny_delete = si.config.deny_delete || false;
        si.config.deny_purge = si.config.deny_purge || false;
        si.config.allow_rollup_hdrs = si.config.allow_rollup_hdrs || false;
    }
    purge(name, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (opts) {
                const { keep, seq } = opts;
                if (typeof keep === "number" && typeof seq === "number") {
                    throw new Error("can specify one of keep or seq");
                }
            }
            (0, jsutil_1.validateStreamName)(name);
            const v = yield this._request(`${this.prefix}.STREAM.PURGE.${name}`, opts);
            return v;
        });
    }
    deleteMessage(stream, seq, erase = true) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            const dr = { seq };
            if (!erase) {
                dr.no_erase = true;
            }
            const r = yield this._request(`${this.prefix}.STREAM.MSG.DELETE.${stream}`, dr);
            const cr = r;
            return cr.success;
        });
    }
    getMessage(stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, jsutil_1.validateStreamName)(stream);
            const r = yield this._request(`${this.prefix}.STREAM.MSG.GET.${stream}`, query);
            const sm = r;
            return new StoredMsgImpl(sm);
        });
    }
    find(subject) {
        return this.findStream(subject);
    }
    listKvs() {
        const filter = (v) => {
            var _a, _b;
            const slr = v;
            const kvStreams = slr.streams.filter((v) => {
                return v.config.name.startsWith(types_2.kvPrefix);
            });
            kvStreams.forEach((si) => {
                this._fixInfo(si);
            });
            let cluster = "";
            if (kvStreams.length) {
                cluster = (_b = (_a = this.nc.info) === null || _a === void 0 ? void 0 : _a.cluster) !== null && _b !== void 0 ? _b : "";
            }
            const status = kvStreams.map((si) => {
                return new kv_1.KvStatusImpl(si, cluster);
            });
            return status;
        };
        const subj = `${this.prefix}.STREAM.LIST`;
        return new jslister_1.ListerImpl(subj, filter, this);
    }
    listObjectStores() {
        const filter = (v) => {
            const slr = v;
            const objStreams = slr.streams.filter((v) => {
                return v.config.name.startsWith(objectstore_1.osPrefix);
            });
            objStreams.forEach((si) => {
                this._fixInfo(si);
            });
            const status = objStreams.map((si) => {
                return new objectstore_1.ObjectStoreStatusImpl(si);
            });
            return status;
        };
        const subj = `${this.prefix}.STREAM.LIST`;
        return new jslister_1.ListerImpl(subj, filter, this);
    }
    names(subject = "") {
        const payload = (subject === null || subject === void 0 ? void 0 : subject.length) ? { subject } : {};
        const listerFilter = (v) => {
            const sr = v;
            return sr.streams;
        };
        const subj = `${this.prefix}.STREAM.NAMES`;
        return new jslister_1.ListerImpl(subj, listerFilter, this, payload);
    }
    get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const si = yield this.info(name);
            return Promise.resolve(new StreamImpl(this, si));
        });
    }
}
exports.StreamAPIImpl = StreamAPIImpl;
class StoredMsgImpl {
    constructor(smr) {
        this.smr = smr;
    }
    get subject() {
        return this.smr.message.subject;
    }
    get seq() {
        return this.smr.message.seq;
    }
    get timestamp() {
        return this.smr.message.time;
    }
    get time() {
        return new Date(Date.parse(this.timestamp));
    }
    get data() {
        return this.smr.message.data ? this._parse(this.smr.message.data) : types_1.Empty;
    }
    get header() {
        if (!this._header) {
            if (this.smr.message.hdrs) {
                const hd = this._parse(this.smr.message.hdrs);
                this._header = headers_1.MsgHdrsImpl.decode(hd);
            }
            else {
                this._header = (0, headers_1.headers)();
            }
        }
        return this._header;
    }
    _parse(s) {
        const bs = atob(s);
        const len = bs.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = bs.charCodeAt(i);
        }
        return bytes;
    }
    json(reviver) {
        return (0, codec_1.JSONCodec)(reviver).decode(this.data);
    }
    string() {
        return encoders_1.TD.decode(this.data);
    }
}
exports.StoredMsgImpl = StoredMsgImpl;
class StreamsImpl {
    constructor(api) {
        this.api = api;
    }
    get(stream) {
        return this.api.info(stream)
            .then((si) => {
            return new StreamImpl(this.api, si);
        });
    }
}
exports.StreamsImpl = StreamsImpl;
//# sourceMappingURL=jsmstream_api.js.map

/***/ }),

/***/ 1186:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkJsErrorCode = exports.isTerminal409 = exports.setMaxWaitingToFail = exports.Js409Errors = exports.checkJsError = exports.newJsErrorMsg = exports.isHeartbeatMsg = exports.isFlowControlMsg = exports.millis = exports.nanos = exports.validName = exports.validateName = exports.minValidation = exports.validateStreamName = exports.validateDurableName = void 0;
/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const encoders_1 = __nccwpck_require__(5450);
const headers_1 = __nccwpck_require__(24);
const msg_1 = __nccwpck_require__(5305);
const core_1 = __nccwpck_require__(9498);
function validateDurableName(name) {
    return minValidation("durable", name);
}
exports.validateDurableName = validateDurableName;
function validateStreamName(name) {
    return minValidation("stream", name);
}
exports.validateStreamName = validateStreamName;
function minValidation(context, name = "") {
    // minimum validation on streams/consumers matches nats cli
    if (name === "") {
        throw Error(`${context} name required`);
    }
    const bad = [".", "*", ">", "/", "\\", " ", "\t", "\n", "\r"];
    bad.forEach((v) => {
        if (name.indexOf(v) !== -1) {
            // make the error have a meaningful character
            switch (v) {
                case "\n":
                    v = "\\n";
                    break;
                case "\r":
                    v = "\\r";
                    break;
                case "\t":
                    v = "\\t";
                    break;
                default:
                // nothing
            }
            throw Error(`invalid ${context} name - ${context} name cannot contain '${v}'`);
        }
    });
    return "";
}
exports.minValidation = minValidation;
function validateName(context, name = "") {
    if (name === "") {
        throw Error(`${context} name required`);
    }
    const m = validName(name);
    if (m.length) {
        throw new Error(`invalid ${context} name - ${context} name ${m}`);
    }
}
exports.validateName = validateName;
function validName(name = "") {
    if (name === "") {
        throw Error(`name required`);
    }
    const RE = /^[-\w]+$/g;
    const m = name.match(RE);
    if (m === null) {
        for (const c of name.split("")) {
            const mm = c.match(RE);
            if (mm === null) {
                return `cannot contain '${c}'`;
            }
        }
    }
    return "";
}
exports.validName = validName;
/**
 * Converts the specified millis into Nanos
 * @param millis
 */
function nanos(millis) {
    return millis * 1000000;
}
exports.nanos = nanos;
/**
 * Convert the specified Nanos into millis
 * @param ns
 */
function millis(ns) {
    return Math.floor(ns / 1000000);
}
exports.millis = millis;
/**
 * Returns true if the message is a flow control message
 * @param msg
 */
function isFlowControlMsg(msg) {
    if (msg.data.length > 0) {
        return false;
    }
    const h = msg.headers;
    if (!h) {
        return false;
    }
    return h.code >= 100 && h.code < 200;
}
exports.isFlowControlMsg = isFlowControlMsg;
/**
 * Returns true if the message is a heart beat message
 * @param msg
 */
function isHeartbeatMsg(msg) {
    var _a;
    return isFlowControlMsg(msg) && ((_a = msg.headers) === null || _a === void 0 ? void 0 : _a.description) === "Idle Heartbeat";
}
exports.isHeartbeatMsg = isHeartbeatMsg;
function newJsErrorMsg(code, description, subject) {
    const h = (0, headers_1.headers)(code, description);
    const arg = { hdr: 1, sid: 0, size: 0 };
    const msg = new msg_1.MsgImpl(arg, encoders_1.Empty, {});
    msg._headers = h;
    msg._subject = subject;
    return msg;
}
exports.newJsErrorMsg = newJsErrorMsg;
function checkJsError(msg) {
    // JS error only if no payload - otherwise assume it is application data
    if (msg.data.length !== 0) {
        return null;
    }
    const h = msg.headers;
    if (!h) {
        return null;
    }
    return checkJsErrorCode(h.code, h.description);
}
exports.checkJsError = checkJsError;
var Js409Errors;
(function (Js409Errors) {
    Js409Errors["MaxBatchExceeded"] = "exceeded maxrequestbatch of";
    Js409Errors["MaxExpiresExceeded"] = "exceeded maxrequestexpires of";
    Js409Errors["MaxBytesExceeded"] = "exceeded maxrequestmaxbytes of";
    Js409Errors["MaxMessageSizeExceeded"] = "message size exceeds maxbytes";
    Js409Errors["PushConsumer"] = "consumer is push based";
    Js409Errors["MaxWaitingExceeded"] = "exceeded maxwaiting";
    Js409Errors["IdleHeartbeatMissed"] = "idle heartbeats missed";
    Js409Errors["ConsumerDeleted"] = "consumer deleted";
    // FIXME: consumer deleted - instead of no responder (terminal error)
    //   leadership changed -
})(Js409Errors || (exports.Js409Errors = Js409Errors = {}));
let MAX_WAITING_FAIL = false;
function setMaxWaitingToFail(tf) {
    MAX_WAITING_FAIL = tf;
}
exports.setMaxWaitingToFail = setMaxWaitingToFail;
function isTerminal409(err) {
    if (err.code !== core_1.ErrorCode.JetStream409) {
        return false;
    }
    const fatal = [
        Js409Errors.MaxBatchExceeded,
        Js409Errors.MaxExpiresExceeded,
        Js409Errors.MaxBytesExceeded,
        Js409Errors.MaxMessageSizeExceeded,
        Js409Errors.PushConsumer,
        Js409Errors.IdleHeartbeatMissed,
        Js409Errors.ConsumerDeleted,
    ];
    if (MAX_WAITING_FAIL) {
        fatal.push(Js409Errors.MaxWaitingExceeded);
    }
    return fatal.find((s) => {
        return err.message.indexOf(s) !== -1;
    }) !== undefined;
}
exports.isTerminal409 = isTerminal409;
function checkJsErrorCode(code, description = "") {
    if (code < 300) {
        return null;
    }
    description = description.toLowerCase();
    switch (code) {
        case 404:
            // 404 for jetstream will provide different messages ensure we
            // keep whatever the server returned
            return new core_1.NatsError(description, core_1.ErrorCode.JetStream404NoMessages);
        case 408:
            return new core_1.NatsError(description, core_1.ErrorCode.JetStream408RequestTimeout);
        case 409: {
            // the description can be exceeded max waiting or max ack pending, which are
            // recoverable, but can also be terminal errors where the request exceeds
            // some value in the consumer configuration
            const ec = description.startsWith(Js409Errors.IdleHeartbeatMissed)
                ? core_1.ErrorCode.JetStreamIdleHeartBeat
                : core_1.ErrorCode.JetStream409;
            return new core_1.NatsError(description, ec);
        }
        case 503:
            return core_1.NatsError.errorForCode(core_1.ErrorCode.JetStreamNotEnabled, new Error(description));
        default:
            if (description === "") {
                description = core_1.ErrorCode.Unknown;
            }
            return new core_1.NatsError(description, `${code}`);
    }
}
exports.checkJsErrorCode = checkJsErrorCode;
//# sourceMappingURL=jsutil.js.map

/***/ }),

/***/ 7249:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KvStatusImpl = exports.Bucket = exports.validateBucket = exports.hasWildcards = exports.validateSearchKey = exports.validateKey = exports.kvOperationHdr = exports.defaultBucketOpts = exports.NoopKvCodecs = exports.Base64KeyCodec = void 0;
const core_1 = __nccwpck_require__(9498);
const jsutil_1 = __nccwpck_require__(1186);
const queued_iterator_1 = __nccwpck_require__(8450);
const headers_1 = __nccwpck_require__(24);
const types_1 = __nccwpck_require__(165);
const semver_1 = __nccwpck_require__(6511);
const util_1 = __nccwpck_require__(4812);
const encoders_1 = __nccwpck_require__(5450);
const jsapi_types_1 = __nccwpck_require__(4399);
const jsclient_1 = __nccwpck_require__(3101);
function Base64KeyCodec() {
    return {
        encode(key) {
            return btoa(key);
        },
        decode(bkey) {
            return atob(bkey);
        },
    };
}
exports.Base64KeyCodec = Base64KeyCodec;
function NoopKvCodecs() {
    return {
        key: {
            encode(k) {
                return k;
            },
            decode(k) {
                return k;
            },
        },
        value: {
            encode(v) {
                return v;
            },
            decode(v) {
                return v;
            },
        },
    };
}
exports.NoopKvCodecs = NoopKvCodecs;
function defaultBucketOpts() {
    return {
        replicas: 1,
        history: 1,
        timeout: 2000,
        maxBucketSize: -1,
        maxValueSize: -1,
        codec: NoopKvCodecs(),
        storage: jsapi_types_1.StorageType.File,
    };
}
exports.defaultBucketOpts = defaultBucketOpts;
exports.kvOperationHdr = "KV-Operation";
const kvSubjectPrefix = "$KV";
const validKeyRe = /^[-/=.\w]+$/;
const validSearchKey = /^[-/=.>*\w]+$/;
const validBucketRe = /^[-\w]+$/;
// this exported for tests
function validateKey(k) {
    if (k.startsWith(".") || k.endsWith(".") || !validKeyRe.test(k)) {
        throw new Error(`invalid key: ${k}`);
    }
}
exports.validateKey = validateKey;
function validateSearchKey(k) {
    if (k.startsWith(".") || k.endsWith(".") || !validSearchKey.test(k)) {
        throw new Error(`invalid key: ${k}`);
    }
}
exports.validateSearchKey = validateSearchKey;
function hasWildcards(k) {
    if (k.startsWith(".") || k.endsWith(".")) {
        throw new Error(`invalid key: ${k}`);
    }
    const chunks = k.split(".");
    let hasWildcards = false;
    for (let i = 0; i < chunks.length; i++) {
        switch (chunks[i]) {
            case "*":
                hasWildcards = true;
                break;
            case ">":
                if (i !== chunks.length - 1) {
                    throw new Error(`invalid key: ${k}`);
                }
                hasWildcards = true;
                break;
            default:
            // continue
        }
    }
    return hasWildcards;
}
exports.hasWildcards = hasWildcards;
// this exported for tests
function validateBucket(name) {
    if (!validBucketRe.test(name)) {
        throw new Error(`invalid bucket name: ${name}`);
    }
}
exports.validateBucket = validateBucket;
class Bucket {
    constructor(bucket, js, jsm) {
        this.validateKey = validateKey;
        this.validateSearchKey = validateSearchKey;
        this.hasWildcards = hasWildcards;
        validateBucket(bucket);
        this.js = js;
        this.jsm = jsm;
        this.bucket = bucket;
        this.prefix = kvSubjectPrefix;
        this.editPrefix = "";
        this.useJsPrefix = false;
        this._prefixLen = 0;
    }
    static create(js, name, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            validateBucket(name);
            const jsm = yield js.jetstreamManager();
            const bucket = new Bucket(name, js, jsm);
            yield bucket.init(opts);
            return bucket;
        });
    }
    static bind(js, name, opts = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jsm = yield js.jetstreamManager();
            const info = yield jsm.streams.info(`${types_1.kvPrefix}${name}`);
            validateBucket(info.config.name);
            const bucket = new Bucket(name, js, jsm);
            Object.assign(bucket, info);
            bucket.codec = opts.codec || NoopKvCodecs();
            bucket.direct = (_a = info.config.allow_direct) !== null && _a !== void 0 ? _a : false;
            bucket.initializePrefixes(info);
            return bucket;
        });
    }
    init(opts = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const bo = Object.assign(defaultBucketOpts(), opts);
            this.codec = bo.codec;
            const sc = {};
            this.stream = sc.name = (_a = opts.streamName) !== null && _a !== void 0 ? _a : this.bucketName();
            sc.retention = jsapi_types_1.RetentionPolicy.Limits;
            sc.max_msgs_per_subject = bo.history;
            if (bo.maxBucketSize) {
                bo.max_bytes = bo.maxBucketSize;
            }
            if (bo.max_bytes) {
                sc.max_bytes = bo.max_bytes;
            }
            sc.max_msg_size = bo.maxValueSize;
            sc.storage = bo.storage;
            const location = (_b = opts.placementCluster) !== null && _b !== void 0 ? _b : "";
            if (location) {
                opts.placement = {};
                opts.placement.cluster = location;
                opts.placement.tags = [];
            }
            if (opts.placement) {
                sc.placement = opts.placement;
            }
            if (opts.republish) {
                sc.republish = opts.republish;
            }
            if (opts.description) {
                sc.description = opts.description;
            }
            if (opts.mirror) {
                const mirror = Object.assign({}, opts.mirror);
                if (!mirror.name.startsWith(types_1.kvPrefix)) {
                    mirror.name = `${types_1.kvPrefix}${mirror.name}`;
                }
                sc.mirror = mirror;
                sc.mirror_direct = true;
            }
            else if (opts.sources) {
                const sources = opts.sources.map((s) => {
                    const c = Object.assign({}, s);
                    if (!c.name.startsWith(types_1.kvPrefix)) {
                        c.name = `${types_1.kvPrefix}${c.name}`;
                    }
                });
                sc.sources = sources;
            }
            else {
                sc.subjects = [this.subjectForBucket()];
            }
            if (opts.metadata) {
                sc.metadata = opts.metadata;
            }
            const nci = this.js.nc;
            const have = nci.getServerVersion();
            const discardNew = have ? (0, semver_1.compare)(have, (0, semver_1.parseSemVer)("2.7.2")) >= 0 : false;
            sc.discard = discardNew ? jsapi_types_1.DiscardPolicy.New : jsapi_types_1.DiscardPolicy.Old;
            const { ok: direct, min } = nci.features.get(semver_1.Feature.JS_ALLOW_DIRECT);
            if (!direct && opts.allow_direct === true) {
                const v = have
                    ? `${have.major}.${have.minor}.${have.micro}`
                    : "unknown";
                return Promise.reject(new Error(`allow_direct is not available on server version ${v} - requires ${min}`));
            }
            // if we are given allow_direct we use it, otherwise what
            // the server supports - in creation this will always rule,
            // but allows the client to opt-in even if it is already
            // available on the stream
            opts.allow_direct = typeof opts.allow_direct === "boolean"
                ? opts.allow_direct
                : direct;
            sc.allow_direct = opts.allow_direct;
            this.direct = sc.allow_direct;
            sc.num_replicas = bo.replicas;
            if (bo.ttl) {
                sc.max_age = (0, jsutil_1.nanos)(bo.ttl);
            }
            sc.allow_rollup_hdrs = true;
            let info;
            try {
                info = yield this.jsm.streams.info(sc.name);
                if (!info.config.allow_direct && this.direct === true) {
                    this.direct = false;
                }
            }
            catch (err) {
                if (err.message === "stream not found") {
                    info = yield this.jsm.streams.add(sc);
                }
                else {
                    throw err;
                }
            }
            this.initializePrefixes(info);
        });
    }
    initializePrefixes(info) {
        this._prefixLen = 0;
        this.prefix = `$KV.${this.bucket}`;
        this.useJsPrefix = this.js.apiPrefix !== "$JS.API";
        const { mirror } = info.config;
        if (mirror) {
            let n = mirror.name;
            if (n.startsWith(types_1.kvPrefix)) {
                n = n.substring(types_1.kvPrefix.length);
            }
            if (mirror.external && mirror.external.api !== "") {
                const mb = mirror.name.substring(types_1.kvPrefix.length);
                this.useJsPrefix = false;
                this.prefix = `$KV.${mb}`;
                this.editPrefix = `${mirror.external.api}.$KV.${n}`;
            }
            else {
                this.editPrefix = this.prefix;
            }
        }
    }
    bucketName() {
        var _a;
        return (_a = this.stream) !== null && _a !== void 0 ? _a : `${types_1.kvPrefix}${this.bucket}`;
    }
    subjectForBucket() {
        return `${this.prefix}.${this.bucket}.>`;
    }
    subjectForKey(k, edit = false) {
        const builder = [];
        if (edit) {
            if (this.useJsPrefix) {
                builder.push(this.js.apiPrefix);
            }
            if (this.editPrefix !== "") {
                builder.push(this.editPrefix);
            }
            else {
                builder.push(this.prefix);
            }
        }
        else {
            if (this.prefix) {
                builder.push(this.prefix);
            }
        }
        builder.push(k);
        return builder.join(".");
    }
    fullKeyName(k) {
        if (this.prefix !== "") {
            return `${this.prefix}.${k}`;
        }
        return `${kvSubjectPrefix}.${this.bucket}.${k}`;
    }
    get prefixLen() {
        if (this._prefixLen === 0) {
            this._prefixLen = this.prefix.length + 1;
        }
        return this._prefixLen;
    }
    encodeKey(key) {
        const chunks = [];
        for (const t of key.split(".")) {
            switch (t) {
                case ">":
                case "*":
                    chunks.push(t);
                    break;
                default:
                    chunks.push(this.codec.key.encode(t));
                    break;
            }
        }
        return chunks.join(".");
    }
    decodeKey(ekey) {
        const chunks = [];
        for (const t of ekey.split(".")) {
            switch (t) {
                case ">":
                case "*":
                    chunks.push(t);
                    break;
                default:
                    chunks.push(this.codec.key.decode(t));
                    break;
            }
        }
        return chunks.join(".");
    }
    close() {
        return Promise.resolve();
    }
    dataLen(data, h) {
        const slen = h ? h.get(types_1.JsHeaders.MessageSizeHdr) || "" : "";
        if (slen !== "") {
            return parseInt(slen, 10);
        }
        return data.length;
    }
    smToEntry(sm) {
        return new KvStoredEntryImpl(this.bucket, this.prefixLen, sm);
    }
    jmToEntry(jm) {
        const key = this.decodeKey(jm.subject.substring(this.prefixLen));
        return new KvJsMsgEntryImpl(this.bucket, key, jm);
    }
    create(k, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let firstErr;
            try {
                const n = yield this.put(k, data, { previousSeq: 0 });
                return Promise.resolve(n);
            }
            catch (err) {
                firstErr = err;
                if (((_a = err === null || err === void 0 ? void 0 : err.api_error) === null || _a === void 0 ? void 0 : _a.err_code) !== 10071) {
                    return Promise.reject(err);
                }
            }
            let rev = 0;
            try {
                const e = yield this.get(k);
                if ((e === null || e === void 0 ? void 0 : e.operation) === "DEL" || (e === null || e === void 0 ? void 0 : e.operation) === "PURGE") {
                    rev = e !== null ? e.revision : 0;
                    return this.update(k, data, rev);
                }
                else {
                    return Promise.reject(firstErr);
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    update(k, data, version) {
        if (version <= 0) {
            throw new Error("version must be greater than 0");
        }
        return this.put(k, data, { previousSeq: version });
    }
    put(k, data, opts = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const ek = this.encodeKey(k);
            this.validateKey(ek);
            const o = {};
            if (opts.previousSeq !== undefined) {
                const h = (0, headers_1.headers)();
                o.headers = h;
                h.set(jsclient_1.PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.previousSeq}`);
            }
            try {
                const pa = yield this.js.publish(this.subjectForKey(ek, true), data, o);
                return pa.seq;
            }
            catch (err) {
                const ne = err;
                if (ne.isJetStreamError()) {
                    ne.message = (_a = ne.api_error) === null || _a === void 0 ? void 0 : _a.description;
                    ne.code = `${(_b = ne.api_error) === null || _b === void 0 ? void 0 : _b.code}`;
                    return Promise.reject(ne);
                }
                return Promise.reject(err);
            }
        });
    }
    get(k, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const ek = this.encodeKey(k);
            this.validateKey(ek);
            let arg = { last_by_subj: this.subjectForKey(ek) };
            if (opts && opts.revision > 0) {
                arg = { seq: opts.revision };
            }
            let sm;
            try {
                if (this.direct) {
                    const direct = this.jsm.direct;
                    sm = yield direct.getMessage(this.bucketName(), arg);
                }
                else {
                    sm = yield this.jsm.streams.getMessage(this.bucketName(), arg);
                }
                const ke = this.smToEntry(sm);
                if (ke.key !== ek) {
                    return null;
                }
                return ke;
            }
            catch (err) {
                if (err.code === core_1.ErrorCode.JetStream404NoMessages) {
                    return null;
                }
                throw err;
            }
        });
    }
    purge(k) {
        return this._deleteOrPurge(k, "PURGE");
    }
    delete(k) {
        return this._deleteOrPurge(k, "DEL");
    }
    purgeDeletes(olderMillis = 30 * 60 * 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            const done = (0, util_1.deferred)();
            const buf = [];
            const i = yield this.watch({
                key: ">",
                initializedFn: () => {
                    done.resolve();
                },
            });
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                try {
                    for (var _d = true, i_1 = __asyncValues(i), i_1_1; i_1_1 = yield i_1.next(), _a = i_1_1.done, !_a; _d = true) {
                        _c = i_1_1.value;
                        _d = false;
                        const e = _c;
                        if (e.operation === "DEL" || e.operation === "PURGE") {
                            buf.push(e);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = i_1.return)) yield _b.call(i_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }))().then();
            yield done;
            i.stop();
            const min = Date.now() - olderMillis;
            const proms = buf.map((e) => {
                const subj = this.subjectForKey(e.key);
                if (e.created.getTime() >= min) {
                    return this.jsm.streams.purge(this.stream, { filter: subj, keep: 1 });
                }
                else {
                    return this.jsm.streams.purge(this.stream, { filter: subj, keep: 0 });
                }
            });
            const purged = yield Promise.all(proms);
            purged.unshift({ success: true, purged: 0 });
            return purged.reduce((pv, cv) => {
                pv.purged += cv.purged;
                return pv;
            });
        });
    }
    _deleteOrPurge(k, op) {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasWildcards(k)) {
                return this._doDeleteOrPurge(k, op);
            }
            const iter = yield this.keys(k);
            const buf = [];
            try {
                for (var _d = true, iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield iter_1.next(), _a = iter_1_1.done, !_a; _d = true) {
                    _c = iter_1_1.value;
                    _d = false;
                    const k = _c;
                    buf.push(this._doDeleteOrPurge(k, op));
                    if (buf.length === 100) {
                        yield Promise.all(buf);
                        buf.length = 0;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iter_1.return)) yield _b.call(iter_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (buf.length > 0) {
                yield Promise.all(buf);
            }
        });
    }
    _doDeleteOrPurge(k, op) {
        return __awaiter(this, void 0, void 0, function* () {
            const ek = this.encodeKey(k);
            this.validateKey(ek);
            const h = (0, headers_1.headers)();
            h.set(exports.kvOperationHdr, op);
            if (op === "PURGE") {
                h.set(types_1.JsHeaders.RollupHdr, types_1.JsHeaders.RollupValueSubject);
            }
            yield this.js.publish(this.subjectForKey(ek, true), encoders_1.Empty, { headers: h });
        });
    }
    _buildCC(k, content, opts = {}) {
        const ek = this.encodeKey(k);
        this.validateSearchKey(k);
        let deliver_policy = jsapi_types_1.DeliverPolicy.LastPerSubject;
        if (content === types_1.KvWatchInclude.AllHistory) {
            deliver_policy = jsapi_types_1.DeliverPolicy.All;
        }
        if (content === types_1.KvWatchInclude.UpdatesOnly) {
            deliver_policy = jsapi_types_1.DeliverPolicy.New;
        }
        return Object.assign({
            deliver_policy,
            "ack_policy": jsapi_types_1.AckPolicy.None,
            "filter_subject": this.fullKeyName(ek),
            "flow_control": true,
            "idle_heartbeat": (0, jsutil_1.nanos)(5 * 1000),
        }, opts);
    }
    remove(k) {
        return this.purge(k);
    }
    history(opts = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const k = (_a = opts.key) !== null && _a !== void 0 ? _a : ">";
            const qi = new queued_iterator_1.QueuedIteratorImpl();
            const co = {};
            co.headers_only = opts.headers_only || false;
            let fn;
            fn = () => {
                qi.stop();
            };
            let count = 0;
            const cc = this._buildCC(k, types_1.KvWatchInclude.AllHistory, co);
            const subj = cc.filter_subject;
            const copts = (0, types_1.consumerOpts)(cc);
            copts.bindStream(this.stream);
            copts.orderedConsumer();
            copts.callback((err, jm) => {
                if (err) {
                    // sub done
                    qi.stop(err);
                    return;
                }
                if (jm) {
                    const e = this.jmToEntry(jm);
                    qi.push(e);
                    qi.received++;
                    //@ts-ignore - function will be removed
                    if (fn && count > 0 && qi.received >= count || jm.info.pending === 0) {
                        //@ts-ignore: we are injecting an unexpected type
                        qi.push(fn);
                        fn = undefined;
                    }
                }
            });
            const sub = yield this.js.subscribe(subj, copts);
            // by the time we are here, likely the subscription got messages
            if (fn) {
                const { info: { last } } = sub;
                // this doesn't sound correct - we should be looking for a seq number instead
                // then if we see a greater one, we are done.
                const expect = last.num_pending + last.delivered.consumer_seq;
                // if the iterator already queued - the only issue is other modifications
                // did happen like stream was pruned, and the ordered consumer reset, etc
                // we won't get what we are expecting - so the notification will never fire
                // the sentinel ought to be coming from the server
                if (expect === 0 || qi.received >= expect) {
                    try {
                        fn();
                    }
                    catch (err) {
                        // fail it - there's something wrong in the user callback
                        qi.stop(err);
                    }
                    finally {
                        fn = undefined;
                    }
                }
                else {
                    count = expect;
                }
            }
            qi._data = sub;
            qi.iterClosed.then(() => {
                sub.unsubscribe();
            });
            sub.closed.then(() => {
                qi.stop();
            }).catch((err) => {
                qi.stop(err);
            });
            return qi;
        });
    }
    watch(opts = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const k = (_a = opts.key) !== null && _a !== void 0 ? _a : ">";
            const qi = new queued_iterator_1.QueuedIteratorImpl();
            const co = {};
            co.headers_only = opts.headers_only || false;
            let content = types_1.KvWatchInclude.LastValue;
            if (opts.include === types_1.KvWatchInclude.AllHistory) {
                content = types_1.KvWatchInclude.AllHistory;
            }
            else if (opts.include === types_1.KvWatchInclude.UpdatesOnly) {
                content = types_1.KvWatchInclude.UpdatesOnly;
            }
            const ignoreDeletes = opts.ignoreDeletes === true;
            let fn = opts.initializedFn;
            let count = 0;
            const cc = this._buildCC(k, content, co);
            const subj = cc.filter_subject;
            const copts = (0, types_1.consumerOpts)(cc);
            copts.bindStream(this.stream);
            copts.orderedConsumer();
            copts.callback((err, jm) => {
                if (err) {
                    // sub done
                    qi.stop(err);
                    return;
                }
                if (jm) {
                    const e = this.jmToEntry(jm);
                    if (ignoreDeletes && e.operation === "DEL") {
                        return;
                    }
                    qi.push(e);
                    qi.received++;
                    // count could have changed or has already been received
                    if (fn && (count > 0 && qi.received >= count || jm.info.pending === 0)) {
                        //@ts-ignore: we are injecting an unexpected type
                        qi.push(fn);
                        fn = undefined;
                    }
                }
            });
            const sub = yield this.js.subscribe(subj, copts);
            // by the time we are here, likely the subscription got messages
            if (fn) {
                const { info: { last } } = sub;
                // this doesn't sound correct - we should be looking for a seq number instead
                // then if we see a greater one, we are done.
                const expect = last.num_pending + last.delivered.consumer_seq;
                // if the iterator already queued - the only issue is other modifications
                // did happen like stream was pruned, and the ordered consumer reset, etc
                // we won't get what we are expecting - so the notification will never fire
                // the sentinel ought to be coming from the server
                if (expect === 0 || qi.received >= expect) {
                    try {
                        fn();
                    }
                    catch (err) {
                        // fail it - there's something wrong in the user callback
                        qi.stop(err);
                    }
                    finally {
                        fn = undefined;
                    }
                }
                else {
                    count = expect;
                }
            }
            qi._data = sub;
            qi.iterClosed.then(() => {
                sub.unsubscribe();
            });
            sub.closed.then(() => {
                qi.stop();
            }).catch((err) => {
                qi.stop(err);
            });
            return qi;
        });
    }
    keys(k = ">") {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = new queued_iterator_1.QueuedIteratorImpl();
            const cc = this._buildCC(k, types_1.KvWatchInclude.LastValue, {
                headers_only: true,
            });
            const subj = cc.filter_subject;
            const copts = (0, types_1.consumerOpts)(cc);
            copts.bindStream(this.stream);
            copts.orderedConsumer();
            const sub = yield this.js.subscribe(subj, copts);
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a, e_3, _b, _c;
                var _d;
                try {
                    for (var _e = true, sub_1 = __asyncValues(sub), sub_1_1; sub_1_1 = yield sub_1.next(), _a = sub_1_1.done, !_a; _e = true) {
                        _c = sub_1_1.value;
                        _e = false;
                        const jm = _c;
                        const op = (_d = jm.headers) === null || _d === void 0 ? void 0 : _d.get(exports.kvOperationHdr);
                        if (op !== "DEL" && op !== "PURGE") {
                            const key = this.decodeKey(jm.subject.substring(this.prefixLen));
                            keys.push(key);
                        }
                        if (jm.info.pending === 0) {
                            sub.unsubscribe();
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = sub_1.return)) yield _b.call(sub_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }))()
                .then(() => {
                keys.stop();
            })
                .catch((err) => {
                keys.stop(err);
            });
            const si = sub;
            if (si.info.last.num_pending === 0) {
                sub.unsubscribe();
            }
            return keys;
        });
    }
    purgeBucket(opts) {
        return this.jsm.streams.purge(this.bucketName(), opts);
    }
    destroy() {
        return this.jsm.streams.delete(this.bucketName());
    }
    status() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const nc = this.js.nc;
            const cluster = (_b = (_a = nc.info) === null || _a === void 0 ? void 0 : _a.cluster) !== null && _b !== void 0 ? _b : "";
            const bn = this.bucketName();
            const si = yield this.jsm.streams.info(bn);
            return new KvStatusImpl(si, cluster);
        });
    }
}
exports.Bucket = Bucket;
class KvStatusImpl {
    constructor(si, cluster = "") {
        this.si = si;
        this.cluster = cluster;
    }
    get bucket() {
        return this.si.config.name.startsWith(types_1.kvPrefix)
            ? this.si.config.name.substring(types_1.kvPrefix.length)
            : this.si.config.name;
    }
    get values() {
        return this.si.state.messages;
    }
    get history() {
        return this.si.config.max_msgs_per_subject;
    }
    get ttl() {
        return (0, jsutil_1.millis)(this.si.config.max_age);
    }
    get bucket_location() {
        return this.cluster;
    }
    get backingStore() {
        return this.si.config.storage;
    }
    get storage() {
        return this.si.config.storage;
    }
    get replicas() {
        return this.si.config.num_replicas;
    }
    get description() {
        var _a;
        return (_a = this.si.config.description) !== null && _a !== void 0 ? _a : "";
    }
    get maxBucketSize() {
        return this.si.config.max_bytes;
    }
    get maxValueSize() {
        return this.si.config.max_msg_size;
    }
    get max_bytes() {
        return this.si.config.max_bytes;
    }
    get placement() {
        return this.si.config.placement || { cluster: "", tags: [] };
    }
    get placementCluster() {
        var _a, _b;
        return (_b = (_a = this.si.config.placement) === null || _a === void 0 ? void 0 : _a.cluster) !== null && _b !== void 0 ? _b : "";
    }
    get republish() {
        var _a;
        return (_a = this.si.config.republish) !== null && _a !== void 0 ? _a : { src: "", dest: "" };
    }
    get streamInfo() {
        return this.si;
    }
    get size() {
        return this.si.state.bytes;
    }
    get metadata() {
        var _a;
        return (_a = this.si.config.metadata) !== null && _a !== void 0 ? _a : {};
    }
}
exports.KvStatusImpl = KvStatusImpl;
class KvStoredEntryImpl {
    constructor(bucket, prefixLen, sm) {
        this.bucket = bucket;
        this.prefixLen = prefixLen;
        this.sm = sm;
    }
    get key() {
        return this.sm.subject.substring(this.prefixLen);
    }
    get value() {
        return this.sm.data;
    }
    get delta() {
        return 0;
    }
    get created() {
        return this.sm.time;
    }
    get revision() {
        return this.sm.seq;
    }
    get operation() {
        return this.sm.header.get(exports.kvOperationHdr) || "PUT";
    }
    get length() {
        const slen = this.sm.header.get(types_1.JsHeaders.MessageSizeHdr) || "";
        if (slen !== "") {
            return parseInt(slen, 10);
        }
        return this.sm.data.length;
    }
    json() {
        return this.sm.json();
    }
    string() {
        return this.sm.string();
    }
}
class KvJsMsgEntryImpl {
    constructor(bucket, key, sm) {
        this.bucket = bucket;
        this.key = key;
        this.sm = sm;
    }
    get value() {
        return this.sm.data;
    }
    get created() {
        return new Date((0, jsutil_1.millis)(this.sm.info.timestampNanos));
    }
    get revision() {
        return this.sm.seq;
    }
    get operation() {
        var _a;
        return ((_a = this.sm.headers) === null || _a === void 0 ? void 0 : _a.get(exports.kvOperationHdr)) || "PUT";
    }
    get delta() {
        return this.sm.info.pending;
    }
    get length() {
        var _a;
        const slen = ((_a = this.sm.headers) === null || _a === void 0 ? void 0 : _a.get(types_1.JsHeaders.MessageSizeHdr)) || "";
        if (slen !== "") {
            return parseInt(slen, 10);
        }
        return this.sm.data.length;
    }
    json() {
        return this.sm.json();
    }
    string() {
        return this.sm.string();
    }
}
//# sourceMappingURL=kv.js.map

/***/ }),

/***/ 1469:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.consumerOpts = exports.StorageType = exports.RetentionPolicy = exports.RepublishHeaders = exports.ReplayPolicy = exports.JsHeaders = exports.DiscardPolicy = exports.DirectMsgHeaders = exports.DeliverPolicy = exports.ConsumerEvents = exports.ConsumerDebugEvents = exports.AdvisoryKind = exports.AckPolicy = exports.nanos = exports.millis = exports.isHeartbeatMsg = exports.isFlowControlMsg = exports.checkJsError = void 0;
/*
 * Copyright 2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var internal_mod_1 = __nccwpck_require__(6260);
Object.defineProperty(exports, "checkJsError", ({ enumerable: true, get: function () { return internal_mod_1.checkJsError; } }));
Object.defineProperty(exports, "isFlowControlMsg", ({ enumerable: true, get: function () { return internal_mod_1.isFlowControlMsg; } }));
Object.defineProperty(exports, "isHeartbeatMsg", ({ enumerable: true, get: function () { return internal_mod_1.isHeartbeatMsg; } }));
Object.defineProperty(exports, "millis", ({ enumerable: true, get: function () { return internal_mod_1.millis; } }));
Object.defineProperty(exports, "nanos", ({ enumerable: true, get: function () { return internal_mod_1.nanos; } }));
var internal_mod_2 = __nccwpck_require__(6260);
Object.defineProperty(exports, "AckPolicy", ({ enumerable: true, get: function () { return internal_mod_2.AckPolicy; } }));
Object.defineProperty(exports, "AdvisoryKind", ({ enumerable: true, get: function () { return internal_mod_2.AdvisoryKind; } }));
Object.defineProperty(exports, "ConsumerDebugEvents", ({ enumerable: true, get: function () { return internal_mod_2.ConsumerDebugEvents; } }));
Object.defineProperty(exports, "ConsumerEvents", ({ enumerable: true, get: function () { return internal_mod_2.ConsumerEvents; } }));
Object.defineProperty(exports, "DeliverPolicy", ({ enumerable: true, get: function () { return internal_mod_2.DeliverPolicy; } }));
Object.defineProperty(exports, "DirectMsgHeaders", ({ enumerable: true, get: function () { return internal_mod_2.DirectMsgHeaders; } }));
Object.defineProperty(exports, "DiscardPolicy", ({ enumerable: true, get: function () { return internal_mod_2.DiscardPolicy; } }));
Object.defineProperty(exports, "JsHeaders", ({ enumerable: true, get: function () { return internal_mod_2.JsHeaders; } }));
Object.defineProperty(exports, "ReplayPolicy", ({ enumerable: true, get: function () { return internal_mod_2.ReplayPolicy; } }));
Object.defineProperty(exports, "RepublishHeaders", ({ enumerable: true, get: function () { return internal_mod_2.RepublishHeaders; } }));
Object.defineProperty(exports, "RetentionPolicy", ({ enumerable: true, get: function () { return internal_mod_2.RetentionPolicy; } }));
Object.defineProperty(exports, "StorageType", ({ enumerable: true, get: function () { return internal_mod_2.StorageType; } }));
var types_1 = __nccwpck_require__(165);
Object.defineProperty(exports, "consumerOpts", ({ enumerable: true, get: function () { return types_1.consumerOpts; } }));
//# sourceMappingURL=mod.js.map

/***/ }),

/***/ 6636:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2022-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ObjectStoreImpl = exports.ObjectStoreStatusImpl = exports.objectStoreBucketName = exports.objectStoreStreamName = exports.digestType = exports.osPrefix = void 0;
const kv_1 = __nccwpck_require__(7249);
const base64_1 = __nccwpck_require__(753);
const codec_1 = __nccwpck_require__(2524);
const nuid_1 = __nccwpck_require__(6146);
const util_1 = __nccwpck_require__(4812);
const databuffer_1 = __nccwpck_require__(2155);
const headers_1 = __nccwpck_require__(24);
const types_1 = __nccwpck_require__(165);
const queued_iterator_1 = __nccwpck_require__(8450);
const sha256_1 = __nccwpck_require__(1663);
const jsapi_types_1 = __nccwpck_require__(4399);
const jsclient_1 = __nccwpck_require__(3101);
exports.osPrefix = "OBJ_";
exports.digestType = "SHA-256=";
function objectStoreStreamName(bucket) {
    (0, kv_1.validateBucket)(bucket);
    return `${exports.osPrefix}${bucket}`;
}
exports.objectStoreStreamName = objectStoreStreamName;
function objectStoreBucketName(stream) {
    if (stream.startsWith(exports.osPrefix)) {
        return stream.substring(4);
    }
    return stream;
}
exports.objectStoreBucketName = objectStoreBucketName;
class ObjectStoreStatusImpl {
    constructor(si) {
        this.si = si;
        this.backingStore = "JetStream";
    }
    get bucket() {
        return objectStoreBucketName(this.si.config.name);
    }
    get description() {
        var _a;
        return (_a = this.si.config.description) !== null && _a !== void 0 ? _a : "";
    }
    get ttl() {
        return this.si.config.max_age;
    }
    get storage() {
        return this.si.config.storage;
    }
    get replicas() {
        return this.si.config.num_replicas;
    }
    get sealed() {
        return this.si.config.sealed;
    }
    get size() {
        return this.si.state.bytes;
    }
    get streamInfo() {
        return this.si;
    }
    get metadata() {
        return this.si.config.metadata;
    }
}
exports.ObjectStoreStatusImpl = ObjectStoreStatusImpl;
class ObjectInfoImpl {
    constructor(oi) {
        this.info = oi;
    }
    get name() {
        return this.info.name;
    }
    get description() {
        var _a;
        return (_a = this.info.description) !== null && _a !== void 0 ? _a : "";
    }
    get headers() {
        if (!this.hdrs) {
            this.hdrs = headers_1.MsgHdrsImpl.fromRecord(this.info.headers || {});
        }
        return this.hdrs;
    }
    get options() {
        return this.info.options;
    }
    get bucket() {
        return this.info.bucket;
    }
    get chunks() {
        return this.info.chunks;
    }
    get deleted() {
        var _a;
        return (_a = this.info.deleted) !== null && _a !== void 0 ? _a : false;
    }
    get digest() {
        return this.info.digest;
    }
    get mtime() {
        return this.info.mtime;
    }
    get nuid() {
        return this.info.nuid;
    }
    get size() {
        return this.info.size;
    }
    get revision() {
        return this.info.revision;
    }
    get metadata() {
        return this.info.metadata || {};
    }
    isLink() {
        var _a;
        return ((_a = this.info.options) === null || _a === void 0 ? void 0 : _a.link) !== undefined;
    }
}
function toServerObjectStoreMeta(meta) {
    var _a;
    const v = {
        name: meta.name,
        description: (_a = meta.description) !== null && _a !== void 0 ? _a : "",
        options: meta.options,
        metadata: meta.metadata,
    };
    if (meta.headers) {
        const mhi = meta.headers;
        v.headers = mhi.toRecord();
    }
    return v;
}
function emptyReadableStream() {
    return new ReadableStream({
        pull(c) {
            c.enqueue(new Uint8Array(0));
            c.close();
        },
    });
}
class ObjectStoreImpl {
    constructor(name, jsm, js) {
        this.name = name;
        this.jsm = jsm;
        this.js = js;
    }
    _checkNotEmpty(name) {
        if (!name || name.length === 0) {
            return { name, error: new Error("name cannot be empty") };
        }
        return { name };
    }
    info(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this.rawInfo(name);
            return info ? new ObjectInfoImpl(info) : null;
        });
    }
    list() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const buf = [];
            const iter = yield this.watch({
                ignoreDeletes: true,
                includeHistory: true,
            });
            try {
                for (var _d = true, iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield iter_1.next(), _a = iter_1_1.done, !_a; _d = true) {
                    _c = iter_1_1.value;
                    _d = false;
                    const info = _c;
                    // watch will give a null when it has initialized
                    // for us that is the hint we are done
                    if (info === null) {
                        break;
                    }
                    buf.push(info);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iter_1.return)) yield _b.call(iter_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Promise.resolve(buf);
        });
    }
    rawInfo(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: obj, error } = this._checkNotEmpty(name);
            if (error) {
                return Promise.reject(error);
            }
            const meta = this._metaSubject(obj);
            try {
                const m = yield this.jsm.streams.getMessage(this.stream, {
                    last_by_subj: meta,
                });
                const jc = (0, codec_1.JSONCodec)();
                const soi = jc.decode(m.data);
                soi.revision = m.seq;
                return soi;
            }
            catch (err) {
                if (err.code === "404") {
                    return null;
                }
                return Promise.reject(err);
            }
        });
    }
    _si(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jsm.streams.info(this.stream, opts);
            }
            catch (err) {
                const nerr = err;
                if (nerr.code === "404") {
                    return null;
                }
                return Promise.reject(err);
            }
        });
    }
    seal() {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield this._si();
            if (info === null) {
                return Promise.reject(new Error("object store not found"));
            }
            info.config.sealed = true;
            info = yield this.jsm.streams.update(this.stream, info.config);
            return Promise.resolve(new ObjectStoreStatusImpl(info));
        });
    }
    status(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this._si(opts);
            if (info === null) {
                return Promise.reject(new Error("object store not found"));
            }
            return Promise.resolve(new ObjectStoreStatusImpl(info));
        });
    }
    destroy() {
        return this.jsm.streams.delete(this.stream);
    }
    _put(meta, rs, opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const jsopts = this.js.getOptions();
            opts = opts || { timeout: jsopts.timeout };
            opts.timeout = opts.timeout || jsopts.timeout;
            opts.previousRevision = (_a = opts.previousRevision) !== null && _a !== void 0 ? _a : undefined;
            const { timeout, previousRevision } = opts;
            const si = this.js.nc.info;
            const maxPayload = (si === null || si === void 0 ? void 0 : si.max_payload) || 1024;
            meta = meta || {};
            meta.options = meta.options || {};
            let maxChunk = ((_b = meta.options) === null || _b === void 0 ? void 0 : _b.max_chunk_size) || 128 * 1024;
            maxChunk = maxChunk > maxPayload ? maxPayload : maxChunk;
            meta.options.max_chunk_size = maxChunk;
            const old = yield this.info(meta.name);
            const { name: n, error } = this._checkNotEmpty(meta.name);
            if (error) {
                return Promise.reject(error);
            }
            const id = nuid_1.nuid.next();
            const chunkSubj = this._chunkSubject(id);
            const metaSubj = this._metaSubject(n);
            const info = Object.assign({
                bucket: this.name,
                nuid: id,
                size: 0,
                chunks: 0,
            }, toServerObjectStoreMeta(meta));
            const d = (0, util_1.deferred)();
            const proms = [];
            const db = new databuffer_1.DataBuffer();
            try {
                const reader = rs ? rs.getReader() : null;
                const sha = new sha256_1.SHA256();
                while (true) {
                    const { done, value } = reader
                        ? yield reader.read()
                        : { done: true, value: undefined };
                    if (done) {
                        // put any partial chunk in
                        if (db.size() > 0) {
                            const payload = db.drain();
                            sha.update(payload);
                            info.chunks++;
                            info.size += payload.length;
                            proms.push(this.js.publish(chunkSubj, payload, { timeout }));
                        }
                        // wait for all the chunks to write
                        yield Promise.all(proms);
                        proms.length = 0;
                        // prepare the metadata
                        info.mtime = new Date().toISOString();
                        const digest = sha.digest("base64");
                        const pad = digest.length % 3;
                        const padding = pad > 0 ? "=".repeat(pad) : "";
                        info.digest = `${exports.digestType}${digest}${padding}`;
                        info.deleted = false;
                        // trailing md for the object
                        const h = (0, headers_1.headers)();
                        if (typeof previousRevision === "number") {
                            h.set(jsclient_1.PubHeaders.ExpectedLastSubjectSequenceHdr, `${previousRevision}`);
                        }
                        h.set(types_1.JsHeaders.RollupHdr, types_1.JsHeaders.RollupValueSubject);
                        // try to update the metadata
                        const pa = yield this.js.publish(metaSubj, (0, codec_1.JSONCodec)().encode(info), {
                            headers: h,
                            timeout,
                        });
                        // update the revision to point to the sequence where we inserted
                        info.revision = pa.seq;
                        // if we are here, the new entry is live
                        if (old) {
                            try {
                                yield this.jsm.streams.purge(this.stream, {
                                    filter: `$O.${this.name}.C.${old.nuid}`,
                                });
                            }
                            catch (_err) {
                                // rejecting here, would mean send the wrong signal
                                // the update succeeded, but cleanup of old chunks failed.
                            }
                        }
                        // resolve the ObjectInfo
                        d.resolve(new ObjectInfoImpl(info));
                        // stop
                        break;
                    }
                    if (value) {
                        db.fill(value);
                        while (db.size() > maxChunk) {
                            info.chunks++;
                            info.size += maxChunk;
                            const payload = db.drain(meta.options.max_chunk_size);
                            sha.update(payload);
                            proms.push(this.js.publish(chunkSubj, payload, { timeout }));
                        }
                    }
                }
            }
            catch (err) {
                // we failed, remove any partials
                yield this.jsm.streams.purge(this.stream, { filter: chunkSubj });
                d.reject(err);
            }
            return d;
        });
    }
    putBlob(meta, data, opts) {
        function readableStreamFrom(data) {
            return new ReadableStream({
                pull(controller) {
                    controller.enqueue(data);
                    controller.close();
                },
            });
        }
        if (data === null) {
            data = new Uint8Array(0);
        }
        return this.put(meta, readableStreamFrom(data), opts);
    }
    put(meta, rs, opts) {
        var _a;
        if ((_a = meta === null || meta === void 0 ? void 0 : meta.options) === null || _a === void 0 ? void 0 : _a.link) {
            return Promise.reject(new Error("link cannot be set when putting the object in bucket"));
        }
        return this._put(meta, rs, opts);
    }
    getBlob(name) {
        return __awaiter(this, void 0, void 0, function* () {
            function fromReadableStream(rs) {
                return __awaiter(this, void 0, void 0, function* () {
                    const buf = new databuffer_1.DataBuffer();
                    const reader = rs.getReader();
                    while (true) {
                        const { done, value } = yield reader.read();
                        if (done) {
                            return buf.drain();
                        }
                        if (value && value.length) {
                            buf.fill(value);
                        }
                    }
                });
            }
            const r = yield this.get(name);
            if (r === null) {
                return Promise.resolve(null);
            }
            const vs = yield Promise.all([r.error, fromReadableStream(r.data)]);
            if (vs[0]) {
                return Promise.reject(vs[0]);
            }
            else {
                return Promise.resolve(vs[1]);
            }
        });
    }
    get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this.rawInfo(name);
            if (info === null) {
                return Promise.resolve(null);
            }
            if (info.deleted) {
                return Promise.resolve(null);
            }
            if (info.options && info.options.link) {
                const ln = info.options.link.name || "";
                if (ln === "") {
                    throw new Error("link is a bucket");
                }
                const os = info.options.link.bucket !== this.name
                    ? yield ObjectStoreImpl.create(this.js, info.options.link.bucket)
                    : this;
                return os.get(ln);
            }
            const d = (0, util_1.deferred)();
            const r = {
                info: new ObjectInfoImpl(info),
                error: d,
            };
            if (info.size === 0) {
                r.data = emptyReadableStream();
                d.resolve(null);
                return Promise.resolve(r);
            }
            let controller;
            const oc = (0, types_1.consumerOpts)();
            oc.orderedConsumer();
            const sha = new sha256_1.SHA256();
            const subj = `$O.${this.name}.C.${info.nuid}`;
            const sub = yield this.js.subscribe(subj, oc);
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a, e_2, _b, _c;
                try {
                    for (var _d = true, sub_1 = __asyncValues(sub), sub_1_1; sub_1_1 = yield sub_1.next(), _a = sub_1_1.done, !_a; _d = true) {
                        _c = sub_1_1.value;
                        _d = false;
                        const jm = _c;
                        if (jm.data.length > 0) {
                            sha.update(jm.data);
                            controller.enqueue(jm.data);
                        }
                        if (jm.info.pending === 0) {
                            const hash = sha.digest("base64");
                            // go pads the hash - which should be multiple of 3 - otherwise pads with '='
                            const pad = hash.length % 3;
                            const padding = pad > 0 ? "=".repeat(pad) : "";
                            const digest = `${exports.digestType}${hash}${padding}`;
                            if (digest !== info.digest) {
                                controller.error(new Error(`received a corrupt object, digests do not match received: ${info.digest} calculated ${digest}`));
                            }
                            else {
                                controller.close();
                            }
                            sub.unsubscribe();
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = sub_1.return)) yield _b.call(sub_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }))()
                .then(() => {
                d.resolve();
            })
                .catch((err) => {
                controller.error(err);
                d.reject(err);
            });
            r.data = new ReadableStream({
                start(c) {
                    controller = c;
                },
                cancel() {
                    sub.unsubscribe();
                },
            });
            return r;
        });
    }
    linkStore(name, bucket) {
        if (!(bucket instanceof ObjectStoreImpl)) {
            return Promise.reject("bucket required");
        }
        const osi = bucket;
        const { name: n, error } = this._checkNotEmpty(name);
        if (error) {
            return Promise.reject(error);
        }
        const meta = {
            name: n,
            options: { link: { bucket: osi.name } },
        };
        return this._put(meta, null);
    }
    link(name, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: n, error } = this._checkNotEmpty(name);
            if (error) {
                return Promise.reject(error);
            }
            if (info.deleted) {
                return Promise.reject(new Error("src object is deleted"));
            }
            if (info.isLink()) {
                return Promise.reject(new Error("src object is a link"));
            }
            const dest = yield this.rawInfo(name);
            if (dest !== null && !dest.deleted) {
                return Promise.reject(new Error("an object already exists with that name"));
            }
            const link = { bucket: info.bucket, name: info.name };
            const mm = {
                name: n,
                options: { link: link },
            };
            yield this.js.publish(this._metaSubject(name), JSON.stringify(mm));
            const i = yield this.info(name);
            return Promise.resolve(i);
        });
    }
    delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this.rawInfo(name);
            if (info === null) {
                return Promise.resolve({ purged: 0, success: false });
            }
            info.deleted = true;
            info.size = 0;
            info.chunks = 0;
            info.digest = "";
            const jc = (0, codec_1.JSONCodec)();
            const h = (0, headers_1.headers)();
            h.set(types_1.JsHeaders.RollupHdr, types_1.JsHeaders.RollupValueSubject);
            yield this.js.publish(this._metaSubject(info.name), jc.encode(info), {
                headers: h,
            });
            return this.jsm.streams.purge(this.stream, {
                filter: this._chunkSubject(info.nuid),
            });
        });
    }
    update(name, meta = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this.rawInfo(name);
            if (info === null) {
                return Promise.reject(new Error("object not found"));
            }
            if (info.deleted) {
                return Promise.reject(new Error("cannot update meta for a deleted object"));
            }
            meta.name = (_a = meta.name) !== null && _a !== void 0 ? _a : info.name;
            const { name: n, error } = this._checkNotEmpty(meta.name);
            if (error) {
                return Promise.reject(error);
            }
            if (name !== meta.name) {
                const i = yield this.info(meta.name);
                if (i && !i.deleted) {
                    return Promise.reject(new Error("an object already exists with that name"));
                }
            }
            meta.name = n;
            const ii = Object.assign({}, info, toServerObjectStoreMeta(meta));
            // if the name changed, delete the old meta
            const ack = yield this.js.publish(this._metaSubject(ii.name), JSON.stringify(ii));
            if (name !== meta.name) {
                yield this.jsm.streams.purge(this.stream, {
                    filter: this._metaSubject(name),
                });
            }
            return Promise.resolve(ack);
        });
    }
    watch(opts = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            opts.includeHistory = (_a = opts.includeHistory) !== null && _a !== void 0 ? _a : false;
            opts.ignoreDeletes = (_b = opts.ignoreDeletes) !== null && _b !== void 0 ? _b : false;
            let initialized = false;
            const qi = new queued_iterator_1.QueuedIteratorImpl();
            const subj = this._metaSubjectAll();
            try {
                yield this.jsm.streams.getMessage(this.stream, { last_by_subj: subj });
            }
            catch (err) {
                if (err.code === "404") {
                    qi.push(null);
                    initialized = true;
                }
                else {
                    qi.stop(err);
                }
            }
            const jc = (0, codec_1.JSONCodec)();
            const copts = (0, types_1.consumerOpts)();
            copts.orderedConsumer();
            if (opts.includeHistory) {
                copts.deliverLastPerSubject();
            }
            else {
                // FIXME: Go's implementation doesn't seem correct - if history is not desired
                //  the watch should only be giving notifications on new entries
                initialized = true;
                copts.deliverNew();
            }
            copts.callback((err, jm) => {
                var _a;
                if (err) {
                    qi.stop(err);
                    return;
                }
                if (jm !== null) {
                    const oi = jc.decode(jm.data);
                    if (oi.deleted && opts.ignoreDeletes === true) {
                        // do nothing
                    }
                    else {
                        qi.push(oi);
                    }
                    if (((_a = jm.info) === null || _a === void 0 ? void 0 : _a.pending) === 0 && !initialized) {
                        initialized = true;
                        qi.push(null);
                    }
                }
            });
            const sub = yield this.js.subscribe(subj, copts);
            qi._data = sub;
            qi.iterClosed.then(() => {
                sub.unsubscribe();
            });
            sub.closed.then(() => {
                qi.stop();
            }).catch((err) => {
                qi.stop(err);
            });
            return qi;
        });
    }
    _chunkSubject(id) {
        return `$O.${this.name}.C.${id}`;
    }
    _metaSubject(n) {
        return `$O.${this.name}.M.${base64_1.Base64UrlPaddedCodec.encode(n)}`;
    }
    _metaSubjectAll() {
        return `$O.${this.name}.M.>`;
    }
    init(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.stream = objectStoreStreamName(this.name);
            }
            catch (err) {
                return Promise.reject(err);
            }
            const max_age = (opts === null || opts === void 0 ? void 0 : opts.ttl) || 0;
            delete opts.ttl;
            const sc = Object.assign({ max_age }, opts);
            sc.name = this.stream;
            sc.allow_direct = true;
            sc.allow_rollup_hdrs = true;
            sc.discard = jsapi_types_1.DiscardPolicy.New;
            sc.subjects = [`$O.${this.name}.C.>`, `$O.${this.name}.M.>`];
            if (opts.placement) {
                sc.placement = opts.placement;
            }
            if (opts.metadata) {
                sc.metadata = opts.metadata;
            }
            try {
                yield this.jsm.streams.info(sc.name);
            }
            catch (err) {
                if (err.message === "stream not found") {
                    yield this.jsm.streams.add(sc);
                }
            }
        });
    }
    static create(js, name, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsm = yield js.jetstreamManager();
            const os = new ObjectStoreImpl(name, jsm, js);
            yield os.init(opts);
            return Promise.resolve(os);
        });
    }
}
exports.ObjectStoreImpl = ObjectStoreImpl;
//# sourceMappingURL=objectstore.js.map

/***/ }),

/***/ 165:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isConsumerOptsBuilder = exports.consumerOpts = exports.ConsumerOptsBuilderImpl = exports.kvPrefix = exports.RepublishHeaders = exports.DirectMsgHeaders = exports.KvWatchInclude = exports.JsHeaders = exports.AdvisoryKind = void 0;
const jsapi_types_1 = __nccwpck_require__(4399);
const jsutil_1 = __nccwpck_require__(1186);
/**
 * The different kinds of Advisories
 */
var AdvisoryKind;
(function (AdvisoryKind) {
    AdvisoryKind["API"] = "api_audit";
    AdvisoryKind["StreamAction"] = "stream_action";
    AdvisoryKind["ConsumerAction"] = "consumer_action";
    AdvisoryKind["SnapshotCreate"] = "snapshot_create";
    AdvisoryKind["SnapshotComplete"] = "snapshot_complete";
    AdvisoryKind["RestoreCreate"] = "restore_create";
    AdvisoryKind["RestoreComplete"] = "restore_complete";
    AdvisoryKind["MaxDeliver"] = "max_deliver";
    AdvisoryKind["Terminated"] = "terminated";
    AdvisoryKind["Ack"] = "consumer_ack";
    AdvisoryKind["StreamLeaderElected"] = "stream_leader_elected";
    AdvisoryKind["StreamQuorumLost"] = "stream_quorum_lost";
    AdvisoryKind["ConsumerLeaderElected"] = "consumer_leader_elected";
    AdvisoryKind["ConsumerQuorumLost"] = "consumer_quorum_lost";
})(AdvisoryKind || (exports.AdvisoryKind = AdvisoryKind = {}));
var JsHeaders;
(function (JsHeaders) {
    /**
     * Set if message is from a stream source - format is `stream seq`
     */
    JsHeaders["StreamSourceHdr"] = "Nats-Stream-Source";
    /**
     * Set for heartbeat messages
     */
    JsHeaders["LastConsumerSeqHdr"] = "Nats-Last-Consumer";
    /**
     * Set for heartbeat messages
     */
    JsHeaders["LastStreamSeqHdr"] = "Nats-Last-Stream";
    /**
     * Set for heartbeat messages if the consumer is stalled
     */
    JsHeaders["ConsumerStalledHdr"] = "Nats-Consumer-Stalled";
    /**
     * Set for headers_only consumers indicates the number of bytes in the payload
     */
    JsHeaders["MessageSizeHdr"] = "Nats-Msg-Size";
    // rollup header
    JsHeaders["RollupHdr"] = "Nats-Rollup";
    // value for rollup header when rolling up a subject
    JsHeaders["RollupValueSubject"] = "sub";
    // value for rollup header when rolling up all subjects
    JsHeaders["RollupValueAll"] = "all";
    /**
     * Set on protocol messages to indicate pull request message count that
     * was not honored.
     */
    JsHeaders["PendingMessagesHdr"] = "Nats-Pending-Messages";
    /**
     * Set on protocol messages to indicate pull request byte count that
     * was not honored
     */
    JsHeaders["PendingBytesHdr"] = "Nats-Pending-Bytes";
})(JsHeaders || (exports.JsHeaders = JsHeaders = {}));
var KvWatchInclude;
(function (KvWatchInclude) {
    /**
     * Include the last value for all the keys
     */
    KvWatchInclude["LastValue"] = "";
    /**
     * Include all available history for all keys
     */
    KvWatchInclude["AllHistory"] = "history";
    /**
     * Don't include history or last values, only notify
     * of updates
     */
    KvWatchInclude["UpdatesOnly"] = "updates";
})(KvWatchInclude || (exports.KvWatchInclude = KvWatchInclude = {}));
var DirectMsgHeaders;
(function (DirectMsgHeaders) {
    DirectMsgHeaders["Stream"] = "Nats-Stream";
    DirectMsgHeaders["Sequence"] = "Nats-Sequence";
    DirectMsgHeaders["TimeStamp"] = "Nats-Time-Stamp";
    DirectMsgHeaders["Subject"] = "Nats-Subject";
})(DirectMsgHeaders || (exports.DirectMsgHeaders = DirectMsgHeaders = {}));
var RepublishHeaders;
(function (RepublishHeaders) {
    /**
     * The source stream of the message
     */
    RepublishHeaders["Stream"] = "Nats-Stream";
    /**
     * The original subject of the message
     */
    RepublishHeaders["Subject"] = "Nats-Subject";
    /**
     * The sequence of the republished message
     */
    RepublishHeaders["Sequence"] = "Nats-Sequence";
    /**
     * The stream sequence id of the last message ingested to the same original subject (or 0 if none or deleted)
     */
    RepublishHeaders["LastSequence"] = "Nats-Last-Sequence";
    /**
     * The size in bytes of the message's body - Only if {@link Republish#headers_only} is set.
     */
    RepublishHeaders["Size"] = "Nats-Msg-Size";
})(RepublishHeaders || (exports.RepublishHeaders = RepublishHeaders = {}));
exports.kvPrefix = "KV_";
// FIXME: some items here that may need to be addressed
// 503s?
// maxRetries()
// retryBackoff()
// ackWait(time)
// replayOriginal()
// rateLimit(bytesPerSec)
class ConsumerOptsBuilderImpl {
    constructor(opts) {
        this.stream = "";
        this.mack = false;
        this.ordered = false;
        this.config = (0, jsapi_types_1.defaultConsumer)("", opts || {});
    }
    getOpts() {
        var _a;
        const o = {};
        o.config = Object.assign({}, this.config);
        if (o.config.filter_subject) {
            this.filterSubject(o.config.filter_subject);
            o.config.filter_subject = undefined;
        }
        if (o.config.filter_subjects) {
            (_a = o.config.filter_subjects) === null || _a === void 0 ? void 0 : _a.forEach((v) => {
                this.filterSubject(v);
            });
            o.config.filter_subjects = undefined;
        }
        o.mack = this.mack;
        o.stream = this.stream;
        o.callbackFn = this.callbackFn;
        o.max = this.max;
        o.queue = this.qname;
        o.ordered = this.ordered;
        o.config.ack_policy = o.ordered ? jsapi_types_1.AckPolicy.None : o.config.ack_policy;
        o.isBind = o.isBind || false;
        if (this.filters) {
            switch (this.filters.length) {
                case 0:
                    break;
                case 1:
                    o.config.filter_subject = this.filters[0];
                    break;
                default:
                    o.config.filter_subjects = this.filters;
            }
        }
        return o;
    }
    description(description) {
        this.config.description = description;
        return this;
    }
    deliverTo(subject) {
        this.config.deliver_subject = subject;
        return this;
    }
    durable(name) {
        (0, jsutil_1.validateDurableName)(name);
        this.config.durable_name = name;
        return this;
    }
    startSequence(seq) {
        if (seq <= 0) {
            throw new Error("sequence must be greater than 0");
        }
        this.config.deliver_policy = jsapi_types_1.DeliverPolicy.StartSequence;
        this.config.opt_start_seq = seq;
        return this;
    }
    startTime(time) {
        this.config.deliver_policy = jsapi_types_1.DeliverPolicy.StartTime;
        this.config.opt_start_time = time.toISOString();
        return this;
    }
    deliverAll() {
        this.config.deliver_policy = jsapi_types_1.DeliverPolicy.All;
        return this;
    }
    deliverLastPerSubject() {
        this.config.deliver_policy = jsapi_types_1.DeliverPolicy.LastPerSubject;
        return this;
    }
    deliverLast() {
        this.config.deliver_policy = jsapi_types_1.DeliverPolicy.Last;
        return this;
    }
    deliverNew() {
        this.config.deliver_policy = jsapi_types_1.DeliverPolicy.New;
        return this;
    }
    startAtTimeDelta(millis) {
        this.startTime(new Date(Date.now() - millis));
        return this;
    }
    headersOnly() {
        this.config.headers_only = true;
        return this;
    }
    ackNone() {
        this.config.ack_policy = jsapi_types_1.AckPolicy.None;
        return this;
    }
    ackAll() {
        this.config.ack_policy = jsapi_types_1.AckPolicy.All;
        return this;
    }
    ackExplicit() {
        this.config.ack_policy = jsapi_types_1.AckPolicy.Explicit;
        return this;
    }
    ackWait(millis) {
        this.config.ack_wait = (0, jsutil_1.nanos)(millis);
        return this;
    }
    maxDeliver(max) {
        this.config.max_deliver = max;
        return this;
    }
    filterSubject(s) {
        this.filters = this.filters || [];
        this.filters.push(s);
        return this;
    }
    replayInstantly() {
        this.config.replay_policy = jsapi_types_1.ReplayPolicy.Instant;
        return this;
    }
    replayOriginal() {
        this.config.replay_policy = jsapi_types_1.ReplayPolicy.Original;
        return this;
    }
    sample(n) {
        n = Math.trunc(n);
        if (n < 0 || n > 100) {
            throw new Error(`value must be between 0-100`);
        }
        this.config.sample_freq = `${n}%`;
        return this;
    }
    limit(n) {
        this.config.rate_limit_bps = n;
        return this;
    }
    maxWaiting(max) {
        this.config.max_waiting = max;
        return this;
    }
    maxAckPending(max) {
        this.config.max_ack_pending = max;
        return this;
    }
    idleHeartbeat(millis) {
        this.config.idle_heartbeat = (0, jsutil_1.nanos)(millis);
        return this;
    }
    flowControl() {
        this.config.flow_control = true;
        return this;
    }
    deliverGroup(name) {
        this.queue(name);
        return this;
    }
    manualAck() {
        this.mack = true;
        return this;
    }
    maxMessages(max) {
        this.max = max;
        return this;
    }
    callback(fn) {
        this.callbackFn = fn;
        return this;
    }
    queue(n) {
        this.qname = n;
        this.config.deliver_group = n;
        return this;
    }
    orderedConsumer() {
        this.ordered = true;
        return this;
    }
    bind(stream, durable) {
        this.stream = stream;
        this.config.durable_name = durable;
        this.isBind = true;
        return this;
    }
    bindStream(stream) {
        this.stream = stream;
        return this;
    }
    inactiveEphemeralThreshold(millis) {
        this.config.inactive_threshold = (0, jsutil_1.nanos)(millis);
        return this;
    }
    maxPullBatch(n) {
        this.config.max_batch = n;
        return this;
    }
    maxPullRequestExpires(millis) {
        this.config.max_expires = (0, jsutil_1.nanos)(millis);
        return this;
    }
    memory() {
        this.config.mem_storage = true;
        return this;
    }
    numReplicas(n) {
        this.config.num_replicas = n;
        return this;
    }
}
exports.ConsumerOptsBuilderImpl = ConsumerOptsBuilderImpl;
function consumerOpts(opts) {
    return new ConsumerOptsBuilderImpl(opts);
}
exports.consumerOpts = consumerOpts;
function isConsumerOptsBuilder(o) {
    return typeof o.getOpts === "function";
}
exports.isConsumerOptsBuilder = isConsumerOptsBuilder;
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1986:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.credsAuthenticator = exports.jwtAuthenticator = exports.nkeyAuthenticator = exports.tokenAuthenticator = exports.usernamePasswordAuthenticator = exports.noAuthFn = exports.multiAuthenticator = void 0;
/*
 * Copyright 2020-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const nkeys_1 = __nccwpck_require__(4215);
const encoders_1 = __nccwpck_require__(5450);
const core_1 = __nccwpck_require__(9498);
function multiAuthenticator(authenticators) {
    return (nonce) => {
        let auth = {};
        authenticators.forEach((a) => {
            const args = a(nonce) || {};
            auth = Object.assign(auth, args);
        });
        return auth;
    };
}
exports.multiAuthenticator = multiAuthenticator;
function noAuthFn() {
    return () => {
        return;
    };
}
exports.noAuthFn = noAuthFn;
/**
 * Returns a user/pass authenticator for the specified user and optional password
 * @param { string | () => string } user
 * @param {string | () => string } pass
 * @return {UserPass}
 */
function usernamePasswordAuthenticator(user, pass) {
    return () => {
        const u = typeof user === "function" ? user() : user;
        const p = typeof pass === "function" ? pass() : pass;
        return { user: u, pass: p };
    };
}
exports.usernamePasswordAuthenticator = usernamePasswordAuthenticator;
/**
 * Returns a token authenticator for the specified token
 * @param { string | () => string } token
 * @return {TokenAuth}
 */
function tokenAuthenticator(token) {
    return () => {
        const auth_token = typeof token === "function" ? token() : token;
        return { auth_token };
    };
}
exports.tokenAuthenticator = tokenAuthenticator;
/**
 * Returns an Authenticator that returns a NKeyAuth based that uses the
 * specified seed or function returning a seed.
 * @param {Uint8Array | (() => Uint8Array)} seed - the nkey seed
 * @return {NKeyAuth}
 */
function nkeyAuthenticator(seed) {
    return (nonce) => {
        const s = typeof seed === "function" ? seed() : seed;
        const kp = s ? nkeys_1.nkeys.fromSeed(s) : undefined;
        const nkey = kp ? kp.getPublicKey() : "";
        const challenge = encoders_1.TE.encode(nonce || "");
        const sigBytes = kp !== undefined && nonce ? kp.sign(challenge) : undefined;
        const sig = sigBytes ? nkeys_1.nkeys.encode(sigBytes) : "";
        return { nkey, sig };
    };
}
exports.nkeyAuthenticator = nkeyAuthenticator;
/**
 * Returns an Authenticator function that returns a JwtAuth.
 * If a seed is provided, the public key, and signature are
 * calculated.
 *
 * @param {string | ()=>string} ajwt - the jwt
 * @param {Uint8Array | ()=> Uint8Array } seed - the optional nkey seed
 * @return {Authenticator}
 */
function jwtAuthenticator(ajwt, seed) {
    return (nonce) => {
        const jwt = typeof ajwt === "function" ? ajwt() : ajwt;
        const fn = nkeyAuthenticator(seed);
        const { nkey, sig } = fn(nonce);
        return { jwt, nkey, sig };
    };
}
exports.jwtAuthenticator = jwtAuthenticator;
/**
 * Returns an Authenticator function that returns a JwtAuth.
 * This is a convenience Authenticator that parses the
 * specified creds and delegates to the jwtAuthenticator.
 * @param {Uint8Array | () => Uint8Array } creds - the contents of a creds file or a function that returns the creds
 * @returns {JwtAuth}
 */
function credsAuthenticator(creds) {
    const fn = typeof creds !== "function" ? () => creds : creds;
    const parse = () => {
        const CREDS = /\s*(?:(?:[-]{3,}[^\n]*[-]{3,}\n)(.+)(?:\n\s*[-]{3,}[^\n]*[-]{3,}\n))/ig;
        const s = encoders_1.TD.decode(fn());
        // get the JWT
        let m = CREDS.exec(s);
        if (!m) {
            throw core_1.NatsError.errorForCode(core_1.ErrorCode.BadCreds);
        }
        const jwt = m[1].trim();
        // get the nkey
        m = CREDS.exec(s);
        if (!m) {
            throw core_1.NatsError.errorForCode(core_1.ErrorCode.BadCreds);
        }
        if (!m) {
            throw core_1.NatsError.errorForCode(core_1.ErrorCode.BadCreds);
        }
        const seed = encoders_1.TE.encode(m[1].trim());
        return { jwt, seed };
    };
    const jwtFn = () => {
        const { jwt } = parse();
        return jwt;
    };
    const nkeyFn = () => {
        const { seed } = parse();
        return seed;
    };
    return jwtAuthenticator(jwtFn, nkeyFn);
}
exports.credsAuthenticator = credsAuthenticator;
//# sourceMappingURL=authenticator.js.map

/***/ }),

/***/ 753:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Base64UrlPaddedCodec = exports.Base64UrlCodec = exports.Base64Codec = void 0;
class Base64Codec {
    static encode(bytes) {
        if (typeof bytes === "string") {
            return btoa(bytes);
        }
        const a = Array.from(bytes);
        return btoa(String.fromCharCode(...a));
    }
    static decode(s, binary = false) {
        const bin = atob(s);
        if (!binary) {
            return bin;
        }
        return Uint8Array.from(bin, (c) => c.charCodeAt(0));
    }
}
exports.Base64Codec = Base64Codec;
class Base64UrlCodec {
    static encode(bytes) {
        return Base64UrlCodec.toB64URLEncoding(Base64Codec.encode(bytes));
    }
    static decode(s, binary = false) {
        return Base64Codec.decode(Base64UrlCodec.fromB64URLEncoding(s), binary);
    }
    static toB64URLEncoding(b64str) {
        return b64str
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
    static fromB64URLEncoding(b64str) {
        // pads are % 4, but not necessary on decoding
        return b64str
            .replace(/_/g, "/")
            .replace(/-/g, "+");
    }
}
exports.Base64UrlCodec = Base64UrlCodec;
class Base64UrlPaddedCodec {
    static encode(bytes) {
        return Base64UrlPaddedCodec.toB64URLEncoding(Base64Codec.encode(bytes));
    }
    static decode(s, binary = false) {
        return Base64UrlPaddedCodec.decode(Base64UrlPaddedCodec.fromB64URLEncoding(s), binary);
    }
    static toB64URLEncoding(b64str) {
        return b64str
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
    static fromB64URLEncoding(b64str) {
        // pads are % 4, but not necessary on decoding
        return b64str
            .replace(/_/g, "/")
            .replace(/-/g, "+");
    }
}
exports.Base64UrlPaddedCodec = Base64UrlPaddedCodec;
//# sourceMappingURL=base64.js.map

/***/ }),

/***/ 1444:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2020-2022 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bench = exports.Metric = void 0;
const types_1 = __nccwpck_require__(3829);
const nuid_1 = __nccwpck_require__(6146);
const util_1 = __nccwpck_require__(4812);
const core_1 = __nccwpck_require__(9498);
class Metric {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
        this.date = Date.now();
        this.payload = 0;
        this.msgs = 0;
        this.bytes = 0;
    }
    toString() {
        const sec = (this.duration) / 1000;
        const mps = Math.round(this.msgs / sec);
        const label = this.asyncRequests ? "asyncRequests" : "";
        let minmax = "";
        if (this.max) {
            minmax = `${this.min}/${this.max}`;
        }
        return `${this.name}${label ? " [asyncRequests]" : ""} ${humanizeNumber(mps)} msgs/sec - [${sec.toFixed(2)} secs] ~ ${throughput(this.bytes, sec)} ${minmax}`;
    }
    toCsv() {
        return `"${this.name}",${new Date(this.date).toISOString()},${this.lang},${this.version},${this.msgs},${this.payload},${this.bytes},${this.duration},${this.asyncRequests ? this.asyncRequests : false}\n`;
    }
    static header() {
        return `Test,Date,Lang,Version,Count,MsgPayload,Bytes,Millis,Async\n`;
    }
}
exports.Metric = Metric;
class Bench {
    constructor(nc, opts = {
        msgs: 100000,
        size: 128,
        subject: "",
        asyncRequests: false,
        pub: false,
        sub: false,
        req: false,
        rep: false,
    }) {
        this.nc = nc;
        this.callbacks = opts.callbacks || false;
        this.msgs = opts.msgs || 0;
        this.size = opts.size || 0;
        this.subject = opts.subject || nuid_1.nuid.next();
        this.asyncRequests = opts.asyncRequests || false;
        this.pub = opts.pub || false;
        this.sub = opts.sub || false;
        this.req = opts.req || false;
        this.rep = opts.rep || false;
        this.perf = new util_1.Perf();
        this.payload = this.size ? new Uint8Array(this.size) : types_1.Empty;
        if (!this.pub && !this.sub && !this.req && !this.rep) {
            throw new Error("no bench option selected");
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.nc.closed()
                .then((err) => {
                if (err) {
                    throw new core_1.NatsError(`bench closed with an error: ${err.message}`, core_1.ErrorCode.Unknown, err);
                }
            });
            if (this.callbacks) {
                yield this.runCallbacks();
            }
            else {
                yield this.runAsync();
            }
            return this.processMetrics();
        });
    }
    processMetrics() {
        const nc = this.nc;
        const { lang, version } = nc.protocol.transport;
        if (this.pub && this.sub) {
            this.perf.measure("pubsub", "pubStart", "subStop");
        }
        if (this.req && this.rep) {
            this.perf.measure("reqrep", "reqStart", "reqStop");
        }
        const measures = this.perf.getEntries();
        const pubsub = measures.find((m) => m.name === "pubsub");
        const reqrep = measures.find((m) => m.name === "reqrep");
        const req = measures.find((m) => m.name === "req");
        const rep = measures.find((m) => m.name === "rep");
        const pub = measures.find((m) => m.name === "pub");
        const sub = measures.find((m) => m.name === "sub");
        const stats = this.nc.stats();
        const metrics = [];
        if (pubsub) {
            const { name, duration } = pubsub;
            const m = new Metric(name, duration);
            m.msgs = this.msgs * 2;
            m.bytes = stats.inBytes + stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
        }
        if (reqrep) {
            const { name, duration } = reqrep;
            const m = new Metric(name, duration);
            m.msgs = this.msgs * 2;
            m.bytes = stats.inBytes + stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
        }
        if (pub) {
            const { name, duration } = pub;
            const m = new Metric(name, duration);
            m.msgs = this.msgs;
            m.bytes = stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
        }
        if (sub) {
            const { name, duration } = sub;
            const m = new Metric(name, duration);
            m.msgs = this.msgs;
            m.bytes = stats.inBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
        }
        if (rep) {
            const { name, duration } = rep;
            const m = new Metric(name, duration);
            m.msgs = this.msgs;
            m.bytes = stats.inBytes + stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
        }
        if (req) {
            const { name, duration } = req;
            const m = new Metric(name, duration);
            m.msgs = this.msgs;
            m.bytes = stats.inBytes + stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
        }
        return metrics;
    }
    runCallbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = [];
            if (this.sub) {
                const d = (0, util_1.deferred)();
                jobs.push(d);
                let i = 0;
                this.nc.subscribe(this.subject, {
                    max: this.msgs,
                    callback: () => {
                        i++;
                        if (i === 1) {
                            this.perf.mark("subStart");
                        }
                        if (i === this.msgs) {
                            this.perf.mark("subStop");
                            this.perf.measure("sub", "subStart", "subStop");
                            d.resolve();
                        }
                    },
                });
            }
            if (this.rep) {
                const d = (0, util_1.deferred)();
                jobs.push(d);
                let i = 0;
                this.nc.subscribe(this.subject, {
                    max: this.msgs,
                    callback: (_, m) => {
                        m.respond(this.payload);
                        i++;
                        if (i === 1) {
                            this.perf.mark("repStart");
                        }
                        if (i === this.msgs) {
                            this.perf.mark("repStop");
                            this.perf.measure("rep", "repStart", "repStop");
                            d.resolve();
                        }
                    },
                });
            }
            if (this.pub) {
                const job = (() => __awaiter(this, void 0, void 0, function* () {
                    this.perf.mark("pubStart");
                    for (let i = 0; i < this.msgs; i++) {
                        this.nc.publish(this.subject, this.payload);
                    }
                    yield this.nc.flush();
                    this.perf.mark("pubStop");
                    this.perf.measure("pub", "pubStart", "pubStop");
                }))();
                jobs.push(job);
            }
            if (this.req) {
                const job = (() => __awaiter(this, void 0, void 0, function* () {
                    if (this.asyncRequests) {
                        this.perf.mark("reqStart");
                        const a = [];
                        for (let i = 0; i < this.msgs; i++) {
                            a.push(this.nc.request(this.subject, this.payload, { timeout: 20000 }));
                        }
                        yield Promise.all(a);
                        this.perf.mark("reqStop");
                        this.perf.measure("req", "reqStart", "reqStop");
                    }
                    else {
                        this.perf.mark("reqStart");
                        for (let i = 0; i < this.msgs; i++) {
                            yield this.nc.request(this.subject);
                        }
                        this.perf.mark("reqStop");
                        this.perf.measure("req", "reqStart", "reqStop");
                    }
                }))();
                jobs.push(job);
            }
            yield Promise.all(jobs);
        });
    }
    runAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = [];
            if (this.rep) {
                let first = false;
                const sub = this.nc.subscribe(this.subject, { max: this.msgs });
                const job = (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, e_1, _b, _c;
                    try {
                        for (var _d = true, sub_1 = __asyncValues(sub), sub_1_1; sub_1_1 = yield sub_1.next(), _a = sub_1_1.done, !_a; _d = true) {
                            _c = sub_1_1.value;
                            _d = false;
                            const m = _c;
                            if (!first) {
                                this.perf.mark("repStart");
                                first = true;
                            }
                            m.respond(this.payload);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = sub_1.return)) yield _b.call(sub_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    yield this.nc.flush();
                    this.perf.mark("repStop");
                    this.perf.measure("rep", "repStart", "repStop");
                }))();
                jobs.push(job);
            }
            if (this.sub) {
                let first = false;
                const sub = this.nc.subscribe(this.subject, { max: this.msgs });
                const job = (() => __awaiter(this, void 0, void 0, function* () {
                    var _e, e_2, _f, _g;
                    try {
                        for (var _h = true, sub_2 = __asyncValues(sub), sub_2_1; sub_2_1 = yield sub_2.next(), _e = sub_2_1.done, !_e; _h = true) {
                            _g = sub_2_1.value;
                            _h = false;
                            const _m = _g;
                            if (!first) {
                                this.perf.mark("subStart");
                                first = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_h && !_e && (_f = sub_2.return)) yield _f.call(sub_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    this.perf.mark("subStop");
                    this.perf.measure("sub", "subStart", "subStop");
                }))();
                jobs.push(job);
            }
            if (this.pub) {
                const job = (() => __awaiter(this, void 0, void 0, function* () {
                    this.perf.mark("pubStart");
                    for (let i = 0; i < this.msgs; i++) {
                        this.nc.publish(this.subject, this.payload);
                    }
                    yield this.nc.flush();
                    this.perf.mark("pubStop");
                    this.perf.measure("pub", "pubStart", "pubStop");
                }))();
                jobs.push(job);
            }
            if (this.req) {
                const job = (() => __awaiter(this, void 0, void 0, function* () {
                    if (this.asyncRequests) {
                        this.perf.mark("reqStart");
                        const a = [];
                        for (let i = 0; i < this.msgs; i++) {
                            a.push(this.nc.request(this.subject, this.payload, { timeout: 20000 }));
                        }
                        yield Promise.all(a);
                        this.perf.mark("reqStop");
                        this.perf.measure("req", "reqStart", "reqStop");
                    }
                    else {
                        this.perf.mark("reqStart");
                        for (let i = 0; i < this.msgs; i++) {
                            yield this.nc.request(this.subject);
                        }
                        this.perf.mark("reqStop");
                        this.perf.measure("req", "reqStart", "reqStop");
                    }
                }))();
                jobs.push(job);
            }
            yield Promise.all(jobs);
        });
    }
}
exports.Bench = Bench;
function throughput(bytes, seconds) {
    return humanizeBytes(bytes / seconds);
}
function humanizeBytes(bytes, si = false) {
    const base = si ? 1000 : 1024;
    const pre = si
        ? ["k", "M", "G", "T", "P", "E"]
        : ["K", "M", "G", "T", "P", "E"];
    const post = si ? "iB" : "B";
    if (bytes < base) {
        return `${bytes.toFixed(2)} ${post}/sec`;
    }
    const exp = parseInt(Math.log(bytes) / Math.log(base) + "");
    const index = parseInt((exp - 1) + "");
    return `${(bytes / Math.pow(base, exp)).toFixed(2)} ${pre[index]}${post}/sec`;
}
function humanizeNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//# sourceMappingURL=bench.js.map

/***/ }),

/***/ 2524:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2020-2022 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JSONCodec = exports.StringCodec = void 0;
const encoders_1 = __nccwpck_require__(5450);
const core_1 = __nccwpck_require__(9498);
/**
 * Returns a {@link Codec} for encoding strings to a message payload
 * and decoding message payloads into strings.
 * @constructor
 */
function StringCodec() {
    return {
        encode(d) {
            return encoders_1.TE.encode(d);
        },
        decode(a) {
            return encoders_1.TD.decode(a);
        },
    };
}
exports.StringCodec = StringCodec;
/**
 * Returns a {@link Codec}  for encoding JavaScript object to JSON and
 * serialize them to an Uint8Array, and conversely, from an
 * Uint8Array to JSON to a JavaScript Object.
 * @param reviver
 * @constructor
 */
function JSONCodec(reviver) {
    return {
        encode(d) {
            try {
                if (d === undefined) {
                    // @ts-ignore: json will not handle undefined
                    d = null;
                }
                return encoders_1.TE.encode(JSON.stringify(d));
            }
            catch (err) {
                throw core_1.NatsError.errorForCode(core_1.ErrorCode.BadJson, err);
            }
        },
        decode(a) {
            try {
                return JSON.parse(encoders_1.TD.decode(a), reviver);
            }
            catch (err) {
                throw core_1.NatsError.errorForCode(core_1.ErrorCode.BadJson, err);
            }
        },
    };
}
exports.JSONCodec = JSONCodec;
//# sourceMappingURL=codec.js.map

/***/ }),

/***/ 9498:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceVerb = exports.DEFAULT_HOST = exports.DEFAULT_PORT = exports.createInbox = exports.ServiceError = exports.ServiceErrorCodeHeader = exports.ServiceErrorHeader = exports.ServiceResponseType = exports.RequestStrategy = exports.Match = exports.NatsError = exports.Messages = exports.isNatsError = exports.ErrorCode = exports.DebugEvents = exports.Events = void 0;
const nuid_1 = __nccwpck_require__(6146);
/**
 * Events reported by the {@link NatsConnection#status} iterator.
 */
var Events;
(function (Events) {
    /** Client disconnected */
    Events["Disconnect"] = "disconnect";
    /** Client reconnected */
    Events["Reconnect"] = "reconnect";
    /** Client received a cluster update */
    Events["Update"] = "update";
    /** Client received a signal telling it that the server is transitioning to Lame Duck Mode */
    Events["LDM"] = "ldm";
    /** Client received an async error from the server */
    Events["Error"] = "error";
})(Events || (exports.Events = Events = {}));
/**
 * Other events that can be reported by the {@link NatsConnection#status} iterator.
 * These can usually be safely ignored, as higher-order functionality of the client
 * will handle them.
 */
var DebugEvents;
(function (DebugEvents) {
    DebugEvents["Reconnecting"] = "reconnecting";
    DebugEvents["PingTimer"] = "pingTimer";
    DebugEvents["StaleConnection"] = "staleConnection";
})(DebugEvents || (exports.DebugEvents = DebugEvents = {}));
var ErrorCode;
(function (ErrorCode) {
    // emitted by the client
    ErrorCode["ApiError"] = "BAD API";
    ErrorCode["BadAuthentication"] = "BAD_AUTHENTICATION";
    ErrorCode["BadCreds"] = "BAD_CREDS";
    ErrorCode["BadHeader"] = "BAD_HEADER";
    ErrorCode["BadJson"] = "BAD_JSON";
    ErrorCode["BadPayload"] = "BAD_PAYLOAD";
    ErrorCode["BadSubject"] = "BAD_SUBJECT";
    ErrorCode["Cancelled"] = "CANCELLED";
    ErrorCode["ConnectionClosed"] = "CONNECTION_CLOSED";
    ErrorCode["ConnectionDraining"] = "CONNECTION_DRAINING";
    ErrorCode["ConnectionRefused"] = "CONNECTION_REFUSED";
    ErrorCode["ConnectionTimeout"] = "CONNECTION_TIMEOUT";
    ErrorCode["Disconnect"] = "DISCONNECT";
    ErrorCode["InvalidOption"] = "INVALID_OPTION";
    ErrorCode["InvalidPayload"] = "INVALID_PAYLOAD";
    ErrorCode["MaxPayloadExceeded"] = "MAX_PAYLOAD_EXCEEDED";
    ErrorCode["NoResponders"] = "503";
    ErrorCode["NotFunction"] = "NOT_FUNC";
    ErrorCode["RequestError"] = "REQUEST_ERROR";
    ErrorCode["ServerOptionNotAvailable"] = "SERVER_OPT_NA";
    ErrorCode["SubClosed"] = "SUB_CLOSED";
    ErrorCode["SubDraining"] = "SUB_DRAINING";
    ErrorCode["Timeout"] = "TIMEOUT";
    ErrorCode["Tls"] = "TLS";
    ErrorCode["Unknown"] = "UNKNOWN_ERROR";
    ErrorCode["WssRequired"] = "WSS_REQUIRED";
    // jetstream
    ErrorCode["JetStreamInvalidAck"] = "JESTREAM_INVALID_ACK";
    ErrorCode["JetStream404NoMessages"] = "404";
    ErrorCode["JetStream408RequestTimeout"] = "408";
    //@deprecated: use JetStream409
    ErrorCode["JetStream409MaxAckPendingExceeded"] = "409";
    ErrorCode["JetStream409"] = "409";
    ErrorCode["JetStreamNotEnabled"] = "503";
    ErrorCode["JetStreamIdleHeartBeat"] = "IDLE_HEARTBEAT";
    // emitted by the server
    ErrorCode["AuthorizationViolation"] = "AUTHORIZATION_VIOLATION";
    ErrorCode["AuthenticationExpired"] = "AUTHENTICATION_EXPIRED";
    ErrorCode["ProtocolError"] = "NATS_PROTOCOL_ERR";
    ErrorCode["PermissionsViolation"] = "PERMISSIONS_VIOLATION";
    ErrorCode["AuthenticationTimeout"] = "AUTHENTICATION_TIMEOUT";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
function isNatsError(err) {
    return typeof err.code === "string";
}
exports.isNatsError = isNatsError;
class Messages {
    constructor() {
        this.messages = new Map();
        this.messages.set(ErrorCode.InvalidPayload, "Invalid payload type - payloads can be 'binary', 'string', or 'json'");
        this.messages.set(ErrorCode.BadJson, "Bad JSON");
        this.messages.set(ErrorCode.WssRequired, "TLS is required, therefore a secure websocket connection is also required");
    }
    static getMessage(s) {
        return messages.getMessage(s);
    }
    getMessage(s) {
        return this.messages.get(s) || s;
    }
}
exports.Messages = Messages;
// safari doesn't support static class members
const messages = new Messages();
class NatsError extends Error {
    /**
     * @param {String} message
     * @param {String} code
     * @param {Error} [chainedError]
     * @constructor
     *
     * @api private
     */
    constructor(message, code, chainedError) {
        super(message);
        this.name = "NatsError";
        this.message = message;
        this.code = code;
        this.chainedError = chainedError;
    }
    static errorForCode(code, chainedError) {
        const m = Messages.getMessage(code);
        return new NatsError(m, code, chainedError);
    }
    isAuthError() {
        return this.code === ErrorCode.AuthenticationExpired ||
            this.code === ErrorCode.AuthorizationViolation;
    }
    isAuthTimeout() {
        return this.code === ErrorCode.AuthenticationTimeout;
    }
    isPermissionError() {
        return this.code === ErrorCode.PermissionsViolation;
    }
    isProtocolError() {
        return this.code === ErrorCode.ProtocolError;
    }
    isJetStreamError() {
        return this.api_error !== undefined;
    }
    jsError() {
        return this.api_error ? this.api_error : null;
    }
}
exports.NatsError = NatsError;
var Match;
(function (Match) {
    // Exact option is case sensitive
    Match[Match["Exact"] = 0] = "Exact";
    // Case sensitive, but key is transformed to Canonical MIME representation
    Match[Match["CanonicalMIME"] = 1] = "CanonicalMIME";
    // Case insensitive matches
    Match[Match["IgnoreCase"] = 2] = "IgnoreCase";
})(Match || (exports.Match = Match = {}));
var RequestStrategy;
(function (RequestStrategy) {
    RequestStrategy["Timer"] = "timer";
    RequestStrategy["Count"] = "count";
    RequestStrategy["JitterTimer"] = "jitterTimer";
    RequestStrategy["SentinelMsg"] = "sentinelMsg";
})(RequestStrategy || (exports.RequestStrategy = RequestStrategy = {}));
var ServiceResponseType;
(function (ServiceResponseType) {
    ServiceResponseType["STATS"] = "io.nats.micro.v1.stats_response";
    ServiceResponseType["INFO"] = "io.nats.micro.v1.info_response";
    ServiceResponseType["PING"] = "io.nats.micro.v1.ping_response";
})(ServiceResponseType || (exports.ServiceResponseType = ServiceResponseType = {}));
exports.ServiceErrorHeader = "Nats-Service-Error";
exports.ServiceErrorCodeHeader = "Nats-Service-Error-Code";
class ServiceError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
    static isServiceError(msg) {
        return ServiceError.toServiceError(msg) !== null;
    }
    static toServiceError(msg) {
        var _a, _b;
        const scode = ((_a = msg === null || msg === void 0 ? void 0 : msg.headers) === null || _a === void 0 ? void 0 : _a.get(exports.ServiceErrorCodeHeader)) || "";
        if (scode !== "") {
            const code = parseInt(scode) || 400;
            const description = ((_b = msg === null || msg === void 0 ? void 0 : msg.headers) === null || _b === void 0 ? void 0 : _b.get(exports.ServiceErrorHeader)) || "";
            return new ServiceError(code, description.length ? description : scode);
        }
        return null;
    }
}
exports.ServiceError = ServiceError;
function createInbox(prefix = "") {
    prefix = prefix || "_INBOX";
    if (typeof prefix !== "string") {
        throw (new Error("prefix must be a string"));
    }
    prefix.split(".")
        .forEach((v) => {
        if (v === "*" || v === ">") {
            throw new Error(`inbox prefixes cannot have wildcards '${prefix}'`);
        }
    });
    return `${prefix}.${nuid_1.nuid.next()}`;
}
exports.createInbox = createInbox;
exports.DEFAULT_PORT = 4222;
exports.DEFAULT_HOST = "127.0.0.1";
var ServiceVerb;
(function (ServiceVerb) {
    ServiceVerb["PING"] = "PING";
    ServiceVerb["STATS"] = "STATS";
    ServiceVerb["INFO"] = "INFO";
})(ServiceVerb || (exports.ServiceVerb = ServiceVerb = {}));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 2155:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2018-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataBuffer = void 0;
const encoders_1 = __nccwpck_require__(5450);
class DataBuffer {
    constructor() {
        this.buffers = [];
        this.byteLength = 0;
    }
    static concat(...bufs) {
        let max = 0;
        for (let i = 0; i < bufs.length; i++) {
            max += bufs[i].length;
        }
        const out = new Uint8Array(max);
        let index = 0;
        for (let i = 0; i < bufs.length; i++) {
            out.set(bufs[i], index);
            index += bufs[i].length;
        }
        return out;
    }
    static fromAscii(m) {
        if (!m) {
            m = "";
        }
        return encoders_1.TE.encode(m);
    }
    static toAscii(a) {
        return encoders_1.TD.decode(a);
    }
    reset() {
        this.buffers.length = 0;
        this.byteLength = 0;
    }
    pack() {
        if (this.buffers.length > 1) {
            const v = new Uint8Array(this.byteLength);
            let index = 0;
            for (let i = 0; i < this.buffers.length; i++) {
                v.set(this.buffers[i], index);
                index += this.buffers[i].length;
            }
            this.buffers.length = 0;
            this.buffers.push(v);
        }
    }
    shift() {
        if (this.buffers.length) {
            const a = this.buffers.shift();
            if (a) {
                this.byteLength -= a.length;
                return a;
            }
        }
        return new Uint8Array(0);
    }
    drain(n) {
        if (this.buffers.length) {
            this.pack();
            const v = this.buffers.pop();
            if (v) {
                const max = this.byteLength;
                if (n === undefined || n > max) {
                    n = max;
                }
                const d = v.subarray(0, n);
                if (max > n) {
                    this.buffers.push(v.subarray(n));
                }
                this.byteLength = max - n;
                return d;
            }
        }
        return new Uint8Array(0);
    }
    fill(a, ...bufs) {
        if (a) {
            this.buffers.push(a);
            this.byteLength += a.length;
        }
        for (let i = 0; i < bufs.length; i++) {
            if (bufs[i] && bufs[i].length) {
                this.buffers.push(bufs[i]);
                this.byteLength += bufs[i].length;
            }
        }
    }
    peek() {
        if (this.buffers.length) {
            this.pack();
            return this.buffers[0];
        }
        return new Uint8Array(0);
    }
    size() {
        return this.byteLength;
    }
    length() {
        return this.buffers.length;
    }
}
exports.DataBuffer = DataBuffer;
//# sourceMappingURL=databuffer.js.map

/***/ }),

/***/ 7410:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.writeAll = exports.readAll = exports.DenoBuffer = exports.append = exports.concat = exports.MAX_SIZE = exports.assert = exports.AssertionError = void 0;
// This code has been ported almost directly from Go's src/bytes/buffer.go
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
// https://github.com/golang/go/blob/master/LICENSE
// This code removes all Deno specific functionality to enable its use
// in a browser environment
//@internal
const encoders_1 = __nccwpck_require__(5450);
class AssertionError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "AssertionError";
    }
}
exports.AssertionError = AssertionError;
// @internal
function assert(cond, msg = "Assertion failed.") {
    if (!cond) {
        throw new AssertionError(msg);
    }
}
exports.assert = assert;
// MIN_READ is the minimum ArrayBuffer size passed to a read call by
// buffer.ReadFrom. As long as the Buffer has at least MIN_READ bytes beyond
// what is required to hold the contents of r, readFrom() will not grow the
// underlying buffer.
const MIN_READ = 32 * 1024;
exports.MAX_SIZE = Math.pow(2, 32) - 2;
// `off` is the offset into `dst` where it will at which to begin writing values
// from `src`.
// Returns the number of bytes copied.
function copy(src, dst, off = 0) {
    const r = dst.byteLength - off;
    if (src.byteLength > r) {
        src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
}
function concat(origin, b) {
    if (origin === undefined && b === undefined) {
        return new Uint8Array(0);
    }
    if (origin === undefined) {
        return b;
    }
    if (b === undefined) {
        return origin;
    }
    const output = new Uint8Array(origin.length + b.length);
    output.set(origin, 0);
    output.set(b, origin.length);
    return output;
}
exports.concat = concat;
function append(origin, b) {
    return concat(origin, Uint8Array.of(b));
}
exports.append = append;
class DenoBuffer {
    constructor(ab) {
        this._off = 0;
        if (ab == null) {
            this._buf = new Uint8Array(0);
            return;
        }
        this._buf = new Uint8Array(ab);
    }
    bytes(options = { copy: true }) {
        if (options.copy === false)
            return this._buf.subarray(this._off);
        return this._buf.slice(this._off);
    }
    empty() {
        return this._buf.byteLength <= this._off;
    }
    get length() {
        return this._buf.byteLength - this._off;
    }
    get capacity() {
        return this._buf.buffer.byteLength;
    }
    truncate(n) {
        if (n === 0) {
            this.reset();
            return;
        }
        if (n < 0 || n > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
        }
        this._reslice(this._off + n);
    }
    reset() {
        this._reslice(0);
        this._off = 0;
    }
    _tryGrowByReslice(n) {
        const l = this._buf.byteLength;
        if (n <= this.capacity - l) {
            this._reslice(l + n);
            return l;
        }
        return -1;
    }
    _reslice(len) {
        assert(len <= this._buf.buffer.byteLength);
        this._buf = new Uint8Array(this._buf.buffer, 0, len);
    }
    readByte() {
        const a = new Uint8Array(1);
        if (this.read(a)) {
            return a[0];
        }
        return null;
    }
    read(p) {
        if (this.empty()) {
            // Buffer is empty, reset to recover space.
            this.reset();
            if (p.byteLength === 0) {
                // this edge case is tested in 'bufferReadEmptyAtEOF' test
                return 0;
            }
            return null;
        }
        const nread = copy(this._buf.subarray(this._off), p);
        this._off += nread;
        return nread;
    }
    writeByte(n) {
        return this.write(Uint8Array.of(n));
    }
    writeString(s) {
        return this.write(encoders_1.TE.encode(s));
    }
    write(p) {
        const m = this._grow(p.byteLength);
        return copy(p, this._buf, m);
    }
    _grow(n) {
        const m = this.length;
        // If buffer is empty, reset to recover space.
        if (m === 0 && this._off !== 0) {
            this.reset();
        }
        // Fast: Try to _grow by means of a _reslice.
        const i = this._tryGrowByReslice(n);
        if (i >= 0) {
            return i;
        }
        const c = this.capacity;
        if (n <= Math.floor(c / 2) - m) {
            // We can slide things down instead of allocating a new
            // ArrayBuffer. We only need m+n <= c to slide, but
            // we instead let capacity get twice as large so we
            // don't spend all our time copying.
            copy(this._buf.subarray(this._off), this._buf);
        }
        else if (c + n > exports.MAX_SIZE) {
            throw new Error("The buffer cannot be grown beyond the maximum size.");
        }
        else {
            // Not enough space anywhere, we need to allocate.
            const buf = new Uint8Array(Math.min(2 * c + n, exports.MAX_SIZE));
            copy(this._buf.subarray(this._off), buf);
            this._buf = buf;
        }
        // Restore this.off and len(this._buf).
        this._off = 0;
        this._reslice(Math.min(m + n, exports.MAX_SIZE));
        return m;
    }
    grow(n) {
        if (n < 0) {
            throw Error("Buffer._grow: negative count");
        }
        const m = this._grow(n);
        this._reslice(m);
    }
    readFrom(r) {
        let n = 0;
        const tmp = new Uint8Array(MIN_READ);
        while (true) {
            const shouldGrow = this.capacity - this.length < MIN_READ;
            // read into tmp buffer if there's not enough room
            // otherwise read directly into the internal buffer
            const buf = shouldGrow
                ? tmp
                : new Uint8Array(this._buf.buffer, this.length);
            const nread = r.read(buf);
            if (nread === null) {
                return n;
            }
            // write will grow if needed
            if (shouldGrow)
                this.write(buf.subarray(0, nread));
            else
                this._reslice(this.length + nread);
            n += nread;
        }
    }
}
exports.DenoBuffer = DenoBuffer;
function readAll(r) {
    const buf = new DenoBuffer();
    buf.readFrom(r);
    return buf.bytes();
}
exports.readAll = readAll;
function writeAll(w, arr) {
    let nwritten = 0;
    while (nwritten < arr.length) {
        nwritten += w.write(arr.subarray(nwritten));
    }
}
exports.writeAll = writeAll;
//# sourceMappingURL=denobuffer.js.map

/***/ }),

/***/ 5450:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.encode = exports.TD = exports.TE = exports.Empty = void 0;
/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
exports.Empty = new Uint8Array(0);
exports.TE = new TextEncoder();
exports.TD = new TextDecoder();
function concat(...bufs) {
    let max = 0;
    for (let i = 0; i < bufs.length; i++) {
        max += bufs[i].length;
    }
    const out = new Uint8Array(max);
    let index = 0;
    for (let i = 0; i < bufs.length; i++) {
        out.set(bufs[i], index);
        index += bufs[i].length;
    }
    return out;
}
function encode(...a) {
    const bufs = [];
    for (let i = 0; i < a.length; i++) {
        bufs.push(exports.TE.encode(a[i]));
    }
    if (bufs.length === 0) {
        return exports.Empty;
    }
    if (bufs.length === 1) {
        return bufs[0];
    }
    return concat(...bufs);
}
exports.encode = encode;
function decode(a) {
    if (!a || a.length === 0) {
        return "";
    }
    return exports.TD.decode(a);
}
exports.decode = decode;
//# sourceMappingURL=encoders.js.map

/***/ }),

/***/ 24:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2020-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsgHdrsImpl = exports.headers = exports.canonicalMIMEHeaderKey = void 0;
// Heavily inspired by Golang's https://golang.org/src/net/http/header.go
const encoders_1 = __nccwpck_require__(5450);
const core_1 = __nccwpck_require__(9498);
// https://www.ietf.org/rfc/rfc822.txt
// 3.1.2.  STRUCTURE OF HEADER FIELDS
//
// Once a field has been unfolded, it may be viewed as being com-
// posed of a field-name followed by a colon (":"), followed by a
// field-body, and  terminated  by  a  carriage-return/line-feed.
// The  field-name must be composed of printable ASCII characters
// (i.e., characters that  have  values  between  33.  and  126.,
// decimal, except colon).  The field-body may be composed of any
// ASCII characters, except CR or LF.  (While CR and/or LF may be
// present  in the actual text, they are removed by the action of
// unfolding the field.)
function canonicalMIMEHeaderKey(k) {
    const a = 97;
    const A = 65;
    const Z = 90;
    const z = 122;
    const dash = 45;
    const colon = 58;
    const start = 33;
    const end = 126;
    const toLower = a - A;
    let upper = true;
    const buf = new Array(k.length);
    for (let i = 0; i < k.length; i++) {
        let c = k.charCodeAt(i);
        if (c === colon || c < start || c > end) {
            throw new core_1.NatsError(`'${k[i]}' is not a valid character for a header key`, core_1.ErrorCode.BadHeader);
        }
        if (upper && a <= c && c <= z) {
            c -= toLower;
        }
        else if (!upper && A <= c && c <= Z) {
            c += toLower;
        }
        buf[i] = c;
        upper = c == dash;
    }
    return String.fromCharCode(...buf);
}
exports.canonicalMIMEHeaderKey = canonicalMIMEHeaderKey;
function headers(code = 0, description = "") {
    if ((code === 0 && description !== "") || (code > 0 && description === "")) {
        throw new Error("setting status requires both code and description");
    }
    return new MsgHdrsImpl(code, description);
}
exports.headers = headers;
const HEADER = "NATS/1.0";
class MsgHdrsImpl {
    constructor(code = 0, description = "") {
        this._code = code;
        this._description = description;
        this.headers = new Map();
    }
    [Symbol.iterator]() {
        return this.headers.entries();
    }
    size() {
        return this.headers.size;
    }
    equals(mh) {
        if (mh && this.headers.size === mh.headers.size &&
            this._code === mh._code) {
            for (const [k, v] of this.headers) {
                const a = mh.values(k);
                if (v.length !== a.length) {
                    return false;
                }
                const vv = [...v].sort();
                const aa = [...a].sort();
                for (let i = 0; i < vv.length; i++) {
                    if (vv[i] !== aa[i]) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
    static decode(a) {
        const mh = new MsgHdrsImpl();
        const s = encoders_1.TD.decode(a);
        const lines = s.split("\r\n");
        const h = lines[0];
        if (h !== HEADER) {
            // malformed headers could add extra space without adding a code or description
            let str = h.replace(HEADER, "").trim();
            if (str.length > 0) {
                mh._code = parseInt(str, 10);
                if (isNaN(mh._code)) {
                    mh._code = 0;
                }
                const scode = mh._code.toString();
                str = str.replace(scode, "");
                mh._description = str.trim();
            }
        }
        if (lines.length >= 1) {
            lines.slice(1).map((s) => {
                if (s) {
                    const idx = s.indexOf(":");
                    if (idx > -1) {
                        const k = s.slice(0, idx);
                        const v = s.slice(idx + 1).trim();
                        mh.append(k, v);
                    }
                }
            });
        }
        return mh;
    }
    toString() {
        if (this.headers.size === 0 && this._code === 0) {
            return "";
        }
        let s = HEADER;
        if (this._code > 0 && this._description !== "") {
            s += ` ${this._code} ${this._description}`;
        }
        for (const [k, v] of this.headers) {
            for (let i = 0; i < v.length; i++) {
                s = `${s}\r\n${k}: ${v[i]}`;
            }
        }
        return `${s}\r\n\r\n`;
    }
    encode() {
        return encoders_1.TE.encode(this.toString());
    }
    static validHeaderValue(k) {
        const inv = /[\r\n]/;
        if (inv.test(k)) {
            throw new core_1.NatsError("invalid header value - \\r and \\n are not allowed.", core_1.ErrorCode.BadHeader);
        }
        return k.trim();
    }
    keys() {
        const keys = [];
        for (const sk of this.headers.keys()) {
            keys.push(sk);
        }
        return keys;
    }
    findKeys(k, match = core_1.Match.Exact) {
        const keys = this.keys();
        switch (match) {
            case core_1.Match.Exact:
                return keys.filter((v) => {
                    return v === k;
                });
            case core_1.Match.CanonicalMIME:
                k = canonicalMIMEHeaderKey(k);
                return keys.filter((v) => {
                    return v === k;
                });
            default: {
                const lci = k.toLowerCase();
                return keys.filter((v) => {
                    return lci === v.toLowerCase();
                });
            }
        }
    }
    get(k, match = core_1.Match.Exact) {
        const keys = this.findKeys(k, match);
        if (keys.length) {
            const v = this.headers.get(keys[0]);
            if (v) {
                return Array.isArray(v) ? v[0] : v;
            }
        }
        return "";
    }
    has(k, match = core_1.Match.Exact) {
        return this.findKeys(k, match).length > 0;
    }
    set(k, v, match = core_1.Match.Exact) {
        this.delete(k, match);
        this.append(k, v, match);
    }
    append(k, v, match = core_1.Match.Exact) {
        // validate the key
        const ck = canonicalMIMEHeaderKey(k);
        if (match === core_1.Match.CanonicalMIME) {
            k = ck;
        }
        // if we get non-sensical ignores/etc, we should try
        // to do the right thing and use the first key that matches
        const keys = this.findKeys(k, match);
        k = keys.length > 0 ? keys[0] : k;
        const value = MsgHdrsImpl.validHeaderValue(v);
        let a = this.headers.get(k);
        if (!a) {
            a = [];
            this.headers.set(k, a);
        }
        a.push(value);
    }
    values(k, match = core_1.Match.Exact) {
        const buf = [];
        const keys = this.findKeys(k, match);
        keys.forEach((v) => {
            const values = this.headers.get(v);
            if (values) {
                buf.push(...values);
            }
        });
        return buf;
    }
    delete(k, match = core_1.Match.Exact) {
        const keys = this.findKeys(k, match);
        keys.forEach((v) => {
            this.headers.delete(v);
        });
    }
    get hasError() {
        return this._code >= 300;
    }
    get status() {
        return `${this._code} ${this._description}`.trim();
    }
    toRecord() {
        const data = {};
        this.keys().forEach((v) => {
            data[v] = this.values(v);
        });
        return data;
    }
    get code() {
        return this._code;
    }
    get description() {
        return this._description;
    }
    static fromRecord(r) {
        const h = new MsgHdrsImpl();
        for (const k in r) {
            h.headers.set(k, r[k]);
        }
        return h;
    }
}
exports.MsgHdrsImpl = MsgHdrsImpl;
//# sourceMappingURL=headers.js.map

/***/ }),

/***/ 4995:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Heartbeat = void 0;
/*
 * Copyright 2020-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const util_1 = __nccwpck_require__(4812);
const core_1 = __nccwpck_require__(9498);
class Heartbeat {
    constructor(ph, interval, maxOut) {
        this.ph = ph;
        this.interval = interval;
        this.maxOut = maxOut;
        this.pendings = [];
    }
    // api to start the heartbeats, since this can be
    // spuriously called from dial, ensure we don't
    // leak timers
    start() {
        this.cancel();
        this._schedule();
    }
    // api for canceling the heartbeats, if stale is
    // true it will initiate a client disconnect
    cancel(stale) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
        this._reset();
        if (stale) {
            this.ph.disconnect();
        }
    }
    _schedule() {
        // @ts-ignore: node is not a number - we treat this opaquely
        this.timer = setTimeout(() => {
            this.ph.dispatchStatus({ type: core_1.DebugEvents.PingTimer, data: `${this.pendings.length + 1}` });
            if (this.pendings.length === this.maxOut) {
                this.cancel(true);
                return;
            }
            const ping = (0, util_1.deferred)();
            this.ph.flush(ping)
                .then(() => {
                this._reset();
            })
                .catch(() => {
                // we disconnected - pongs were rejected
                this.cancel();
            });
            this.pendings.push(ping);
            this._schedule();
        }, this.interval);
    }
    _reset() {
        // clear pendings after resolving them
        this.pendings = this.pendings.filter((p) => {
            const d = p;
            d.resolve();
            return false;
        });
    }
}
exports.Heartbeat = Heartbeat;
//# sourceMappingURL=heartbeats.js.map

/***/ }),

/***/ 2529:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdleHeartbeat = void 0;
class IdleHeartbeat {
    /**
     * Constructor
     * @param interval in millis to check
     * @param cb a callback to report when heartbeats are missed
     * @param opts monitor options @see IdleHeartbeatOptions
     */
    constructor(interval, cb, opts = { maxOut: 2 }) {
        this.interval = interval;
        this.maxOut = (opts === null || opts === void 0 ? void 0 : opts.maxOut) || 2;
        this.cancelAfter = (opts === null || opts === void 0 ? void 0 : opts.cancelAfter) || 0;
        this.last = Date.now();
        this.missed = 0;
        this.count = 0;
        this.callback = cb;
        this._schedule();
    }
    /**
     * cancel monitoring
     */
    cancel() {
        if (this.autoCancelTimer) {
            clearTimeout(this.autoCancelTimer);
        }
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = 0;
        this.autoCancelTimer = 0;
    }
    /**
     * work signals that there was work performed
     */
    work() {
        this.last = Date.now();
        this.missed = 0;
    }
    /**
     * internal api to change the interval, cancelAfter and maxOut
     * @param interval
     * @param cancelAfter
     * @param maxOut
     */
    _change(interval, cancelAfter = 0, maxOut = 2) {
        this.interval = interval;
        this.maxOut = maxOut;
        this.cancelAfter = cancelAfter;
        this.restart();
    }
    /**
     * cancels and restarts the monitoring
     */
    restart() {
        this.cancel();
        this._schedule();
    }
    /**
     * internal api called to start monitoring
     */
    _schedule() {
        if (this.cancelAfter > 0) {
            // @ts-ignore: in node is not a number - we treat this opaquely
            this.autoCancelTimer = setTimeout(() => {
                this.cancel();
            }, this.cancelAfter);
        }
        // @ts-ignore: in node is not a number - we treat this opaquely
        this.timer = setInterval(() => {
            this.count++;
            if ((Date.now() - this.last) > this.interval) {
                this.missed++;
            }
            if (this.missed >= this.maxOut) {
                try {
                    if (this.callback(this.missed) === true) {
                        this.cancel();
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }, this.interval);
    }
}
exports.IdleHeartbeat = IdleHeartbeat;
//# sourceMappingURL=idleheartbeat.js.map

/***/ }),

/***/ 8104:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoopKvCodecs = exports.defaultBucketOpts = exports.Bucket = exports.Base64KeyCodec = exports.TypedSubscription = exports.parseIP = exports.isIP = exports.TE = exports.TD = exports.Metric = exports.Bench = exports.writeAll = exports.readAll = exports.MAX_SIZE = exports.DenoBuffer = exports.State = exports.Parser = exports.Kind = exports.QueuedIteratorImpl = exports.StringCodec = exports.JSONCodec = exports.usernamePasswordAuthenticator = exports.tokenAuthenticator = exports.nkeyAuthenticator = exports.jwtAuthenticator = exports.credsAuthenticator = exports.RequestOne = exports.checkUnsupportedOption = exports.checkOptions = exports.buildAuthenticator = exports.DataBuffer = exports.MuxSubscription = exports.Heartbeat = exports.MsgHdrsImpl = exports.headers = exports.canonicalMIMEHeaderKey = exports.timeout = exports.render = exports.extend = exports.delay = exports.deferred = exports.collect = exports.ProtocolHandler = exports.INFO = exports.Connect = exports.setTransportFactory = exports.MsgImpl = exports.nuid = exports.Nuid = exports.NatsConnectionImpl = void 0;
exports.ServiceVerb = exports.Subscriptions = exports.SubscriptionImpl = exports.ServiceError = exports.NatsError = exports.Match = exports.isNatsError = exports.ErrorCode = exports.createInbox = exports.ServiceErrorHeader = exports.ServiceErrorCodeHeader = exports.ServiceResponseType = exports.RequestStrategy = exports.Events = exports.DebugEvents = exports.extractProtocolMessage = exports.Empty = exports.parseSemVer = exports.compare = void 0;
var nats_1 = __nccwpck_require__(9842);
Object.defineProperty(exports, "NatsConnectionImpl", ({ enumerable: true, get: function () { return nats_1.NatsConnectionImpl; } }));
var nuid_1 = __nccwpck_require__(6146);
Object.defineProperty(exports, "Nuid", ({ enumerable: true, get: function () { return nuid_1.Nuid; } }));
Object.defineProperty(exports, "nuid", ({ enumerable: true, get: function () { return nuid_1.nuid; } }));
var msg_1 = __nccwpck_require__(5305);
Object.defineProperty(exports, "MsgImpl", ({ enumerable: true, get: function () { return msg_1.MsgImpl; } }));
var transport_1 = __nccwpck_require__(5030);
Object.defineProperty(exports, "setTransportFactory", ({ enumerable: true, get: function () { return transport_1.setTransportFactory; } }));
var protocol_1 = __nccwpck_require__(8231);
Object.defineProperty(exports, "Connect", ({ enumerable: true, get: function () { return protocol_1.Connect; } }));
Object.defineProperty(exports, "INFO", ({ enumerable: true, get: function () { return protocol_1.INFO; } }));
Object.defineProperty(exports, "ProtocolHandler", ({ enumerable: true, get: function () { return protocol_1.ProtocolHandler; } }));
var util_1 = __nccwpck_require__(4812);
Object.defineProperty(exports, "collect", ({ enumerable: true, get: function () { return util_1.collect; } }));
Object.defineProperty(exports, "deferred", ({ enumerable: true, get: function () { return util_1.deferred; } }));
Object.defineProperty(exports, "delay", ({ enumerable: true, get: function () { return util_1.delay; } }));
Object.defineProperty(exports, "extend", ({ enumerable: true, get: function () { return util_1.extend; } }));
Object.defineProperty(exports, "render", ({ enumerable: true, get: function () { return util_1.render; } }));
Object.defineProperty(exports, "timeout", ({ enumerable: true, get: function () { return util_1.timeout; } }));
var headers_1 = __nccwpck_require__(24);
Object.defineProperty(exports, "canonicalMIMEHeaderKey", ({ enumerable: true, get: function () { return headers_1.canonicalMIMEHeaderKey; } }));
Object.defineProperty(exports, "headers", ({ enumerable: true, get: function () { return headers_1.headers; } }));
Object.defineProperty(exports, "MsgHdrsImpl", ({ enumerable: true, get: function () { return headers_1.MsgHdrsImpl; } }));
var heartbeats_1 = __nccwpck_require__(4995);
Object.defineProperty(exports, "Heartbeat", ({ enumerable: true, get: function () { return heartbeats_1.Heartbeat; } }));
var muxsubscription_1 = __nccwpck_require__(7729);
Object.defineProperty(exports, "MuxSubscription", ({ enumerable: true, get: function () { return muxsubscription_1.MuxSubscription; } }));
var databuffer_1 = __nccwpck_require__(2155);
Object.defineProperty(exports, "DataBuffer", ({ enumerable: true, get: function () { return databuffer_1.DataBuffer; } }));
var options_1 = __nccwpck_require__(6495);
Object.defineProperty(exports, "buildAuthenticator", ({ enumerable: true, get: function () { return options_1.buildAuthenticator; } }));
Object.defineProperty(exports, "checkOptions", ({ enumerable: true, get: function () { return options_1.checkOptions; } }));
Object.defineProperty(exports, "checkUnsupportedOption", ({ enumerable: true, get: function () { return options_1.checkUnsupportedOption; } }));
var request_1 = __nccwpck_require__(7008);
Object.defineProperty(exports, "RequestOne", ({ enumerable: true, get: function () { return request_1.RequestOne; } }));
var authenticator_1 = __nccwpck_require__(1986);
Object.defineProperty(exports, "credsAuthenticator", ({ enumerable: true, get: function () { return authenticator_1.credsAuthenticator; } }));
Object.defineProperty(exports, "jwtAuthenticator", ({ enumerable: true, get: function () { return authenticator_1.jwtAuthenticator; } }));
Object.defineProperty(exports, "nkeyAuthenticator", ({ enumerable: true, get: function () { return authenticator_1.nkeyAuthenticator; } }));
Object.defineProperty(exports, "tokenAuthenticator", ({ enumerable: true, get: function () { return authenticator_1.tokenAuthenticator; } }));
Object.defineProperty(exports, "usernamePasswordAuthenticator", ({ enumerable: true, get: function () { return authenticator_1.usernamePasswordAuthenticator; } }));
var codec_1 = __nccwpck_require__(2524);
Object.defineProperty(exports, "JSONCodec", ({ enumerable: true, get: function () { return codec_1.JSONCodec; } }));
Object.defineProperty(exports, "StringCodec", ({ enumerable: true, get: function () { return codec_1.StringCodec; } }));
__exportStar(__nccwpck_require__(4215), exports);
var queued_iterator_1 = __nccwpck_require__(8450);
Object.defineProperty(exports, "QueuedIteratorImpl", ({ enumerable: true, get: function () { return queued_iterator_1.QueuedIteratorImpl; } }));
var parser_1 = __nccwpck_require__(9134);
Object.defineProperty(exports, "Kind", ({ enumerable: true, get: function () { return parser_1.Kind; } }));
Object.defineProperty(exports, "Parser", ({ enumerable: true, get: function () { return parser_1.Parser; } }));
Object.defineProperty(exports, "State", ({ enumerable: true, get: function () { return parser_1.State; } }));
var denobuffer_1 = __nccwpck_require__(7410);
Object.defineProperty(exports, "DenoBuffer", ({ enumerable: true, get: function () { return denobuffer_1.DenoBuffer; } }));
Object.defineProperty(exports, "MAX_SIZE", ({ enumerable: true, get: function () { return denobuffer_1.MAX_SIZE; } }));
Object.defineProperty(exports, "readAll", ({ enumerable: true, get: function () { return denobuffer_1.readAll; } }));
Object.defineProperty(exports, "writeAll", ({ enumerable: true, get: function () { return denobuffer_1.writeAll; } }));
var bench_1 = __nccwpck_require__(1444);
Object.defineProperty(exports, "Bench", ({ enumerable: true, get: function () { return bench_1.Bench; } }));
Object.defineProperty(exports, "Metric", ({ enumerable: true, get: function () { return bench_1.Metric; } }));
var encoders_1 = __nccwpck_require__(5450);
Object.defineProperty(exports, "TD", ({ enumerable: true, get: function () { return encoders_1.TD; } }));
Object.defineProperty(exports, "TE", ({ enumerable: true, get: function () { return encoders_1.TE; } }));
var ipparser_1 = __nccwpck_require__(6699);
Object.defineProperty(exports, "isIP", ({ enumerable: true, get: function () { return ipparser_1.isIP; } }));
Object.defineProperty(exports, "parseIP", ({ enumerable: true, get: function () { return ipparser_1.parseIP; } }));
var typedsub_1 = __nccwpck_require__(5916);
Object.defineProperty(exports, "TypedSubscription", ({ enumerable: true, get: function () { return typedsub_1.TypedSubscription; } }));
var kv_1 = __nccwpck_require__(7249);
Object.defineProperty(exports, "Base64KeyCodec", ({ enumerable: true, get: function () { return kv_1.Base64KeyCodec; } }));
Object.defineProperty(exports, "Bucket", ({ enumerable: true, get: function () { return kv_1.Bucket; } }));
Object.defineProperty(exports, "defaultBucketOpts", ({ enumerable: true, get: function () { return kv_1.defaultBucketOpts; } }));
Object.defineProperty(exports, "NoopKvCodecs", ({ enumerable: true, get: function () { return kv_1.NoopKvCodecs; } }));
var semver_1 = __nccwpck_require__(6511);
Object.defineProperty(exports, "compare", ({ enumerable: true, get: function () { return semver_1.compare; } }));
Object.defineProperty(exports, "parseSemVer", ({ enumerable: true, get: function () { return semver_1.parseSemVer; } }));
var types_1 = __nccwpck_require__(3829);
Object.defineProperty(exports, "Empty", ({ enumerable: true, get: function () { return types_1.Empty; } }));
var transport_2 = __nccwpck_require__(5030);
Object.defineProperty(exports, "extractProtocolMessage", ({ enumerable: true, get: function () { return transport_2.extractProtocolMessage; } }));
var core_1 = __nccwpck_require__(9498);
Object.defineProperty(exports, "DebugEvents", ({ enumerable: true, get: function () { return core_1.DebugEvents; } }));
Object.defineProperty(exports, "Events", ({ enumerable: true, get: function () { return core_1.Events; } }));
Object.defineProperty(exports, "RequestStrategy", ({ enumerable: true, get: function () { return core_1.RequestStrategy; } }));
Object.defineProperty(exports, "ServiceResponseType", ({ enumerable: true, get: function () { return core_1.ServiceResponseType; } }));
var core_2 = __nccwpck_require__(9498);
Object.defineProperty(exports, "ServiceErrorCodeHeader", ({ enumerable: true, get: function () { return core_2.ServiceErrorCodeHeader; } }));
Object.defineProperty(exports, "ServiceErrorHeader", ({ enumerable: true, get: function () { return core_2.ServiceErrorHeader; } }));
var core_3 = __nccwpck_require__(9498);
Object.defineProperty(exports, "createInbox", ({ enumerable: true, get: function () { return core_3.createInbox; } }));
Object.defineProperty(exports, "ErrorCode", ({ enumerable: true, get: function () { return core_3.ErrorCode; } }));
Object.defineProperty(exports, "isNatsError", ({ enumerable: true, get: function () { return core_3.isNatsError; } }));
Object.defineProperty(exports, "Match", ({ enumerable: true, get: function () { return core_3.Match; } }));
Object.defineProperty(exports, "NatsError", ({ enumerable: true, get: function () { return core_3.NatsError; } }));
Object.defineProperty(exports, "ServiceError", ({ enumerable: true, get: function () { return core_3.ServiceError; } }));
var protocol_2 = __nccwpck_require__(8231);
Object.defineProperty(exports, "SubscriptionImpl", ({ enumerable: true, get: function () { return protocol_2.SubscriptionImpl; } }));
var protocol_3 = __nccwpck_require__(8231);
Object.defineProperty(exports, "Subscriptions", ({ enumerable: true, get: function () { return protocol_3.Subscriptions; } }));
var core_4 = __nccwpck_require__(9498);
Object.defineProperty(exports, "ServiceVerb", ({ enumerable: true, get: function () { return core_4.ServiceVerb; } }));
//# sourceMappingURL=internal_mod.js.map

/***/ }),

/***/ 6699:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2020-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseIP = exports.isIP = exports.ipV4 = void 0;
// JavaScript port of go net/ip/ParseIP
// https://github.com/golang/go/blob/master/src/net/ip.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
const IPv4LEN = 4;
const IPv6LEN = 16;
const ASCII0 = 48;
const ASCII9 = 57;
const ASCIIA = 65;
const ASCIIF = 70;
const ASCIIa = 97;
const ASCIIf = 102;
const big = 0xFFFFFF;
function ipV4(a, b, c, d) {
    const ip = new Uint8Array(IPv6LEN);
    const prefix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff];
    prefix.forEach((v, idx) => {
        ip[idx] = v;
    });
    ip[12] = a;
    ip[13] = b;
    ip[14] = c;
    ip[15] = d;
    return ip;
}
exports.ipV4 = ipV4;
function isIP(h) {
    return parseIP(h) !== undefined;
}
exports.isIP = isIP;
function parseIP(h) {
    for (let i = 0; i < h.length; i++) {
        switch (h[i]) {
            case ".":
                return parseIPv4(h);
            case ":":
                return parseIPv6(h);
        }
    }
    return;
}
exports.parseIP = parseIP;
function parseIPv4(s) {
    const ip = new Uint8Array(IPv4LEN);
    for (let i = 0; i < IPv4LEN; i++) {
        if (s.length === 0) {
            return undefined;
        }
        if (i > 0) {
            if (s[0] !== ".") {
                return undefined;
            }
            s = s.substring(1);
        }
        const { n, c, ok } = dtoi(s);
        if (!ok || n > 0xFF) {
            return undefined;
        }
        s = s.substring(c);
        ip[i] = n;
    }
    return ipV4(ip[0], ip[1], ip[2], ip[3]);
}
function parseIPv6(s) {
    const ip = new Uint8Array(IPv6LEN);
    let ellipsis = -1;
    if (s.length >= 2 && s[0] === ":" && s[1] === ":") {
        ellipsis = 0;
        s = s.substring(2);
        if (s.length === 0) {
            return ip;
        }
    }
    let i = 0;
    while (i < IPv6LEN) {
        const { n, c, ok } = xtoi(s);
        if (!ok || n > 0xFFFF) {
            return undefined;
        }
        if (c < s.length && s[c] === ".") {
            if (ellipsis < 0 && i != IPv6LEN - IPv4LEN) {
                return undefined;
            }
            if (i + IPv4LEN > IPv6LEN) {
                return undefined;
            }
            const ip4 = parseIPv4(s);
            if (ip4 === undefined) {
                return undefined;
            }
            ip[i] = ip4[12];
            ip[i + 1] = ip4[13];
            ip[i + 2] = ip4[14];
            ip[i + 3] = ip4[15];
            s = "";
            i += IPv4LEN;
            break;
        }
        ip[i] = n >> 8;
        ip[i + 1] = n;
        i += 2;
        s = s.substring(c);
        if (s.length === 0) {
            break;
        }
        if (s[0] !== ":" || s.length == 1) {
            return undefined;
        }
        s = s.substring(1);
        if (s[0] === ":") {
            if (ellipsis >= 0) {
                return undefined;
            }
            ellipsis = i;
            s = s.substring(1);
            if (s.length === 0) {
                break;
            }
        }
    }
    if (s.length !== 0) {
        return undefined;
    }
    if (i < IPv6LEN) {
        if (ellipsis < 0) {
            return undefined;
        }
        const n = IPv6LEN - i;
        for (let j = i - 1; j >= ellipsis; j--) {
            ip[j + n] = ip[j];
        }
        for (let j = ellipsis + n - 1; j >= ellipsis; j--) {
            ip[j] = 0;
        }
    }
    else if (ellipsis >= 0) {
        return undefined;
    }
    return ip;
}
function dtoi(s) {
    let i = 0;
    let n = 0;
    for (i = 0; i < s.length && ASCII0 <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII9; i++) {
        n = n * 10 + (s.charCodeAt(i) - ASCII0);
        if (n >= big) {
            return { n: big, c: i, ok: false };
        }
    }
    if (i === 0) {
        return { n: 0, c: 0, ok: false };
    }
    return { n: n, c: i, ok: true };
}
function xtoi(s) {
    let n = 0;
    let i = 0;
    for (i = 0; i < s.length; i++) {
        if (ASCII0 <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII9) {
            n *= 16;
            n += s.charCodeAt(i) - ASCII0;
        }
        else if (ASCIIa <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCIIf) {
            n *= 16;
            n += (s.charCodeAt(i) - ASCIIa) + 10;
        }
        else if (ASCIIA <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCIIF) {
            n *= 16;
            n += (s.charCodeAt(i) - ASCIIA) + 10;
        }
        else {
            break;
        }
        if (n >= big) {
            return { n: 0, c: i, ok: false };
        }
    }
    if (i === 0) {
        return { n: 0, c: i, ok: false };
    }
    return { n: n, c: i, ok: true };
}
//# sourceMappingURL=ipparser.js.map

/***/ }),

/***/ 1782:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.usernamePasswordAuthenticator = exports.tokenAuthenticator = exports.StringCodec = exports.ServiceVerb = exports.ServiceResponseType = exports.ServiceErrorHeader = exports.ServiceErrorCodeHeader = exports.ServiceError = exports.RequestStrategy = exports.nuid = exports.Nuid = exports.nkeys = exports.nkeyAuthenticator = exports.NatsError = exports.MsgHdrsImpl = exports.Metric = exports.Match = exports.jwtAuthenticator = exports.JSONCodec = exports.headers = exports.Events = exports.ErrorCode = exports.Empty = exports.deferred = exports.DebugEvents = exports.credsAuthenticator = exports.createInbox = exports.canonicalMIMEHeaderKey = exports.buildAuthenticator = exports.Bench = void 0;
var internal_mod_1 = __nccwpck_require__(8104);
Object.defineProperty(exports, "Bench", ({ enumerable: true, get: function () { return internal_mod_1.Bench; } }));
Object.defineProperty(exports, "buildAuthenticator", ({ enumerable: true, get: function () { return internal_mod_1.buildAuthenticator; } }));
Object.defineProperty(exports, "canonicalMIMEHeaderKey", ({ enumerable: true, get: function () { return internal_mod_1.canonicalMIMEHeaderKey; } }));
Object.defineProperty(exports, "createInbox", ({ enumerable: true, get: function () { return internal_mod_1.createInbox; } }));
Object.defineProperty(exports, "credsAuthenticator", ({ enumerable: true, get: function () { return internal_mod_1.credsAuthenticator; } }));
Object.defineProperty(exports, "DebugEvents", ({ enumerable: true, get: function () { return internal_mod_1.DebugEvents; } }));
Object.defineProperty(exports, "deferred", ({ enumerable: true, get: function () { return internal_mod_1.deferred; } }));
Object.defineProperty(exports, "Empty", ({ enumerable: true, get: function () { return internal_mod_1.Empty; } }));
Object.defineProperty(exports, "ErrorCode", ({ enumerable: true, get: function () { return internal_mod_1.ErrorCode; } }));
Object.defineProperty(exports, "Events", ({ enumerable: true, get: function () { return internal_mod_1.Events; } }));
Object.defineProperty(exports, "headers", ({ enumerable: true, get: function () { return internal_mod_1.headers; } }));
Object.defineProperty(exports, "JSONCodec", ({ enumerable: true, get: function () { return internal_mod_1.JSONCodec; } }));
Object.defineProperty(exports, "jwtAuthenticator", ({ enumerable: true, get: function () { return internal_mod_1.jwtAuthenticator; } }));
Object.defineProperty(exports, "Match", ({ enumerable: true, get: function () { return internal_mod_1.Match; } }));
Object.defineProperty(exports, "Metric", ({ enumerable: true, get: function () { return internal_mod_1.Metric; } }));
Object.defineProperty(exports, "MsgHdrsImpl", ({ enumerable: true, get: function () { return internal_mod_1.MsgHdrsImpl; } }));
Object.defineProperty(exports, "NatsError", ({ enumerable: true, get: function () { return internal_mod_1.NatsError; } }));
Object.defineProperty(exports, "nkeyAuthenticator", ({ enumerable: true, get: function () { return internal_mod_1.nkeyAuthenticator; } }));
Object.defineProperty(exports, "nkeys", ({ enumerable: true, get: function () { return internal_mod_1.nkeys; } }));
Object.defineProperty(exports, "Nuid", ({ enumerable: true, get: function () { return internal_mod_1.Nuid; } }));
Object.defineProperty(exports, "nuid", ({ enumerable: true, get: function () { return internal_mod_1.nuid; } }));
Object.defineProperty(exports, "RequestStrategy", ({ enumerable: true, get: function () { return internal_mod_1.RequestStrategy; } }));
Object.defineProperty(exports, "ServiceError", ({ enumerable: true, get: function () { return internal_mod_1.ServiceError; } }));
Object.defineProperty(exports, "ServiceErrorCodeHeader", ({ enumerable: true, get: function () { return internal_mod_1.ServiceErrorCodeHeader; } }));
Object.defineProperty(exports, "ServiceErrorHeader", ({ enumerable: true, get: function () { return internal_mod_1.ServiceErrorHeader; } }));
Object.defineProperty(exports, "ServiceResponseType", ({ enumerable: true, get: function () { return internal_mod_1.ServiceResponseType; } }));
Object.defineProperty(exports, "ServiceVerb", ({ enumerable: true, get: function () { return internal_mod_1.ServiceVerb; } }));
Object.defineProperty(exports, "StringCodec", ({ enumerable: true, get: function () { return internal_mod_1.StringCodec; } }));
Object.defineProperty(exports, "tokenAuthenticator", ({ enumerable: true, get: function () { return internal_mod_1.tokenAuthenticator; } }));
Object.defineProperty(exports, "usernamePasswordAuthenticator", ({ enumerable: true, get: function () { return internal_mod_1.usernamePasswordAuthenticator; } }));
//# sourceMappingURL=mod.js.map

/***/ }),

/***/ 5305:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsgImpl = exports.isRequestError = void 0;
/*
 * Copyright 2020-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const headers_1 = __nccwpck_require__(24);
const encoders_1 = __nccwpck_require__(5450);
const codec_1 = __nccwpck_require__(2524);
const core_1 = __nccwpck_require__(9498);
function isRequestError(msg) {
    var _a;
    // NATS core only considers errors 503s on messages that have no payload
    // everything else simply forwarded as part of the message and is considered
    // application level information
    if (msg && msg.data.length === 0 && ((_a = msg.headers) === null || _a === void 0 ? void 0 : _a.code) === 503) {
        return core_1.NatsError.errorForCode(core_1.ErrorCode.NoResponders);
    }
    return null;
}
exports.isRequestError = isRequestError;
class MsgImpl {
    constructor(msg, data, publisher) {
        this._msg = msg;
        this._rdata = data;
        this.publisher = publisher;
    }
    get subject() {
        if (this._subject) {
            return this._subject;
        }
        this._subject = encoders_1.TD.decode(this._msg.subject);
        return this._subject;
    }
    get reply() {
        if (this._reply) {
            return this._reply;
        }
        this._reply = encoders_1.TD.decode(this._msg.reply);
        return this._reply;
    }
    get sid() {
        return this._msg.sid;
    }
    get headers() {
        if (this._msg.hdr > -1 && !this._headers) {
            const buf = this._rdata.subarray(0, this._msg.hdr);
            this._headers = headers_1.MsgHdrsImpl.decode(buf);
        }
        return this._headers;
    }
    get data() {
        if (!this._rdata) {
            return new Uint8Array(0);
        }
        return this._msg.hdr > -1
            ? this._rdata.subarray(this._msg.hdr)
            : this._rdata;
    }
    // eslint-ignore-next-line @typescript-eslint/no-explicit-any
    respond(data = encoders_1.Empty, opts) {
        if (this.reply) {
            this.publisher.publish(this.reply, data, opts);
            return true;
        }
        return false;
    }
    size() {
        var _a;
        const subj = this._msg.subject.length;
        const reply = ((_a = this._msg.reply) === null || _a === void 0 ? void 0 : _a.length) || 0;
        const payloadAndHeaders = this._msg.size === -1 ? 0 : this._msg.size;
        return subj + reply + payloadAndHeaders;
    }
    json(reviver) {
        return (0, codec_1.JSONCodec)(reviver).decode(this.data);
    }
    string() {
        return encoders_1.TD.decode(this.data);
    }
}
exports.MsgImpl = MsgImpl;
//# sourceMappingURL=msg.js.map

/***/ }),

/***/ 7729:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MuxSubscription = void 0;
/*
 * Copyright 2020-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const msg_1 = __nccwpck_require__(5305);
const core_1 = __nccwpck_require__(9498);
class MuxSubscription {
    constructor() {
        this.reqs = new Map();
    }
    size() {
        return this.reqs.size;
    }
    init(prefix) {
        this.baseInbox = `${(0, core_1.createInbox)(prefix)}.`;
        return this.baseInbox;
    }
    add(r) {
        if (!isNaN(r.received)) {
            r.received = 0;
        }
        this.reqs.set(r.token, r);
    }
    get(token) {
        return this.reqs.get(token);
    }
    cancel(r) {
        this.reqs.delete(r.token);
    }
    getToken(m) {
        const s = m.subject || "";
        if (s.indexOf(this.baseInbox) === 0) {
            return s.substring(this.baseInbox.length);
        }
        return null;
    }
    all() {
        return Array.from(this.reqs.values());
    }
    handleError(isMuxPermissionError, err) {
        if (err && err.permissionContext) {
            if (isMuxPermissionError) {
                // one or more requests queued but mux cannot process them
                this.all().forEach((r) => {
                    r.resolver(err, {});
                });
                return true;
            }
            const ctx = err.permissionContext;
            if (ctx.operation === "publish") {
                const req = this.all().find((s) => {
                    return s.requestSubject === ctx.subject;
                });
                if (req) {
                    req.resolver(err, {});
                    return true;
                }
            }
        }
        return false;
    }
    dispatcher() {
        return (err, m) => {
            const token = this.getToken(m);
            if (token) {
                const r = this.get(token);
                if (r) {
                    if (err === null && m.headers) {
                        err = (0, msg_1.isRequestError)(m);
                    }
                    r.resolver(err, m);
                }
            }
        };
    }
    close() {
        const err = core_1.NatsError.errorForCode(core_1.ErrorCode.Timeout);
        this.reqs.forEach((req) => {
            req.resolver(err, {});
        });
    }
}
exports.MuxSubscription = MuxSubscription;
//# sourceMappingURL=muxsubscription.js.map

/***/ }),

/***/ 9842:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2018-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesFactory = exports.NatsConnectionImpl = void 0;
const util_1 = __nccwpck_require__(4812);
const protocol_1 = __nccwpck_require__(8231);
const encoders_1 = __nccwpck_require__(5450);
const types_1 = __nccwpck_require__(3829);
const semver_1 = __nccwpck_require__(6511);
const options_1 = __nccwpck_require__(6495);
const queued_iterator_1 = __nccwpck_require__(8450);
const request_1 = __nccwpck_require__(7008);
const msg_1 = __nccwpck_require__(5305);
const jsm_1 = __nccwpck_require__(6254);
const jsclient_1 = __nccwpck_require__(3101);
const service_1 = __nccwpck_require__(3594);
const serviceclient_1 = __nccwpck_require__(8878);
const core_1 = __nccwpck_require__(9498);
class NatsConnectionImpl {
    constructor(opts) {
        this.draining = false;
        this.options = (0, options_1.parseOptions)(opts);
        this.listeners = [];
    }
    static connect(opts = {}) {
        return new Promise((resolve, reject) => {
            const nc = new NatsConnectionImpl(opts);
            protocol_1.ProtocolHandler.connect(nc.options, nc)
                .then((ph) => {
                nc.protocol = ph;
                (function () {
                    var _a, e_1, _b, _c;
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            for (var _d = true, _e = __asyncValues(ph.status()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                                _c = _f.value;
                                _d = false;
                                const s = _c;
                                nc.listeners.forEach((l) => {
                                    l.push(s);
                                });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    });
                })();
                resolve(nc);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    closed() {
        return this.protocol.closed;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.protocol.close();
        });
    }
    _check(subject, sub, pub) {
        if (this.isClosed()) {
            throw types_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionClosed);
        }
        if (sub && this.isDraining()) {
            throw types_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionDraining);
        }
        if (pub && this.protocol.noMorePublishing) {
            throw types_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionDraining);
        }
        subject = subject || "";
        if (subject.length === 0) {
            throw types_1.NatsError.errorForCode(core_1.ErrorCode.BadSubject);
        }
    }
    publish(subject, data, options) {
        this._check(subject, false, true);
        this.protocol.publish(subject, data, options);
    }
    subscribe(subject, opts = {}) {
        this._check(subject, true, false);
        const sub = new protocol_1.SubscriptionImpl(this.protocol, subject, opts);
        this.protocol.subscribe(sub);
        return sub;
    }
    _resub(s, subject, max) {
        this._check(subject, true, false);
        const si = s;
        // FIXME: need way of understanding a callbacks processed
        //   count without it, we cannot really do much - ie
        //   for rejected messages, the count would be lower, etc.
        //   To handle cases were for example KV is building a map
        //   the consumer would say how many messages we need to do
        //   a proper build before we can handle updates.
        si.max = max; // this might clear it
        if (max) {
            // we cannot auto-unsub, because we don't know the
            // number of messages we processed vs received
            // allow the auto-unsub on processMsg to work if they
            // we were called with a new max
            si.max = max + si.received;
        }
        this.protocol.resub(si, subject);
    }
    // possibilities are:
    // stop on error or any non-100 status
    // AND:
    // - wait for timer
    // - wait for n messages or timer
    // - wait for unknown messages, done when empty or reset timer expires (with possible alt wait)
    // - wait for unknown messages, done when an empty payload is received or timer expires (with possible alt wait)
    requestMany(subject, data = encoders_1.Empty, opts = { maxWait: 1000, maxMessages: -1 }) {
        try {
            this._check(subject, true, true);
        }
        catch (err) {
            return Promise.reject(err);
        }
        opts.strategy = opts.strategy || core_1.RequestStrategy.Timer;
        opts.maxWait = opts.maxWait || 1000;
        if (opts.maxWait < 1) {
            return Promise.reject(new types_1.NatsError("timeout", core_1.ErrorCode.InvalidOption));
        }
        // the iterator for user results
        const qi = new queued_iterator_1.QueuedIteratorImpl();
        function stop(err) {
            //@ts-ignore: stop function
            qi.push(() => {
                qi.stop(err);
            });
        }
        // callback for the subscription or the mux handler
        // simply pushes errors and messages into the iterator
        function callback(err, msg) {
            if (err || msg === null) {
                stop(err === null ? undefined : err);
            }
            else {
                qi.push(msg);
            }
        }
        if (opts.noMux) {
            // we setup a subscription and manage it
            const stack = new Error().stack;
            let max = typeof opts.maxMessages === "number" && opts.maxMessages > 0
                ? opts.maxMessages
                : -1;
            const sub = this.subscribe((0, core_1.createInbox)(this.options.inboxPrefix), {
                callback: (err, msg) => {
                    var _a, _b;
                    // we only expect runtime errors or a no responders
                    if (((_a = msg === null || msg === void 0 ? void 0 : msg.data) === null || _a === void 0 ? void 0 : _a.length) === 0 &&
                        ((_b = msg === null || msg === void 0 ? void 0 : msg.headers) === null || _b === void 0 ? void 0 : _b.status) === core_1.ErrorCode.NoResponders) {
                        err = types_1.NatsError.errorForCode(core_1.ErrorCode.NoResponders);
                    }
                    // augment any error with the current stack to provide context
                    // for the error on the suer code
                    if (err) {
                        err.stack += `\n\n${stack}`;
                        cancel(err);
                        return;
                    }
                    // push the message
                    callback(null, msg);
                    // see if the m request is completed
                    if (opts.strategy === core_1.RequestStrategy.Count) {
                        max--;
                        if (max === 0) {
                            cancel();
                        }
                    }
                    if (opts.strategy === core_1.RequestStrategy.JitterTimer) {
                        clearTimers();
                        timer = setTimeout(() => {
                            cancel();
                        }, 300);
                    }
                    if (opts.strategy === core_1.RequestStrategy.SentinelMsg) {
                        if (msg && msg.data.length === 0) {
                            cancel();
                        }
                    }
                },
            });
            sub.closed
                .then(() => {
                stop();
            })
                .catch((err) => {
                qi.stop(err);
            });
            const cancel = (err) => {
                if (err) {
                    //@ts-ignore: error
                    qi.push(() => {
                        throw err;
                    });
                }
                clearTimers();
                sub.drain()
                    .then(() => {
                    stop();
                })
                    .catch((_err) => {
                    stop();
                });
            };
            qi.iterClosed
                .then(() => {
                clearTimers();
                sub === null || sub === void 0 ? void 0 : sub.unsubscribe();
            })
                .catch((_err) => {
                clearTimers();
                sub === null || sub === void 0 ? void 0 : sub.unsubscribe();
            });
            try {
                this.publish(subject, data, { reply: sub.getSubject() });
            }
            catch (err) {
                cancel(err);
            }
            let timer = setTimeout(() => {
                cancel();
            }, opts.maxWait);
            const clearTimers = () => {
                if (timer) {
                    clearTimeout(timer);
                }
            };
        }
        else {
            // the ingestion is the RequestMany
            const rmo = opts;
            rmo.callback = callback;
            qi.iterClosed.then(() => {
                r.cancel();
            }).catch((err) => {
                r.cancel(err);
            });
            const r = new request_1.RequestMany(this.protocol.muxSubscriptions, subject, rmo);
            this.protocol.request(r);
            try {
                this.publish(subject, data, {
                    reply: `${this.protocol.muxSubscriptions.baseInbox}${r.token}`,
                    headers: opts.headers,
                });
            }
            catch (err) {
                r.cancel(err);
            }
        }
        return Promise.resolve(qi);
    }
    request(subject, data, opts = { timeout: 1000, noMux: false }) {
        try {
            this._check(subject, true, true);
        }
        catch (err) {
            return Promise.reject(err);
        }
        opts.timeout = opts.timeout || 1000;
        if (opts.timeout < 1) {
            return Promise.reject(new types_1.NatsError("timeout", core_1.ErrorCode.InvalidOption));
        }
        if (!opts.noMux && opts.reply) {
            return Promise.reject(new types_1.NatsError("reply can only be used with noMux", core_1.ErrorCode.InvalidOption));
        }
        if (opts.noMux) {
            const inbox = opts.reply
                ? opts.reply
                : (0, core_1.createInbox)(this.options.inboxPrefix);
            const d = (0, util_1.deferred)();
            const errCtx = new Error();
            const sub = this.subscribe(inbox, {
                max: 1,
                timeout: opts.timeout,
                callback: (err, msg) => {
                    if (err) {
                        // timeouts from `timeout()` will have the proper stack
                        if (err.code !== core_1.ErrorCode.Timeout) {
                            err.stack += `\n\n${errCtx.stack}`;
                        }
                        d.reject(err);
                    }
                    else {
                        err = (0, msg_1.isRequestError)(msg);
                        if (err) {
                            // if we failed here, help the developer by showing what failed
                            err.stack += `\n\n${errCtx.stack}`;
                            d.reject(err);
                        }
                        else {
                            d.resolve(msg);
                        }
                    }
                },
            });
            sub.requestSubject = subject;
            this.protocol.publish(subject, data, {
                reply: inbox,
                headers: opts.headers,
            });
            return d;
        }
        else {
            const r = new request_1.RequestOne(this.protocol.muxSubscriptions, subject, opts);
            this.protocol.request(r);
            try {
                this.publish(subject, data, {
                    reply: `${this.protocol.muxSubscriptions.baseInbox}${r.token}`,
                    headers: opts.headers,
                });
            }
            catch (err) {
                r.cancel(err);
            }
            const p = Promise.race([r.timer, r.deferred]);
            p.catch(() => {
                r.cancel();
            });
            return p;
        }
    }
    /** *
     * Flushes to the server. Promise resolves when round-trip completes.
     * @returns {Promise<void>}
     */
    flush() {
        if (this.isClosed()) {
            return Promise.reject(types_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionClosed));
        }
        return this.protocol.flush();
    }
    drain() {
        if (this.isClosed()) {
            return Promise.reject(types_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionClosed));
        }
        if (this.isDraining()) {
            return Promise.reject(types_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionDraining));
        }
        this.draining = true;
        return this.protocol.drain();
    }
    isClosed() {
        return this.protocol.isClosed();
    }
    isDraining() {
        return this.draining;
    }
    getServer() {
        const srv = this.protocol.getServer();
        return srv ? srv.listen : "";
    }
    status() {
        const iter = new queued_iterator_1.QueuedIteratorImpl();
        iter.iterClosed.then(() => {
            const idx = this.listeners.indexOf(iter);
            this.listeners.splice(idx, 1);
        });
        this.listeners.push(iter);
        return iter;
    }
    get info() {
        return this.protocol.isClosed() ? undefined : this.protocol.info;
    }
    stats() {
        return {
            inBytes: this.protocol.inBytes,
            outBytes: this.protocol.outBytes,
            inMsgs: this.protocol.inMsgs,
            outMsgs: this.protocol.outMsgs,
        };
    }
    jetstreamManager(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const adm = new jsm_1.JetStreamManagerImpl(this, opts);
            try {
                yield adm.getAccountInfo();
            }
            catch (err) {
                const ne = err;
                if (ne.code === core_1.ErrorCode.NoResponders) {
                    ne.code = core_1.ErrorCode.JetStreamNotEnabled;
                }
                throw ne;
            }
            return adm;
        });
    }
    jetstream(opts = {}) {
        return new jsclient_1.JetStreamClientImpl(this, opts);
    }
    getServerVersion() {
        const info = this.info;
        return info ? (0, semver_1.parseSemVer)(info.version) : undefined;
    }
    rtt() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.protocol._closed && !this.protocol.connected) {
                throw types_1.NatsError.errorForCode(core_1.ErrorCode.Disconnect);
            }
            const start = Date.now();
            yield this.flush();
            return Date.now() - start;
        });
    }
    get features() {
        return this.protocol.features;
    }
    get services() {
        if (!this._services) {
            this._services = new ServicesFactory(this);
        }
        return this._services;
    }
}
exports.NatsConnectionImpl = NatsConnectionImpl;
class ServicesFactory {
    constructor(nc) {
        this.nc = nc;
    }
    add(config) {
        try {
            const s = new service_1.ServiceImpl(this.nc, config);
            return s.start();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    client(opts, prefix) {
        return new serviceclient_1.ServiceClientImpl(this.nc, opts, prefix);
    }
}
exports.ServicesFactory = ServicesFactory;
//# sourceMappingURL=nats.js.map

/***/ }),

/***/ 4215:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nkeys = void 0;
exports.nkeys = __nccwpck_require__(9615);
//# sourceMappingURL=nkeys.js.map

/***/ }),

/***/ 6146:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*
 * Copyright 2016-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nuid = exports.Nuid = void 0;
const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base = 36;
const preLen = 12;
const seqLen = 10;
const maxSeq = 3656158440062976; // base^seqLen == 36^10
const minInc = 33;
const maxInc = 333;
const totalLen = preLen + seqLen;
function _getRandomValues(a) {
    for (let i = 0; i < a.length; i++) {
        a[i] = Math.floor(Math.random() * 255);
    }
}
function fillRandom(a) {
    var _a;
    if ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || _a === void 0 ? void 0 : _a.getRandomValues) {
        globalThis.crypto.getRandomValues(a);
    }
    else {
        _getRandomValues(a);
    }
}
/**
 * Create and initialize a nuid.
 *
 * @api private
 */
class Nuid {
    constructor() {
        this.buf = new Uint8Array(totalLen);
        this.init();
    }
    /**
     * Initializes a nuid with a crypto random prefix,
     * and pseudo-random sequence and increment.
     *
     * @api private
     */
    init() {
        this.setPre();
        this.initSeqAndInc();
        this.fillSeq();
    }
    /**
     * Initializes the pseudo randmon sequence number and the increment range.
     *
     * @api private
     */
    initSeqAndInc() {
        this.seq = Math.floor(Math.random() * maxSeq);
        this.inc = Math.floor(Math.random() * (maxInc - minInc) + minInc);
    }
    /**
     * Sets the prefix from crypto random bytes. Converts to base36.
     *
     * @api private
     */
    setPre() {
        const cbuf = new Uint8Array(preLen);
        fillRandom(cbuf);
        for (let i = 0; i < preLen; i++) {
            const di = cbuf[i] % base;
            this.buf[i] = digits.charCodeAt(di);
        }
    }
    /**
     * Fills the sequence part of the nuid as base36 from this.seq.
     *
     * @api private
     */
    fillSeq() {
        let n = this.seq;
        for (let i = totalLen - 1; i >= preLen; i--) {
            this.buf[i] = digits.charCodeAt(n % base);
            n = Math.floor(n / base);
        }
    }
    /**
     * Returns the next nuid.
     *
     * @api private
     */
    next() {
        this.seq += this.inc;
        if (this.seq > maxSeq) {
            this.setPre();
            this.initSeqAndInc();
        }
        this.fillSeq();
        // @ts-ignore - Uint8Arrays can be an argument
        return String.fromCharCode.apply(String, this.buf);
    }
    reset() {
        this.init();
    }
}
exports.Nuid = Nuid;
exports.nuid = new Nuid();
//# sourceMappingURL=nuid.js.map

/***/ }),

/***/ 6495:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2021-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkUnsupportedOption = exports.checkOptions = exports.parseOptions = exports.buildAuthenticator = exports.defaultOptions = exports.DEFAULT_RECONNECT_TIME_WAIT = exports.DEFAULT_MAX_PING_OUT = exports.DEFAULT_PING_INTERVAL = exports.DEFAULT_JITTER_TLS = exports.DEFAULT_JITTER = exports.DEFAULT_MAX_RECONNECT_ATTEMPTS = void 0;
const util_1 = __nccwpck_require__(4812);
const transport_1 = __nccwpck_require__(5030);
const core_1 = __nccwpck_require__(9498);
const authenticator_1 = __nccwpck_require__(1986);
const core_2 = __nccwpck_require__(9498);
exports.DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
exports.DEFAULT_JITTER = 100;
exports.DEFAULT_JITTER_TLS = 1000;
// Ping interval
exports.DEFAULT_PING_INTERVAL = 2 * 60 * 1000; // 2 minutes
exports.DEFAULT_MAX_PING_OUT = 2;
// DISCONNECT Parameters, 2 sec wait, 10 tries
exports.DEFAULT_RECONNECT_TIME_WAIT = 2 * 1000;
function defaultOptions() {
    return {
        maxPingOut: exports.DEFAULT_MAX_PING_OUT,
        maxReconnectAttempts: exports.DEFAULT_MAX_RECONNECT_ATTEMPTS,
        noRandomize: false,
        pedantic: false,
        pingInterval: exports.DEFAULT_PING_INTERVAL,
        reconnect: true,
        reconnectJitter: exports.DEFAULT_JITTER,
        reconnectJitterTLS: exports.DEFAULT_JITTER_TLS,
        reconnectTimeWait: exports.DEFAULT_RECONNECT_TIME_WAIT,
        tls: undefined,
        verbose: false,
        waitOnFirstConnect: false,
        ignoreAuthErrorAbort: false,
    };
}
exports.defaultOptions = defaultOptions;
function buildAuthenticator(opts) {
    const buf = [];
    // jwtAuthenticator is created by the user, since it
    // will require possibly reading files which
    // some of the clients are simply unable to do
    if (typeof opts.authenticator === "function") {
        buf.push(opts.authenticator);
    }
    if (Array.isArray(opts.authenticator)) {
        buf.push(...opts.authenticator);
    }
    if (opts.token) {
        buf.push((0, authenticator_1.tokenAuthenticator)(opts.token));
    }
    if (opts.user) {
        buf.push((0, authenticator_1.usernamePasswordAuthenticator)(opts.user, opts.pass));
    }
    return buf.length === 0 ? (0, authenticator_1.noAuthFn)() : (0, authenticator_1.multiAuthenticator)(buf);
}
exports.buildAuthenticator = buildAuthenticator;
function parseOptions(opts) {
    const dhp = `${core_2.DEFAULT_HOST}:${(0, transport_1.defaultPort)()}`;
    opts = opts || { servers: [dhp] };
    opts.servers = opts.servers || [];
    if (typeof opts.servers === "string") {
        opts.servers = [opts.servers];
    }
    if (opts.servers.length > 0 && opts.port) {
        throw new core_2.NatsError("port and servers options are mutually exclusive", core_2.ErrorCode.InvalidOption);
    }
    if (opts.servers.length === 0 && opts.port) {
        opts.servers = [`${core_2.DEFAULT_HOST}:${opts.port}`];
    }
    if (opts.servers && opts.servers.length === 0) {
        opts.servers = [dhp];
    }
    const options = (0, util_1.extend)(defaultOptions(), opts);
    options.authenticator = buildAuthenticator(options);
    ["reconnectDelayHandler", "authenticator"].forEach((n) => {
        if (options[n] && typeof options[n] !== "function") {
            throw new core_2.NatsError(`${n} option should be a function`, core_2.ErrorCode.NotFunction);
        }
    });
    if (!options.reconnectDelayHandler) {
        options.reconnectDelayHandler = () => {
            let extra = options.tls
                ? options.reconnectJitterTLS
                : options.reconnectJitter;
            if (extra) {
                extra++;
                extra = Math.floor(Math.random() * extra);
            }
            return options.reconnectTimeWait + extra;
        };
    }
    if (options.inboxPrefix) {
        try {
            (0, core_1.createInbox)(options.inboxPrefix);
        }
        catch (err) {
            throw new core_2.NatsError(err.message, core_2.ErrorCode.ApiError);
        }
    }
    if (options.resolve) {
        if (typeof (0, transport_1.getResolveFn)() !== "function") {
            throw new core_2.NatsError(`'resolve' is not supported on this client`, core_2.ErrorCode.InvalidOption);
        }
    }
    return options;
}
exports.parseOptions = parseOptions;
function checkOptions(info, options) {
    const { proto, tls_required: tlsRequired, tls_available: tlsAvailable } = info;
    if ((proto === undefined || proto < 1) && options.noEcho) {
        throw new core_2.NatsError("noEcho", core_2.ErrorCode.ServerOptionNotAvailable);
    }
    const tls = tlsRequired || tlsAvailable || false;
    if (options.tls && !tls) {
        throw new core_2.NatsError("tls", core_2.ErrorCode.ServerOptionNotAvailable);
    }
}
exports.checkOptions = checkOptions;
function checkUnsupportedOption(prop, v) {
    if (v) {
        throw new core_2.NatsError(prop, core_2.ErrorCode.InvalidOption);
    }
}
exports.checkUnsupportedOption = checkUnsupportedOption;
//# sourceMappingURL=options.js.map

/***/ }),

/***/ 9134:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.State = exports.Parser = exports.describe = exports.Kind = void 0;
// deno-lint-ignore-file no-undef
/*
 * Copyright 2020-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const denobuffer_1 = __nccwpck_require__(7410);
const encoders_1 = __nccwpck_require__(5450);
var Kind;
(function (Kind) {
    Kind[Kind["OK"] = 0] = "OK";
    Kind[Kind["ERR"] = 1] = "ERR";
    Kind[Kind["MSG"] = 2] = "MSG";
    Kind[Kind["INFO"] = 3] = "INFO";
    Kind[Kind["PING"] = 4] = "PING";
    Kind[Kind["PONG"] = 5] = "PONG";
})(Kind || (exports.Kind = Kind = {}));
function describe(e) {
    let ks;
    let data = "";
    switch (e.kind) {
        case Kind.MSG:
            ks = "MSG";
            break;
        case Kind.OK:
            ks = "OK";
            break;
        case Kind.ERR:
            ks = "ERR";
            data = encoders_1.TD.decode(e.data);
            break;
        case Kind.PING:
            ks = "PING";
            break;
        case Kind.PONG:
            ks = "PONG";
            break;
        case Kind.INFO:
            ks = "INFO";
            data = encoders_1.TD.decode(e.data);
    }
    return `${ks}: ${data}`;
}
exports.describe = describe;
function newMsgArg() {
    const ma = {};
    ma.sid = -1;
    ma.hdr = -1;
    ma.size = -1;
    return ma;
}
const ASCII_0 = 48;
const ASCII_9 = 57;
// This is an almost verbatim port of the Go NATS parser
// https://github.com/nats-io/nats.go/blob/master/parser.go
class Parser {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.state = State.OP_START;
        this.as = 0;
        this.drop = 0;
        this.hdr = 0;
    }
    parse(buf) {
        let i;
        for (i = 0; i < buf.length; i++) {
            const b = buf[i];
            switch (this.state) {
                case State.OP_START:
                    switch (b) {
                        case cc.M:
                        case cc.m:
                            this.state = State.OP_M;
                            this.hdr = -1;
                            this.ma = newMsgArg();
                            break;
                        case cc.H:
                        case cc.h:
                            this.state = State.OP_H;
                            this.hdr = 0;
                            this.ma = newMsgArg();
                            break;
                        case cc.P:
                        case cc.p:
                            this.state = State.OP_P;
                            break;
                        case cc.PLUS:
                            this.state = State.OP_PLUS;
                            break;
                        case cc.MINUS:
                            this.state = State.OP_MINUS;
                            break;
                        case cc.I:
                        case cc.i:
                            this.state = State.OP_I;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_H:
                    switch (b) {
                        case cc.M:
                        case cc.m:
                            this.state = State.OP_M;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_M:
                    switch (b) {
                        case cc.S:
                        case cc.s:
                            this.state = State.OP_MS;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MS:
                    switch (b) {
                        case cc.G:
                        case cc.g:
                            this.state = State.OP_MSG;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MSG:
                    switch (b) {
                        case cc.SPACE:
                        case cc.TAB:
                            this.state = State.OP_MSG_SPC;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MSG_SPC:
                    switch (b) {
                        case cc.SPACE:
                        case cc.TAB:
                            continue;
                        default:
                            this.state = State.MSG_ARG;
                            this.as = i;
                    }
                    break;
                case State.MSG_ARG:
                    switch (b) {
                        case cc.CR:
                            this.drop = 1;
                            break;
                        case cc.NL: {
                            const arg = this.argBuf
                                ? this.argBuf.bytes()
                                : buf.subarray(this.as, i - this.drop);
                            this.processMsgArgs(arg);
                            this.drop = 0;
                            this.as = i + 1;
                            this.state = State.MSG_PAYLOAD;
                            // jump ahead with the index. If this overruns
                            // what is left we fall out and process a split buffer.
                            i = this.as + this.ma.size - 1;
                            break;
                        }
                        default:
                            if (this.argBuf) {
                                this.argBuf.writeByte(b);
                            }
                    }
                    break;
                case State.MSG_PAYLOAD:
                    if (this.msgBuf) {
                        if (this.msgBuf.length >= this.ma.size) {
                            const data = this.msgBuf.bytes({ copy: false });
                            this.dispatcher.push({ kind: Kind.MSG, msg: this.ma, data: data });
                            this.argBuf = undefined;
                            this.msgBuf = undefined;
                            this.state = State.MSG_END;
                        }
                        else {
                            let toCopy = this.ma.size - this.msgBuf.length;
                            const avail = buf.length - i;
                            if (avail < toCopy) {
                                toCopy = avail;
                            }
                            if (toCopy > 0) {
                                this.msgBuf.write(buf.subarray(i, i + toCopy));
                                i = (i + toCopy) - 1;
                            }
                            else {
                                this.msgBuf.writeByte(b);
                            }
                        }
                    }
                    else if (i - this.as >= this.ma.size) {
                        this.dispatcher.push({ kind: Kind.MSG, msg: this.ma, data: buf.subarray(this.as, i) });
                        this.argBuf = undefined;
                        this.msgBuf = undefined;
                        this.state = State.MSG_END;
                    }
                    break;
                case State.MSG_END:
                    switch (b) {
                        case cc.NL:
                            this.drop = 0;
                            this.as = i + 1;
                            this.state = State.OP_START;
                            break;
                        default:
                            continue;
                    }
                    break;
                case State.OP_PLUS:
                    switch (b) {
                        case cc.O:
                        case cc.o:
                            this.state = State.OP_PLUS_O;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PLUS_O:
                    switch (b) {
                        case cc.K:
                        case cc.k:
                            this.state = State.OP_PLUS_OK;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PLUS_OK:
                    switch (b) {
                        case cc.NL:
                            this.dispatcher.push({ kind: Kind.OK });
                            this.drop = 0;
                            this.state = State.OP_START;
                            break;
                    }
                    break;
                case State.OP_MINUS:
                    switch (b) {
                        case cc.E:
                        case cc.e:
                            this.state = State.OP_MINUS_E;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MINUS_E:
                    switch (b) {
                        case cc.R:
                        case cc.r:
                            this.state = State.OP_MINUS_ER;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MINUS_ER:
                    switch (b) {
                        case cc.R:
                        case cc.r:
                            this.state = State.OP_MINUS_ERR;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MINUS_ERR:
                    switch (b) {
                        case cc.SPACE:
                        case cc.TAB:
                            this.state = State.OP_MINUS_ERR_SPC;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_MINUS_ERR_SPC:
                    switch (b) {
                        case cc.SPACE:
                        case cc.TAB:
                            continue;
                        default:
                            this.state = State.MINUS_ERR_ARG;
                            this.as = i;
                    }
                    break;
                case State.MINUS_ERR_ARG:
                    switch (b) {
                        case cc.CR:
                            this.drop = 1;
                            break;
                        case cc.NL: {
                            let arg;
                            if (this.argBuf) {
                                arg = this.argBuf.bytes();
                                this.argBuf = undefined;
                            }
                            else {
                                arg = buf.subarray(this.as, i - this.drop);
                            }
                            this.dispatcher.push({ kind: Kind.ERR, data: arg });
                            this.drop = 0;
                            this.as = i + 1;
                            this.state = State.OP_START;
                            break;
                        }
                        default:
                            if (this.argBuf) {
                                this.argBuf.write(Uint8Array.of(b));
                            }
                    }
                    break;
                case State.OP_P:
                    switch (b) {
                        case cc.I:
                        case cc.i:
                            this.state = State.OP_PI;
                            break;
                        case cc.O:
                        case cc.o:
                            this.state = State.OP_PO;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PO:
                    switch (b) {
                        case cc.N:
                        case cc.n:
                            this.state = State.OP_PON;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PON:
                    switch (b) {
                        case cc.G:
                        case cc.g:
                            this.state = State.OP_PONG;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PONG:
                    switch (b) {
                        case cc.NL:
                            this.dispatcher.push({ kind: Kind.PONG });
                            this.drop = 0;
                            this.state = State.OP_START;
                            break;
                    }
                    break;
                case State.OP_PI:
                    switch (b) {
                        case cc.N:
                        case cc.n:
                            this.state = State.OP_PIN;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PIN:
                    switch (b) {
                        case cc.G:
                        case cc.g:
                            this.state = State.OP_PING;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_PING:
                    switch (b) {
                        case cc.NL:
                            this.dispatcher.push({ kind: Kind.PING });
                            this.drop = 0;
                            this.state = State.OP_START;
                            break;
                    }
                    break;
                case State.OP_I:
                    switch (b) {
                        case cc.N:
                        case cc.n:
                            this.state = State.OP_IN;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_IN:
                    switch (b) {
                        case cc.F:
                        case cc.f:
                            this.state = State.OP_INF;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_INF:
                    switch (b) {
                        case cc.O:
                        case cc.o:
                            this.state = State.OP_INFO;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_INFO:
                    switch (b) {
                        case cc.SPACE:
                        case cc.TAB:
                            this.state = State.OP_INFO_SPC;
                            break;
                        default:
                            throw this.fail(buf.subarray(i));
                    }
                    break;
                case State.OP_INFO_SPC:
                    switch (b) {
                        case cc.SPACE:
                        case cc.TAB:
                            continue;
                        default:
                            this.state = State.INFO_ARG;
                            this.as = i;
                    }
                    break;
                case State.INFO_ARG:
                    switch (b) {
                        case cc.CR:
                            this.drop = 1;
                            break;
                        case cc.NL: {
                            let arg;
                            if (this.argBuf) {
                                arg = this.argBuf.bytes();
                                this.argBuf = undefined;
                            }
                            else {
                                arg = buf.subarray(this.as, i - this.drop);
                            }
                            this.dispatcher.push({ kind: Kind.INFO, data: arg });
                            this.drop = 0;
                            this.as = i + 1;
                            this.state = State.OP_START;
                            break;
                        }
                        default:
                            if (this.argBuf) {
                                this.argBuf.writeByte(b);
                            }
                    }
                    break;
                default:
                    throw this.fail(buf.subarray(i));
            }
        }
        if ((this.state === State.MSG_ARG || this.state === State.MINUS_ERR_ARG ||
            this.state === State.INFO_ARG) && !this.argBuf) {
            this.argBuf = new denobuffer_1.DenoBuffer(buf.subarray(this.as, i - this.drop));
        }
        if (this.state === State.MSG_PAYLOAD && !this.msgBuf) {
            if (!this.argBuf) {
                this.cloneMsgArg();
            }
            this.msgBuf = new denobuffer_1.DenoBuffer(buf.subarray(this.as));
        }
    }
    cloneMsgArg() {
        const s = this.ma.subject.length;
        const r = this.ma.reply ? this.ma.reply.length : 0;
        const buf = new Uint8Array(s + r);
        buf.set(this.ma.subject);
        if (this.ma.reply) {
            buf.set(this.ma.reply, s);
        }
        this.argBuf = new denobuffer_1.DenoBuffer(buf);
        this.ma.subject = buf.subarray(0, s);
        if (this.ma.reply) {
            this.ma.reply = buf.subarray(s);
        }
    }
    processMsgArgs(arg) {
        if (this.hdr >= 0) {
            return this.processHeaderMsgArgs(arg);
        }
        const args = [];
        let start = -1;
        for (let i = 0; i < arg.length; i++) {
            const b = arg[i];
            switch (b) {
                case cc.SPACE:
                case cc.TAB:
                case cc.CR:
                case cc.NL:
                    if (start >= 0) {
                        args.push(arg.subarray(start, i));
                        start = -1;
                    }
                    break;
                default:
                    if (start < 0) {
                        start = i;
                    }
            }
        }
        if (start >= 0) {
            args.push(arg.subarray(start));
        }
        switch (args.length) {
            case 3:
                this.ma.subject = args[0];
                this.ma.sid = this.protoParseInt(args[1]);
                this.ma.reply = undefined;
                this.ma.size = this.protoParseInt(args[2]);
                break;
            case 4:
                this.ma.subject = args[0];
                this.ma.sid = this.protoParseInt(args[1]);
                this.ma.reply = args[2];
                this.ma.size = this.protoParseInt(args[3]);
                break;
            default:
                throw this.fail(arg, "processMsgArgs Parse Error");
        }
        if (this.ma.sid < 0) {
            throw this.fail(arg, "processMsgArgs Bad or Missing Sid Error");
        }
        if (this.ma.size < 0) {
            throw this.fail(arg, "processMsgArgs Bad or Missing Size Error");
        }
    }
    fail(data, label = "") {
        if (!label) {
            label = `parse error [${this.state}]`;
        }
        else {
            label = `${label} [${this.state}]`;
        }
        return new Error(`${label}: ${encoders_1.TD.decode(data)}`);
    }
    processHeaderMsgArgs(arg) {
        const args = [];
        let start = -1;
        for (let i = 0; i < arg.length; i++) {
            const b = arg[i];
            switch (b) {
                case cc.SPACE:
                case cc.TAB:
                case cc.CR:
                case cc.NL:
                    if (start >= 0) {
                        args.push(arg.subarray(start, i));
                        start = -1;
                    }
                    break;
                default:
                    if (start < 0) {
                        start = i;
                    }
            }
        }
        if (start >= 0) {
            args.push(arg.subarray(start));
        }
        switch (args.length) {
            case 4:
                this.ma.subject = args[0];
                this.ma.sid = this.protoParseInt(args[1]);
                this.ma.reply = undefined;
                this.ma.hdr = this.protoParseInt(args[2]);
                this.ma.size = this.protoParseInt(args[3]);
                break;
            case 5:
                this.ma.subject = args[0];
                this.ma.sid = this.protoParseInt(args[1]);
                this.ma.reply = args[2];
                this.ma.hdr = this.protoParseInt(args[3]);
                this.ma.size = this.protoParseInt(args[4]);
                break;
            default:
                throw this.fail(arg, "processHeaderMsgArgs Parse Error");
        }
        if (this.ma.sid < 0) {
            throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Sid Error");
        }
        if (this.ma.hdr < 0 || this.ma.hdr > this.ma.size) {
            throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Header Size Error");
        }
        if (this.ma.size < 0) {
            throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Size Error");
        }
    }
    protoParseInt(a) {
        if (a.length === 0) {
            return -1;
        }
        let n = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] < ASCII_0 || a[i] > ASCII_9) {
                return -1;
            }
            n = n * 10 + (a[i] - ASCII_0);
        }
        return n;
    }
}
exports.Parser = Parser;
var State;
(function (State) {
    State[State["OP_START"] = 0] = "OP_START";
    State[State["OP_PLUS"] = 1] = "OP_PLUS";
    State[State["OP_PLUS_O"] = 2] = "OP_PLUS_O";
    State[State["OP_PLUS_OK"] = 3] = "OP_PLUS_OK";
    State[State["OP_MINUS"] = 4] = "OP_MINUS";
    State[State["OP_MINUS_E"] = 5] = "OP_MINUS_E";
    State[State["OP_MINUS_ER"] = 6] = "OP_MINUS_ER";
    State[State["OP_MINUS_ERR"] = 7] = "OP_MINUS_ERR";
    State[State["OP_MINUS_ERR_SPC"] = 8] = "OP_MINUS_ERR_SPC";
    State[State["MINUS_ERR_ARG"] = 9] = "MINUS_ERR_ARG";
    State[State["OP_M"] = 10] = "OP_M";
    State[State["OP_MS"] = 11] = "OP_MS";
    State[State["OP_MSG"] = 12] = "OP_MSG";
    State[State["OP_MSG_SPC"] = 13] = "OP_MSG_SPC";
    State[State["MSG_ARG"] = 14] = "MSG_ARG";
    State[State["MSG_PAYLOAD"] = 15] = "MSG_PAYLOAD";
    State[State["MSG_END"] = 16] = "MSG_END";
    State[State["OP_H"] = 17] = "OP_H";
    State[State["OP_P"] = 18] = "OP_P";
    State[State["OP_PI"] = 19] = "OP_PI";
    State[State["OP_PIN"] = 20] = "OP_PIN";
    State[State["OP_PING"] = 21] = "OP_PING";
    State[State["OP_PO"] = 22] = "OP_PO";
    State[State["OP_PON"] = 23] = "OP_PON";
    State[State["OP_PONG"] = 24] = "OP_PONG";
    State[State["OP_I"] = 25] = "OP_I";
    State[State["OP_IN"] = 26] = "OP_IN";
    State[State["OP_INF"] = 27] = "OP_INF";
    State[State["OP_INFO"] = 28] = "OP_INFO";
    State[State["OP_INFO_SPC"] = 29] = "OP_INFO_SPC";
    State[State["INFO_ARG"] = 30] = "INFO_ARG";
})(State || (exports.State = State = {}));
var cc;
(function (cc) {
    cc[cc["CR"] = "\r".charCodeAt(0)] = "CR";
    cc[cc["E"] = "E".charCodeAt(0)] = "E";
    cc[cc["e"] = "e".charCodeAt(0)] = "e";
    cc[cc["F"] = "F".charCodeAt(0)] = "F";
    cc[cc["f"] = "f".charCodeAt(0)] = "f";
    cc[cc["G"] = "G".charCodeAt(0)] = "G";
    cc[cc["g"] = "g".charCodeAt(0)] = "g";
    cc[cc["H"] = "H".charCodeAt(0)] = "H";
    cc[cc["h"] = "h".charCodeAt(0)] = "h";
    cc[cc["I"] = "I".charCodeAt(0)] = "I";
    cc[cc["i"] = "i".charCodeAt(0)] = "i";
    cc[cc["K"] = "K".charCodeAt(0)] = "K";
    cc[cc["k"] = "k".charCodeAt(0)] = "k";
    cc[cc["M"] = "M".charCodeAt(0)] = "M";
    cc[cc["m"] = "m".charCodeAt(0)] = "m";
    cc[cc["MINUS"] = "-".charCodeAt(0)] = "MINUS";
    cc[cc["N"] = "N".charCodeAt(0)] = "N";
    cc[cc["n"] = "n".charCodeAt(0)] = "n";
    cc[cc["NL"] = "\n".charCodeAt(0)] = "NL";
    cc[cc["O"] = "O".charCodeAt(0)] = "O";
    cc[cc["o"] = "o".charCodeAt(0)] = "o";
    cc[cc["P"] = "P".charCodeAt(0)] = "P";
    cc[cc["p"] = "p".charCodeAt(0)] = "p";
    cc[cc["PLUS"] = "+".charCodeAt(0)] = "PLUS";
    cc[cc["R"] = "R".charCodeAt(0)] = "R";
    cc[cc["r"] = "r".charCodeAt(0)] = "r";
    cc[cc["S"] = "S".charCodeAt(0)] = "S";
    cc[cc["s"] = "s".charCodeAt(0)] = "s";
    cc[cc["SPACE"] = " ".charCodeAt(0)] = "SPACE";
    cc[cc["TAB"] = "\t".charCodeAt(0)] = "TAB";
})(cc || (cc = {}));
//# sourceMappingURL=parser.js.map

/***/ }),

/***/ 8231:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProtocolHandler = exports.Subscriptions = exports.SubscriptionImpl = exports.Connect = exports.INFO = void 0;
/*
 * Copyright 2018-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const encoders_1 = __nccwpck_require__(5450);
const transport_1 = __nccwpck_require__(5030);
const util_1 = __nccwpck_require__(4812);
const databuffer_1 = __nccwpck_require__(2155);
const servers_1 = __nccwpck_require__(423);
const queued_iterator_1 = __nccwpck_require__(8450);
const muxsubscription_1 = __nccwpck_require__(7729);
const heartbeats_1 = __nccwpck_require__(4995);
const parser_1 = __nccwpck_require__(9134);
const msg_1 = __nccwpck_require__(5305);
const semver_1 = __nccwpck_require__(6511);
const core_1 = __nccwpck_require__(9498);
const options_1 = __nccwpck_require__(6495);
const FLUSH_THRESHOLD = 1024 * 32;
exports.INFO = /^INFO\s+([^\r\n]+)\r\n/i;
const PONG_CMD = (0, encoders_1.encode)("PONG\r\n");
const PING_CMD = (0, encoders_1.encode)("PING\r\n");
class Connect {
    constructor(transport, opts, nonce) {
        this.protocol = 1;
        this.version = transport.version;
        this.lang = transport.lang;
        this.echo = opts.noEcho ? false : undefined;
        this.verbose = opts.verbose;
        this.pedantic = opts.pedantic;
        this.tls_required = opts.tls ? true : undefined;
        this.name = opts.name;
        const creds = (opts && typeof opts.authenticator === "function"
            ? opts.authenticator(nonce)
            : {}) || {};
        (0, util_1.extend)(this, creds);
    }
}
exports.Connect = Connect;
class SubscriptionImpl extends queued_iterator_1.QueuedIteratorImpl {
    constructor(protocol, subject, opts = {}) {
        super();
        (0, util_1.extend)(this, opts);
        this.protocol = protocol;
        this.subject = subject;
        this.draining = false;
        this.noIterator = typeof opts.callback === "function";
        this.closed = (0, util_1.deferred)();
        if (opts.timeout) {
            this.timer = (0, util_1.timeout)(opts.timeout);
            this.timer
                .then(() => {
                // timer was cancelled
                this.timer = undefined;
            })
                .catch((err) => {
                // timer fired
                this.stop(err);
                if (this.noIterator) {
                    this.callback(err, {});
                }
            });
        }
        if (!this.noIterator) {
            // cleanup - they used break or return from the iterator
            // make sure we clean up, if they didn't call unsub
            this.iterClosed.then(() => {
                this.closed.resolve();
                this.unsubscribe();
            });
        }
    }
    setPrePostHandlers(opts) {
        if (this.noIterator) {
            const uc = this.callback;
            const ingestion = opts.ingestionFilterFn
                ? opts.ingestionFilterFn
                : () => {
                    return { ingest: true, protocol: false };
                };
            const filter = opts.protocolFilterFn ? opts.protocolFilterFn : () => {
                return true;
            };
            const dispatched = opts.dispatchedFn ? opts.dispatchedFn : () => { };
            this.callback = (err, msg) => {
                const { ingest } = ingestion(msg);
                if (!ingest) {
                    return;
                }
                if (filter(msg)) {
                    uc(err, msg);
                    dispatched(msg);
                }
            };
        }
        else {
            this.protocolFilterFn = opts.protocolFilterFn;
            this.dispatchedFn = opts.dispatchedFn;
        }
    }
    callback(err, msg) {
        this.cancelTimeout();
        err ? this.stop(err) : this.push(msg);
    }
    close() {
        if (!this.isClosed()) {
            this.cancelTimeout();
            const fn = () => {
                this.stop();
                if (this.cleanupFn) {
                    try {
                        this.cleanupFn(this, this.info);
                    }
                    catch (_err) {
                        // ignoring
                    }
                }
                this.closed.resolve();
            };
            if (this.noIterator) {
                fn();
            }
            else {
                //@ts-ignore: schedule the close once all messages are processed
                this.push(fn);
            }
        }
    }
    unsubscribe(max) {
        this.protocol.unsubscribe(this, max);
    }
    cancelTimeout() {
        if (this.timer) {
            this.timer.cancel();
            this.timer = undefined;
        }
    }
    drain() {
        if (this.protocol.isClosed()) {
            return Promise.reject(core_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionClosed));
        }
        if (this.isClosed()) {
            return Promise.reject(core_1.NatsError.errorForCode(core_1.ErrorCode.SubClosed));
        }
        if (!this.drained) {
            this.draining = true;
            this.protocol.unsub(this);
            this.drained = this.protocol.flush((0, util_1.deferred)())
                .then(() => {
                this.protocol.subscriptions.cancel(this);
            })
                .catch(() => {
                this.protocol.subscriptions.cancel(this);
            });
        }
        return this.drained;
    }
    isDraining() {
        return this.draining;
    }
    isClosed() {
        return this.done;
    }
    getSubject() {
        return this.subject;
    }
    getMax() {
        return this.max;
    }
    getID() {
        return this.sid;
    }
}
exports.SubscriptionImpl = SubscriptionImpl;
class Subscriptions {
    constructor() {
        this.sidCounter = 0;
        this.mux = null;
        this.subs = new Map();
    }
    size() {
        return this.subs.size;
    }
    add(s) {
        this.sidCounter++;
        s.sid = this.sidCounter;
        this.subs.set(s.sid, s);
        return s;
    }
    setMux(s) {
        this.mux = s;
        return s;
    }
    getMux() {
        return this.mux;
    }
    get(sid) {
        return this.subs.get(sid);
    }
    resub(s) {
        this.sidCounter++;
        this.subs.delete(s.sid);
        s.sid = this.sidCounter;
        this.subs.set(s.sid, s);
        return s;
    }
    all() {
        return Array.from(this.subs.values());
    }
    cancel(s) {
        if (s) {
            s.close();
            this.subs.delete(s.sid);
        }
    }
    handleError(err) {
        if (err && err.permissionContext) {
            const ctx = err.permissionContext;
            const subs = this.all();
            let sub;
            if (ctx.operation === "subscription") {
                sub = subs.find((s) => {
                    return s.subject === ctx.subject;
                });
            }
            if (ctx.operation === "publish") {
                // we have a no mux subscription
                sub = subs.find((s) => {
                    return s.requestSubject === ctx.subject;
                });
            }
            if (sub) {
                sub.callback(err, {});
                sub.close();
                this.subs.delete(sub.sid);
                return sub !== this.mux;
            }
        }
        return false;
    }
    close() {
        this.subs.forEach((sub) => {
            sub.close();
        });
    }
}
exports.Subscriptions = Subscriptions;
class ProtocolHandler {
    constructor(options, publisher) {
        this._closed = false;
        this.connected = false;
        this.connectedOnce = false;
        this.infoReceived = false;
        this.noMorePublishing = false;
        this.abortReconnect = false;
        this.listeners = [];
        this.pendingLimit = FLUSH_THRESHOLD;
        this.outMsgs = 0;
        this.inMsgs = 0;
        this.outBytes = 0;
        this.inBytes = 0;
        this.options = options;
        this.publisher = publisher;
        this.subscriptions = new Subscriptions();
        this.muxSubscriptions = new muxsubscription_1.MuxSubscription();
        this.outbound = new databuffer_1.DataBuffer();
        this.pongs = [];
        //@ts-ignore: options.pendingLimit is hidden
        this.pendingLimit = options.pendingLimit || this.pendingLimit;
        this.features = new semver_1.Features({ major: 0, minor: 0, micro: 0 });
        this.connectPromise = null;
        const servers = typeof options.servers === "string"
            ? [options.servers]
            : options.servers;
        this.servers = new servers_1.Servers(servers, {
            randomize: !options.noRandomize,
        });
        this.closed = (0, util_1.deferred)();
        this.parser = new parser_1.Parser(this);
        this.heartbeats = new heartbeats_1.Heartbeat(this, this.options.pingInterval || options_1.DEFAULT_PING_INTERVAL, this.options.maxPingOut || options_1.DEFAULT_MAX_PING_OUT);
    }
    resetOutbound() {
        this.outbound.reset();
        const pongs = this.pongs;
        this.pongs = [];
        // reject the pongs - the disconnect from here shouldn't have a trace
        // because that confuses API consumers
        const err = core_1.NatsError.errorForCode(core_1.ErrorCode.Disconnect);
        err.stack = "";
        pongs.forEach((p) => {
            p.reject(err);
        });
        this.parser = new parser_1.Parser(this);
        this.infoReceived = false;
    }
    dispatchStatus(status) {
        this.listeners.forEach((q) => {
            q.push(status);
        });
    }
    status() {
        const iter = new queued_iterator_1.QueuedIteratorImpl();
        this.listeners.push(iter);
        return iter;
    }
    prepare() {
        if (this.transport) {
            this.transport.discard();
        }
        this.info = undefined;
        this.resetOutbound();
        const pong = (0, util_1.deferred)();
        pong.catch(() => {
            // provide at least one catch - as pong rejection can happen before it is expected
        });
        this.pongs.unshift(pong);
        this.connectError = (err) => {
            pong.reject(err);
        };
        this.transport = (0, transport_1.newTransport)();
        this.transport.closed()
            .then((_err) => __awaiter(this, void 0, void 0, function* () {
            this.connected = false;
            if (!this.isClosed()) {
                // if the transport gave an error use that, otherwise
                // we may have received a protocol error
                yield this.disconnected(this.transport.closeError || this.lastError);
                return;
            }
        }));
        return pong;
    }
    disconnect() {
        this.dispatchStatus({ type: core_1.DebugEvents.StaleConnection, data: "" });
        this.transport.disconnect();
    }
    disconnected(err) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispatchStatus({
                type: core_1.Events.Disconnect,
                data: this.servers.getCurrentServer().toString(),
            });
            if (this.options.reconnect) {
                yield this.dialLoop()
                    .then(() => {
                    var _a;
                    this.dispatchStatus({
                        type: core_1.Events.Reconnect,
                        data: this.servers.getCurrentServer().toString(),
                    });
                    // if we are here we reconnected, but we have an authentication
                    // that expired, we need to clean it up, otherwise we'll queue up
                    // two of these, and the default for the client will be to
                    // close, rather than attempt again - possibly they have an
                    // authenticator that dynamically updates
                    if (((_a = this.lastError) === null || _a === void 0 ? void 0 : _a.code) === core_1.ErrorCode.AuthenticationExpired) {
                        this.lastError = undefined;
                    }
                })
                    .catch((err) => {
                    this._close(err);
                });
            }
            else {
                yield this._close(err);
            }
        });
    }
    dial(srv) {
        return __awaiter(this, void 0, void 0, function* () {
            const pong = this.prepare();
            let timer;
            try {
                timer = (0, util_1.timeout)(this.options.timeout || 20000);
                const cp = this.transport.connect(srv, this.options);
                yield Promise.race([cp, timer]);
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, e_1, _b, _c;
                    try {
                        try {
                            for (var _d = true, _e = __asyncValues(this.transport), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                                _c = _f.value;
                                _d = false;
                                const b = _c;
                                this.parser.parse(b);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    catch (err) {
                        console.log("reader closed", err);
                    }
                }))().then();
            }
            catch (err) {
                pong.reject(err);
            }
            try {
                yield Promise.race([timer, pong]);
                if (timer) {
                    timer.cancel();
                }
                this.connected = true;
                this.connectError = undefined;
                this.sendSubscriptions();
                this.connectedOnce = true;
                this.server.didConnect = true;
                this.server.reconnects = 0;
                this.flushPending();
                this.heartbeats.start();
            }
            catch (err) {
                if (timer) {
                    timer.cancel();
                }
                yield this.transport.close(err);
                throw err;
            }
        });
    }
    _doDial(srv) {
        return __awaiter(this, void 0, void 0, function* () {
            const alts = yield srv.resolve({
                fn: (0, transport_1.getResolveFn)(),
                debug: this.options.debug,
                randomize: !this.options.noRandomize,
            });
            let lastErr = null;
            for (const a of alts) {
                try {
                    lastErr = null;
                    this.dispatchStatus({ type: core_1.DebugEvents.Reconnecting, data: a.toString() });
                    yield this.dial(a);
                    // if here we connected
                    return;
                }
                catch (err) {
                    lastErr = err;
                }
            }
            // if we are here, we failed, and we have no additional
            // alternatives for this server
            throw lastErr;
        });
    }
    dialLoop() {
        if (this.connectPromise === null) {
            this.connectPromise = this.dodialLoop();
            this.connectPromise
                .then(() => { })
                .catch(() => { })
                .finally(() => {
                this.connectPromise = null;
            });
        }
        return this.connectPromise;
    }
    dodialLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            let lastError;
            while (true) {
                if (this._closed) {
                    // if we are disconnected, and close is called, the client
                    // still tries to reconnect - to match the reconnect policy
                    // in the case of close, want to stop.
                    this.servers.clear();
                }
                const wait = this.options.reconnectDelayHandler
                    ? this.options.reconnectDelayHandler()
                    : options_1.DEFAULT_RECONNECT_TIME_WAIT;
                let maxWait = wait;
                const srv = this.selectServer();
                if (!srv || this.abortReconnect) {
                    if (lastError) {
                        throw lastError;
                    }
                    else if (this.lastError) {
                        throw this.lastError;
                    }
                    else {
                        throw core_1.NatsError.errorForCode(core_1.ErrorCode.ConnectionRefused);
                    }
                }
                const now = Date.now();
                if (srv.lastConnect === 0 || srv.lastConnect + wait <= now) {
                    srv.lastConnect = Date.now();
                    try {
                        yield this._doDial(srv);
                        break;
                    }
                    catch (err) {
                        lastError = err;
                        if (!this.connectedOnce) {
                            if (this.options.waitOnFirstConnect) {
                                continue;
                            }
                            this.servers.removeCurrentServer();
                        }
                        srv.reconnects++;
                        const mra = this.options.maxReconnectAttempts || 0;
                        if (mra !== -1 && srv.reconnects >= mra) {
                            this.servers.removeCurrentServer();
                        }
                    }
                }
                else {
                    maxWait = Math.min(maxWait, srv.lastConnect + wait - now);
                    yield (0, util_1.delay)(maxWait);
                }
            }
        });
    }
    static connect(options, publisher) {
        return __awaiter(this, void 0, void 0, function* () {
            const h = new ProtocolHandler(options, publisher);
            yield h.dialLoop();
            return h;
        });
    }
    static toError(s) {
        const t = s ? s.toLowerCase() : "";
        if (t.indexOf("permissions violation") !== -1) {
            const err = new core_1.NatsError(s, core_1.ErrorCode.PermissionsViolation);
            const m = s.match(/(Publish|Subscription) to "(\S+)"/);
            if (m) {
                err.permissionContext = {
                    operation: m[1].toLowerCase(),
                    subject: m[2],
                };
            }
            return err;
        }
        else if (t.indexOf("authorization violation") !== -1) {
            return new core_1.NatsError(s, core_1.ErrorCode.AuthorizationViolation);
        }
        else if (t.indexOf("user authentication expired") !== -1) {
            return new core_1.NatsError(s, core_1.ErrorCode.AuthenticationExpired);
        }
        else if (t.indexOf("authentication timeout") !== -1) {
            return new core_1.NatsError(s, core_1.ErrorCode.AuthenticationTimeout);
        }
        else {
            return new core_1.NatsError(s, core_1.ErrorCode.ProtocolError);
        }
    }
    processMsg(msg, data) {
        this.inMsgs++;
        this.inBytes += data.length;
        if (!this.subscriptions.sidCounter) {
            return;
        }
        const sub = this.subscriptions.get(msg.sid);
        if (!sub) {
            return;
        }
        sub.received += 1;
        if (sub.callback) {
            sub.callback(null, new msg_1.MsgImpl(msg, data, this));
        }
        if (sub.max !== undefined && sub.received >= sub.max) {
            sub.unsubscribe();
        }
    }
    processError(m) {
        const s = (0, encoders_1.decode)(m);
        const err = ProtocolHandler.toError(s);
        const status = { type: core_1.Events.Error, data: err.code };
        if (err.isPermissionError()) {
            let isMuxPermissionError = false;
            if (err.permissionContext) {
                status.permissionContext = err.permissionContext;
                const mux = this.subscriptions.getMux();
                isMuxPermissionError = (mux === null || mux === void 0 ? void 0 : mux.subject) === err.permissionContext.subject;
            }
            this.subscriptions.handleError(err);
            this.muxSubscriptions.handleError(isMuxPermissionError, err);
            if (isMuxPermissionError) {
                // remove the permission - enable it to be recreated
                this.subscriptions.setMux(null);
            }
        }
        this.dispatchStatus(status);
        this.handleError(err);
    }
    handleError(err) {
        if (err.isAuthError()) {
            this.handleAuthError(err);
        }
        else if (err.isProtocolError()) {
            this.lastError = err;
        }
        else if (err.isAuthTimeout()) {
            this.lastError = err;
        }
        // fallthrough here
        if (!err.isPermissionError()) {
            this.lastError = err;
        }
    }
    handleAuthError(err) {
        if ((this.lastError && err.code === this.lastError.code) &&
            this.options.ignoreAuthErrorAbort === false) {
            this.abortReconnect = true;
        }
        if (this.connectError) {
            this.connectError(err);
        }
        else {
            this.disconnect();
        }
    }
    processPing() {
        this.transport.send(PONG_CMD);
    }
    processPong() {
        const cb = this.pongs.shift();
        if (cb) {
            cb.resolve();
        }
    }
    processInfo(m) {
        const info = JSON.parse((0, encoders_1.decode)(m));
        this.info = info;
        const updates = this.options && this.options.ignoreClusterUpdates
            ? undefined
            : this.servers.update(info);
        if (!this.infoReceived) {
            this.features.update((0, semver_1.parseSemVer)(info.version));
            this.infoReceived = true;
            if (this.transport.isEncrypted()) {
                this.servers.updateTLSName();
            }
            // send connect
            const { version, lang } = this.transport;
            try {
                const c = new Connect({ version, lang }, this.options, info.nonce);
                if (info.headers) {
                    c.headers = true;
                    c.no_responders = true;
                }
                const cs = JSON.stringify(c);
                this.transport.send((0, encoders_1.encode)(`CONNECT ${cs}${transport_1.CR_LF}`));
                this.transport.send(PING_CMD);
            }
            catch (err) {
                // if we are dying here, this is likely some an authenticator blowing up
                this._close(err);
            }
        }
        if (updates) {
            this.dispatchStatus({ type: core_1.Events.Update, data: updates });
        }
        const ldm = info.ldm !== undefined ? info.ldm : false;
        if (ldm) {
            this.dispatchStatus({
                type: core_1.Events.LDM,
                data: this.servers.getCurrentServer().toString(),
            });
        }
    }
    push(e) {
        switch (e.kind) {
            case parser_1.Kind.MSG: {
                const { msg, data } = e;
                this.processMsg(msg, data);
                break;
            }
            case parser_1.Kind.OK:
                break;
            case parser_1.Kind.ERR:
                this.processError(e.data);
                break;
            case parser_1.Kind.PING:
                this.processPing();
                break;
            case parser_1.Kind.PONG:
                this.processPong();
                break;
            case parser_1.Kind.INFO:
                this.processInfo(e.data);
                break;
        }
    }
    sendCommand(cmd, ...payloads) {
        const len = this.outbound.length();
        let buf;
        if (typeof cmd === "string") {
            buf = (0, encoders_1.encode)(cmd);
        }
        else {
            buf = cmd;
        }
        this.outbound.fill(buf, ...payloads);
        if (len === 0) {
            queueMicrotask(() => {
                this.flushPending();
            });
        }
        else if (this.outbound.size() >= this.pendingLimit) {
            // flush inline
            this.flushPending();
        }
    }
    publish(subject, payload = encoders_1.Empty, options) {
        let data;
        if (payload instanceof Uint8Array) {
            data = payload;
        }
        else if (typeof payload === "string") {
            data = encoders_1.TE.encode(payload);
        }
        else {
            throw core_1.NatsError.errorForCode(core_1.ErrorCode.BadPayload);
        }
        let len = data.length;
        options = options || {};
        options.reply = options.reply || "";
        let headers = encoders_1.Empty;
        let hlen = 0;
        if (options.headers) {
            if (this.info && !this.info.headers) {
                throw new core_1.NatsError("headers", core_1.ErrorCode.ServerOptionNotAvailable);
            }
            const hdrs = options.headers;
            headers = hdrs.encode();
            hlen = headers.length;
            len = data.length + hlen;
        }
        if (this.info && len > this.info.max_payload) {
            throw core_1.NatsError.errorForCode(core_1.ErrorCode.MaxPayloadExceeded);
        }
        this.outBytes += len;
        this.outMsgs++;
        let proto;
        if (options.headers) {
            if (options.reply) {
                proto = `HPUB ${subject} ${options.reply} ${hlen} ${len}\r\n`;
            }
            else {
                proto = `HPUB ${subject} ${hlen} ${len}\r\n`;
            }
            this.sendCommand(proto, headers, data, transport_1.CRLF);
        }
        else {
            if (options.reply) {
                proto = `PUB ${subject} ${options.reply} ${len}\r\n`;
            }
            else {
                proto = `PUB ${subject} ${len}\r\n`;
            }
            this.sendCommand(proto, data, transport_1.CRLF);
        }
    }
    request(r) {
        this.initMux();
        this.muxSubscriptions.add(r);
        return r;
    }
    subscribe(s) {
        this.subscriptions.add(s);
        this._subunsub(s);
        return s;
    }
    _sub(s) {
        if (s.queue) {
            this.sendCommand(`SUB ${s.subject} ${s.queue} ${s.sid}\r\n`);
        }
        else {
            this.sendCommand(`SUB ${s.subject} ${s.sid}\r\n`);
        }
    }
    _subunsub(s) {
        this._sub(s);
        if (s.max) {
            this.unsubscribe(s, s.max);
        }
        return s;
    }
    unsubscribe(s, max) {
        this.unsub(s, max);
        if (s.max === undefined || s.received >= s.max) {
            this.subscriptions.cancel(s);
        }
    }
    unsub(s, max) {
        if (!s || this.isClosed()) {
            return;
        }
        if (max) {
            this.sendCommand(`UNSUB ${s.sid} ${max}\r\n`);
        }
        else {
            this.sendCommand(`UNSUB ${s.sid}\r\n`);
        }
        s.max = max;
    }
    resub(s, subject) {
        if (!s || this.isClosed()) {
            return;
        }
        s.subject = subject;
        this.subscriptions.resub(s);
        // we don't auto-unsub here because we don't
        // really know "processed"
        this._sub(s);
    }
    flush(p) {
        if (!p) {
            p = (0, util_1.deferred)();
        }
        this.pongs.push(p);
        this.outbound.fill(PING_CMD);
        this.flushPending();
        return p;
    }
    sendSubscriptions() {
        const cmds = [];
        this.subscriptions.all().forEach((s) => {
            const sub = s;
            if (sub.queue) {
                cmds.push(`SUB ${sub.subject} ${sub.queue} ${sub.sid}${transport_1.CR_LF}`);
            }
            else {
                cmds.push(`SUB ${sub.subject} ${sub.sid}${transport_1.CR_LF}`);
            }
        });
        if (cmds.length) {
            this.transport.send((0, encoders_1.encode)(cmds.join("")));
        }
    }
    _close(err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._closed) {
                return;
            }
            this.heartbeats.cancel();
            if (this.connectError) {
                this.connectError(err);
                this.connectError = undefined;
            }
            this.muxSubscriptions.close();
            this.subscriptions.close();
            this.listeners.forEach((l) => {
                l.stop();
            });
            this._closed = true;
            yield this.transport.close(err);
            yield this.closed.resolve(err);
        });
    }
    close() {
        return this._close();
    }
    isClosed() {
        return this._closed;
    }
    drain() {
        const subs = this.subscriptions.all();
        const promises = [];
        subs.forEach((sub) => {
            promises.push(sub.drain());
        });
        return Promise.all(promises)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            this.noMorePublishing = true;
            yield this.flush();
            return this.close();
        }))
            .catch(() => {
            // cannot happen
        });
    }
    flushPending() {
        if (!this.infoReceived || !this.connected) {
            return;
        }
        if (this.outbound.size()) {
            const d = this.outbound.drain();
            this.transport.send(d);
        }
    }
    initMux() {
        const mux = this.subscriptions.getMux();
        if (!mux) {
            const inbox = this.muxSubscriptions.init(this.options.inboxPrefix);
            // dot is already part of mux
            const sub = new SubscriptionImpl(this, `${inbox}*`);
            sub.callback = this.muxSubscriptions.dispatcher();
            this.subscriptions.setMux(sub);
            this.subscribe(sub);
        }
    }
    selectServer() {
        const server = this.servers.selectServer();
        if (server === undefined) {
            return undefined;
        }
        // Place in client context.
        this.server = server;
        return this.server;
    }
    getServer() {
        return this.server;
    }
}
exports.ProtocolHandler = ProtocolHandler;
//# sourceMappingURL=protocol.js.map

/***/ }),

/***/ 8450:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueuedIteratorImpl = void 0;
/*
 * Copyright 2020-2022 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const util_1 = __nccwpck_require__(4812);
const core_1 = __nccwpck_require__(9498);
class QueuedIteratorImpl {
    constructor() {
        this.inflight = 0;
        this.filtered = 0;
        this.pendingFiltered = 0;
        this.processed = 0;
        this.received = 0;
        this.noIterator = false;
        this.done = false;
        this.signal = (0, util_1.deferred)();
        this.yields = [];
        this.iterClosed = (0, util_1.deferred)();
        this.time = 0;
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
    push(v) {
        if (this.done) {
            return;
        }
        if (typeof v === "function") {
            this.yields.push(v);
            this.signal.resolve();
            return;
        }
        const { ingest, protocol } = this.ingestionFilterFn
            ? this.ingestionFilterFn(v, this.ctx || this)
            : { ingest: true, protocol: false };
        if (ingest) {
            if (protocol) {
                this.filtered++;
                this.pendingFiltered++;
            }
            this.yields.push(v);
            this.signal.resolve();
        }
    }
    iterate() {
        return __asyncGenerator(this, arguments, function* iterate_1() {
            if (this.noIterator) {
                throw new core_1.NatsError("unsupported iterator", core_1.ErrorCode.ApiError);
            }
            try {
                while (true) {
                    if (this.yields.length === 0) {
                        yield __await(this.signal);
                    }
                    if (this.err) {
                        throw this.err;
                    }
                    const yields = this.yields;
                    this.inflight = yields.length;
                    this.yields = [];
                    for (let i = 0; i < yields.length; i++) {
                        if (typeof yields[i] === "function") {
                            const fn = yields[i];
                            try {
                                fn();
                            }
                            catch (err) {
                                // failed on the invocation - fail the iterator
                                // so they know to fix the callback
                                throw err;
                            }
                            // fn could have also set an error
                            if (this.err) {
                                throw this.err;
                            }
                            continue;
                        }
                        // only pass messages that pass the filter
                        const ok = this.protocolFilterFn
                            ? this.protocolFilterFn(yields[i])
                            : true;
                        if (ok) {
                            this.processed++;
                            const start = Date.now();
                            yield yield __await(yields[i]);
                            this.time = Date.now() - start;
                            if (this.dispatchedFn && yields[i]) {
                                this.dispatchedFn(yields[i]);
                            }
                        }
                        else {
                            this.pendingFiltered--;
                        }
                        this.inflight--;
                    }
                    // yielding could have paused and microtask
                    // could have added messages. Prevent allocations
                    // if possible
                    if (this.done) {
                        break;
                    }
                    else if (this.yields.length === 0) {
                        yields.length = 0;
                        this.yields = yields;
                        this.signal = (0, util_1.deferred)();
                    }
                }
            }
            finally {
                // the iterator used break/return
                this.stop();
            }
        });
    }
    stop(err) {
        if (this.done) {
            return;
        }
        this.err = err;
        this.done = true;
        this.signal.resolve();
        this.iterClosed.resolve();
    }
    getProcessed() {
        return this.noIterator ? this.received : this.processed;
    }
    getPending() {
        return this.yields.length + this.inflight - this.pendingFiltered;
    }
    getReceived() {
        return this.received - this.filtered;
    }
}
exports.QueuedIteratorImpl = QueuedIteratorImpl;
//# sourceMappingURL=queued_iterator.js.map

/***/ }),

/***/ 7008:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestOne = exports.RequestMany = exports.BaseRequest = void 0;
/*
 * Copyright 2020-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const util_1 = __nccwpck_require__(4812);
const nuid_1 = __nccwpck_require__(6146);
const core_1 = __nccwpck_require__(9498);
class BaseRequest {
    constructor(mux, requestSubject) {
        this.mux = mux;
        this.requestSubject = requestSubject;
        this.received = 0;
        this.token = nuid_1.nuid.next();
        this.ctx = new Error();
    }
}
exports.BaseRequest = BaseRequest;
/**
 * Request expects multiple message response
 * the request ends when the timer expires,
 * an error arrives or an expected count of messages
 * arrives, end is signaled by a null message
 */
class RequestMany extends BaseRequest {
    constructor(mux, requestSubject, opts = { maxWait: 1000 }) {
        super(mux, requestSubject);
        this.opts = opts;
        if (typeof this.opts.callback !== "function") {
            throw new Error("callback is required");
        }
        this.callback = this.opts.callback;
        this.max = typeof opts.maxMessages === "number" && opts.maxMessages > 0
            ? opts.maxMessages
            : -1;
        this.done = (0, util_1.deferred)();
        this.done.then(() => {
            this.callback(null, null);
        });
        // @ts-ignore: node is not a number
        this.timer = setTimeout(() => {
            this.cancel();
        }, opts.maxWait);
    }
    cancel(err) {
        if (err) {
            this.callback(err, null);
        }
        clearTimeout(this.timer);
        this.mux.cancel(this);
        this.done.resolve();
    }
    resolver(err, msg) {
        if (err) {
            err.stack += `\n\n${this.ctx.stack}`;
            this.cancel(err);
        }
        else {
            this.callback(null, msg);
            if (this.opts.strategy === core_1.RequestStrategy.Count) {
                this.max--;
                if (this.max === 0) {
                    this.cancel();
                }
            }
            if (this.opts.strategy === core_1.RequestStrategy.JitterTimer) {
                clearTimeout(this.timer);
                // @ts-ignore: node is not a number
                this.timer = setTimeout(() => {
                    this.cancel();
                }, this.opts.jitter || 300);
            }
            if (this.opts.strategy === core_1.RequestStrategy.SentinelMsg) {
                if (msg && msg.data.length === 0) {
                    this.cancel();
                }
            }
        }
    }
}
exports.RequestMany = RequestMany;
class RequestOne extends BaseRequest {
    constructor(mux, requestSubject, opts = { timeout: 1000 }) {
        super(mux, requestSubject);
        // extend(this, opts);
        this.deferred = (0, util_1.deferred)();
        this.timer = (0, util_1.timeout)(opts.timeout);
    }
    resolver(err, msg) {
        if (this.timer) {
            this.timer.cancel();
        }
        if (err) {
            err.stack += `\n\n${this.ctx.stack}`;
            this.deferred.reject(err);
        }
        else {
            this.deferred.resolve(msg);
        }
        this.cancel();
    }
    cancel(err) {
        if (this.timer) {
            this.timer.cancel();
        }
        this.mux.cancel(this);
        this.deferred.reject(err ? err : core_1.NatsError.errorForCode(core_1.ErrorCode.Cancelled));
    }
}
exports.RequestOne = RequestOne;
//# sourceMappingURL=request.js.map

/***/ }),

/***/ 6511:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Features = exports.Feature = exports.compare = exports.parseSemVer = void 0;
function parseSemVer(s = "") {
    const m = s.match(/(\d+).(\d+).(\d+)/);
    if (m) {
        return {
            major: parseInt(m[1]),
            minor: parseInt(m[2]),
            micro: parseInt(m[3]),
        };
    }
    throw new Error(`'${s}' is not a semver value`);
}
exports.parseSemVer = parseSemVer;
function compare(a, b) {
    if (a.major < b.major)
        return -1;
    if (a.major > b.major)
        return 1;
    if (a.minor < b.minor)
        return -1;
    if (a.minor > b.minor)
        return 1;
    if (a.micro < b.micro)
        return -1;
    if (a.micro > b.micro)
        return 1;
    return 0;
}
exports.compare = compare;
var Feature;
(function (Feature) {
    Feature["JS_KV"] = "js_kv";
    Feature["JS_OBJECTSTORE"] = "js_objectstore";
    Feature["JS_PULL_MAX_BYTES"] = "js_pull_max_bytes";
    Feature["JS_NEW_CONSUMER_CREATE_API"] = "js_new_consumer_create";
    Feature["JS_ALLOW_DIRECT"] = "js_allow_direct";
    Feature["JS_MULTIPLE_CONSUMER_FILTER"] = "js_multiple_consumer_filter";
    Feature["JS_SIMPLIFICATION"] = "js_simplification";
    Feature["JS_STREAM_CONSUMER_METADATA"] = "js_stream_consumer_metadata";
    Feature["JS_CONSUMER_FILTER_SUBJECTS"] = "js_consumer_filter_subjects";
    Feature["JS_STREAM_FIRST_SEQ"] = "js_stream_first_seq";
    Feature["JS_STREAM_SUBJECT_TRANSFORM"] = "js_stream_subject_transform";
    Feature["JS_STREAM_SOURCE_SUBJECT_TRANSFORM"] = "js_stream_source_subject_transform";
    Feature["JS_STREAM_COMPRESSION"] = "js_stream_compression";
    Feature["JS_DEFAULT_CONSUMER_LIMITS"] = "js_default_consumer_limits";
})(Feature || (exports.Feature = Feature = {}));
class Features {
    constructor(v) {
        this.features = new Map();
        this.disabled = [];
        this.update(v);
    }
    /**
     * Removes all disabled entries
     */
    resetDisabled() {
        this.disabled.length = 0;
        this.update(this.server);
    }
    /**
     * Disables a particular feature.
     * @param f
     */
    disable(f) {
        this.disabled.push(f);
        this.update(this.server);
    }
    isDisabled(f) {
        return this.disabled.indexOf(f) !== -1;
    }
    update(v) {
        if (typeof v === "string") {
            v = parseSemVer(v);
        }
        this.server = v;
        this.set(Feature.JS_KV, "2.6.2");
        this.set(Feature.JS_OBJECTSTORE, "2.6.3");
        this.set(Feature.JS_PULL_MAX_BYTES, "2.8.3");
        this.set(Feature.JS_NEW_CONSUMER_CREATE_API, "2.9.0");
        this.set(Feature.JS_ALLOW_DIRECT, "2.9.0");
        this.set(Feature.JS_MULTIPLE_CONSUMER_FILTER, "2.10.0");
        this.set(Feature.JS_SIMPLIFICATION, "2.9.4");
        this.set(Feature.JS_STREAM_CONSUMER_METADATA, "2.10.0");
        this.set(Feature.JS_CONSUMER_FILTER_SUBJECTS, "2.10.0");
        this.set(Feature.JS_STREAM_FIRST_SEQ, "2.10.0");
        this.set(Feature.JS_STREAM_SUBJECT_TRANSFORM, "2.10.0");
        this.set(Feature.JS_STREAM_SOURCE_SUBJECT_TRANSFORM, "2.10.0");
        this.set(Feature.JS_STREAM_COMPRESSION, "2.10.0");
        this.set(Feature.JS_DEFAULT_CONSUMER_LIMITS, "2.10.0");
        this.disabled.forEach((f) => {
            this.features.delete(f);
        });
    }
    /**
     * Register a feature that requires a particular server version.
     * @param f
     * @param requires
     */
    set(f, requires) {
        this.features.set(f, {
            min: requires,
            ok: compare(this.server, parseSemVer(requires)) >= 0,
        });
    }
    /**
     * Returns whether the feature is available and the min server
     * version that supports it.
     * @param f
     */
    get(f) {
        return this.features.get(f) || { min: "unknown", ok: false };
    }
    /**
     * Returns true if the feature is supported
     * @param f
     */
    supports(f) {
        var _a;
        return ((_a = this.get(f)) === null || _a === void 0 ? void 0 : _a.ok) || false;
    }
    /**
     * Returns true if the server is at least the specified version
     * @param v
     */
    require(v) {
        if (typeof v === "string") {
            v = parseSemVer(v);
        }
        return compare(this.server, v) >= 0;
    }
}
exports.Features = Features;
//# sourceMappingURL=semver.js.map

/***/ }),

/***/ 423:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Servers = exports.ServerImpl = exports.hostPort = exports.isIPV4OrHostname = void 0;
/*
 * Copyright 2018-2022 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const transport_1 = __nccwpck_require__(5030);
const util_1 = __nccwpck_require__(4812);
const ipparser_1 = __nccwpck_require__(6699);
const core_1 = __nccwpck_require__(9498);
function isIPV4OrHostname(hp) {
    if (hp.indexOf(".") !== -1) {
        return true;
    }
    if (hp.indexOf("[") !== -1 || hp.indexOf("::") !== -1) {
        return false;
    }
    // if we have a plain hostname or host:port
    if (hp.split(":").length <= 2) {
        return true;
    }
    return false;
}
exports.isIPV4OrHostname = isIPV4OrHostname;
function isIPV6(hp) {
    return !isIPV4OrHostname(hp);
}
function filterIpv6MappedToIpv4(hp) {
    const prefix = "::FFFF:";
    const idx = hp.toUpperCase().indexOf(prefix);
    if (idx !== -1 && hp.indexOf(".") !== -1) {
        // we have something like: ::FFFF:127.0.0.1 or [::FFFF:127.0.0.1]:4222
        let ip = hp.substring(idx + prefix.length);
        ip = ip.replace("[", "");
        return ip.replace("]", "");
    }
    return hp;
}
function hostPort(u) {
    u = u.trim();
    // remove any protocol that may have been provided
    if (u.match(/^(.*:\/\/)(.*)/m)) {
        u = u.replace(/^(.*:\/\/)(.*)/gm, "$2");
    }
    // in web environments, URL may not be a living standard
    // that means that protocols other than HTTP/S are not
    // parsable correctly.
    // the third complication is that we may have been given
    // an IPv6 or worse IPv6 mapping an Ipv4
    u = filterIpv6MappedToIpv4(u);
    // we only wrap cases where they gave us a plain ipv6
    // and we are not already bracketed
    if (isIPV6(u) && u.indexOf("[") === -1) {
        u = `[${u}]`;
    }
    // if we have ipv6, we expect port after ']:' otherwise after ':'
    const op = isIPV6(u) ? u.match(/(]:)(\d+)/) : u.match(/(:)(\d+)/);
    const port = op && op.length === 3 && op[1] && op[2]
        ? parseInt(op[2])
        : core_1.DEFAULT_PORT;
    // the next complication is that new URL() may
    // eat ports which match the protocol - so for example
    // port 80 may be eliminated - so we flip the protocol
    // so that it always yields a value
    const protocol = port === 80 ? "https" : "http";
    const url = new URL(`${protocol}://${u}`);
    url.port = `${port}`;
    let hostname = url.hostname;
    // if we are bracketed, we need to rip it out
    if (hostname.charAt(0) === "[") {
        hostname = hostname.substring(1, hostname.length - 1);
    }
    const listen = url.host;
    return { listen, hostname, port };
}
exports.hostPort = hostPort;
/**
 * @hidden
 */
class ServerImpl {
    constructor(u, gossiped = false) {
        this.src = u;
        this.tlsName = "";
        const v = hostPort(u);
        this.listen = v.listen;
        this.hostname = v.hostname;
        this.port = v.port;
        this.didConnect = false;
        this.reconnects = 0;
        this.lastConnect = 0;
        this.gossiped = gossiped;
    }
    toString() {
        return this.listen;
    }
    resolve(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts.fn) {
                // we cannot resolve - transport doesn't support it
                // don't add - to resolves or we get a circ reference
                return [this];
            }
            const buf = [];
            if ((0, ipparser_1.isIP)(this.hostname)) {
                // don't add - to resolves or we get a circ reference
                return [this];
            }
            else {
                // resolve the hostname to ips
                const ips = yield opts.fn(this.hostname);
                if (opts.debug) {
                    console.log(`resolve ${this.hostname} = ${ips.join(",")}`);
                }
                for (const ip of ips) {
                    // letting URL handle the details of representing IPV6 ip with a port, etc
                    // careful to make sure the protocol doesn't line with standard ports or they
                    // get swallowed
                    const proto = this.port === 80 ? "https" : "http";
                    // ipv6 won't be bracketed here, because it came from resolve
                    const url = new URL(`${proto}://${isIPV6(ip) ? "[" + ip + "]" : ip}`);
                    url.port = `${this.port}`;
                    const ss = new ServerImpl(url.host, false);
                    ss.tlsName = this.hostname;
                    buf.push(ss);
                }
            }
            if (opts.randomize) {
                (0, util_1.shuffle)(buf);
            }
            this.resolves = buf;
            return buf;
        });
    }
}
exports.ServerImpl = ServerImpl;
/**
 * @hidden
 */
class Servers {
    constructor(listens = [], opts = {}) {
        this.firstSelect = true;
        this.servers = [];
        this.tlsName = "";
        this.randomize = opts.randomize || false;
        const urlParseFn = (0, transport_1.getUrlParseFn)();
        if (listens) {
            listens.forEach((hp) => {
                hp = urlParseFn ? urlParseFn(hp) : hp;
                this.servers.push(new ServerImpl(hp));
            });
            if (this.randomize) {
                this.servers = (0, util_1.shuffle)(this.servers);
            }
        }
        if (this.servers.length === 0) {
            this.addServer(`${core_1.DEFAULT_HOST}:${(0, transport_1.defaultPort)()}`, false);
        }
        this.currentServer = this.servers[0];
    }
    clear() {
        this.servers.length = 0;
    }
    updateTLSName() {
        const cs = this.getCurrentServer();
        if (!(0, ipparser_1.isIP)(cs.hostname)) {
            this.tlsName = cs.hostname;
            this.servers.forEach((s) => {
                if (s.gossiped) {
                    s.tlsName = this.tlsName;
                }
            });
        }
    }
    getCurrentServer() {
        return this.currentServer;
    }
    addServer(u, implicit = false) {
        const urlParseFn = (0, transport_1.getUrlParseFn)();
        u = urlParseFn ? urlParseFn(u) : u;
        const s = new ServerImpl(u, implicit);
        if ((0, ipparser_1.isIP)(s.hostname)) {
            s.tlsName = this.tlsName;
        }
        this.servers.push(s);
    }
    selectServer() {
        // allow using select without breaking the order of the servers
        if (this.firstSelect) {
            this.firstSelect = false;
            return this.currentServer;
        }
        const t = this.servers.shift();
        if (t) {
            this.servers.push(t);
            this.currentServer = t;
        }
        return t;
    }
    removeCurrentServer() {
        this.removeServer(this.currentServer);
    }
    removeServer(server) {
        if (server) {
            const index = this.servers.indexOf(server);
            this.servers.splice(index, 1);
        }
    }
    length() {
        return this.servers.length;
    }
    next() {
        return this.servers.length ? this.servers[0] : undefined;
    }
    getServers() {
        return this.servers;
    }
    update(info) {
        const added = [];
        let deleted = [];
        const urlParseFn = (0, transport_1.getUrlParseFn)();
        const discovered = new Map();
        if (info.connect_urls && info.connect_urls.length > 0) {
            info.connect_urls.forEach((hp) => {
                hp = urlParseFn ? urlParseFn(hp) : hp;
                const s = new ServerImpl(hp, true);
                discovered.set(hp, s);
            });
        }
        // remove gossiped servers that are no longer reported
        const toDelete = [];
        this.servers.forEach((s, index) => {
            const u = s.listen;
            if (s.gossiped && this.currentServer.listen !== u &&
                discovered.get(u) === undefined) {
                // server was removed
                toDelete.push(index);
            }
            // remove this entry from reported
            discovered.delete(u);
        });
        // perform the deletion
        toDelete.reverse();
        toDelete.forEach((index) => {
            const removed = this.servers.splice(index, 1);
            deleted = deleted.concat(removed[0].listen);
        });
        // remaining servers are new
        discovered.forEach((v, k) => {
            this.servers.push(v);
            added.push(k);
        });
        return { added, deleted };
    }
}
exports.Servers = Servers;
//# sourceMappingURL=servers.js.map

/***/ }),

/***/ 3594:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceImpl = exports.ServiceGroupImpl = exports.ServiceMsgImpl = exports.ServiceApiPrefix = void 0;
/*
 * Copyright 2022-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const util_1 = __nccwpck_require__(4812);
const headers_1 = __nccwpck_require__(24);
const codec_1 = __nccwpck_require__(2524);
const nuid_1 = __nccwpck_require__(6146);
const queued_iterator_1 = __nccwpck_require__(8450);
const jsutil_1 = __nccwpck_require__(1186);
const semver_1 = __nccwpck_require__(6511);
const encoders_1 = __nccwpck_require__(5450);
const core_1 = __nccwpck_require__(9498);
/**
 * Services have common backplane subject pattern:
 *
 * `$SRV.PING|STATS|INFO` - pings or retrieves status for all services
 * `$SRV.PING|STATS|INFO.<name>` - pings or retrieves status for all services having the specified name
 * `$SRV.PING|STATS|INFO.<name>.<id>` - pings or retrieves status of a particular service
 *
 * Note that <name> and <id> are upper-cased.
 */
exports.ServiceApiPrefix = "$SRV";
class ServiceMsgImpl {
    constructor(msg) {
        this.msg = msg;
    }
    get data() {
        return this.msg.data;
    }
    get sid() {
        return this.msg.sid;
    }
    get subject() {
        return this.msg.subject;
    }
    get reply() {
        return this.msg.reply || "";
    }
    get headers() {
        return this.msg.headers;
    }
    respond(data, opts) {
        return this.msg.respond(data, opts);
    }
    respondError(code, description, data, opts) {
        var _a, _b;
        opts = opts || {};
        opts.headers = opts.headers || (0, headers_1.headers)();
        (_a = opts.headers) === null || _a === void 0 ? void 0 : _a.set(core_1.ServiceErrorCodeHeader, `${code}`);
        (_b = opts.headers) === null || _b === void 0 ? void 0 : _b.set(core_1.ServiceErrorHeader, description);
        return this.msg.respond(data, opts);
    }
    json(reviver) {
        return this.msg.json(reviver);
    }
    string() {
        return this.msg.string();
    }
}
exports.ServiceMsgImpl = ServiceMsgImpl;
class ServiceGroupImpl {
    constructor(parent, name = "", queue = "") {
        if (name !== "") {
            validInternalToken("service group", name);
        }
        let root = "";
        if (parent instanceof ServiceImpl) {
            this.srv = parent;
            root = "";
        }
        else if (parent instanceof ServiceGroupImpl) {
            const sg = parent;
            this.srv = sg.srv;
            if (queue === "" && sg.queue !== "") {
                queue = sg.queue;
            }
            root = sg.subject;
        }
        else {
            throw new Error("unknown ServiceGroup type");
        }
        this.subject = this.calcSubject(root, name);
        this.queue = queue;
    }
    calcSubject(root, name = "") {
        if (name === "") {
            return root;
        }
        return root !== "" ? `${root}.${name}` : name;
    }
    addEndpoint(name = "", opts) {
        opts = opts || { subject: name };
        const args = typeof opts === "function"
            ? { handler: opts, subject: name }
            : opts;
        (0, jsutil_1.validateName)("endpoint", name);
        let { subject, handler, metadata, queue } = args;
        subject = subject || name;
        queue = queue || this.queue;
        validSubjectName("endpoint subject", subject);
        subject = this.calcSubject(this.subject, subject);
        const ne = { name, subject, queue, handler, metadata };
        return this.srv._addEndpoint(ne);
    }
    addGroup(name = "", queue = "") {
        return new ServiceGroupImpl(this, name, queue);
    }
}
exports.ServiceGroupImpl = ServiceGroupImpl;
function validSubjectName(context, subj) {
    if (subj === "") {
        throw new Error(`${context} cannot be empty`);
    }
    if (subj.indexOf(" ") !== -1) {
        throw new Error(`${context} cannot contain spaces: '${subj}'`);
    }
    const tokens = subj.split(".");
    tokens.forEach((v, idx) => {
        if (v === ">" && idx !== tokens.length - 1) {
            throw new Error(`${context} cannot have internal '>': '${subj}'`);
        }
    });
}
function validInternalToken(context, subj) {
    if (subj.indexOf(" ") !== -1) {
        throw new Error(`${context} cannot contain spaces: '${subj}'`);
    }
    const tokens = subj.split(".");
    tokens.forEach((v) => {
        if (v === ">") {
            throw new Error(`${context} name cannot contain internal '>': '${subj}'`);
        }
    });
}
class ServiceImpl {
    /**
     * @param verb
     * @param name
     * @param id
     * @param prefix - this is only supplied by tooling when building control subject that crosses an account
     */
    static controlSubject(verb, name = "", id = "", prefix) {
        // the prefix is used as is, because it is an
        // account boundary permission
        const pre = prefix !== null && prefix !== void 0 ? prefix : exports.ServiceApiPrefix;
        if (name === "" && id === "") {
            return `${pre}.${verb}`;
        }
        (0, jsutil_1.validateName)("control subject name", name);
        if (id !== "") {
            (0, jsutil_1.validateName)("control subject id", id);
            return `${pre}.${verb}.${name}.${id}`;
        }
        return `${pre}.${verb}.${name}`;
    }
    constructor(nc, config = { name: "", version: "" }) {
        this.nc = nc;
        this.config = Object.assign({}, config);
        if (!this.config.queue) {
            this.config.queue = "q";
        }
        // this will throw if no name
        (0, jsutil_1.validateName)("name", this.config.name);
        (0, jsutil_1.validateName)("queue", this.config.queue);
        // this will throw if not semver
        (0, semver_1.parseSemVer)(this.config.version);
        this._id = nuid_1.nuid.next();
        this.internal = [];
        this._done = (0, util_1.deferred)();
        this._stopped = false;
        this.handlers = [];
        this.started = new Date().toISOString();
        // initialize the stats
        this.reset();
        // close if the connection closes
        this.nc.closed()
            .then(() => {
            this.close().catch();
        })
            .catch((err) => {
            this.close(err).catch();
        });
    }
    get subjects() {
        return this.handlers.filter((s) => {
            return s.internal === false;
        }).map((s) => {
            return s.subject;
        });
    }
    get id() {
        return this._id;
    }
    get name() {
        return this.config.name;
    }
    get description() {
        var _a;
        return (_a = this.config.description) !== null && _a !== void 0 ? _a : "";
    }
    get version() {
        return this.config.version;
    }
    get metadata() {
        return this.config.metadata;
    }
    errorToHeader(err) {
        const h = (0, headers_1.headers)();
        if (err instanceof core_1.ServiceError) {
            const se = err;
            h.set(core_1.ServiceErrorHeader, se.message);
            h.set(core_1.ServiceErrorCodeHeader, `${se.code}`);
        }
        else {
            h.set(core_1.ServiceErrorHeader, err.message);
            h.set(core_1.ServiceErrorCodeHeader, "500");
        }
        return h;
    }
    setupHandler(h, internal = false) {
        // internals don't use a queue
        const queue = internal ? "" : (h.queue ? h.queue : this.config.queue);
        const { name, subject, handler } = h;
        const sv = h;
        sv.internal = internal;
        if (internal) {
            this.internal.push(sv);
        }
        sv.stats = new NamedEndpointStatsImpl(name, subject, queue);
        sv.queue = queue;
        const callback = handler
            ? (err, msg) => {
                if (err) {
                    this.close(err);
                    return;
                }
                const start = Date.now();
                try {
                    handler(err, new ServiceMsgImpl(msg));
                }
                catch (err) {
                    sv.stats.countError(err);
                    msg === null || msg === void 0 ? void 0 : msg.respond(encoders_1.Empty, { headers: this.errorToHeader(err) });
                }
                finally {
                    sv.stats.countLatency(start);
                }
            }
            : undefined;
        sv.sub = this.nc.subscribe(subject, {
            callback,
            queue,
        });
        sv.sub.closed
            .then(() => {
            if (!this._stopped) {
                this.close(new Error(`required subscription ${h.subject} stopped`))
                    .catch();
            }
        })
            .catch((err) => {
            if (!this._stopped) {
                const ne = new Error(`required subscription ${h.subject} errored: ${err.message}`);
                ne.stack = err.stack;
                this.close(ne).catch();
            }
        });
        return sv;
    }
    info() {
        return {
            type: core_1.ServiceResponseType.INFO,
            name: this.name,
            id: this.id,
            version: this.version,
            description: this.description,
            metadata: this.metadata,
            endpoints: this.endpoints(),
        };
    }
    endpoints() {
        return this.handlers.map((v) => {
            const { subject, metadata, name, queue } = v;
            return { subject, metadata, name, queue_group: queue };
        });
    }
    stats() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoints = [];
            for (const h of this.handlers) {
                if (typeof this.config.statsHandler === "function") {
                    try {
                        h.stats.data = yield this.config.statsHandler(h);
                    }
                    catch (err) {
                        h.stats.countError(err);
                    }
                }
                endpoints.push(h.stats.stats(h.qi));
            }
            return {
                type: core_1.ServiceResponseType.STATS,
                name: this.name,
                id: this.id,
                version: this.version,
                started: this.started,
                metadata: this.metadata,
                endpoints,
            };
        });
    }
    addInternalHandler(verb, handler) {
        const v = `${verb}`.toUpperCase();
        this._doAddInternalHandler(`${v}-all`, verb, handler);
        this._doAddInternalHandler(`${v}-kind`, verb, handler, this.name);
        this._doAddInternalHandler(`${v}`, verb, handler, this.name, this.id);
    }
    _doAddInternalHandler(name, verb, handler, kind = "", id = "") {
        const endpoint = {};
        endpoint.name = name;
        endpoint.subject = ServiceImpl.controlSubject(verb, kind, id);
        endpoint.handler = handler;
        this.setupHandler(endpoint, true);
    }
    start() {
        const jc = (0, codec_1.JSONCodec)();
        const statsHandler = (err, msg) => {
            if (err) {
                this.close(err);
                return Promise.reject(err);
            }
            return this.stats().then((s) => {
                msg === null || msg === void 0 ? void 0 : msg.respond(jc.encode(s));
                return Promise.resolve();
            });
        };
        const infoHandler = (err, msg) => {
            if (err) {
                this.close(err);
                return Promise.reject(err);
            }
            msg === null || msg === void 0 ? void 0 : msg.respond(jc.encode(this.info()));
            return Promise.resolve();
        };
        const ping = jc.encode(this.ping());
        const pingHandler = (err, msg) => {
            if (err) {
                this.close(err).then().catch();
                return Promise.reject(err);
            }
            msg.respond(ping);
            return Promise.resolve();
        };
        this.addInternalHandler(core_1.ServiceVerb.PING, pingHandler);
        this.addInternalHandler(core_1.ServiceVerb.STATS, statsHandler);
        this.addInternalHandler(core_1.ServiceVerb.INFO, infoHandler);
        // now the actual service
        this.handlers.forEach((h) => {
            const { subject } = h;
            if (typeof subject !== "string") {
                return;
            }
            // this is expected in cases where main subject is just
            // a root subject for multiple endpoints - user can disable
            // listening to the root endpoint, by specifying null
            if (h.handler === null) {
                return;
            }
            this.setupHandler(h);
        });
        return Promise.resolve(this);
    }
    close(err) {
        if (this._stopped) {
            return this._done;
        }
        this._stopped = true;
        let buf = [];
        if (!this.nc.isClosed()) {
            buf = this.handlers.concat(this.internal).map((h) => {
                return h.sub.drain();
            });
        }
        Promise.allSettled(buf)
            .then(() => {
            this._done.resolve(err ? err : null);
        });
        return this._done;
    }
    get stopped() {
        return this._done;
    }
    get isStopped() {
        return this._stopped;
    }
    stop(err) {
        return this.close(err);
    }
    ping() {
        return {
            type: core_1.ServiceResponseType.PING,
            name: this.name,
            id: this.id,
            version: this.version,
            metadata: this.metadata,
        };
    }
    reset() {
        // pretend we restarted
        this.started = new Date().toISOString();
        if (this.handlers) {
            for (const h of this.handlers) {
                h.stats.reset(h.qi);
            }
        }
    }
    addGroup(name, queue) {
        return new ServiceGroupImpl(this, name, queue);
    }
    addEndpoint(name, handler) {
        const sg = new ServiceGroupImpl(this);
        return sg.addEndpoint(name, handler);
    }
    _addEndpoint(e) {
        const qi = new queued_iterator_1.QueuedIteratorImpl();
        qi.noIterator = typeof e.handler === "function";
        if (!qi.noIterator) {
            e.handler = (err, msg) => {
                err ? this.stop(err).catch() : qi.push(new ServiceMsgImpl(msg));
            };
            // close the service if the iterator closes
            qi.iterClosed.then(() => {
                this.close().catch();
            });
        }
        // track the iterator for stats
        const ss = this.setupHandler(e, false);
        ss.qi = qi;
        this.handlers.push(ss);
        return qi;
    }
}
exports.ServiceImpl = ServiceImpl;
class NamedEndpointStatsImpl {
    constructor(name, subject, queue = "") {
        this.name = name;
        this.subject = subject;
        this.average_processing_time = 0;
        this.num_errors = 0;
        this.num_requests = 0;
        this.processing_time = 0;
        this.queue = queue;
    }
    reset(qi) {
        this.num_requests = 0;
        this.processing_time = 0;
        this.average_processing_time = 0;
        this.num_errors = 0;
        this.last_error = undefined;
        this.data = undefined;
        const qii = qi;
        if (qii) {
            qii.time = 0;
            qii.processed = 0;
        }
    }
    countLatency(start) {
        this.num_requests++;
        this.processing_time += (0, jsutil_1.nanos)(Date.now() - start);
        this.average_processing_time = Math.round(this.processing_time / this.num_requests);
    }
    countError(err) {
        this.num_errors++;
        this.last_error = err.message;
    }
    _stats() {
        const { name, subject, average_processing_time, num_errors, num_requests, processing_time, last_error, data, queue, } = this;
        return {
            name,
            subject,
            average_processing_time,
            num_errors,
            num_requests,
            processing_time,
            last_error,
            data,
            queue_group: queue,
        };
    }
    stats(qi) {
        const qii = qi;
        if ((qii === null || qii === void 0 ? void 0 : qii.noIterator) === false) {
            // grab stats in the iterator
            this.processing_time = qii.time;
            this.num_requests = qii.processed;
            this.average_processing_time =
                this.processing_time > 0 && this.num_requests > 0
                    ? this.processing_time / this.num_requests
                    : 0;
        }
        return this._stats();
    }
}
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 8878:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceClientImpl = void 0;
/*
 * Copyright 2022-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const encoders_1 = __nccwpck_require__(5450);
const codec_1 = __nccwpck_require__(2524);
const queued_iterator_1 = __nccwpck_require__(8450);
const core_1 = __nccwpck_require__(9498);
const service_1 = __nccwpck_require__(3594);
const core_2 = __nccwpck_require__(9498);
class ServiceClientImpl {
    constructor(nc, opts = {
        strategy: core_2.RequestStrategy.JitterTimer,
        maxWait: 2000,
    }, prefix) {
        this.nc = nc;
        this.prefix = prefix;
        this.opts = opts;
    }
    ping(name = "", id = "") {
        return this.q(core_1.ServiceVerb.PING, name, id);
    }
    stats(name = "", id = "") {
        return this.q(core_1.ServiceVerb.STATS, name, id);
    }
    info(name = "", id = "") {
        return this.q(core_1.ServiceVerb.INFO, name, id);
    }
    q(v, name = "", id = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const iter = new queued_iterator_1.QueuedIteratorImpl();
            const jc = (0, codec_1.JSONCodec)();
            const subj = service_1.ServiceImpl.controlSubject(v, name, id, this.prefix);
            const responses = yield this.nc.requestMany(subj, encoders_1.Empty, this.opts);
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                try {
                    for (var _d = true, responses_1 = __asyncValues(responses), responses_1_1; responses_1_1 = yield responses_1.next(), _a = responses_1_1.done, !_a; _d = true) {
                        _c = responses_1_1.value;
                        _d = false;
                        const m = _c;
                        try {
                            const s = jc.decode(m.data);
                            iter.push(s);
                        }
                        catch (err) {
                            // @ts-ignore: pushing fn
                            iter.push(() => {
                                iter.stop(err);
                            });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = responses_1.return)) yield _b.call(responses_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                //@ts-ignore: push a fn
                iter.push(() => {
                    iter.stop();
                });
            }))().catch((err) => {
                iter.stop(err);
            });
            return iter;
        });
    }
}
exports.ServiceClientImpl = ServiceClientImpl;
//# sourceMappingURL=serviceclient.js.map

/***/ }),

/***/ 1663:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sha256 = exports.SHA256 = exports.BYTES = void 0;
// deno bundle https://deno.land/x/sha256@v1.0.2/mod.ts
// The MIT License (MIT)
//
// Original work (c) Marco Paland (marco@paland.com) 2015-2018, PALANDesign Hannover, Germany
//
// Deno port Copyright (c) 2019 Noah Anabiik Schwarz
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
function getLengths(b64) {
    const len = b64.length;
    let validLen = b64.indexOf("=");
    if (validLen === -1) {
        validLen = len;
    }
    const placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
function init(lookup, revLookup, urlsafe = false) {
    function _byteLength(validLen, placeHoldersLen) {
        return Math.floor((validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen);
    }
    function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3f] + lookup[num >> 12 & 0x3f] + lookup[num >> 6 & 0x3f] + lookup[num & 0x3f];
    }
    function encodeChunk(buf, start, end) {
        const out = new Array((end - start) / 3);
        for (let i = start, curTriplet = 0; i < end; i += 3) {
            out[curTriplet++] = tripletToBase64((buf[i] << 16) + (buf[i + 1] << 8) + buf[i + 2]);
        }
        return out.join("");
    }
    return {
        byteLength(b64) {
            return _byteLength.apply(null, getLengths(b64));
        },
        toUint8Array(b64) {
            const [validLen, placeHoldersLen] = getLengths(b64);
            const buf = new Uint8Array(_byteLength(validLen, placeHoldersLen));
            const len = placeHoldersLen ? validLen - 4 : validLen;
            let tmp;
            let curByte = 0;
            let i;
            for (i = 0; i < len; i += 4) {
                tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
                buf[curByte++] = tmp >> 16 & 0xff;
                buf[curByte++] = tmp >> 8 & 0xff;
                buf[curByte++] = tmp & 0xff;
            }
            if (placeHoldersLen === 2) {
                tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
                buf[curByte++] = tmp & 0xff;
            }
            else if (placeHoldersLen === 1) {
                tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
                buf[curByte++] = tmp >> 8 & 0xff;
                buf[curByte++] = tmp & 0xff;
            }
            return buf;
        },
        fromUint8Array(buf) {
            const maxChunkLength = 16383;
            const len = buf.length;
            const extraBytes = len % 3;
            const len2 = len - extraBytes;
            const parts = new Array(Math.ceil(len2 / 16383) + (extraBytes ? 1 : 0));
            let curChunk = 0;
            let chunkEnd;
            for (let i = 0; i < len2; i += maxChunkLength) {
                chunkEnd = i + maxChunkLength;
                parts[curChunk++] = encodeChunk(buf, i, chunkEnd > len2 ? len2 : chunkEnd);
            }
            let tmp;
            if (extraBytes === 1) {
                tmp = buf[len2];
                parts[curChunk] = lookup[tmp >> 2] + lookup[tmp << 4 & 0x3f];
                if (!urlsafe)
                    parts[curChunk] += "==";
            }
            else if (extraBytes === 2) {
                tmp = buf[len2] << 8 | buf[len2 + 1] & 0xff;
                parts[curChunk] = lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3f] + lookup[tmp << 2 & 0x3f];
                if (!urlsafe)
                    parts[curChunk] += "=";
            }
            return parts.join("");
        }
    };
}
const lookup = [];
const revLookup = [];
const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
for (let i = 0, l = code.length; i < l; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
const { byteLength, toUint8Array, fromUint8Array } = init(lookup, revLookup, true);
const decoder = new TextDecoder();
const encoder = new TextEncoder();
function toHexString(buf) {
    return buf.reduce((hex, __byte) => `${hex}${__byte < 16 ? "0" : ""}${__byte.toString(16)}`, "");
}
function fromHexString(hex) {
    const len = hex.length;
    if (len % 2 || !/^[0-9a-fA-F]+$/.test(hex)) {
        throw new TypeError("Invalid hex string.");
    }
    hex = hex.toLowerCase();
    const buf = new Uint8Array(Math.floor(len / 2));
    const end = len / 2;
    for (let i = 0; i < end; ++i) {
        buf[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return buf;
}
function decode(buf, encoding = "utf8") {
    if (/^utf-?8$/i.test(encoding)) {
        return decoder.decode(buf);
    }
    else if (/^base64$/i.test(encoding)) {
        return fromUint8Array(buf);
    }
    else if (/^hex(?:adecimal)?$/i.test(encoding)) {
        return toHexString(buf);
    }
    else {
        throw new TypeError("Unsupported string encoding.");
    }
}
function encode(str, encoding = "utf8") {
    if (/^utf-?8$/i.test(encoding)) {
        return encoder.encode(str);
    }
    else if (/^base64$/i.test(encoding)) {
        return toUint8Array(str);
    }
    else if (/^hex(?:adecimal)?$/i.test(encoding)) {
        return fromHexString(str);
    }
    else {
        throw new TypeError("Unsupported string encoding.");
    }
}
const BYTES = 32;
exports.BYTES = BYTES;
class SHA256 {
    constructor() {
        this.hashSize = 32;
        this._buf = new Uint8Array(64);
        this._K = new Uint32Array([
            0x428a2f98,
            0x71374491,
            0xb5c0fbcf,
            0xe9b5dba5,
            0x3956c25b,
            0x59f111f1,
            0x923f82a4,
            0xab1c5ed5,
            0xd807aa98,
            0x12835b01,
            0x243185be,
            0x550c7dc3,
            0x72be5d74,
            0x80deb1fe,
            0x9bdc06a7,
            0xc19bf174,
            0xe49b69c1,
            0xefbe4786,
            0x0fc19dc6,
            0x240ca1cc,
            0x2de92c6f,
            0x4a7484aa,
            0x5cb0a9dc,
            0x76f988da,
            0x983e5152,
            0xa831c66d,
            0xb00327c8,
            0xbf597fc7,
            0xc6e00bf3,
            0xd5a79147,
            0x06ca6351,
            0x14292967,
            0x27b70a85,
            0x2e1b2138,
            0x4d2c6dfc,
            0x53380d13,
            0x650a7354,
            0x766a0abb,
            0x81c2c92e,
            0x92722c85,
            0xa2bfe8a1,
            0xa81a664b,
            0xc24b8b70,
            0xc76c51a3,
            0xd192e819,
            0xd6990624,
            0xf40e3585,
            0x106aa070,
            0x19a4c116,
            0x1e376c08,
            0x2748774c,
            0x34b0bcb5,
            0x391c0cb3,
            0x4ed8aa4a,
            0x5b9cca4f,
            0x682e6ff3,
            0x748f82ee,
            0x78a5636f,
            0x84c87814,
            0x8cc70208,
            0x90befffa,
            0xa4506ceb,
            0xbef9a3f7,
            0xc67178f2
        ]);
        this.init();
    }
    init() {
        this._H = new Uint32Array([
            0x6a09e667,
            0xbb67ae85,
            0x3c6ef372,
            0xa54ff53a,
            0x510e527f,
            0x9b05688c,
            0x1f83d9ab,
            0x5be0cd19
        ]);
        this._bufIdx = 0;
        this._count = new Uint32Array(2);
        this._buf.fill(0);
        this._finalized = false;
        return this;
    }
    update(msg, inputEncoding) {
        if (msg === null) {
            throw new TypeError("msg must be a string or Uint8Array.");
        }
        else if (typeof msg === "string") {
            msg = encode(msg, inputEncoding);
        }
        for (let i = 0, len = msg.length; i < len; i++) {
            this._buf[this._bufIdx++] = msg[i];
            if (this._bufIdx === 64) {
                this._transform();
                this._bufIdx = 0;
            }
        }
        const c = this._count;
        if ((c[0] += msg.length << 3) < msg.length << 3) {
            c[1]++;
        }
        c[1] += msg.length >>> 29;
        return this;
    }
    digest(outputEncoding) {
        if (this._finalized) {
            throw new Error("digest has already been called.");
        }
        this._finalized = true;
        const b = this._buf;
        let idx = this._bufIdx;
        b[idx++] = 0x80;
        while (idx !== 56) {
            if (idx === 64) {
                this._transform();
                idx = 0;
            }
            b[idx++] = 0;
        }
        const c = this._count;
        b[56] = c[1] >>> 24 & 0xff;
        b[57] = c[1] >>> 16 & 0xff;
        b[58] = c[1] >>> 8 & 0xff;
        b[59] = c[1] >>> 0 & 0xff;
        b[60] = c[0] >>> 24 & 0xff;
        b[61] = c[0] >>> 16 & 0xff;
        b[62] = c[0] >>> 8 & 0xff;
        b[63] = c[0] >>> 0 & 0xff;
        this._transform();
        const hash = new Uint8Array(32);
        for (let i = 0; i < 8; i++) {
            hash[(i << 2) + 0] = this._H[i] >>> 24 & 0xff;
            hash[(i << 2) + 1] = this._H[i] >>> 16 & 0xff;
            hash[(i << 2) + 2] = this._H[i] >>> 8 & 0xff;
            hash[(i << 2) + 3] = this._H[i] >>> 0 & 0xff;
        }
        this.init();
        return outputEncoding ? decode(hash, outputEncoding) : hash;
    }
    _transform() {
        const h = this._H;
        let h0 = h[0];
        let h1 = h[1];
        let h2 = h[2];
        let h3 = h[3];
        let h4 = h[4];
        let h5 = h[5];
        let h6 = h[6];
        let h7 = h[7];
        const w = new Uint32Array(16);
        let i;
        for (i = 0; i < 16; i++) {
            w[i] = this._buf[(i << 2) + 3] | this._buf[(i << 2) + 2] << 8 | this._buf[(i << 2) + 1] << 16 | this._buf[i << 2] << 24;
        }
        for (i = 0; i < 64; i++) {
            let tmp;
            if (i < 16) {
                tmp = w[i];
            }
            else {
                let a = w[i + 1 & 15];
                let b = w[i + 14 & 15];
                tmp = w[i & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i & 15] + w[i + 9 & 15] | 0;
            }
            tmp = tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + this._K[i] | 0;
            h7 = h6;
            h6 = h5;
            h5 = h4;
            h4 = h3 + tmp;
            h3 = h2;
            h2 = h1;
            h1 = h0;
            h0 = tmp + (h1 & h2 ^ h3 & (h1 ^ h2)) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10) | 0;
        }
        h[0] = h[0] + h0 | 0;
        h[1] = h[1] + h1 | 0;
        h[2] = h[2] + h2 | 0;
        h[3] = h[3] + h3 | 0;
        h[4] = h[4] + h4 | 0;
        h[5] = h[5] + h5 | 0;
        h[6] = h[6] + h6 | 0;
        h[7] = h[7] + h7 | 0;
    }
}
exports.SHA256 = SHA256;
function sha256(msg, inputEncoding, outputEncoding) {
    return new SHA256().update(msg, inputEncoding).digest(outputEncoding);
}
exports.sha256 = sha256;
//# sourceMappingURL=sha256.js.map

/***/ }),

/***/ 5030:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractProtocolMessage = exports.protoLen = exports.LF = exports.CR = exports.CRLF = exports.CR_LF_LEN = exports.CR_LF = exports.getResolveFn = exports.newTransport = exports.getUrlParseFn = exports.defaultPort = exports.setTransportFactory = void 0;
/*
 * Copyright 2020-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const encoders_1 = __nccwpck_require__(5450);
const core_1 = __nccwpck_require__(9498);
const databuffer_1 = __nccwpck_require__(2155);
let transportConfig;
function setTransportFactory(config) {
    transportConfig = config;
}
exports.setTransportFactory = setTransportFactory;
function defaultPort() {
    return transportConfig !== undefined &&
        transportConfig.defaultPort !== undefined
        ? transportConfig.defaultPort
        : core_1.DEFAULT_PORT;
}
exports.defaultPort = defaultPort;
function getUrlParseFn() {
    return transportConfig !== undefined && transportConfig.urlParseFn
        ? transportConfig.urlParseFn
        : undefined;
}
exports.getUrlParseFn = getUrlParseFn;
function newTransport() {
    if (!transportConfig || typeof transportConfig.factory !== "function") {
        throw new Error("transport fn is not set");
    }
    return transportConfig.factory();
}
exports.newTransport = newTransport;
function getResolveFn() {
    return transportConfig !== undefined && transportConfig.dnsResolveFn
        ? transportConfig.dnsResolveFn
        : undefined;
}
exports.getResolveFn = getResolveFn;
exports.CR_LF = "\r\n";
exports.CR_LF_LEN = exports.CR_LF.length;
exports.CRLF = databuffer_1.DataBuffer.fromAscii(exports.CR_LF);
exports.CR = new Uint8Array(exports.CRLF)[0]; // 13
exports.LF = new Uint8Array(exports.CRLF)[1]; // 10
function protoLen(ba) {
    for (let i = 0; i < ba.length; i++) {
        const n = i + 1;
        if (ba.byteLength > n && ba[i] === exports.CR && ba[n] === exports.LF) {
            return n + 1;
        }
    }
    return 0;
}
exports.protoLen = protoLen;
function extractProtocolMessage(a) {
    // protocol messages are ascii, so Uint8Array
    const len = protoLen(a);
    if (len > 0) {
        const ba = new Uint8Array(a);
        const out = ba.slice(0, len);
        return encoders_1.TD.decode(out);
    }
    return "";
}
exports.extractProtocolMessage = extractProtocolMessage;
//# sourceMappingURL=transport.js.map

/***/ }),

/***/ 5916:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypedSubscription = exports.checkFn = void 0;
const util_1 = __nccwpck_require__(4812);
const queued_iterator_1 = __nccwpck_require__(8450);
const core_1 = __nccwpck_require__(9498);
function checkFn(fn, name, required = false) {
    if (required === true && !fn) {
        throw core_1.NatsError.errorForCode(core_1.ErrorCode.ApiError, new Error(`${name} is not a function`));
    }
    if (fn && typeof fn !== "function") {
        throw core_1.NatsError.errorForCode(core_1.ErrorCode.ApiError, new Error(`${name} is not a function`));
    }
}
exports.checkFn = checkFn;
/**
 * TypedSubscription wraps a subscription to provide payload specific
 * subscription semantics. That is messages are a transport
 * for user data, and the data is presented as application specific
 * data to the client.
 */
class TypedSubscription extends queued_iterator_1.QueuedIteratorImpl {
    constructor(nc, subject, opts) {
        super();
        checkFn(opts.adapter, "adapter", true);
        this.adapter = opts.adapter;
        if (opts.callback) {
            checkFn(opts.callback, "callback");
        }
        this.noIterator = typeof opts.callback === "function";
        if (opts.ingestionFilterFn) {
            checkFn(opts.ingestionFilterFn, "ingestionFilterFn");
            this.ingestionFilterFn = opts.ingestionFilterFn;
        }
        if (opts.protocolFilterFn) {
            checkFn(opts.protocolFilterFn, "protocolFilterFn");
            this.protocolFilterFn = opts.protocolFilterFn;
        }
        if (opts.dispatchedFn) {
            checkFn(opts.dispatchedFn, "dispatchedFn");
            this.dispatchedFn = opts.dispatchedFn;
        }
        if (opts.cleanupFn) {
            checkFn(opts.cleanupFn, "cleanupFn");
        }
        let callback = (err, msg) => {
            this.callback(err, msg);
        };
        if (opts.callback) {
            const uh = opts.callback;
            callback = (err, msg) => {
                const [jer, tm] = this.adapter(err, msg);
                if (jer) {
                    uh(jer, null);
                    return;
                }
                const { ingest } = this.ingestionFilterFn
                    ? this.ingestionFilterFn(tm, this)
                    : { ingest: true };
                if (ingest) {
                    const ok = this.protocolFilterFn ? this.protocolFilterFn(tm) : true;
                    if (ok) {
                        uh(jer, tm);
                        if (this.dispatchedFn && tm) {
                            this.dispatchedFn(tm);
                        }
                    }
                }
            };
        }
        const { max, queue, timeout } = opts;
        const sopts = { queue, timeout, callback };
        if (max && max > 0) {
            sopts.max = max;
        }
        this.sub = nc.subscribe(subject, sopts);
        if (opts.cleanupFn) {
            this.sub.cleanupFn = opts.cleanupFn;
        }
        if (!this.noIterator) {
            this.iterClosed.then(() => {
                this.unsubscribe();
            });
        }
        this.subIterDone = (0, util_1.deferred)();
        Promise.all([this.sub.closed, this.iterClosed])
            .then(() => {
            this.subIterDone.resolve();
        })
            .catch(() => {
            this.subIterDone.resolve();
        });
        ((s) => __awaiter(this, void 0, void 0, function* () {
            yield s.closed;
            this.stop();
        }))(this.sub).then().catch();
    }
    unsubscribe(max) {
        this.sub.unsubscribe(max);
    }
    drain() {
        return this.sub.drain();
    }
    isDraining() {
        return this.sub.isDraining();
    }
    isClosed() {
        return this.sub.isClosed();
    }
    callback(e, msg) {
        this.sub.cancelTimeout();
        const [err, tm] = this.adapter(e, msg);
        if (err) {
            this.stop(err);
        }
        if (tm) {
            this.push(tm);
        }
    }
    getSubject() {
        return this.sub.getSubject();
    }
    getReceived() {
        return this.sub.getReceived();
    }
    getProcessed() {
        return this.sub.getProcessed();
    }
    getPending() {
        return this.sub.getPending();
    }
    getID() {
        return this.sub.getID();
    }
    getMax() {
        return this.sub.getMax();
    }
    get closed() {
        return this.sub.closed;
    }
}
exports.TypedSubscription = TypedSubscription;
//# sourceMappingURL=typedsub.js.map

/***/ }),

/***/ 3829:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Empty = exports.NatsError = void 0;
var core_1 = __nccwpck_require__(9498);
Object.defineProperty(exports, "NatsError", ({ enumerable: true, get: function () { return core_1.NatsError; } }));
var encoders_1 = __nccwpck_require__(5450);
Object.defineProperty(exports, "Empty", ({ enumerable: true, get: function () { return encoders_1.Empty; } }));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 4812:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleMutex = exports.Perf = exports.collect = exports.shuffle = exports.debugDeferred = exports.deferred = exports.deadline = exports.delay = exports.timeout = exports.render = exports.extend = void 0;
/*
 * Copyright 2018-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// deno-lint-ignore-file no-explicit-any
const encoders_1 = __nccwpck_require__(5450);
const core_1 = __nccwpck_require__(9498);
function extend(a, ...b) {
    for (let i = 0; i < b.length; i++) {
        const o = b[i];
        Object.keys(o).forEach(function (k) {
            a[k] = o[k];
        });
    }
    return a;
}
exports.extend = extend;
function render(frame) {
    const cr = "␍";
    const lf = "␊";
    return encoders_1.TD.decode(frame)
        .replace(/\n/g, lf)
        .replace(/\r/g, cr);
}
exports.render = render;
function timeout(ms) {
    // by generating the stack here to help identify what timed out
    const err = core_1.NatsError.errorForCode(core_1.ErrorCode.Timeout);
    let methods;
    let timer;
    const p = new Promise((_resolve, reject) => {
        const cancel = () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
        methods = { cancel };
        // @ts-ignore: node is not a number
        timer = setTimeout(() => {
            reject(err);
        }, ms);
    });
    // noinspection JSUnusedAssignment
    return Object.assign(p, methods);
}
exports.timeout = timeout;
function delay(ms = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.delay = delay;
function deadline(p, millis = 1000) {
    const err = new Error(`deadline exceeded`);
    const d = deferred();
    const timer = setTimeout(() => d.reject(err), millis);
    return Promise.race([p, d]).finally(() => clearTimeout(timer));
}
exports.deadline = deadline;
/**
 * Returns a Promise that has a resolve/reject methods that can
 * be used to resolve and defer the Deferred.
 */
function deferred() {
    let methods = {};
    const p = new Promise((resolve, reject) => {
        methods = { resolve, reject };
    });
    return Object.assign(p, methods);
}
exports.deferred = deferred;
function debugDeferred() {
    let methods = {};
    const p = new Promise((resolve, reject) => {
        methods = {
            resolve: (v) => {
                console.trace("resolve", v);
                resolve(v);
            },
            reject: (err) => {
                console.trace("reject");
                reject(err);
            },
        };
    });
    return Object.assign(p, methods);
}
exports.debugDeferred = debugDeferred;
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
exports.shuffle = shuffle;
function collect(iter) {
    var _a, iter_1, iter_1_1;
    var _b, e_1, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const buf = [];
        try {
            for (_a = true, iter_1 = __asyncValues(iter); iter_1_1 = yield iter_1.next(), _b = iter_1_1.done, !_b; _a = true) {
                _d = iter_1_1.value;
                _a = false;
                const v = _d;
                buf.push(v);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = iter_1.return)) yield _c.call(iter_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return buf;
    });
}
exports.collect = collect;
class Perf {
    constructor() {
        this.timers = new Map();
        this.measures = new Map();
    }
    mark(key) {
        this.timers.set(key, performance.now());
    }
    measure(key, startKey, endKey) {
        const s = this.timers.get(startKey);
        if (s === undefined) {
            throw new Error(`${startKey} is not defined`);
        }
        const e = this.timers.get(endKey);
        if (e === undefined) {
            throw new Error(`${endKey} is not defined`);
        }
        this.measures.set(key, e - s);
    }
    getEntries() {
        const values = [];
        this.measures.forEach((v, k) => {
            values.push({ name: k, duration: v });
        });
        return values;
    }
}
exports.Perf = Perf;
class SimpleMutex {
    /**
     * @param max number of concurrent operations
     */
    constructor(max = 1) {
        this.max = max;
        this.current = 0;
        this.waiting = [];
    }
    /**
     * Returns a promise that resolves when the mutex is acquired
     */
    lock() {
        // increment the count
        this.current++;
        // if we have runners, resolve it
        if (this.current <= this.max) {
            return Promise.resolve();
        }
        // otherwise defer it
        const d = deferred();
        this.waiting.push(d);
        return d;
    }
    /**
     * Release an acquired mutex - must be called
     */
    unlock() {
        // decrement the count
        this.current--;
        // if we have deferred, resolve one
        const d = this.waiting.pop();
        d === null || d === void 0 ? void 0 : d.resolve();
    }
}
exports.SimpleMutex = SimpleMutex;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ 4270:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connect = void 0;
/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const node_transport_1 = __nccwpck_require__(6807);
const nats_base_client_1 = __nccwpck_require__(6890);
function connect(opts = {}) {
    (0, nats_base_client_1.setTransportFactory)({
        factory: () => {
            return new node_transport_1.NodeTransport();
        },
        dnsResolveFn: node_transport_1.nodeResolveHost,
    });
    return nats_base_client_1.NatsConnectionImpl.connect(opts);
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map

/***/ }),

/***/ 1617:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connect = void 0;
/*
 * Copyright 2020-2022 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if (typeof TextEncoder === "undefined") {
    const { TextEncoder, TextDecoder } = __nccwpck_require__(3837);
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}
if (typeof globalThis.crypto === "undefined") {
    const c = __nccwpck_require__(6113);
    // this will patch to undefined if webcrypto is not available (node 14)
    // views will toss if crypto is not available
    global.crypto = c.webcrypto;
}
if (typeof globalThis.ReadableStream === "undefined") {
    // @ts-ignore: node global
    const chunks = process.versions.node.split(".");
    const v = parseInt(chunks[0]);
    if (v >= 16) {
        // this won't mess up fetch
        const streams = __nccwpck_require__(5356);
        // views will toss if ReadableStream is not available
        global.ReadableStream = streams.ReadableStream;
    }
}
var connect_1 = __nccwpck_require__(4270);
Object.defineProperty(exports, "connect", ({ enumerable: true, get: function () { return connect_1.connect; } }));
__exportStar(__nccwpck_require__(1782), exports);
__exportStar(__nccwpck_require__(1469), exports);
//# sourceMappingURL=mod.js.map

/***/ }),

/***/ 6890:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__exportStar(__nccwpck_require__(8104), exports);
__exportStar(__nccwpck_require__(6260), exports);
//# sourceMappingURL=nats-base-client.js.map

/***/ }),

/***/ 6807:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nodeResolveHost = exports.NodeTransport = void 0;
/*
 * Copyright 2020-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const nats_base_client_1 = __nccwpck_require__(6890);
const net_1 = __nccwpck_require__(1808);
const util_1 = __nccwpck_require__(4812);
const tls_1 = __nccwpck_require__(4404);
const { resolve } = __nccwpck_require__(1017);
const { readFile, existsSync } = __nccwpck_require__(7147);
const dns = __nccwpck_require__(9523);
const VERSION = "2.17.0";
const LANG = "nats.js";
class NodeTransport {
    constructor() {
        this.yields = [];
        this.signal = (0, nats_base_client_1.deferred)();
        this.closedNotification = (0, nats_base_client_1.deferred)();
        this.connected = false;
        this.tlsName = "";
        this.done = false;
        this.lang = LANG;
        this.version = VERSION;
    }
    connect(hp, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tlsName = hp.tlsName;
            this.options = options;
            try {
                this.socket = yield this.dial(hp);
                const info = yield this.peekInfo();
                (0, nats_base_client_1.checkOptions)(info, options);
                const { tls_required: tlsRequired, tls_available: tlsAvailable } = info;
                const desired = tlsAvailable === true && options.tls !== null;
                if (tlsRequired || desired) {
                    this.socket = yield this.startTLS();
                }
                //@ts-ignore: this is possibly a TlsSocket
                if (tlsRequired && this.socket.encrypted !== true) {
                    throw new nats_base_client_1.NatsError("tls", nats_base_client_1.ErrorCode.ServerOptionNotAvailable);
                }
                this.connected = true;
                this.setupHandlers();
                this.signal.resolve();
                return Promise.resolve();
            }
            catch (err) {
                if (!err) {
                    // this seems to be possible in Kubernetes
                    // where an error is thrown, but it is undefined
                    // when something like istio-init is booting up
                    err = nats_base_client_1.NatsError.errorForCode(nats_base_client_1.ErrorCode.ConnectionRefused, new Error("node provided an undefined error!"));
                }
                const { code } = err;
                const perr = code === "ECONNREFUSED"
                    ? nats_base_client_1.NatsError.errorForCode(nats_base_client_1.ErrorCode.ConnectionRefused, err)
                    : err;
                if (this.socket) {
                    this.socket.destroy();
                }
                throw perr;
            }
        });
    }
    dial(hp) {
        const d = (0, nats_base_client_1.deferred)();
        let dialError;
        const socket = (0, net_1.createConnection)(hp.port, hp.hostname, () => {
            d.resolve(socket);
            socket.removeAllListeners();
        });
        socket.on("error", (err) => {
            dialError = err;
        });
        socket.on("close", () => {
            socket.removeAllListeners();
            d.reject(dialError);
        });
        socket.setNoDelay(true);
        return d;
    }
    get isClosed() {
        return this.done;
    }
    close(err) {
        return this._closed(err, false);
    }
    peekInfo() {
        const d = (0, nats_base_client_1.deferred)();
        let peekError;
        this.socket.on("data", (frame) => {
            this.yields.push(frame);
            const t = nats_base_client_1.DataBuffer.concat(...this.yields);
            const pm = (0, nats_base_client_1.extractProtocolMessage)(t);
            if (pm !== "") {
                try {
                    const m = nats_base_client_1.INFO.exec(pm);
                    if (!m) {
                        throw new Error("unexpected response from server");
                    }
                    const info = JSON.parse(m[1]);
                    d.resolve(info);
                }
                catch (err) {
                    d.reject(err);
                }
                finally {
                    this.socket.removeAllListeners();
                }
            }
        });
        this.socket.on("error", (err) => {
            peekError = err;
        });
        this.socket.on("close", () => {
            this.socket.removeAllListeners();
            d.reject(peekError);
        });
        return d;
    }
    loadFile(fn) {
        if (!fn) {
            return Promise.resolve();
        }
        const d = (0, nats_base_client_1.deferred)();
        try {
            fn = resolve(fn);
            if (!existsSync(fn)) {
                d.reject(new Error(`${fn} doesn't exist`));
            }
            readFile(fn, (err, data) => {
                if (err) {
                    return d.reject(err);
                }
                d.resolve(data);
            });
        }
        catch (err) {
            d.reject(err);
        }
        return d;
    }
    loadClientCerts() {
        return __awaiter(this, void 0, void 0, function* () {
            const tlsOpts = {};
            const { certFile, cert, caFile, ca, keyFile, key } = this.options.tls;
            try {
                if (certFile) {
                    const data = yield this.loadFile(certFile);
                    if (data) {
                        tlsOpts.cert = data;
                    }
                }
                else if (cert) {
                    tlsOpts.cert = cert;
                }
                if (keyFile) {
                    const data = yield this.loadFile(keyFile);
                    if (data) {
                        tlsOpts.key = data;
                    }
                }
                else if (key) {
                    tlsOpts.key = key;
                }
                if (caFile) {
                    const data = yield this.loadFile(caFile);
                    if (data) {
                        tlsOpts.ca = [data];
                    }
                }
                else if (ca) {
                    tlsOpts.ca = ca;
                }
                return Promise.resolve(tlsOpts);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    startTLS() {
        return __awaiter(this, void 0, void 0, function* () {
            let tlsError;
            let tlsOpts = {
                socket: this.socket,
                servername: this.tlsName,
                rejectUnauthorized: true,
            };
            if (typeof this.options.tls === "object") {
                try {
                    const certOpts = (yield this.loadClientCerts()) || {};
                    tlsOpts = (0, util_1.extend)(tlsOpts, this.options.tls, certOpts);
                }
                catch (err) {
                    return Promise.reject(new nats_base_client_1.NatsError(err.message, nats_base_client_1.ErrorCode.Tls, err));
                }
            }
            const d = (0, nats_base_client_1.deferred)();
            try {
                const tlsSocket = (0, tls_1.connect)(tlsOpts, () => {
                    tlsSocket.removeAllListeners();
                    d.resolve(tlsSocket);
                });
                tlsSocket.on("error", (err) => {
                    tlsError = err;
                });
                tlsSocket.on("secureConnect", () => {
                    // socket won't be authorized, if the user disabled it
                    if (tlsOpts.rejectUnauthorized === false) {
                        return;
                    }
                    if (!tlsSocket.authorized) {
                        throw tlsSocket.authorizationError;
                    }
                });
                tlsSocket.on("close", () => {
                    d.reject(tlsError);
                    tlsSocket.removeAllListeners();
                });
            }
            catch (err) {
                // tls throws errors on bad certs see nats.js#310
                d.reject(nats_base_client_1.NatsError.errorForCode(nats_base_client_1.ErrorCode.Tls, err));
            }
            return d;
        });
    }
    setupHandlers() {
        let connError;
        this.socket.on("data", (frame) => {
            this.yields.push(frame);
            return this.signal.resolve();
        });
        this.socket.on("error", (err) => {
            connError = err;
        });
        this.socket.on("end", () => {
            var _a, _b;
            if ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.destroyed) {
                return;
            }
            (_b = this.socket) === null || _b === void 0 ? void 0 : _b.write(new Uint8Array(0), () => {
                var _a;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.end();
            });
        });
        this.socket.on("close", () => {
            this._closed(connError, false);
        });
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
    iterate() {
        return __asyncGenerator(this, arguments, function* iterate_1() {
            const debug = this.options.debug;
            while (true) {
                if (this.yields.length === 0) {
                    yield __await(this.signal);
                }
                const yields = this.yields;
                this.yields = [];
                for (let i = 0; i < yields.length; i++) {
                    if (debug) {
                        console.info(`> ${(0, nats_base_client_1.render)(yields[i])}`);
                    }
                    yield yield __await(yields[i]);
                }
                // yielding could have paused and microtask
                // could have added messages. Prevent allocations
                // if possible
                if (this.done) {
                    break;
                }
                else if (this.yields.length === 0) {
                    yields.length = 0;
                    this.yields = yields;
                    this.signal = (0, nats_base_client_1.deferred)();
                }
            }
        });
    }
    discard() {
        // ignored - this is not required, as there's no throttling
    }
    disconnect() {
        this._closed(undefined, true).then().catch();
    }
    isEncrypted() {
        return this.socket instanceof tls_1.TLSSocket;
    }
    _send(frame) {
        if (this.isClosed || this.socket === undefined) {
            return Promise.resolve();
        }
        if (this.options.debug) {
            console.info(`< ${(0, nats_base_client_1.render)(frame)}`);
        }
        const d = (0, nats_base_client_1.deferred)();
        try {
            this.socket.write(frame, (err) => {
                if (err) {
                    if (this.options.debug) {
                        console.error(`!!! ${(0, nats_base_client_1.render)(frame)}: ${err}`);
                    }
                    return d.reject(err);
                }
                return d.resolve();
            });
        }
        catch (err) {
            if (this.options.debug) {
                console.error(`!!! ${(0, nats_base_client_1.render)(frame)}: ${err}`);
            }
            d.reject(err);
        }
        return d;
    }
    send(frame) {
        const p = this._send(frame);
        p.catch((_err) => {
            // we ignore write errors because client will
            // fail on a read or when the heartbeat timer
            // detects a stale connection
        });
    }
    _closed(err, internal = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // if this connection didn't succeed, then ignore it.
            if (!this.connected)
                return;
            if (this.done)
                return;
            this.closeError = err;
            // only try to flush the outbound buffer if we got no error and
            // the close is internal, if the transport closed, we are done.
            if (!err && this.socket && internal) {
                try {
                    yield this._send(new TextEncoder().encode(""));
                }
                catch (err) {
                    if (this.options.debug) {
                        console.log("transport close terminated with an error", err);
                    }
                }
            }
            try {
                if (this.socket) {
                    this.socket.removeAllListeners();
                    this.socket.destroy();
                    this.socket = undefined;
                }
            }
            catch (err) {
                console.log(err);
            }
            this.done = true;
            this.closedNotification.resolve(this.closeError);
        });
    }
    closed() {
        return this.closedNotification;
    }
}
exports.NodeTransport = NodeTransport;
function nodeResolveHost(s) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = (0, nats_base_client_1.deferred)();
        const aaaa = (0, nats_base_client_1.deferred)();
        dns.resolve4(s, (err, records) => {
            if (err) {
                a.resolve(err);
            }
            else {
                a.resolve(records);
            }
        });
        dns.resolve6(s, (err, records) => {
            if (err) {
                aaaa.resolve(err);
            }
            else {
                aaaa.resolve(records);
            }
        });
        const ips = [];
        const da = yield a;
        if (Array.isArray(da)) {
            ips.push(...da);
        }
        const daaaa = yield aaaa;
        if (Array.isArray(daaaa)) {
            ips.push(...daaaa);
        }
        if (ips.length === 0) {
            ips.push(s);
        }
        return ips;
    });
}
exports.nodeResolveHost = nodeResolveHost;
//# sourceMappingURL=node_transport.js.map

/***/ }),

/***/ 5698:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2018-2021 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.base32 = void 0;
// Fork of https://github.com/LinusU/base32-encode
// and https://github.com/LinusU/base32-decode to support returning
// buffers without padding.
/**
 * @ignore
 */
const b32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/**
 * @ignore
 */
class base32 {
    static encode(src) {
        let bits = 0;
        let value = 0;
        let a = new Uint8Array(src);
        let buf = new Uint8Array(src.byteLength * 2);
        let j = 0;
        for (let i = 0; i < a.byteLength; i++) {
            value = (value << 8) | a[i];
            bits += 8;
            while (bits >= 5) {
                let index = (value >>> (bits - 5)) & 31;
                buf[j++] = b32Alphabet.charAt(index).charCodeAt(0);
                bits -= 5;
            }
        }
        if (bits > 0) {
            let index = (value << (5 - bits)) & 31;
            buf[j++] = b32Alphabet.charAt(index).charCodeAt(0);
        }
        return buf.slice(0, j);
    }
    static decode(src) {
        let bits = 0;
        let byte = 0;
        let j = 0;
        let a = new Uint8Array(src);
        let out = new Uint8Array(a.byteLength * 5 / 8 | 0);
        for (let i = 0; i < a.byteLength; i++) {
            let v = String.fromCharCode(a[i]);
            let vv = b32Alphabet.indexOf(v);
            if (vv === -1) {
                throw new Error("Illegal Base32 character: " + a[i]);
            }
            byte = (byte << 5) | vv;
            bits += 5;
            if (bits >= 8) {
                out[j++] = (byte >>> (bits - 8)) & 255;
                bits -= 8;
            }
        }
        return out.slice(0, j);
    }
}
exports.base32 = base32;


/***/ }),

/***/ 1235:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2018-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Codec = void 0;
const crc16_1 = __nccwpck_require__(3450);
const nkeys_1 = __nccwpck_require__(7697);
const base32_1 = __nccwpck_require__(5698);
/**
 * @ignore
 */
class Codec {
    static encode(prefix, src) {
        if (!src || !(src instanceof Uint8Array)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.SerializationError);
        }
        if (!nkeys_1.Prefixes.isValidPrefix(prefix)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
        }
        return Codec._encode(false, prefix, src);
    }
    static encodeSeed(role, src) {
        if (!src) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ApiError);
        }
        if (!nkeys_1.Prefixes.isValidPublicPrefix(role)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
        }
        if (src.byteLength !== 32) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidSeedLen);
        }
        return Codec._encode(true, role, src);
    }
    static decode(expected, src) {
        if (!nkeys_1.Prefixes.isValidPrefix(expected)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
        }
        const raw = Codec._decode(src);
        if (raw[0] !== expected) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
        }
        return raw.slice(1);
    }
    static decodeSeed(src) {
        const raw = Codec._decode(src);
        const prefix = Codec._decodePrefix(raw);
        if (prefix[0] != nkeys_1.Prefix.Seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidSeed);
        }
        if (!nkeys_1.Prefixes.isValidPublicPrefix(prefix[1])) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
        }
        return ({ buf: raw.slice(2), prefix: prefix[1] });
    }
    // unsafe encode no prefix/role validation
    static _encode(seed, role, payload) {
        // offsets for this token
        const payloadOffset = seed ? 2 : 1;
        const payloadLen = payload.byteLength;
        const checkLen = 2;
        const cap = payloadOffset + payloadLen + checkLen;
        const checkOffset = payloadOffset + payloadLen;
        const raw = new Uint8Array(cap);
        // make the prefixes human readable when encoded
        if (seed) {
            const encodedPrefix = Codec._encodePrefix(nkeys_1.Prefix.Seed, role);
            raw.set(encodedPrefix);
        }
        else {
            raw[0] = role;
        }
        raw.set(payload, payloadOffset);
        //calculate the checksum write it LE
        const checksum = crc16_1.crc16.checksum(raw.slice(0, checkOffset));
        const dv = new DataView(raw.buffer);
        dv.setUint16(checkOffset, checksum, true);
        return base32_1.base32.encode(raw);
    }
    // unsafe decode - no prefix/role validation
    static _decode(src) {
        if (src.byteLength < 4) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidEncoding);
        }
        let raw;
        try {
            raw = base32_1.base32.decode(src);
        }
        catch (ex) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidEncoding, ex);
        }
        const checkOffset = raw.byteLength - 2;
        const dv = new DataView(raw.buffer);
        const checksum = dv.getUint16(checkOffset, true);
        const payload = raw.slice(0, checkOffset);
        if (!crc16_1.crc16.validate(payload, checksum)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidChecksum);
        }
        return payload;
    }
    static _encodePrefix(kind, role) {
        // In order to make this human printable for both bytes, we need to do a little
        // bit manipulation to setup for base32 encoding which takes 5 bits at a time.
        const b1 = kind | (role >> 5);
        const b2 = (role & 31) << 3; // 31 = 00011111
        return new Uint8Array([b1, b2]);
    }
    static _decodePrefix(raw) {
        // Need to do the reverse from the printable representation to
        // get back to internal representation.
        const b1 = raw[0] & 248; // 248 = 11111000
        const b2 = (raw[0] & 7) << 5 | ((raw[1] & 248) >> 3); // 7 = 00000111
        return new Uint8Array([b1, b2]);
    }
}
exports.Codec = Codec;


/***/ }),

/***/ 3450:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2018-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.crc16 = void 0;
// An implementation of crc16 according to CCITT standards for XMODEM.
/**
 * @ignore
 */
const crc16tab = new Uint16Array([
    0x0000,
    0x1021,
    0x2042,
    0x3063,
    0x4084,
    0x50a5,
    0x60c6,
    0x70e7,
    0x8108,
    0x9129,
    0xa14a,
    0xb16b,
    0xc18c,
    0xd1ad,
    0xe1ce,
    0xf1ef,
    0x1231,
    0x0210,
    0x3273,
    0x2252,
    0x52b5,
    0x4294,
    0x72f7,
    0x62d6,
    0x9339,
    0x8318,
    0xb37b,
    0xa35a,
    0xd3bd,
    0xc39c,
    0xf3ff,
    0xe3de,
    0x2462,
    0x3443,
    0x0420,
    0x1401,
    0x64e6,
    0x74c7,
    0x44a4,
    0x5485,
    0xa56a,
    0xb54b,
    0x8528,
    0x9509,
    0xe5ee,
    0xf5cf,
    0xc5ac,
    0xd58d,
    0x3653,
    0x2672,
    0x1611,
    0x0630,
    0x76d7,
    0x66f6,
    0x5695,
    0x46b4,
    0xb75b,
    0xa77a,
    0x9719,
    0x8738,
    0xf7df,
    0xe7fe,
    0xd79d,
    0xc7bc,
    0x48c4,
    0x58e5,
    0x6886,
    0x78a7,
    0x0840,
    0x1861,
    0x2802,
    0x3823,
    0xc9cc,
    0xd9ed,
    0xe98e,
    0xf9af,
    0x8948,
    0x9969,
    0xa90a,
    0xb92b,
    0x5af5,
    0x4ad4,
    0x7ab7,
    0x6a96,
    0x1a71,
    0x0a50,
    0x3a33,
    0x2a12,
    0xdbfd,
    0xcbdc,
    0xfbbf,
    0xeb9e,
    0x9b79,
    0x8b58,
    0xbb3b,
    0xab1a,
    0x6ca6,
    0x7c87,
    0x4ce4,
    0x5cc5,
    0x2c22,
    0x3c03,
    0x0c60,
    0x1c41,
    0xedae,
    0xfd8f,
    0xcdec,
    0xddcd,
    0xad2a,
    0xbd0b,
    0x8d68,
    0x9d49,
    0x7e97,
    0x6eb6,
    0x5ed5,
    0x4ef4,
    0x3e13,
    0x2e32,
    0x1e51,
    0x0e70,
    0xff9f,
    0xefbe,
    0xdfdd,
    0xcffc,
    0xbf1b,
    0xaf3a,
    0x9f59,
    0x8f78,
    0x9188,
    0x81a9,
    0xb1ca,
    0xa1eb,
    0xd10c,
    0xc12d,
    0xf14e,
    0xe16f,
    0x1080,
    0x00a1,
    0x30c2,
    0x20e3,
    0x5004,
    0x4025,
    0x7046,
    0x6067,
    0x83b9,
    0x9398,
    0xa3fb,
    0xb3da,
    0xc33d,
    0xd31c,
    0xe37f,
    0xf35e,
    0x02b1,
    0x1290,
    0x22f3,
    0x32d2,
    0x4235,
    0x5214,
    0x6277,
    0x7256,
    0xb5ea,
    0xa5cb,
    0x95a8,
    0x8589,
    0xf56e,
    0xe54f,
    0xd52c,
    0xc50d,
    0x34e2,
    0x24c3,
    0x14a0,
    0x0481,
    0x7466,
    0x6447,
    0x5424,
    0x4405,
    0xa7db,
    0xb7fa,
    0x8799,
    0x97b8,
    0xe75f,
    0xf77e,
    0xc71d,
    0xd73c,
    0x26d3,
    0x36f2,
    0x0691,
    0x16b0,
    0x6657,
    0x7676,
    0x4615,
    0x5634,
    0xd94c,
    0xc96d,
    0xf90e,
    0xe92f,
    0x99c8,
    0x89e9,
    0xb98a,
    0xa9ab,
    0x5844,
    0x4865,
    0x7806,
    0x6827,
    0x18c0,
    0x08e1,
    0x3882,
    0x28a3,
    0xcb7d,
    0xdb5c,
    0xeb3f,
    0xfb1e,
    0x8bf9,
    0x9bd8,
    0xabbb,
    0xbb9a,
    0x4a75,
    0x5a54,
    0x6a37,
    0x7a16,
    0x0af1,
    0x1ad0,
    0x2ab3,
    0x3a92,
    0xfd2e,
    0xed0f,
    0xdd6c,
    0xcd4d,
    0xbdaa,
    0xad8b,
    0x9de8,
    0x8dc9,
    0x7c26,
    0x6c07,
    0x5c64,
    0x4c45,
    0x3ca2,
    0x2c83,
    0x1ce0,
    0x0cc1,
    0xef1f,
    0xff3e,
    0xcf5d,
    0xdf7c,
    0xaf9b,
    0xbfba,
    0x8fd9,
    0x9ff8,
    0x6e17,
    0x7e36,
    0x4e55,
    0x5e74,
    0x2e93,
    0x3eb2,
    0x0ed1,
    0x1ef0,
]);
/**
 * @ignore
 */
class crc16 {
    // crc16 returns the crc for the data provided.
    static checksum(data) {
        let crc = 0;
        for (let i = 0; i < data.byteLength; i++) {
            let b = data[i];
            crc = ((crc << 8) & 0xffff) ^ crc16tab[((crc >> 8) ^ (b)) & 0x00FF];
        }
        return crc;
    }
    // validate will check the calculated crc16 checksum for data against the expected.
    static validate(data, expected) {
        let ba = crc16.checksum(data);
        return ba == expected;
    }
}
exports.crc16 = crc16;


/***/ }),

/***/ 7869:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEd25519Helper = exports.setEd25519Helper = void 0;
/**
 * @ignore
 */
let helper;
/**
 * @ignore
 */
function setEd25519Helper(lib) {
    helper = lib;
}
exports.setEd25519Helper = setEd25519Helper;
/**
 * @ignore
 */
function getEd25519Helper() {
    return helper;
}
exports.getEd25519Helper = getEd25519Helper;


/***/ }),

/***/ 9615:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @ignore
 */
//@ts-ignore
const nacl = __nccwpck_require__(8729);
/**
 * @ignore
 */
//@ts-ignore
const helper = {
    randomBytes: nacl.randomBytes,
    verify: nacl.sign.detached.verify,
    fromSeed: nacl.sign.keyPair.fromSeed,
    sign: nacl.sign.detached,
};
// This here to support node 10.
if (typeof TextEncoder === "undefined") {
    //@ts-ignore
    const util = __nccwpck_require__(3837);
    //@ts-ignore
    global.TextEncoder = util.TextEncoder;
    //@ts-ignore
    global.TextDecoder = util.TextDecoder;
}
if (typeof atob === "undefined") {
    global.atob = (a) => {
        return Buffer.from(a, "base64").toString("binary");
    };
    global.btoa = (b) => {
        return Buffer.from(b, "binary").toString("base64");
    };
}
/**
 * @ignore
 */
//@ts-ignore
const { setEd25519Helper } = __nccwpck_require__(7869);
setEd25519Helper(helper);
/**
 * @ignore
 */
//@ts-ignore
__exportStar(__nccwpck_require__(1084), exports);


/***/ }),

/***/ 3267:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2018-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KP = void 0;
const codec_1 = __nccwpck_require__(1235);
const nkeys_1 = __nccwpck_require__(7697);
const helper_1 = __nccwpck_require__(7869);
/**
 * @ignore
 */
class KP {
    constructor(seed) {
        this.seed = seed;
    }
    getRawSeed() {
        if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        let sd = codec_1.Codec.decodeSeed(this.seed);
        return sd.buf;
    }
    getSeed() {
        if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        return this.seed;
    }
    getPublicKey() {
        if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        const sd = codec_1.Codec.decodeSeed(this.seed);
        const kp = (0, helper_1.getEd25519Helper)().fromSeed(this.getRawSeed());
        const buf = codec_1.Codec.encode(sd.prefix, kp.publicKey);
        return new TextDecoder().decode(buf);
    }
    getPrivateKey() {
        if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        const kp = (0, helper_1.getEd25519Helper)().fromSeed(this.getRawSeed());
        return codec_1.Codec.encode(nkeys_1.Prefix.Private, kp.secretKey);
    }
    sign(input) {
        if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        const kp = (0, helper_1.getEd25519Helper)().fromSeed(this.getRawSeed());
        return (0, helper_1.getEd25519Helper)().sign(input, kp.secretKey);
    }
    verify(input, sig) {
        if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        const kp = (0, helper_1.getEd25519Helper)().fromSeed(this.getRawSeed());
        return (0, helper_1.getEd25519Helper)().verify(input, sig, kp.publicKey);
    }
    clear() {
        if (!this.seed) {
            return;
        }
        this.seed.fill(0);
        this.seed = undefined;
    }
}
exports.KP = KP;


/***/ }),

/***/ 1084:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encode = exports.decode = exports.Prefix = exports.NKeysErrorCode = exports.NKeysError = exports.fromSeed = exports.fromPublic = exports.createUser = exports.createServer = exports.createPair = exports.createOperator = exports.createCluster = exports.createAccount = void 0;
var nkeys_1 = __nccwpck_require__(7697);
Object.defineProperty(exports, "createAccount", ({ enumerable: true, get: function () { return nkeys_1.createAccount; } }));
Object.defineProperty(exports, "createCluster", ({ enumerable: true, get: function () { return nkeys_1.createCluster; } }));
Object.defineProperty(exports, "createOperator", ({ enumerable: true, get: function () { return nkeys_1.createOperator; } }));
Object.defineProperty(exports, "createPair", ({ enumerable: true, get: function () { return nkeys_1.createPair; } }));
Object.defineProperty(exports, "createServer", ({ enumerable: true, get: function () { return nkeys_1.createServer; } }));
Object.defineProperty(exports, "createUser", ({ enumerable: true, get: function () { return nkeys_1.createUser; } }));
Object.defineProperty(exports, "fromPublic", ({ enumerable: true, get: function () { return nkeys_1.fromPublic; } }));
Object.defineProperty(exports, "fromSeed", ({ enumerable: true, get: function () { return nkeys_1.fromSeed; } }));
Object.defineProperty(exports, "NKeysError", ({ enumerable: true, get: function () { return nkeys_1.NKeysError; } }));
Object.defineProperty(exports, "NKeysErrorCode", ({ enumerable: true, get: function () { return nkeys_1.NKeysErrorCode; } }));
Object.defineProperty(exports, "Prefix", ({ enumerable: true, get: function () { return nkeys_1.Prefix; } }));
var util_1 = __nccwpck_require__(9539);
Object.defineProperty(exports, "decode", ({ enumerable: true, get: function () { return util_1.decode; } }));
Object.defineProperty(exports, "encode", ({ enumerable: true, get: function () { return util_1.encode; } }));


/***/ }),

/***/ 7697:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NKeysError = exports.NKeysErrorCode = exports.Prefixes = exports.Prefix = exports.fromSeed = exports.fromPublic = exports.createServer = exports.createCluster = exports.createUser = exports.createAccount = exports.createOperator = exports.createPair = void 0;
/*
 * Copyright 2018-2023 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const kp_1 = __nccwpck_require__(3267);
const public_1 = __nccwpck_require__(6859);
const codec_1 = __nccwpck_require__(1235);
const helper_1 = __nccwpck_require__(7869);
/**
 * @ignore
 */
function createPair(prefix) {
    const rawSeed = (0, helper_1.getEd25519Helper)().randomBytes(32);
    let str = codec_1.Codec.encodeSeed(prefix, new Uint8Array(rawSeed));
    return new kp_1.KP(str);
}
exports.createPair = createPair;
/**
 * Creates a KeyPair with an operator prefix
 * @returns {KeyPair} Returns the created KeyPair.
 */
function createOperator() {
    return createPair(Prefix.Operator);
}
exports.createOperator = createOperator;
/**
 * Creates a KeyPair with an account prefix
 * @returns {KeyPair} Returns the created KeyPair.
 */
function createAccount() {
    return createPair(Prefix.Account);
}
exports.createAccount = createAccount;
/**
 * Creates a KeyPair with a user prefix
 * @returns {KeyPair} Returns the created KeyPair.
 */
function createUser() {
    return createPair(Prefix.User);
}
exports.createUser = createUser;
/**
 * @ignore
 */
function createCluster() {
    return createPair(Prefix.Cluster);
}
exports.createCluster = createCluster;
/**
 * @ignore
 */
function createServer() {
    return createPair(Prefix.Server);
}
exports.createServer = createServer;
/**
 * Creates a KeyPair from a specified public key
 * @param {string} src of the public key in string format.
 * @returns {KeyPair} Returns the created KeyPair.
 * @see KeyPair#getPublicKey
 */
function fromPublic(src) {
    const ba = new TextEncoder().encode(src);
    const raw = codec_1.Codec._decode(ba);
    const prefix = Prefixes.parsePrefix(raw[0]);
    if (Prefixes.isValidPublicPrefix(prefix)) {
        return new public_1.PublicKey(ba);
    }
    throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
}
exports.fromPublic = fromPublic;
/**
 * Creates a KeyPair from a specified seed.
 * @param {Uint8Array} src of the seed key as Uint8Array
 * @returns {KeyPair} Returns the created KeyPair.
 * @see KeyPair#getSeed
 */
function fromSeed(src) {
    codec_1.Codec.decodeSeed(src);
    // if we are here it decoded
    return new kp_1.KP(src);
}
exports.fromSeed = fromSeed;
/**
 * @ignore
 */
var Prefix;
(function (Prefix) {
    //Seed is the version byte used for encoded NATS Seeds
    Prefix[Prefix["Seed"] = 144] = "Seed";
    //PrefixBytePrivate is the version byte used for encoded NATS Private keys
    Prefix[Prefix["Private"] = 120] = "Private";
    //PrefixByteOperator is the version byte used for encoded NATS Operators
    Prefix[Prefix["Operator"] = 112] = "Operator";
    //PrefixByteServer is the version byte used for encoded NATS Servers
    Prefix[Prefix["Server"] = 104] = "Server";
    //PrefixByteCluster is the version byte used for encoded NATS Clusters
    Prefix[Prefix["Cluster"] = 16] = "Cluster";
    //PrefixByteAccount is the version byte used for encoded NATS Accounts
    Prefix[Prefix["Account"] = 0] = "Account";
    //PrefixByteUser is the version byte used for encoded NATS Users
    Prefix[Prefix["User"] = 160] = "User";
})(Prefix = exports.Prefix || (exports.Prefix = {}));
/**
 * @private
 */
class Prefixes {
    static isValidPublicPrefix(prefix) {
        return prefix == Prefix.Server ||
            prefix == Prefix.Operator ||
            prefix == Prefix.Cluster ||
            prefix == Prefix.Account ||
            prefix == Prefix.User;
    }
    static startsWithValidPrefix(s) {
        let c = s[0];
        return c == "S" || c == "P" || c == "O" || c == "N" || c == "C" ||
            c == "A" || c == "U";
    }
    static isValidPrefix(prefix) {
        let v = this.parsePrefix(prefix);
        return v != -1;
    }
    static parsePrefix(v) {
        switch (v) {
            case Prefix.Seed:
                return Prefix.Seed;
            case Prefix.Private:
                return Prefix.Private;
            case Prefix.Operator:
                return Prefix.Operator;
            case Prefix.Server:
                return Prefix.Server;
            case Prefix.Cluster:
                return Prefix.Cluster;
            case Prefix.Account:
                return Prefix.Account;
            case Prefix.User:
                return Prefix.User;
            default:
                return -1;
        }
    }
}
exports.Prefixes = Prefixes;
/**
 * Possible error codes on exceptions thrown by the library.
 */
var NKeysErrorCode;
(function (NKeysErrorCode) {
    NKeysErrorCode["InvalidPrefixByte"] = "nkeys: invalid prefix byte";
    NKeysErrorCode["InvalidKey"] = "nkeys: invalid key";
    NKeysErrorCode["InvalidPublicKey"] = "nkeys: invalid public key";
    NKeysErrorCode["InvalidSeedLen"] = "nkeys: invalid seed length";
    NKeysErrorCode["InvalidSeed"] = "nkeys: invalid seed";
    NKeysErrorCode["InvalidEncoding"] = "nkeys: invalid encoded key";
    NKeysErrorCode["InvalidSignature"] = "nkeys: signature verification failed";
    NKeysErrorCode["CannotSign"] = "nkeys: cannot sign, no private key available";
    NKeysErrorCode["PublicKeyOnly"] = "nkeys: no seed or private key available";
    NKeysErrorCode["InvalidChecksum"] = "nkeys: invalid checksum";
    NKeysErrorCode["SerializationError"] = "nkeys: serialization error";
    NKeysErrorCode["ApiError"] = "nkeys: api error";
    NKeysErrorCode["ClearedPair"] = "nkeys: pair is cleared";
})(NKeysErrorCode = exports.NKeysErrorCode || (exports.NKeysErrorCode = {}));
class NKeysError extends Error {
    /**
     * @param {NKeysErrorCode} code
     * @param {Error} [chainedError]
     * @constructor
     *
     * @api private
     */
    constructor(code, chainedError) {
        super(code);
        this.name = "NKeysError";
        this.code = code;
        this.chainedError = chainedError;
    }
}
exports.NKeysError = NKeysError;


/***/ }),

/***/ 6859:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*
 * Copyright 2018-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PublicKey = void 0;
const codec_1 = __nccwpck_require__(1235);
const nkeys_1 = __nccwpck_require__(7697);
const helper_1 = __nccwpck_require__(7869);
/**
 * @ignore
 */
class PublicKey {
    constructor(publicKey) {
        this.publicKey = publicKey;
    }
    getPublicKey() {
        if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        return new TextDecoder().decode(this.publicKey);
    }
    getPrivateKey() {
        if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.PublicKeyOnly);
    }
    getSeed() {
        if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.PublicKeyOnly);
    }
    sign(_) {
        if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.CannotSign);
    }
    verify(input, sig) {
        if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
        }
        let buf = codec_1.Codec._decode(this.publicKey);
        return (0, helper_1.getEd25519Helper)().verify(input, sig, buf.slice(1));
    }
    clear() {
        if (!this.publicKey) {
            return;
        }
        this.publicKey.fill(0);
        this.publicKey = undefined;
    }
}
exports.PublicKey = PublicKey;


/***/ }),

/***/ 9539:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dump = exports.decode = exports.encode = void 0;
/*
 * Copyright 2018-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Encode binary data to a base64 string
 * @param {Uint8Array} bytes to encode to base64
 */
function encode(bytes) {
    return btoa(String.fromCharCode(...bytes));
}
exports.encode = encode;
/**
 * Decode a base64 encoded string to a binary Uint8Array
 * @param {string} b64str encoded string
 */
function decode(b64str) {
    const bin = atob(b64str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
}
exports.decode = decode;
/**
 * @ignore
 */
function dump(buf, msg) {
    if (msg) {
        console.log(msg);
    }
    let a = [];
    for (let i = 0; i < buf.byteLength; i++) {
        if (i % 8 === 0) {
            a.push("\n");
        }
        let v = buf[i].toString(16);
        if (v.length === 1) {
            v = "0" + v;
        }
        a.push(v);
    }
    console.log(a.join("  "));
}
exports.dump = dump;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 8729:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = Math.floor((x[j] + 128) / 256);
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  return n;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES,

  gf: gf,
  D: D,
  L: L,
  pack25519: pack25519,
  unpack25519: unpack25519,
  M: M,
  A: A,
  S: S,
  Z: Z,
  pow2523: pow2523,
  add: add,
  set25519: set25519,
  modL: modL,
  scalarmult: scalarmult,
  scalarbase: scalarbase,
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  for (var i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Uint8Array))
      throw new TypeError('unexpected type, use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return null;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (true) {
    // Node.js.
    crypto = __nccwpck_require__(6113);
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})( true && module.exports ? module.exports : (self.nacl = self.nacl || {}));


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core = __importStar(__nccwpck_require__(2186));
const nats_1 = __nccwpck_require__(2627);
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const subject = core.getInput('subject');
        const message = core.getInput('message');
        const urls = core.getInput('urls');
        const jwt = core.getInput('jwt');
        const nKeySeed = core.getInput('nKeySeed');
        const nc = await (0, nats_1.connectToMQ)({ urls, jwt, nKeySeed });
        (0, nats_1.publishMessage)(nc, subject, message);
        core.debug(`published message to ${subject}: ${message}`);
        core.debug(`draining...`);
        await nc.drain();
        core.debug(`closing...`);
        await nc.close();
        core.setOutput('published', `subject: ${subject}, message: ${message}`);
        // check if the close was OK
        const err = await nc.closed();
        if (err) {
            core.debug(`error closing:
${err.message}`);
            core.setFailed(err.message);
        }
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;


/***/ }),

/***/ 2627:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.publishMessage = exports.connectToMQ = void 0;
const core = __importStar(__nccwpck_require__(2186));
const nats_1 = __nccwpck_require__(1954);
async function connectToMQ({ urls: natsUrls, jwt, nKeySeed }) {
    const urls = natsUrls?.split(',') ?? [];
    const servers = urls.map(s => s.trim());
    const natsConn = await (0, nats_1.connect)({
        servers,
        authenticator: (0, nats_1.jwtAuthenticator)(jwt, new TextEncoder().encode(nKeySeed))
    });
    core.debug(`NATS connected to ${natsConn.info?.server_name}`);
    return natsConn;
}
exports.connectToMQ = connectToMQ;
/**
 * @param {import("nats").NatsConnection} nc
 * @param {string} subject
 * @param {string} message
 */
function publishMessage(nc, subject, message) {
    nc.publish(subject, (0, nats_1.StringCodec)().encode(message));
}
exports.publishMessage = publishMessage;


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 9523:
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 5356:
/***/ ((module) => {

"use strict";
module.exports = require("stream/web");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const main_1 = __nccwpck_require__(399);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;