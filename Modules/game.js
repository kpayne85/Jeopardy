class game {
    constructor(parent) {
        this.parent = parent;
        this.root = this.#buildLayout();
        this.boardHook = this.root.children[0].children[0];
        this.gameBoard = new board(this.boardHook, 'test');
        this.chatHook = this.root.children[0].children[1].children[1];
        this.gameChat = new chat(this.chatHook);
        this.root.addEventListener('chatPost', this);
        this.root.addEventListener('click', this);
        this.hostHook = document.getElementById("host-hook");
        this.gameHost = new host(this.hostHook, this.gameChat, this.gameBoard);
    }

    #getLayout() {
        const root = {
            type: 'div',
            id: 'game-root',
        };
        const upper = {
            type: 'div',
            id: 'game-upper',
        };
        const lower = {
            type: 'div',
            id: 'game-lower',
        };
        const boardHook = {
            type: 'div',
            id: 'board-hook',
        };
        const rightPannel = {
            type: 'div',
            id: 'right-pannel',
        };
        const hostHook = {
            type: 'div',
            id: 'host-hook',
        };
        const chatHook = {
            type: 'div',
            id: 'chat-hook',
        };
        const contestOneHook = {
            type: 'div',
            id: 'c-one-hook',
            classList: "contestant",
        };
        const contestTwoHook = {
            type: 'div',
            id: 'c-two-hook',
            classList: "contestant",
        };
        const contestThreeHook = {
            type: 'div',
            id: 'c-three-hook',
            classList: "contestant",
        };

        const template = new forrest(root);
        template
            .addChild(upper)
            .addChild(lower);
        template.children[0]    //upper
            .addChild(boardHook)
            .addChild(rightPannel);
        template.children[1]    //lower
            .addChild(contestOneHook)
            .addChild(contestTwoHook)
            .addChild(contestThreeHook);
        template.children[0].children[1]    //rightPannel
            .addChild(hostHook)
            .addChild(chatHook);

        return template;
    }

    #buildLayout() {
        return builder(this.#getLayout(), this.parent);
    }

    handleEvent(e) {
        if (e.type === 'chatPost') {
            this.chatPostEvent(e);
        }
        if (e.type === 'click') {
            //get the question value
            const val = e.target.firstElementChild.innerText;
            //get the catagory
            console.log(e.target.parentElement.parentElement)
            let titlecard = e.target.parentElement.parentElement;
            console.log(titlecard);
            for (let i = 0; i < 6; i++) {
                titlecard = titlecard.previousElementSibling;
                if (titlecard.firstElementChild.classList.contains("title-element")) break;

            }
            const cat = titlecard.firstElementChild.firstElementChild.innerText;
            //Post the message
            const phrase = `I would like ${cat} for ${val}, please.`;
            this.gameChat.post({ who: 'player', said: phrase });
            this.gameChat.input.focus();

        }
    }

    chatPostEvent(e) {
        this.gameHost.chatPostEvent(e);

    }
}