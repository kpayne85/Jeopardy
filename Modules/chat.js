class chat {
    constructor(parent) {
        this.parent = parent;
        this.root = this.#buildLayout();
        this.history = this.root.children[0];
        this.input = this.root.children[1];
        this.#setupInput();
    }

    #getLayout() {
        const root = {
            type: 'div',
            id: 'chat-root',
        };
        const history = {
            type: 'div',
            id: 'chat-history',
        };
        const chatInput = {
            type: 'input',
            id: 'chat-input',
        };
        const template = new forrest(root);
        template.addChild(history).addChild(chatInput);
        return template;

    }
    #buildLayout() {
        return builder(this.#getLayout(), this.parent);
    }

    #setupInput() {
        this.input.addEventListener('keyup', this);
        this.input.placeholder = "Say: ";
    }

    handleEvent(e) {
        switch (e.type) {
            case 'keyup':
                if (e.target === this.input && e.key === 'Enter') this.#inputReturn();
                break;
            default:
        }
    }

    #inputReturn() {
        this.post({ who: "player", said: this.input.value });
        this.input.value = "";

    }

    post({ who, said }) {

        const postEvent = new CustomEvent('chatPost', { detail: { who, said }, bubbles: true })
        //TODO: send message posted event
        const post = `${who}: ${said}`;
        if (this.history.innerText !== "") {
            this.history.innerText = this.history.innerText + "\n";
        }
        this.history.innerText = this.history.innerText + post;
        this.history.scrollTop = this.history.scrollHeight;

        this.history.dispatchEvent(postEvent);

    }
}
