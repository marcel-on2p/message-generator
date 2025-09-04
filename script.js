// ===== Konfigurierbare Wortlisten =====
// Füge hier deine eigenen Inhalte hinzu (auch mehr Kategorien möglich)
const parts = {
  greetings: [
  "Willkommen, Champion des Tages!",
  "Hallo, unaufhaltsamer Problemlöser!",
  "Grüß dich, Held der kleinen Schritte!",
  "Servus, Meister der guten Laune!",
  "Hey, Zukunfts-Gewinner!",
  "Moin, unerschütterlicher Optimist!",
  "Hi, kreatives Genie auf Erfolgskurs!",
  "Guten Tag, Fels in der Brandung!",
  "Hallo, wandelndes Energiepaket!",
  "Willkommen, inspirierende Legende!"
],
  subjects: [
  "Du schaffst alles, wenn du nur dranbleibst.",
  "Heute ist der perfekte Tag, um Neues zu wagen.",
  "Gib niemals auf – dein Durchbruch ist näher als du denkst.",
  "Jeder Schritt bringt dich deinem Ziel näher.",
  "Du bist stärker, als du dir selbst zutraust.",
  "Aus kleinen Schritten entstehen große Erfolge."
],
  verbs: [
  "Der Weg ist das Ziel.",
  "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
  "Geduld ist der Schlüssel zum Erfolg.",
  "Auch die längste Reise beginnt mit dem ersten Schritt.",
  "Man wächst an seinen Herausforderungen.",
  "Träume nicht dein Leben, sondern lebe deinen Traum."
],
  objects: [
  "Denke immer daran: Du bist unglaublich stark!",
  "Behalte stehts im Hinterkopf: Du hast ein großartiges Talent.",
  "Eines ist klar: Dein Durchhaltevermögen ist bewundernswert.",
  "Denke immer daran: Du machst das richtig gut!",
  "Sei dir immer eines bewusst: Du bist einzigartig und wertvoll.",
  "Du bist sehr besonders, denn: Du strahlst pure Energie aus!"
],
  endings: ["🚀", "💪", "🔥", "✨", "🌟"]
};

// ===== Utilities =====
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const $ = (sel) => document.querySelector(sel);

// Einfache "keine direkte Wiederholung"-Logik über localStorage:
function generateMessageSimple() {
  const msg =
    `${pick(parts.greetings)} ${pick(parts.subjects)} ` +
    `${pick(parts.verbs)} ${pick(parts.objects)} ${pick(parts.endings)}`;

  const last = localStorage.getItem("lastMessage");
  if (msg === last) return generateMessageSimple(); // ziehe neu
  localStorage.setItem("lastMessage", msg);
  return msg;
}

/*
// Alternative: "no-repeat bis alles durch ist" (für begrenzte Kombi-Mengen):
// - Erzeugt alle Kombinationen einmal, mischt sie, gibt sie als Queue zurück.
// - Achtung: Bei großen Listen kann die Kombi-Anzahl sehr groß werden!
function* allCombosShuffled() {
  const combos = [];
  for (const g of parts.greetings)
    for (const s of parts.subjects)
      for (const v of parts.verbs)
        for (const o of parts.objects)
          for (const e of parts.endings)
            combos.push(`${g}, ${s}! ${v} ${o} ${e}`);

  // Fisher-Yates mixen
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }
  for (const c of combos) yield c;
}

let queue = null;
function generateMessageNoRepeatAll() {
  if (!queue) queue = allCombosShuffled();
  const next = queue.next();
  if (next.done) queue = allCombosShuffled(); // neu füllen, wenn durch
  return next.value ?? generateMessageNoRepeatAll();
}
*/

// ===== App-Logik =====
function updateMessage() {
  // einfache Variante:
  const text = generateMessageSimple();

  // oder streng ohne Wiederholung aller Kombinationen:
  // const text = generateMessageNoRepeatAll();

  $("#message").textContent = text;
}

// ===== Setup =====
document.addEventListener("DOMContentLoaded", () => {
  const newBtn = $("#newMessage");
  const copyBtn = $("#copyBtn");

  newBtn.addEventListener("click", updateMessage);

  copyBtn.addEventListener("click", async () => {
    const text = $("#message").textContent.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      const prev = copyBtn.textContent;
      copyBtn.textContent = "Kopiert!";
      setTimeout(() => (copyBtn.textContent = prev), 900);
    } catch {
      // Fallback: Text markieren
      const range = document.createRange();
      range.selectNodeContents($("#message"));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  updateMessage();
});
