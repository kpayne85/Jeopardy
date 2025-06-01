function CEBTFactory() {

    /**
     * 
     * @param {{
    * type: String,
    * text: String,
    * id: String,
    * classList: String,
    * actions: [{event: String, func: function, target: HTMLElement}],
    * appTarget: HTMLElement,
    * appRelation: String,
    * styles: [{prop: String, val: String}],}} propObj 
    * @returns 
    */
    const CEBT = function ({
        type,
        text,
        id,
        classList,
        appTarget,
        appRelation,
        actions,
        styles
    }) {

        //type, text, append, actions
        if (type) {
            const ele = document.createElement(type);
            if (text) ele.innerText = text;
            if (actions) {
                actions.forEach((a) => {
                    ele.addEventListener(a.event, function (e) {
                        e.preventDefault();
                        console.log(e);
                        a.func(e);
                        // if (e.type === a.event && ele === e.target) {
                        //     a.func(e, ele);
                        // }
                    });
                })
            }
            if (id) ele.id = id;
            if (classList) ele.classList = classList;
            if (styles) {
                styles.forEach((style) => {
                    ele.style[style.prop] = style.val;
                });
            }

            if (appTarget) {
                switch (appRelation) {
                    case 'last child':
                        appTarget.appendChild(ele);
                        break;
                    default:
                }
            }
            return ele;
        }
    }
    return CEBT;
}

const createElementBT = CEBTFactory();