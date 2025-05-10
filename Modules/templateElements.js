function builder(template, parent) {
    const thisElement = createElementBT({
        ...template.data,
        appTarget: parent,
        appRelation: 'last child',

    });
    parent.appendChild(thisElement);
    template.children.forEach((child) => {
        builder(child, thisElement);
    });
    return thisElement;
}


/*
================================================================================
Game Area
================================================================================
*/
function gameAreaFactory() {
    const gameArea = {
        type: 'div',
        id: 'app',
    };
    const template = new forrest(gameArea);
    const gameAreaBuilder = function (parent) {
        return builder(template, parent);
    }
    return gameAreaBuilder;
}

/*
================================================================================
End Game Area
================================================================================
*/


/*
================================================================================
start page elements
================================================================================
*/

function startPageFactory() {
    const btnAction = function (e) {
        e.preventDefault();
        const name = document.getElementById('start-name-input').value;
        alert("You entered: \n" + name);

    };
    const window = {
        type: 'div',
        id: 'start-window',
    };
    const title = {
        type: 'h1',
        id: 'start-window-title',
        text: 'Welcome to Jeopardy!',
    };
    const directions = {
        type: 'p',
        id: 'start-window-directions',
        text: 'Please input your name below.',
    };
    const startForm = {
        type: 'form',
        id: 'start-form',
    };
    const nameInput = {
        type: 'input',
        id: 'start-name-input',
    };
    const playBtn = {
        type: 'button',
        id: 'start-submit',
        text: 'Play',
        actions: [{ event: 'click', func: btnAction }],
    };
    const template = new forrest(window);
    template
        .addChild(title)
        .addChild(directions)
        .addChild(startForm);
    template.children[2] //startForm
        .addChild(nameInput)
        .addChild(playBtn);
    const startPageBuilder = function (parent) {
        return builder(template, parent);
    }
    return startPageBuilder;

}

/*
================================================================================
End start page elements
================================================================================
*/

/*
================================================================================
start question
================================================================================
*/
function questionFactory() {
    const question = {
        type: 'div',
        classList: 'question',
    };
    const questionInner = {
        type: 'div',
        classList: 'question-inner',
    };
    const questionFront = {
        type: 'div',
        classList: 'question-front',
    };
    const questionValue = {
        type: 'p',
        classList: 'question-value',
    };
    const questionBack = {
        type: 'div',
        classList: 'question-back',
    };
    const questionDisplay = {
        type: 'div',
        classList: 'question-display',
    };
    const questionText = {
        type: 'p',
        classList: 'question-text',
    };
    const questionInput = {
        type: 'input',
        classList: 'question-input',
    };

    const template = new forrest(question);
    template.addChild(questionInner);
    template.children[0] //question inner
        .addChild(questionFront)
        .addChild(questionBack);
    template.children[0].children[0] //question front
        .addChild(questionValue);
    template.children[0].children[1] //question back
        .addChild(questionDisplay)
        .addChild(questionInput);
    template.children[0].children[1].children[0] //question display
        .addChild(questionText);
    const questionBuilder = function (parent) {
        return builder(template, parent);
    };
    return questionBuilder;
}

const questionBuilder = questionFactory();
class question {
    constructor(parent) {
        this.questionRoot = questionBuilder(parent);
        this.valueLink = this.questionRoot
            .children[0].children[0].children[0];
        this.promptLink = this.questionRoot
            .children[0].children[1].children[0].children[0];
        this.inputLink = this.questionRoot
            .children[0].children[1].children[1];
        this.innerLink = this.questionRoot.children[0];
    }
    setValue(val) {
        this.valueLink.innerText = val;
        return this;
    }
    setPrompt(prompt) {
        this.promptLink.innerText = prompt;
        return this;
    }
    setAnswer(ans) {
        this.answer = ans;
        return this;
    }
    setPosition({ column = 1, row = 0 }) {
        switch (column) {
            case 1:
                this.innerLink.classList.add('first-column');
                break;

            case 2:
                this.innerLink.classList.add('second-column');
                break;

            case 3:
                this.innerLink.classList.add('third-column');
                break;

            case 4:
                this.innerLink.classList.add('fourth-column');
                break;

            case 5:
                this.innerLink.classList.add('fifth-column');
                break;

            case 6:
                this.innerLink.classList.add('sixth-column');
                break;
            default:
        }

        switch (row) {
            case 1:
                this.innerLink.classList.add('first-row');
                break;

            case 2:
                this.innerLink.classList.add('second-row');
                break;

            case 3:
                this.innerLink.classList.add('third-row');
                break;

            case 4:
                this.innerLink.classList.add('fourth-row');
                break;

            case 5:
                this.innerLink.classList.add('fifth-row');
                break;

            case 0:
                this.innerLink.classList.add('title-row');
                break;
            default:
        }

        return this;

    }
}


/*
================================================================================
start catagory
================================================================================
*/


/*
================================================================================
start game board
================================================================================
*/
function gameBoardFactory() {




    const template = new forrest(/* first element*/);
    //add all the elements of template
    const gameBoardBuilder = function (parent) {
        return builder(template, parent);
    };
    return gameBoardBuilder;
}
/*
================================================================================
start game board
================================================================================
*/