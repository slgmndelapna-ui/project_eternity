import { CONFIG } from "./config.js";
import { Authenticator } from "./auth.js";
import { MessageArchive } from "./archive.js";

class EternityApplication {
  #authenticator;
  #archive;
  #form;
  #input;
  #feedback;
  #archivePanel;
  #messageOutput;
  #recipientName;

  constructor() {
    this.#authenticator = new Authenticator();
    this.#archive = new MessageArchive(CONFIG.recipient);
    this.#form = document.querySelector("#auth-form");
    this.#input = document.querySelector("#passphrase");
    this.#feedback = document.querySelector("#feedback");
    this.#archivePanel = document.querySelector("#archive");
    this.#messageOutput = document.querySelector("#message-output");
    this.#recipientName = document.querySelector("#recipient-name");

    this.#bindEvents();
  }

  #bindEvents() {
    this.#form.addEventListener("submit", event => {
      event.preventDefault();
      void this.#handleAuthentication();
    });
  }

  async #handleAuthentication() {
    this.#setFeedback("VERIFYING CREDENTIALS...", "");
    const authorized = await this.#authenticator.verify(this.#input.value);

    if (!authorized) {
      this.#setFeedback("ACCESS DENIED // CHECK THE PASSPHRASE.", "error");
      this.#input.select();
      return;
    }

    const record = this.#archive.retrieve("personal-note");
    this.#recipientName.textContent = record.recipient.toUpperCase();
    this.#messageOutput.textContent = record.content;
    this.#archivePanel.classList.remove("hidden");
    this.#setFeedback("ACCESS GRANTED // RECORD SUCCESSFULLY RETRIEVED.", "success");
    this.#form.querySelector("button").disabled = true;
    this.#input.disabled = true;
  }

  #setFeedback(message, state) {
    this.#feedback.textContent = message;
    this.#feedback.className = `feedback ${state}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EternityApplication();
});
