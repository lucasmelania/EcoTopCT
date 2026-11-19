document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const navLinks = document.querySelector('.nav-links');
  const year = document.getElementById('current-year');

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  function closeMenu() {
    if (!menuButton || !navLinks) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    navLinks.classList.remove('is-open');
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  year.textContent = new Date().getFullYear();

  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
    navLinks.classList.toggle('is-open', opening);
  });

  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const materialInfo = {
    reciclaveis: {
      symbol: '♻', label: 'Papel, plástico, vidro e metal', title: 'Separe os recicláveis',
      text: 'Mantenha papel, plástico, vidro e metal separados dos orgânicos. Assim, o material pode seguir para a coleta seletiva e a reciclagem.',
      tip: 'Procure informações de coleta seletiva com associações, ONGs ou órgãos públicos da sua região.'
    },
    organicos: {
      symbol: '⌁', label: 'Restos de alimentos e materiais orgânicos', title: 'Dê atenção aos orgânicos',
      text: 'Separe os resíduos orgânicos dos recicláveis. Sempre que for possível para sua rotina, considere encaminhá-los para a compostagem.',
      tip: 'A compostagem é uma forma de aproveitar resíduos orgânicos e reduzir o volume destinado ao lixo.'
    },
    cortantes: {
      symbol: '✦', label: 'Vidros quebrados e objetos que cortam', title: 'Proteja quem coleta',
      text: 'Antes do descarte, embale vidros quebrados e objetos cortantes em um recipiente firme e sinalize o conteúdo.',
      tip: 'O cuidado na embalagem ajuda a evitar cortes e acidentes com garis, coletores e outras pessoas.'
    },
    outros: {
      symbol: '↗', label: 'Itens que pedem orientação específica', title: 'Busque o destino adequado',
      text: 'Para materiais e resíduos que não entram na sua coleta habitual, procure orientação antes de descartar.',
      tip: 'ONGs, associações e órgãos públicos podem informar a maneira mais adequada de entregar esses itens.'
    }
  };

  const result = {
    symbol: document.getElementById('result-symbol'), label: document.getElementById('result-label'),
    title: document.getElementById('result-title'), text: document.getElementById('result-text'), tip: document.getElementById('result-tip')
  };

  document.querySelectorAll('.material-button').forEach((button) => {
    button.addEventListener('click', () => {
      const info = materialInfo[button.dataset.material];
      document.querySelectorAll('.material-button').forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      result.symbol.textContent = info.symbol;
      result.label.textContent = info.label;
      result.title.textContent = info.title;
      result.text.textContent = info.text;
      result.tip.textContent = info.tip;
    });
  });

  const habits = document.querySelectorAll('[data-habit]');
  const progressMessage = document.getElementById('progress-message');
  const storageKey = 'ecotopct-habits';
  let savedHabits = {};

  try { savedHabits = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { savedHabits = {}; }
  habits.forEach((habit) => { habit.checked = Boolean(savedHabits[habit.dataset.habit]); });

  function updateProgress() {
    const complete = [...habits].filter((habit) => habit.checked).length;
    const messages = [
      'Escolha uma ação para começar.',
      'Bom começo: uma atitude já faz diferença.',
      'Você está transformando intenção em cuidado.',
      'Quase lá: compartilhe esses hábitos com a sua rede.',
      'Todas as ações marcadas. O território agradece!'
    ];
    progressMessage.textContent = messages[complete];
    const values = Object.fromEntries([...habits].map((habit) => [habit.dataset.habit, habit.checked]));
    try { localStorage.setItem(storageKey, JSON.stringify(values)); } catch { /* progresso continua na página */ }
  }

  habits.forEach((habit) => habit.addEventListener('change', updateProgress));
  updateProgress();

  const copyButton = document.querySelector('.copy-button');
  const copyFeedback = document.getElementById('copy-feedback');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copyText);
      copyFeedback.textContent = 'Mensagem copiada. Agora é só compartilhar com a sua rede.';
    } catch {
      copyFeedback.textContent = 'Não foi possível copiar automaticamente. Selecione a mensagem e compartilhe com a sua rede.';
    }
  });
});
