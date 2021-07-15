"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeAvatar = void 0;
const functions = require("firebase-functions");
const Storage = require("@google-cloud/storage");
const gcs = Storage();
const os_1 = require("os");
const path_1 = require("path");
const sharp = require("sharp");
exports.resizeAvatar = functions.storage
    .object()
    .onFinalize(async (object) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const tmpFilePath = path_1.join(os_1.tmpdir(), object.name);
    const avatarFileName = 'avatar_' + fileName;
    const tmpAvatarPath = path_1.join(os_1.tmpdir(), avatarFileName);
    if (fileName.includes('avatar_')) {
        console.log('exiting function');
        return false;
    }
    await bucket.file(filePath).download({
        destination: tmpFilePath
    });
    await sharp(tmpFilePath)
        .resize(100, 100)
        .toFile(tmpAvatarPath);
    return bucket.upload(tmpAvatarPath, {
        destination: path_1.join(path_1.dirname(filePath), avatarFileName)
    });
});
//# sourceMappingURL=storage.js.map