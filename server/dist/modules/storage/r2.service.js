"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2Service = void 0;
// src/modules/storage/r2.service.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
class R2Service {
    static s3Client = null;
    static getClient() {
        if (this.s3Client)
            return this.s3Client;
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        if (!accountId || !accessKeyId || !secretAccessKey) {
            console.warn('Cloudflare R2 is not fully configured in env. Falling back to local disk storage.');
            return null;
        }
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        return this.s3Client;
    }
    static async uploadFile(file) {
        const client = this.getClient();
        if (!client) {
            return `/uploads/${file.filename}`;
        }
        const bucketName = process.env.R2_BUCKET_NAME || 'bs-cart-r2';
        const publicUrl = process.env.R2_PUBLIC_URL;
        const key = `prescriptions/${Date.now()}-${file.filename}`;
        try {
            const fileStream = fs_1.default.createReadStream(file.path);
            await client.send(new client_s3_1.PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: fileStream,
                ContentType: file.mimetype,
            }));
            // Clean up the local file after uploading to R2
            try {
                fs_1.default.unlinkSync(file.path);
            }
            catch (err) {
                console.error('Failed to delete local temp file after R2 upload:', err);
            }
            if (publicUrl) {
                return `${publicUrl.replace(/\/$/, '')}/${key}`;
            }
            return `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
        }
        catch (err) {
            console.error('Cloudflare R2 Upload failed:', err);
            throw new Error('Failed to upload file to Cloudflare R2');
        }
    }
}
exports.R2Service = R2Service;
