(function () {
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');

  let current = '0';
  let previous = null;
  let operator = null;
  let justEvaluated = false;

  const OPS = { '+': (a, b) => a + b, '-': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };

  function formatNumber(n) {
    if (!isFinite(n)) return 'Error';
    const str = n.toString();
    if (str.length > 12) {
      return Number(n.toPrecision(10)).toString();
    }
    return str;
  }

  function render() {
    resultEl.classList.remove('error');
    resultEl.textContent = current === 'Error' ? 'Error' : formatNumber(parseFloat(current));
    if (current === 'Error') resultEl.classList.add('error');

    if (operator && previous !== null) {
      expressionEl.textContent = `${formatNumber(previous)} ${operator}`;
    } else {
      expressionEl.innerHTML = '&nbsp;';
    }
  }

  function inputDigit(d) {
    if (current === 'Error' || justEvaluated) {
      current = d;
      justEvaluated = false;
    } else if (current === '0') {
      current = d;
    } else {
      current += d;
    }
    render();
  }

  function inputDecimal() {
    if (current === 'Error' || justEvaluated) {
      current = '0.';
      justEvaluated = false;
    } else if (!current.includes('.')) {
      current += '.';
    }
    render();
  }

  function setOperator(op) {
    if (current === 'Error') return;
    if (operator && !justEvaluated) {
      evaluate();
    }
    previous = parseFloat(current);
    operator = op;
    justEvaluated = true;
    render();
  }

  function evaluate() {
    if (operator === null || previous === null || current === 'Error') return;
    const a = previous;
    const b = parseFloat(current);
    const r = OPS[operator](a, b);
    current = (!isFinite(r)) ? 'Error' : r.toString();
    operator = null;
    previous = null;
    justEvaluated = true;
    render();
  }

  function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    justEvaluated = false;
    render();
  }

  function negate() {
    if (current === 'Error') return;
    current = (parseFloat(current) * -1).toString();
    render();
  }

  function percent() {
    if (current === 'Error') return;
    current = (parseFloat(current) / 100).toString();
    render();
  }

  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      if (action === 'digit') inputDigit(value);
      else if (action === 'decimal') inputDecimal();
      else if (action === 'operator') setOperator(value);
      else if (action === 'equals') evaluate();
      else if (action === 'clear') clearAll();
      else if (action === 'negate') negate();
      else if (action === 'percent') percent();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') setOperator('+');
    else if (e.key === '-') setOperator('-');
    else if (e.key === '*') setOperator('×');
    else if (e.key === '/') { e.preventDefault(); setOperator('÷'); }
    else if (e.key === 'Enter' || e.key === '=') evaluate();
    else if (e.key === 'Escape') clearAll();
    else if (e.key === 'Backspace') {
      if (current.length > 1) current = current.slice(0, -1);
      else current = '0';
      render();
    }
  });

  render();
})();