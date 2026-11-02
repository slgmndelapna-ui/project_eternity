import { CONFIG } from "./config.js";

export class Authenticator {
  async verify(candidate) {
    // Simulated access gate for a personal surprise.
    // Do not use this pattern to protect real accounts or sensitive data.
    await new Promise(resolve => setTimeout(resolve, 450));
    return candidate.trim() === CONFIG.passphrase;
  }
}
