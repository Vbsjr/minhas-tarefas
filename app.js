const CHAVE = 'minhas-tarefas-v1';
let tarefas = [];
try {
  const salvas = JSON.parse(localStorage.getItem(CHAVE));
  if (Array.isArray(salvas)) tarefas = salvas;
} catch (e) { tarefas = []; }

const $ = id => document.getElementById(id);

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(tarefas)); } catch (e) {}
}

function render() {
  const lista = $('lista');
  lista.innerHTML = '';
  tarefas.forEach(t => {
    const li = document.createElement('li');
    if (t.feita) li.className = 'done';

    const btnCheck = document.createElement('button');
    btnCheck.className = 'check';
    btnCheck.textContent = t.feita ? '✓' : '';
    btnCheck.setAttribute('aria-label', 'Marcar como concluída');
    btnCheck.onclick = () => alternar(t.id);

    const texto = document.createElement('span');
    texto.className = 'text';
    texto.textContent = t.texto;

    const btnDel = document.createElement('button');
    btnDel.className = 'del';
    btnDel.textContent = 'Excluir';
    btnDel.onclick = () => excluir(t.id);

    li.append(btnCheck, texto, btnDel);
    lista.appendChild(li);
  });
  const concluidas = tarefas.filter(t => t.feita).length;
  $('pend').textContent = tarefas.length - concluidas;
  $('conc').textContent = concluidas;
  $('vazio').style.display = tarefas.length ? 'none' : 'block';
}

function adicionar(texto) {
  tarefas.unshift({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), texto: texto, feita: false });
  salvar();
  render();
}

function alternar(id) {
  const t = tarefas.find(x => x.id === id);
  if (t) { t.feita = !t.feita; salvar(); render(); }
}

function excluir(id) {
  tarefas = tarefas.filter(x => x.id !== id);
  salvar();
  render();
}

$('form').addEventListener('submit', e => {
  e.preventDefault();
  const texto = $('input').value.trim();
  if (!texto) { $('input').focus(); return; }
  adicionar(texto);
  $('input').value = '';
  $('input').focus();
});

$('limpar').addEventListener('click', () => {
  if (!tarefas.some(t => t.feita)) return;
  if (confirm('Apagar todas as tarefas concluídas?')) {
    tarefas = tarefas.filter(t => !t.feita);
    salvar();
    render();
  }
});

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}
