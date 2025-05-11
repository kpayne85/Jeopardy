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


    const template = new forrest(question);
    template.addChild(questionInner);
    template.children[0] //question inner
        .addChild(questionFront)
        .addChild(questionBack);
    template.children[0].children[0] //question front
        .addChild(questionValue);
    template.children[0].children[1] //question back
        .addChild(questionDisplay);
    template.children[0].children[1].children[0] //question display
        .addChild(questionText);
    const questionBuilder = function (parent) {
        return builder(template, parent);
    };
    return questionBuilder;
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