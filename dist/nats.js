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
exports.publishMessage = exports.connectToMQ = void 0;
const core = __importStar(require("@actions/core"));
const nats_1 = require("nats");
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
//# sourceMappingURL=nats.js.map