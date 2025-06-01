class elemConstructor {

    /**
     * 
     * @param {String} tag 
     */
    constructor(tag) {
        if (tag) {
            this.elem = document.createElement(tag);
        }
    }

    setTag(tag) {
        this.elem = document.createElement(tag);
        return this;
    }

    /**
     * 
     * @param {{
     * key: property,
     * key2: property2,
     * }} options 
     * @returns self
     */
    setOptions(options) {
        for (let key in options) {
            this.elem[key] = options[key];
        }
        return this;
    }

    /**
     * 
     * @param {{
     * key: property,
    *  key2: property2,
    * }} styles 
     * @returns self
     */
    setStyles(styles) {
        for (let key in styles) {
            this.elem.style[key] = styles[key];
        }
        return this;
    }

    appendAsChildOf(parent) {
        parent.appendChild(this.elem);
        return this;
    }

}

class abstractElemCollection extends elemConstructor {

    constructor() {
        if (new.target === abstractElemCollection) throw new ErrorEvent("This class cannot be instantiated");
        super();

    }

    constructFromTemplate(template, parent) {

        const { tag, options, styles } = template.data;
        const newEle = new elemConstructor(tag)
            .setOptions(options)
            .setStyles(styles);
        newEle.appendAsChildOf(parent);
        template.children.forEach((ct) => {
            this.constructFromTemplate(ct, newEle.elem);
        });

    }

    addEvent({
        eventType: type,
        eventTarget: target,
        eventFunction: func }) {


        target.addEventListener(type, (e) => func(e, type, target));
        if (this.properties) {
            console.log(`${this.properties.name} added event listener ${type}`);
        }
        return this;

    }

    /**
     * 
     * @param {fnName: String,
    * sender: HTMLElement,
    * type: String,
    * options: Object,
    * } param0 
    * @returns 
    */
    addAction({ fnName, sender, type }) {

        Object.defineProperty(this, fnName, {
            value: function (dataObj) {
                const options = { detail: {} };

                for (let key in dataObj) {
                    options.detail[key] = dataObj[key];
                }
                options.bubbles = true;
                const newAction = new CustomEvent(type, options);
                sender.dispatchEvent(newAction);
            },
            writable: false,
            enumerable: false,
            configurable: false,
        });

        if (this.property) {
            console.log(`${this.property.name}`)
        }
        return this;
    }

    build(hook) {
        const t = this.constructorTemplate();
        const { tag, options, styles } = t.data;
        this.setTag(tag)
            .setOptions(options)
            .setStyles(styles);

        t.children.forEach((ct) => {
            this.constructFromTemplate(ct, this.elem);
        });
        if (hook) {
            this.appendAsChildOf(hook);
        }
        this.eventConstructor();
        this.actionConstructor();




        return this;
    }

    //need to implement these methods in decendant class.
    eventConstructor() {
        throw new ErrorEvent("This is an abstract method");

        /* Example Event

        // for each event you want your collection to handle,
        // make an event handler object

        const myEvent = {
            eventType: 'click',
            eventTarget: this.elem.children[0],
            eventFunction: function (event, type, target) {
                if (event.target === target && event.type === type) {
                    console.log("The event happened!");
                }
            },
        };
        const myEvent2 = {
            eventType: 'mycustomevent',
            eventTarget: this.elem,
            eventFunction: function (event, type, target) {
                if (event.target === target && event.type === type) {
                    console.log(event.detail.message);
                }
            },
        };

        // pass your event handler object to add event

        this.addEvent(myEvent);
        this.addEvent(myEvent2);
        */
    }

    actionConstructor() {

        throw new ErrorEvent("This is an Abstract method");

        /* Example Action

        // throw new ErrorEvent("This is an Abstract method");

        //make action constructor object

        const myAction = {
            fnName: "sayHello",
            sender: this.elem,
            type: "mycustomevent",

            //inside options.detail you can pass your custom information
            //and will be the variable required when you call the function.
            options: {detail: ""},
        };

        //add your custom event

        this.addAction(myAction);

        */

    }

    constructorTemplate() {

        throw new ErrorEvent("This is an Abstract method");

        //create any templates for elements

        // const root = {
        //     tag: 'div',
        //     options: { innerText: "Hello, World!" },
        //     styles: { color: "black" },
        // };

        // const child = {
        //     tag: 'h1',
        //     options: {innerText: "Hello again!"},
        //     styles: {border: "2px solid black"},
        // };

        //add root and any children to template tree how you want them organized
        //as html tags.

        // const template = new tree(root);
        // template.addChild(child);

        //return the template

        // return template;

    }
}