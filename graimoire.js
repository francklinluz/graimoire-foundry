// ── Graimoire Foundry Module ───────────────────────────────────────────
// Intercepta o comando /graimoire no chat e consulta a API do Graimoire

const MODULE_ID  = 'graimoire';
const MODULE_NAME = 'Graimoire';

// ── Settings ───────────────────────────────────────────────────────────
Hooks.once('init', () => {
  game.settings.register(MODULE_ID, 'serverUrl', {
    name: 'URL do servidor Graimoire',
    hint: 'URL do seu backend Graimoire (ex: https://graimoire-production.up.railway.app)',
    scope: 'world',
    config: true,
    type: String,
    default: 'https://graimoire-production.up.railway.app',
  });

  game.settings.register(MODULE_ID, 'activeBookId', {
    name: 'ID do livro ativo',
    hint: 'ID do livro indexado no Graimoire para consulta (deixe vazio para usar o padrão)',
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });

  game.settings.register(MODULE_ID, 'showToAll', {
    name: 'Mostrar respostas para todos',
    hint: 'Se ativado, as respostas aparecem para todos os jogadores. Se desativado, só para quem perguntou.',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  console.log(`${MODULE_NAME} | Módulo inicializado`);
});

// ── Ready ──────────────────────────────────────────────────────────────
Hooks.once('ready', () => {
  console.log(`${MODULE_NAME} | Pronto. Use /graimoire <pergunta> no chat.`);
  if (game.user.isGM) {
    const url = game.settings.get(MODULE_ID, 'serverUrl');
    if (!url) {
      ui.notifications.warn('Graimoire: configure a URL do servidor em Configurações do Módulo.');
    }
  }
});

// ── Chat command interceptor ───────────────────────────────────────────
Hooks.on('chatMessage', (chatLog, message, chatData) => {
  const trimmed = message.trim();

  // Detect /graimoire command
  if (!trimmed.toLowerCase().startsWith('/graimoire')) return true;

  // Extract question after the command
  const question = trimmed.replace(/^\/graimoire\s*/i, '').trim();

  if (!question) {
    ui.notifications.warn('Graimoire: digite uma pergunta após /graimoire');
    return false;
  }

  // Fire async without blocking
  handleGraimoireQuery(question, chatData);

  // Return false to prevent Foundry from processing the message normally
  return false;
});

// ── Query handler ──────────────────────────────────────────────────────
async function handleGraimoireQuery(question, chatData) {
  const serverUrl = game.settings.get(MODULE_ID, 'serverUrl').replace(/\/$/, '');
  const showToAll = game.settings.get(MODULE_ID, 'showToAll');

  // Show typing indicator in chat
  const typingId = await showTyping(question, showToAll);

  try {
    // Call Graimoire API
    const response = await fetch(`${serverUrl}/api/foundry/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ question }),
    });

    // Remove typing indicator
    removeTyping(typingId);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));

      // Not authenticated — show login prompt
      if (response.status === 401) {
        showLoginPrompt(serverUrl);
        return;
      }

      // Limit reached
      if (response.status === 403 && err.limitReached) {
        showLimitReached(err.error, showToAll);
        return;
      }

      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    showAnswer(question, data.answer, data.sources, showToAll);

  } catch (err) {
    removeTyping(typingId);
    console.error(`${MODULE_NAME} | Erro:`, err);
    showError(err.message, showToAll);
  }
}

// ── Chat message helpers ───────────────────────────────────────────────
async function showTyping(question, showToAll) {
  const id = `graimoire-typing-${Date.now()}`;
  const content = `
    <div class="graimoire-message graimoire-typing" data-id="${id}">
      <div class="graimoire-header">
        <span class="graimoire-icon">📖</span>
        <span class="graimoire-title">Graimoire</span>
        <span class="graimoire-query">"${escapeHtml(question)}"</span>
      </div>
      <div class="graimoire-body">
        <span class="graimoire-dots"><span></span><span></span><span></span></span>
        Consultando livro de regras...
      </div>
    </div>`;

  await ChatMessage.create({
    content,
    speaker: { alias: 'Graimoire' },
    whisper: showToAll ? [] : [game.user.id],
    flags: { [MODULE_ID]: { type: 'typing', typingId: id } },
  });

  return id;
}

function removeTyping(typingId) {
  // Find and delete the typing message
  const msg = game.messages.find(m =>
    m.getFlag(MODULE_ID, 'typingId') === typingId
  );
  if (msg) msg.delete();
}

async function showAnswer(question, answer, sources, showToAll) {
  // Format sources as page citations
  let sourcesHtml = '';
  if (sources && sources.length > 0) {
    const tags = sources.map(s =>
      `<span class="graimoire-source">📄 Pág. ${s.page} · ${Math.round(s.score * 100)}%</span>`
    ).join('');
    sourcesHtml = `<div class="graimoire-sources">${tags}</div>`;
  }

  // Format answer — bold and line breaks
  const formattedAnswer = answer
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  const content = `
    <div class="graimoire-message graimoire-answer">
      <div class="graimoire-header">
        <span class="graimoire-icon">📖</span>
        <span class="graimoire-title">Graimoire</span>
        <span class="graimoire-query">"${escapeHtml(question)}"</span>
      </div>
      <div class="graimoire-body">${formattedAnswer}</div>
      ${sourcesHtml}
    </div>`;

  await ChatMessage.create({
    content,
    speaker: { alias: 'Graimoire' },
    whisper: showToAll ? [] : [game.user.id],
    flags: { [MODULE_ID]: { type: 'answer' } },
  });
}

async function showError(message, showToAll) {
  const content = `
    <div class="graimoire-message graimoire-error">
      <div class="graimoire-header">
        <span class="graimoire-icon">📖</span>
        <span class="graimoire-title">Graimoire</span>
      </div>
      <div class="graimoire-body">⚠️ ${escapeHtml(message)}</div>
    </div>`;

  await ChatMessage.create({
    content,
    speaker: { alias: 'Graimoire' },
    whisper: [game.user.id],
    flags: { [MODULE_ID]: { type: 'error' } },
  });
}

async function showLimitReached(message, showToAll) {
  const serverUrl = game.settings.get(MODULE_ID, 'serverUrl').replace(/\/$/, '');
  const content = `
    <div class="graimoire-message graimoire-error">
      <div class="graimoire-header">
        <span class="graimoire-icon">📖</span>
        <span class="graimoire-title">Graimoire — Limite atingido</span>
      </div>
      <div class="graimoire-body">
        ${escapeHtml(message)}<br><br>
        <a href="${serverUrl}" target="_blank">Fazer upgrade →</a>
      </div>
    </div>`;

  await ChatMessage.create({
    content,
    speaker: { alias: 'Graimoire' },
    whisper: [game.user.id],
    flags: { [MODULE_ID]: { type: 'error' } },
  });
}

function showLoginPrompt(serverUrl) {
  new Dialog({
    title: 'Graimoire — Login necessário',
    content: `
      <p>Você precisa estar logado no Graimoire para usar este módulo.</p>
      <p>Clique em "Abrir Graimoire" para fazer login, depois volte ao Foundry.</p>
    `,
    buttons: {
      login: {
        label: 'Abrir Graimoire',
        callback: () => window.open(serverUrl, '_blank'),
      },
      cancel: {
        label: 'Cancelar',
      },
    },
    default: 'login',
  }).render(true);
}

// ── Utils ──────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
