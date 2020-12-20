(function() {
    const form = document.forms.date;
    const clock = document.querySelector('#clock');
    let oldTime;
    let timer;
    // adds 0 to dates/hours which are < 10
    function transformDate(h) {
        let newH = '';

        if (h < 10) {
            newH = '0'+h;
        }
        
        else {
            newH = h;
        }
        return String(newH)
    }

    function getNow() {
        const date = new Date();
        const today = `${date.getFullYear()}-${transformDate(date.getMonth()+1)}-${transformDate(date.getDate())}T${transformDate(date.getHours())}:${transformDate(date.getMinutes())}:${transformDate(date.getSeconds())}`;
        return today
    }

    // DO SECOND FUNCTION WHICH WILL SUPPORT CLONE AND NORMAL NODE!
    function animateTransition(e, remove) { 
        let velocity = parseInt(e.style.top);
        e.id = `animated-${e.id}`;
        let animation = setInterval(function() {
            if (velocity <= -200) {
                clearInterval(animation);
                e.remove()
                return
            }
            move();
        }, 30);
        function move() {
            velocity -= 3;
            e.style.top = `${velocity}px`;
        }
    }

    //I'm sure that this can be done 10x times better
    function countTime(value) {
        const now = new Date(getNow());
        const date = new Date(value);
        const difference = date-now;
        const weeks = Math.floor(difference / (1000*3600*24*7));
        const days = Math.floor((difference % (1000*3600*24*7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const time = new Map([['weeks', weeks], ['days', days], ['hours', hours], ['minutes', minutes], ['seconds', seconds]]);
        if (weeks >= 0 && days >= 0 && minutes >= 0 && seconds >= 0 && hours >= 0) {
            const node = document.querySelector('.time');
            if (!node) {

                for (let entity of time) {
                    let timeElement = document.createElement('div');
                    timeElement.className = 'time';
                    timeElement.id = `${entity[0]}-box`;
                    clock.appendChild(timeElement);
                    oldTime = new Map();
                }
            }
            for (let entity of time){
                if (oldTime.get(entity[0]) != entity[1]) {
                    if (document.querySelector(`#${entity[0]}`)){
                        let previousElement = document.querySelector(`#${entity[0]}`);
                        if (previousElement.classList.contains('content')) {
                            console.log(previousElement);
                            previousElement.className = 'animate';
                        }
                    }
                    let timeContent = document.createElement('div');
                    let box = document.querySelector(`#${entity[0]}-box`);
                    timeContent.innerHTML = `${transformDate(entity[1])}`;
                    timeContent.id = entity[0];
                    timeContent.style.top = '75px';
                    timeContent.className = 'content';
                    box.appendChild(timeContent);
                }
            }
            
                    /*clock.appendChild(timeElement);
                    let timeContent = document.createElement('div')
                    timeContent.innerHTML = `${transformDate(entity[1])}`;
                    timeContent.className = 'content animate'
                    timeContent.style.top = '0px';
                    timeContent.id = entity[0];
                    timeElement.id = `${entity[0]}-box`;
                    timeElement.appendChild(timeContent);*/
                /*for (let entity of time) {
                    if (oldTime.get(entity[0]) != entity[1]) {
                        let timeBit = document.querySelector(`#${entity[0]}`);
                        let nextTimeElement = document.createElement('div');
                        nextTimeElement.innerHTML = `${transformDate(entity[1])}`;
                        nextTimeElement.id = entity[0];
                        nextTimeElement.className = `content`;
                        nextTimeElement.style.top = '85px';
                        animateTransition(nextTimeElement, true);
                        document.querySelector(`#${entity[0]}-box`).append(nextTimeElement);
                    }
                }*/
                oldTime = new Map(time);

        }
        if (weeks == 0 && days == 0 && minutes == 0 && seconds == 0 && hours == 0) {
            localStorage.removeItem('date');
            clock.innerHTML = '';
        }
    }
    window.addEventListener('animationend', () => {
        if (document.querySelector('.content')) {
            let animatedElement = document.querySelectorAll('.content');
            for (el of animatedElement) {
                el.style.top = '0px';
            }
        }
        if (document.querySelector('.animate')){
            let secondAnimation = document.querySelector('.animate');
            secondAnimation.style.top = '-75px';
            secondAnimation.remove();
        }
    });
    form.button.addEventListener('click', () => {
        const date = form.datetime.value;
        if (!localStorage.getItem('date')) {
            localStorage.setItem('date', date);
            timer = setInterval(() => countTime(date), 500);
        } else {
            localStorage.removeItem('date');
            localStorage.setItem('date', date);
            clearInterval(timer);
            timer = setInterval(() => countTime(date), 500);

        }
    });
    window.addEventListener('load', () => {
        const date = localStorage.getItem('date');
        if (localStorage.getItem('date') != null) {
            form.datetime.value = date;
            clearInterval(timer);
            timer = setInterval(() => countTime(date), 500);
        } 
    });
})()