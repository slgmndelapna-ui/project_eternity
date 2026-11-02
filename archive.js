import { CONFIG } from "./config.js";

export class MessageArchive {
  constructor(recipient) {
    this.recipient = recipient;
    this.records = new Map([
      ["personal-note", {
        type: "PERSONAL MESSAGE",
        content: CONFIG.message
      }]
    ]);
  }

  retrieve(recordId) {
    const record = this.records.get(recordId);
    if (!record) throw new Error("Requested record does not exist.");
    return Object.freeze({ ...record, recipient: this.recipient });
  }
}
