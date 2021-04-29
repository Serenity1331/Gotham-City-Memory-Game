function mainFunc() {

    createCards(6);
    let cards = document.querySelectorAll(".card");
    let levels = document.querySelectorAll('.levels');
    let cardsClicked = [];
    let gameStart = true;

    populateCards(6);
    chooseLevelListener();
    addClickListeners();
    startGameListener();

    function createCards(num) {
        const str = `
        <div class="card">
            <div class="front-face"></div>
        </div>`;

        let rowFirst = document.querySelector('.subcontainer-1');
        let rowSecond = document.querySelector('.subcontainer-2');
   
        for (let i = 0; i < num; i++) {

            if (i < num/2) {
                rowFirst.insertAdjacentHTML('beforeend', str);
            } else {
                rowSecond.insertAdjacentHTML('beforeend', str);
            }
        }
    }

    function getImageLinks(num) {

        const levelOne = {
            'batman': 'url(images/batman.jpg) no-repeat center',
            'joker': 'url(images/joker.jpg) no-repeat center',
            'catwoman': 'url(images/catwoman.jpg) no-repeat center',
        }
        const levelTwo = {'riddler': 'url(images/riddler.jpg) no-repeat center'}
        const levelThree = {'poisonIvy': 'url(images/poisonIvy.jpg) no-repeat center'}

        switch(num) {
            case 6: return levelOne;
            case 8: return {...levelOne, ...levelTwo};
            case 10: return {...levelOne, ...levelTwo, ...levelThree};
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

    function removeCards() {
        let subcontainers = document.querySelectorAll('.subcontainer');
        subcontainers.forEach(node => {
            console.log(node.children);
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
            setTimeout(() => addClickListeners(), 2000);
            
        } else {
            playMatchedAudio();
            addClickListeners();    
        } 
    
        cardsClicked = [];
        youWin();
    }

    function youWin(num=6) {
        let flipped = document.querySelectorAll('.flip');
        if (flipped.length === num) {
            console.log('Congratulations!');
            gameStart = true;
            // hideCards();
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
            setTimeout(() => card.classList.add('flip'), time);
            time += 200; 
        })
    }
    
    function hideCards() {
        let time = 0;
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            setTimeout(() => card.classList.remove('flip'), time);
            time += 200; 
        })
    }
    
    function startGameListener() {
        
        let btn = document.querySelector('.startGame');
        btn.addEventListener('click', function() {

            if (gameStart) {
                showCards();
                setTimeout(() => hideCards(), 3000);
                gameStart = false;
                // this.style.opacity = 0;
            }
            
        })
    }

    function chooseLevelListener() {
        
        levels.forEach((level, index) => {
            level.addEventListener('click', function() {   
                
                clearChosenLevels();
                removeCards();
                this.classList.add('chosenLevel');

                let cardsNum = +this.getAttribute('cards');
                createCards(cardsNum);
                populateCards(cardsNum);
                addClickListeners();  
                gameStart = true;

            }) 
        })
    }

    function clearChosenLevels() {
        levels.forEach(level => level.classList.remove('chosenLevel'));
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

function unflipTwo(lst) {
    setTimeout(() => {
        lst[0].classList.remove('flip');
        lst[1].classList.remove('flip');
    }, 1500);
}

function playMatchedAudio() {
    setTimeout(() => {
        let audio = document.createElement('audio');
        audio.src = 'audio/success.mp3';
        audio.play();
    }, 700);
}

// Support functions ---------------