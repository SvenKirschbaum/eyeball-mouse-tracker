window.customElements.define('eyeball-mouse-tracker', class EyeballMouseTracker extends HTMLElement {

    static IMAGE_PATH = import.meta.url.substring(0, import.meta.url.lastIndexOf('/')) + "/rick-and-morty.png";

    static EYE_POSITIONS = [
        [31, 68.5],
        [45.5, 66],
        [63, 37.5],
        [77, 36.5]
    ];

    static EYE_SIZE = "8%";

    static CSS_STYLE = `
        :host {
            display: flex;
            position: relative;       
        }
        
        img {
            width: 100%;
            height: 100%;        
        }
        
        .eye {
            position: absolute;
            width: ${EyeballMouseTracker.EYE_SIZE};
            height: ${EyeballMouseTracker.EYE_SIZE};
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin: 0;
            // background-color: red;
        }
        
        .eye::before {
            display: block;
            content: '';
            box-sizing: border-box;
            border-radius: 100%;
            border: solid black;
            border-width: 1px;
            background-color: black;
            width: 25%;
            height: 25%;
        
        }
    `;

    eyes = [];

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'closed'});

        const img = document.createElement('img');
        img.setAttribute('src', EyeballMouseTracker.IMAGE_PATH);
        img.setAttribute('alt', 'Rick and Morty');
        shadow.appendChild(img);

        const style = document.createElement('style');
        style.textContent = EyeballMouseTracker.CSS_STYLE;
        shadow.appendChild(style);

        this.eyes = EyeballMouseTracker.EYE_POSITIONS.map(([x, y]) => {
            const eye = document.createElement('div');
            eye.classList.add('eye');
            shadow.appendChild(eye);

            eye.style.left = `calc(${x}% - ${EyeballMouseTracker.EYE_SIZE}/2)`;
            eye.style.top = `calc(${y}% - ${EyeballMouseTracker.EYE_SIZE}/2)`;

            return eye;
        });

        document.addEventListener('mousemove', (e) => this.updateTransform(e) )
        document.addEventListener('touchmove', (e) => this.updateTransform(e.touches[0]) )
    }

    updateTransform(event) {
        const eyeTransform = [];
        if(this.attributes.getNamedItem("flipX")) eyeTransform.push("scaleX(-1)");
        if(this.attributes.getNamedItem("flipY")) eyeTransform.push("scaleY(-1)");

        this.eyes.forEach((eye) => {
            const rect = eye.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            const rotation = Math.atan2(y, x);

            eye.style.transform = `${eyeTransform.join(" ")} rotate(${rotation}rad)`;
        });
    }

});
