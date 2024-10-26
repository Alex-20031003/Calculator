const display = document.getElementById('input');
// const buttonBack = document.getElementById('backScape');
display.value = '0';


function setFocusAtEnd() {
    display.focus();

    display.selectionStart = display.selectionEnd = display.value.length;
}

function clearDisplay(){
    display.value = '0';
}

function appendToDisplay(input) {
    if (display.value === '0') {
        if (input === '.') {
            display.value = '0.';
        } else {
            display.value = input;
        }
    } else {
        // Сначала пытаемся заменить или добавить последний символ
        const symbolReplaced = changeLastSymbol(input);
        
        if (!symbolReplaced) {
            // Если символ не был заменён, тогда добавляем его
            const lastNumber = display.value.split(/[\+\-\/\*]/).pop();

            if (input === '.' && lastNumber.includes('.')) {
                return;  // Если в числе уже есть точка, не добавляем её снова
            }

            display.value += input;
        }
        setFocusAtEnd();
    }
}

function changeLastSymbol(input) {
    let inputValue = display.value;
    const lastSymbol = inputValue.slice(-1);
    const lastTwoSymbols = inputValue.slice(-2); 

    if (/[\+\-*/]{2}$/.test(lastTwoSymbols)) {
        if(input === '+' || input === '-' || input === '*' || input === '/'){
            return true;
        }
    }

    if ((lastSymbol === '/' || lastSymbol === '*') && input === '-') {
        display.value = inputValue + input;  // Добавляем минус после / или *
        return true;  // Символ был добавлен
    }

    if ((lastSymbol === '/' || lastSymbol === '*' || lastSymbol === '+' || lastSymbol === '-') && 
        (input === '+' || input === '-' || input === '*' || input === '/')) {
        display.value = inputValue.slice(0, -1) + input;  // Заменяем последний символ
        return true;
    }

    return false;
}

function calculation() {
    let inputValue = display.value;

    changeLastSymbol(input);

    inputValue = inputValue.replace(/(\d+(\.\d+)?)([%])/g, (match, number, dot, percent, offset, string) => {
        let operatorBefore = string[offset - 1];
        if (operatorBefore === '*' || operatorBefore === '/') {
            return (`${number} / 100`);
        } else {
            return (`${numberBefore(inputValue, offset)} * ${number} / 100`);
        }
    });

    if (/[+\-*/]$/.test(inputValue)) {
        display.value = 'Error';
        return;
    }

    try {
        display.value = eval(inputValue);
    } catch (error) {
        display.value = 'Error';
        console.log(error);
    }
}



function numberBefore(expression, percentIndex) {
    let slicedExpression = expression.slice(0, percentIndex);
    let numbers = slicedExpression.match(/\d+(\.\d+)?/g);

    if (numbers && numbers.length > 0) {
        return numbers[numbers.length - 1];
    }
    return 1;
}




function minusOrPlus() {
    if (display.value !== '0') {
        if (display.value.startsWith('-')) {
            display.value = display.value.substring(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter') {
        calculation();
    } else if (key === 'Backspace') {
        if (display.value.length > 1) {
            display.value = display.value.slice(0, -1);
        } else {
            display.value = '0';
        }
    } else if (key === 'Escape') {
        clearDisplay()
    } else if (key === '+' || key === '-' || key === 'x' || key === '÷') {
        appendToDisplay(key);
    } else if (key === 'ArrowUp') {
        minusOrPlus();
    }
});