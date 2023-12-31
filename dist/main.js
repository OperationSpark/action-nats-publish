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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const nats_1 = require("./nats");
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const subject = core.getInput('subject') || 'default';
        const message = core.getInput('message') || '{"default": "message"}';
        const urls = core.getInput('urls') || process.env.NATS_URL || 'nats://localhost:4222';
        const jwt = core.getInput('jwt') || process.env.NATS_CLIENT_JWT;
        const nKeySeed = core.getInput('nKeySeed') || process.env.NATS_NKEY_SEED;
        const nc = await (0, nats_1.connectToMQ)({ urls, jwt, nKeySeed });
        (0, nats_1.publishMessage)(nc, subject, message);
        await nc.drain();
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
//# sourceMappingURL=main.js.map