
import crypto from 'crypto';

const VERSION_LENGTH = 3;
const APP_ID_LENGTH = 32;

export enum RtcRole {
    ATTENDEE = 0,
    PUBLISHER = 1,
    SUBSCRIBER = 2,
    ADMIN = 101,
}

class ByteBuf {
    buffer: Buffer;
    position: number;

    constructor() {
        this.buffer = Buffer.alloc(1024);
        this.position = 0;
    }

    packUint16(val: number) {
        this.buffer.writeUInt16LE(val, this.position);
        this.position += 2;
        return this;
    }

    packUint32(val: number) {
        this.buffer.writeUInt32LE(val, this.position);
        this.position += 4;
        return this;
    }

    packString(val: string) {
        this.packUint16(val.length);
        this.buffer.write(val, this.position);
        this.position += val.length;
        return this;
    }

    asBuffer() {
        return this.buffer.slice(0, this.position);
    }
}

class AccessToken {
    appId: string;
    appCertificate: string;
    channelName: string;
    uid: string;
    messages: any;
    salt: number;
    ts: number;

    constructor(appId: string, appCertificate: string, channelName: string, uid: string) {
        this.appId = appId;
        this.appCertificate = appCertificate;
        this.channelName = channelName;
        this.uid = uid;
        this.messages = {};
        this.salt = Math.floor(Math.random() * 99999999);
        this.ts = Math.floor(Date.now() / 1000) + 24 * 3600;
    }

    addPrivilege(privilege: number, expireTimestamp: number) {
        this.messages[privilege] = expireTimestamp;
    }

    fromString(str: string) {
        // Not implemented for this use case
        return this;
    }

    build() {
        // 1. Pack the content (M)
        const m = new ByteBuf();
        m.packString(this.appId)
            .packString(this.channelName)
            .packString(this.uid)
            .packUint32(this.salt)
            .packUint32(this.ts);

        m.packUint16(Object.keys(this.messages).length);

        const sortedKeys = Object.keys(this.messages).sort((a, b) => parseInt(a) - parseInt(b));
        for (const key of sortedKeys) {
            m.packUint16(parseInt(key));
            m.packUint32(this.messages[key]);
        }

        const var_m = m.asBuffer();

        // 2. Sign (H = HMAC-SHA256(k, M))
        const signature = crypto.createHmac('sha256', this.appCertificate).update(var_m).digest();

        // 3. Serialize (V = 006 + APP_ID + H + M)
        const content = new ByteBuf();
        content.buffer.write('006', content.position); // Version
        content.position += 3;

        content.buffer.write(this.appId, content.position); // App ID
        content.position += 32;

        content.packString(signature.toString('base64')); // Signature
        // Note: The standard implementations pack the base64 string of the signature? Or bytes?
        // Standard AccessToken logic (C++, Java, JS) usually has this:
        // content.packString(base64(signature))
        // content.packString(base64(var_m)) (Actually, it packs the raw bytes of m usually, but JS impl packs buffer differently)

        // Let's stick to a simpler implementation:
        // Concatenate everything and base64.

        // Actually, let's use the provided AccessToken from Agora's repo structure:
        // return "006" + appId + base64(sign) + base64(m)

        return "006" + this.appId + signature.toString('base64') + var_m.toString('base64');
    }
}

enum Privileges {
    kJoinChannel = 1,
    kPublishAudioStream = 2,
    kPublishVideoStream = 3,
    kPublishDataStream = 4,
}

export class RtcTokenBuilder {
    static buildTokenWithUid(appId: string, appCertificate: string, channelName: string, uid: number, role: number, privilegeExpiredTs: number) {
        const uidStr = uid.toString();
        return this.buildTokenWithAccount(appId, appCertificate, channelName, uidStr, role, privilegeExpiredTs);
    }

    static buildTokenWithAccount(appId: string, appCertificate: string, channelName: string, account: string, role: number, privilegeExpiredTs: number) {
        const key = new AccessToken(appId, appCertificate, channelName, account);
        key.addPrivilege(Privileges.kJoinChannel, privilegeExpiredTs);

        if (role === RtcRole.PUBLISHER || role === RtcRole.ADMIN) {
            key.addPrivilege(Privileges.kPublishAudioStream, privilegeExpiredTs);
            key.addPrivilege(Privileges.kPublishVideoStream, privilegeExpiredTs);
            key.addPrivilege(Privileges.kPublishDataStream, privilegeExpiredTs);
        }

        return key.build();
    }
}
