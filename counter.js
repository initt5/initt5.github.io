(function() {
    const form = document.forms.date;
    const clockElement = document.querySelector('#clock');
    let oldTime = new Map();
    let timerInterval;
    function transformDate(date) {
        let changeDate = '';

        if (date < 10) {
            changeDate = '0'+date;
        }
        
        else {
            changeDate = date;
        }
        return String(changeDate);
    }

    function getNowDate() {
        const date = new Date();
        const nowDate = `${date.getFullYear()}-${transformDate(date.getMonth()+1)}-${transformDate(date.getDate())}T${transformDate(date.getHours())}:${transformDate(date.getMinutes())}:${transformDate(date.getSeconds())}`;
        return nowDate
    }
    function changeTime(entity) {
        let timeContent = document.createElement('span');
        let timeBox = document.querySelector(`#${entity[0]}-box`);
        timeContent.innerHTML = `${transformDate(entity[1])}`;
        timeContent.id = entity[0];
        timeContent.style.top = '75px';
        timeContent.className = 'content';
        if (entity[0] == 'weeks' && String(entity[1]).length > 2) {
            console.log(`${String(entity[1])}`)
            timeContent.style.fontSize = `${80 - (14*(String(entity[1]).length-1))}px`;
            timeContent.style.lineHeight = `${100+(30*(String(entity-1).length-1)*(String(entity-1).length-2))}%`
        }
        else {

        }
        timeBox.appendChild(timeContent);
    }
    function countTime(formValue) {
        const now = new Date(getNowDate());
        const date = new Date(formValue);
        const timeDifference = date-now;
        const weeks = Math.floor(timeDifference / (1000*3600*24*7));
        const days = Math.floor((timeDifference % (1000*3600*24*7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        const presentTime = new Map([['weeks', weeks], ['days', days], ['hours', hours], ['minutes', minutes], ['seconds', seconds]]);
        if (weeks >= 0 && days >= 0 && minutes >= 0 && seconds >= 0 && hours >= 0) {
            const node = document.querySelector('.time');
            if (!node) {

                for (let entity of presentTime) {
                    let timeElement = document.createElement('div');
                    timeElement.className = 'time';
                    timeElement.id = `${entity[0]}-box`;
                    clockElement.appendChild(timeElement);
                }
            }
            for (let entity of presentTime){
                if (oldTime.get(entity[0]) != entity[1]) {
                    if (document.querySelector(`#${entity[0]}`)){
                        let previousElement = document.querySelector(`#${entity[0]}`);
                        if (previousElement.classList.contains('content')) {
                            setTimeout(() => previousElement.remove(), 1000);
                            previousElement.className = 'animate';
                        }
                    }
                    if (!document.hidden) {
                        changeTime(entity);
                    } else {
                        if (entity[0] != 'seconds') {
                            changeTime(entity);
                        }
                    }
                }
            }
                oldTime = new Map(presentTime);

        } else {
                localStorage.removeItem('date');
                clockElement.innerHTML = '';
                clearInterval(timerInterval);
                oldTime = new Map();
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
            timerInterval = setInterval(() =>   countTime(date), 500);
        } else {
            localStorage.removeItem('date');
            localStorage.setItem('date', date);
            clearInterval(timerInterval);
            timerInterval = setInterval(() => countTime(date), 500);

        }
    });
    window.addEventListener('load', () => {
        const date = localStorage.getItem('date');
        if (localStorage.getItem('date') != null) {
            form.datetime.value = date;
            clearInterval(timerInterval);
            timerInterval = setInterval(() => countTime(date), 500);
        } 
    });
})()