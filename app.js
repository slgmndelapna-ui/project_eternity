
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
    this.#initializeCodeViewer();
  }

  #bindEvents() {
    this.#form.addEventListener("submit", event => {
      event.preventDefault();
      void this.#handleAuthentication();
    });
  }

  async #handleAuthentication() {
    this.#setFeedback("VERIFYING CREDENTIALS...", "");

    const authorized = await this.#authenticator.verify(
      this.#input.value
    );

    if (!authorized) {
      this.#setFeedback(
        "ACCESS DENIED // CHECK THE PASSPHRASE.",
        "error"
      );
      this.#input.select();
      return;
    }

    const record = this.#archive.retrieve("personal-note");

    this.#recipientName.textContent =
      record.recipient.toUpperCase();

    this.#messageOutput.textContent = record.content;

    this.#archivePanel.classList.remove("hidden");

    this.#setFeedback(
      "ACCESS GRANTED // RECORD SUCCESSFULLY RETRIEVED.",
      "success"
    );

    this.#form.querySelector("button").disabled = true;
    this.#input.disabled = true;
  }

  #setFeedback(message, state) {
    this.#feedback.textContent = message;
    this.#feedback.className = `feedback ${state}`;
  }

  #initializeCodeViewer() {
    const tabs = document.querySelectorAll(".code-tab");
    const codeDisplay = document.querySelector("#source-code");
    const filename = document.querySelector("#current-filename");
    const status = document.querySelector("#code-status");
    const copyButton = document.querySelector("#copy-code");

    if (!codeDisplay || !tabs.length) return;

    const sourceFiles = {
      "index.html": "html",
      "main.css": "css",
      "app.js": "javascript",
      "auth.js": "javascript",
      "archive.js": "javascript"
    };

    let currentCode = "";

    const loadFile = async file => {
      filename.textContent = file;
      status.textContent = "LOADING SOURCE FILE...";

      codeDisplay.textContent = "Loading...";
      codeDisplay.className = `language-${sourceFiles[file]}`;

      tabs.forEach(tab => {
        const selected = tab.dataset.file === file;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });

      try {
        const response = await fetch(`./${file}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        currentCode = await response.text();

        codeDisplay.textContent = currentCode;

        if (window.hljs) {
          window.hljs.highlightElement(codeDisplay);
        }

        status.textContent = "SOURCE LOADED // READ ONLY";
      } catch (error) {
        currentCode = "";
        codeDisplay.textContent =
          `Unable to load ${file}.\n${error.message}`;

        status.textContent = "SOURCE FILE UNAVAILABLE";
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        void loadFile(tab.dataset.file);
      });
    });

    copyButton?.addEventListener("click", async () => {
      if (!currentCode) return;

      try {
        await navigator.clipboard.writeText(currentCode);
        copyButton.textContent = "COPIED!";

        setTimeout(() => {
          copyButton.textContent = "COPY CODE";
        }, 1500);
      } catch {
        copyButton.textContent = "COPY FAILED";
      }
    });

    void loadFile("index.html");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EternityApplication();
});
