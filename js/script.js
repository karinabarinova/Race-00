let calculate = (a, op, b) => {
    let firstNum = parseFloat(a);
    let secondNum = parseFloat(b);
    if (op === 'add') return firstNum + secondNum
    if (op === 'subtract') return firstNum - secondNum
    if (op === 'multiply') return firstNum * secondNum
    if (op === 'divide') return firstNum / secondNum
    if (op === 'percent') return firstNum * secondNum / 100;
    if (op = 'sign') return firstNum * secondNum;
}

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

const getKeyType = key => {
    const { action } = key.dataset;
    if (!action) 
        return 'number';
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide' || 
      action === 'percent' ||
      action === 'sign')
        return 'operator';
    return action;
}

let createResult = (key, displayedNum, state) => {
    const keyContent = key.textContent;
    const keyType = getKeyType(key);
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = state;
  
    if (keyType === 'number') {
      return displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
        ? keyContent
        : displayedNum + keyContent;
    }
  
    if (keyType === 'decimal') {
      if (!displayedNum.includes('.')) 
        return displayedNum + '.';
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') 
        return '0.';
      return displayedNum;
    }
  
    if (keyType === 'operator') {
        if (key.dataset.action === "sign")
            return calculate(displayedNum, "sign", "-1");
        return firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
        ? calculate(firstValue, operator, displayedNum)
        : displayedNum;
    }
  
    if (keyType === 'clear') 
        return 0;
  
    if (keyType === 'calculate') {
      return firstValue
        ? previousKeyType === 'calculate'
          ? calculate(displayedNum, operator, modValue)
          : calculate(firstValue, operator, displayedNum)
        : displayedNum;
    }
}

keys.addEventListener("click", e => {
    if (!e.target.matches("button"))
        return;
    const key = e.target;
    const numOnDisplay = display.textContent;
    const resultStr = createResult(key, numOnDisplay, calculator.dataset);
    display.textContent = resultStr;
    updateCalculatorState(key, calculator, resultStr, numOnDisplay);
    updateVisualState(key, calculator);
});

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = calculator.dataset;
  
    calculator.dataset.previousKeyType = keyType;
  
    if (keyType === 'operator') {
      calculator.dataset.operator = key.dataset.action;
      calculator.dataset.firstValue = firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
        ? calculatedValue
        : displayedNum;
    }
  
    if (keyType === 'calculate') {
      calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
        ? modValue
        : displayedNum;
    }
  
    if (keyType === 'clear' && key.textContent === 'AC') {
      calculator.dataset.firstValue = '';
      calculator.dataset.modValue = '';
      calculator.dataset.operator = '';
      calculator.dataset.previousKeyType = '';
    }
}
  
const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('pressed'));
  
    if (keyType === 'operator') key.classList.add('pressed');
    if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC';
    if (keyType !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]');
      clearButton.textContent = 'CE';
    }
}
