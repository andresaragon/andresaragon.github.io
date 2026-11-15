(() => {
  "use strict";

  const examples = {
    safe: {
      command: "inspect --example legitimate-query",
      input: "“Which customers have overdue invoices?”",
      status: "ALLOWED",
      latency: "23 ms · simulated",
      sql: "SELECT customer_id, due_date\nFROM invoices\nWHERE status = 'overdue'\nLIMIT 100;",
      note: "AST valid · read-only · row limit enforced",
      blocked: false
    },
    attack: {
      command: "inspect --example sql-injection",
      input: "“Show customers; DROP TABLE customers; --”",
      status: "BLOCKED",
      latency: "4 ms · simulated",
      sql: "UnsafeQueryError: multiple statements are prohibited.",
      note: "AST rejected · database not contacted",
      blocked: true
    }
  };

  const command = document.getElementById("demo-command");
  const input = document.getElementById("demo-input");
  const output = document.getElementById("demo-output");
  const choices = Array.from(document.querySelectorAll("[data-example]"));

  function showExample(key) {
    const item = examples[key];
    if (!item || !command || !input || !output) return;

    command.textContent = item.command;
    input.textContent = item.input;
    output.replaceChildren();

    const heading = document.createElement("div");
    heading.className = "result-heading " + (item.blocked ? "result-blocked" : "result-allowed");

    const symbol = document.createElement("span");
    symbol.className = "result-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = item.blocked ? "×" : "✓";

    const status = document.createElement("strong");
    status.textContent = item.status;

    const latency = document.createElement("span");
    latency.className = "result-latency";
    latency.textContent = item.latency;

    heading.append(symbol, status, latency);

    const code = document.createElement("code");
    code.className = "result-code" + (item.blocked ? " is-danger" : "");
    code.textContent = item.sql;

    const note = document.createElement("p");
    note.className = "result-note";
    note.textContent = item.note;

    output.append(heading, code, note);

    choices.forEach((choice) => {
      const selected = choice.dataset.example === key;
      choice.classList.toggle("is-selected", selected);
      choice.setAttribute("aria-pressed", String(selected));
    });
  }

  choices.forEach((choice) => {
    choice.addEventListener("click", () => showExample(choice.dataset.example));
  });
})();
