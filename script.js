const display = document.querySelector(".display");

let hasDot = false; //this indicates if the text has a dot already

const numbersButton = [...document.getElementsByClassName("number")];//getting all the  number btn in array

//getting all the operator in the array
const operatorButtons = [...document.getElementsByClassName("operator")];

//.... function to handle number button click.....

const handleNumberClick = (event) => {
  if (display.innerHTML === "0") {
    display.innerHTML = "";
    display.innerHTML = event.target.innerHTML;
  } else {
    display.innerHTML += event.target.innerHTML;
  }
};

//.... function to handle operator exluding '-' button click.....

const handleOperatorClick = (event) => {
  const lastChar = display.innerHTML.slice(-1);
  if (!["+", "-", "/", "*", "("].includes(lastChar)) {
    if (display.innerHTML !== "0") {
      display.innerHTML += event.target.innerHTML;
      hasDot = false;
    }
  }
};
//.... section to handle '-' operator button click.....\

const handleSubstract = (e) => {
  const lastChar = display.innerHTML.slice(-1);
  if (!["+", "-", "/", "*"].includes(lastChar)) {
    if (display.innerHTML === "0") {
      display.innerHTML = "";
    }
    display.innerHTML += e.target.innerHTML;
    hasDot = false;
  }
};
document
  .querySelector(".min--operator")
  .addEventListener("click", handleSubstract);

//.... function to handle dot button click.....

const handleDotClick = (event) => {
  if (!hasDot) {
    hasDot = true;
    display.innerHTML += event.target.innerHTML;
  }
};

// adding event listener to all number operatorButtons.
numbersButton.map((button) => {
  button.addEventListener("click", handleNumberClick);
});

// adding event listener to all operator operatorButtons.

operatorButtons.map((button) => {
  button.addEventListener("click", handleOperatorClick);
});

// adding event listener to dot operatorButtons.
const dot = document.querySelector(".dot");

dot.addEventListener("click", handleDotClick);

// .....script to handle parenthesis........

let open = 0;
let close = 0;


//function to handle open prenthesis
const handleOpenParClick = (e) => {
  if (display.innerHTML === "0") {
    display.innerHTML = "";
  }

  open += 1;
  display.innerHTML += e.target.innerHTML;
};

//function to handle close prenthesis
const handleCloseParClick = (e) => {
  if (close < open) {
    if (!["+", "-", "/", "*"].includes(display.innerHTML.slice(-1))) {
      close += 1;

      display.innerHTML += e.target.innerHTML;
    }
  }
};

document
  .querySelector(".open--parenthesis")
  .addEventListener("click", handleOpenParClick);

document
  .querySelector(".close--parenthesis")
  .addEventListener("click", handleCloseParClick);

// .....script to handle delete and AC........
const handleDelete = (e) => {
  if (display.innerHTML !== "0") {
    let n = display.innerHTML.length;
    display.innerHTML = display.innerHTML.slice(0, n - 1);
    if (display.innerHTML.length === 0) {
      display.innerHTML = "0";
    }
  }
};


const handleAc = () => {
    display.innerHTML = "0"; 
    hasDot = false; 
    open = 0;
    close = 0;
  };


document.querySelector(".delete").addEventListener("click", handleDelete);
document.querySelector(".ac").addEventListener("click", handleAc);


// .....script to evaluate expression or handle equal"="" 
class Node {
    constructor(value = null, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

// Class for handling the Arithmetic Expression Tree construction
class ArithmeticExpressionTree {
    constructor() {
        this.stack = [];  // Stack to hold nodes during parsing
    }

    buildTree(expr) {
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
        let operators = [];
        let operands = [];

        for (let i = 0; i < expr.length; i++) {
            let c = expr[i];

            // Handle numbers (including decimals)
            if (/\d/.test(c)) {
                let num = '';
                while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
                    num += expr[i];
                    i++;
                }
                operands.push(new Node(num));  // Push number node
                i--;  // Adjust for extra increment
            }
            // Handle left parenthesis
            else if (c === '(') {
                operators.push(c);
            }
            // Handle right parenthesis
            else if (c === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                    let operator = operators.pop();
                    let right = operands.pop();
                    let left = operands.pop();
                    operands.push(new Node(operator, left, right));
                }
                operators.pop();  // Pop '('
            }
            // Handle operators (+, -, *, /)
            else if (['+', '-', '*', '/'].includes(c)) {
                while (
                    operators.length && 
                    precedence[operators[operators.length - 1]] >= precedence[c]
                ) {
                    let operator = operators.pop();
                    let right = operands.pop();
                    let left = operands.pop();
                    operands.push(new Node(operator, left, right));
                }
                operators.push(c);
            }
        }

        // Process remaining operators
        while (operators.length) {
            let operator = operators.pop();
            let right = operands.pop();
            let left = operands.pop();
            operands.push(new Node(operator, left, right));
        }

        return operands.pop();  // Return the root of the tree
    }

    

    // Evaluate the expression tree
    evaluate(node) {
        if (!node.left && !node.right) {
            return parseFloat(node.value);  // Convert to float for decimal handling
        }

        let leftVal = this.evaluate(node.left);
        let rightVal = this.evaluate(node.right);

        switch (node.value) {
            case '+': return leftVal + rightVal;
            case '-': return leftVal - rightVal;
            case '*': return leftVal * rightVal;
            case '/': return leftVal / rightVal;
            default: return 0;
        }
    }
}

// Function to evaluate expression from display
const evaluateExpression = () => {
    const display = document.querySelector(".display");
    const expr = display.innerHTML.trim();

    // Check if the expression is empty
    if (!expr) {
        display.innerHTML = 'Error: Empty Expression';
        return;
    }

    try {
        // Construct the arithmetic expression tree
        const exprTree = new ArithmeticExpressionTree();
        const root = exprTree.buildTree(expr);

        // Evaluate the tree and display the result
        const result = exprTree.evaluate(root);
        display.innerHTML = result.toFixed(2);
    } catch (error) {
        // Handle any errors (invalid arithmetic expression)
        // display.innerHTML = 'Error: Invalid Expression';
    }
};

// Attach the evaluateExpression function to the equal button
document.querySelector(".equal").addEventListener("click", evaluateExpression);



// Adding keydown event to the buttons enables typing from keybord
//this will enable user to type from
//keyboard 

document.addEventListener("keydown", (event) => {
    let key = event.key;

    if (/\d/.test(key)) {  
        handleNumberClick({ target: { innerHTML: key } });
    } else if (["+", "*", "/"].includes(key)) { 
        handleOperatorClick({ target: { innerHTML: key } });
    } else if (key === "-") {  
        handleSubstract({ target: { innerHTML: key } });
    } else if (key === ".") {  
        handleDotClick({ target: { innerHTML: key } });
    } else if (key === "Backspace") { 
        handleDelete();
    } else if (key === "Enter" || key === "=") {  
        event.preventDefault();
        evaluateExpression();
    } else if (key === "Escape") {  
        handleAc();
    } else if (key === "(") {  
        handleOpenParClick({ target: { innerHTML: "(" } });
    } else if (key === ")") {  
        handleCloseParClick({ target: { innerHTML: ")" } });
    }
});

