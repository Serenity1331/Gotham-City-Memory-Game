function mainFunc() {

    createCards(8);
    let levels = document.querySelectorAll('.levels');
    let currentLevel = document.querySelector('.chosenLevel').innerHTML;
    let cardsClicked = [];
    let timeOut;

    populateCards(8);
    chooseLevelListener();
    soundSwitchListener();
    startGameListener();

    function createCards(num) {

        const str = `
        <div class="card">
            <div class="front-face"></div>
        </div>`;

        let rowFirst = document.querySelector('.subcontainer-1');
        let rowSecond = document.querySelector('.subcontainer-2');
        let rowThird = document.querySelector('.subcontainer-3');

        if (num < 12) {
            rowFirst.insertAdjacentHTML('beforeend', str.repeat(num/2));
            rowSecond.insertAdjacentHTML('beforeend', str.repeat(num/2));
        }

        if (num >= 12) {
            rowFirst.insertAdjacentHTML('beforeend', str.repeat(num/3));
            rowSecond.insertAdjacentHTML('beforeend', str.repeat(num/3));
            rowThird.insertAdjacentHTML('beforeend', str.repeat(num/3));
        }
    }

    function getImageLinks(num) {

        const levelOne = {
            'batman': 'url(images/batman.jpg) no-repeat center',
            'joker': 'url(images/joker.jpg) no-repeat center',
            'catwoman': 'url(images/catwoman.jpg) no-repeat center',
            'penguin': 'url(images/penguin.jpg) no-repeat center',
        }
        const levelTwo = {'riddler': 'url(images/riddler.jpg) no-repeat center'}
        const levelThree = {'poisonIvy': 'url(images/poisonIvy.jpg) no-repeat center'}
        const levelFour = {
            'harleyQuinn': 'url(images/harleyQuinn.jpg) no-repeat center',
            'bane': 'url(images/bane.jpg) no-repeat center',
            'twoFace': 'url(images/twoFace.jpg) no-repeat center',
        }

        switch(num) {
            case 8: return levelOne;
            case 10: return {...levelOne, ...levelTwo};
            case 12: return {...levelOne, ...levelTwo, ...levelThree};
            case 18: return {...levelOne, ...levelTwo, ...levelThree, ...levelFour};
        }
    }

    function populateCards(num) {

        let cards = document.querySelectorAll('.card');
        let currentLevel = getImageLinks(num);
        let imageNames = shuffleKeys(currentLevel);
    
        cards.forEach((card, index) => {
            card.style.background = currentLevel[imageNames[index]];
            card.style.backgroundSize = 'cover';    
        });
    }

    // to be changed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    function removeCards() {
        let subcontainers = document.querySelectorAll('.subcontainer');
        subcontainers.forEach(node => {
            node.innerHTML = '';
        })
    }

    function flipCard() {
    
        // if card is flipped or more than 1 cards flipped overall
        if (this.classList.contains('flip') || cardsClicked.length > 1) return;
    
        this.classList.add('flip');
        cardsClicked.push(this);
    
        if (cardsClicked.length !== 2) return;
    
        [card1, card2] = cardsClicked;
        removeClickListeners();
    
        // cards not matching
        if (!matchCards(card1, card2)) {
            unflipTwo(cardsClicked);
            timeOut = setTimeout(() => addClickListeners(), 2000);
            
        } else {
            playMatchedAudio();
            addClickListeners();    
        } 
        
        let cardsNum = +document.querySelector('.chosenLevel').getAttribute('cards');
        cardsClicked = [];
        youWin(cardsNum);
    }

    function youWin(num) {

        let startBtn = document.querySelector('.startGame');
        let flipped = document.querySelectorAll('.flip');
        let container = document.querySelector('.container-main');
        let message = 
            `<div class="success">
                <h1 class="congrats">Congratulations!
                    <div class="stars"></div>
                </h1>      
            </div>`;

        if (flipped.length === num) {
            container.insertAdjacentHTML('beforeend', message);
            chooseLevelListener();
            hideCards();
            startBtn.classList.remove('hidden');
            startBtn.disabled = false;
            removeClickListeners();
        }
    }

    function removeClickListeners() {
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => card.removeEventListener('click', flipCard ));
    }
    
    function addClickListeners() {
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => card.addEventListener('click', flipCard ));
    }

    function showCards() {
        let time = 0;
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            timeOut = setTimeout(() => card.classList.add('flip'), time);
            time += 150; 
        })
    }
    
    function hideCards() {
        let time = 0;
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            timeOut = setTimeout(() => card.classList.remove('flip'), time);
            time += 150; 
        })
    }

    function getHideDelay() {

        switch(currentLevel) {
            case 'Level 1': return 3000;
            case 'Level 2': return 4000;
            case 'Level 3': return 5000;
            case 'Final Level': return 7000;
        }
    }
    
    function startGameListener() {

        let btn = document.querySelector('.startGame');
        btn.addEventListener('click', function() {

            let time = getHideDelay();
            showCards();
            timeOut = setTimeout(() => hideCards(), time);
        
            setTimeout(() => addClickListeners(), 3000);
            btn.disabled = true;
            btn.classList.add('hidden');

             // Removing the "congrats" message
            let winMessage = document.querySelector('.success');
            if (winMessage) {
                winMessage.remove();
            }

        })
    }

    function chooseLevelListener() {

        let startBtn = document.querySelector('.startGame');
        let winMessage = document.querySelector('.success');
        
        levels.forEach(level => {
            level.addEventListener('click', function() {

                clearChosenLevels();
                removeCards();
                this.classList.add('chosenLevel');
                currentLevel = this.innerHTML;

                let cardsNum = +this.getAttribute('cards');
                createCards(cardsNum);
                populateCards(cardsNum);

                if (winMessage) {
                    winMessage.remove();
                }
    
                startBtn.disabled = false;
                startBtn.classList.remove('hidden');
                stopTimeout();
            }) 
        })
    }

    function clearChosenLevels() {
        levels.forEach(level => level.classList.remove('chosenLevel'));
    }

    function unflipTwo(lst) {
        timeOut = setTimeout(() => {
            lst[0].classList.remove('flip');
            lst[1].classList.remove('flip');
        }, 1500);
    }
    
    function playMatchedAudio() {
    
        let status = document.querySelector('.soundOn');
        if (status) {
            timeOut = setTimeout(() => {
                let audio = document.createElement('audio');
                audio.src = 'audio/success.mp3';
                audio.play();
            }, 150);
        }
    }

    function stopTimeout() {
        clearTimeout(timeOut);
    }
    
}

mainFunc();


// Support functions ---------------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  
    }
}

function shuffleKeys(arr) {
    let imgList = [];

    for (let key of Object.keys(arr)) {
        imgList.push(key, key);
    }
    shuffle(imgList);

    return imgList;
}

function matchCards(a, b) {
    return a.style.background === b.style.background;
}

function soundSwitchListener() {

    let switcher = document.querySelector('.soundOn');
    switcher.addEventListener('click', function() {
        this.classList.toggle('soundOn');
        this.classList.toggle('soundOff');
    })
}



// Support functions ---------------