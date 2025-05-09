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