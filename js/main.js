class Game {
    constructor() {
        let words = ["Abuse", "Adult", "Agent", "Anger", "Apple", "Award", "Basis", "Beach", "Birth", "Block", "Blood", "Board", "Brain", "Bread", "Break", "Brown", "Buyer", "Cause", "Chain", "Chair", "Chest", "Chief", "Child", "China", "Claim", "Class", "Clock", "Coach", "Coast", "Court", "Cover", "Cream", "Crime", "Cross", "Crowd", "Crown", "Cycle", "Dance", "Death", "Depth", "Doubt", "Draft", "Drama", "Dream", "Dress", "Drink", "Drive", "Earth", "Enemy", "Entry", "Error", "Event", "Faith", "Fault", "Field", "Fight", "Final", "Floor", "Focus", "Force", "Frame", "Frank", "Front", "Fruit", "Glass", "Grant", "Grass", "Green", "Group", "Guide", "Heart", "Henry", "Horse", "Hotel", "House", "Image", "Index", "Input", "Issue", "Japan", "Jones", "Judge", "Knife", "Laura", "Layer", "Level", "Lewis", "Light", "Limit", "Lunch", "Major", "March", "Match", "Metal", "Model", "Money", "Month", "Motor", "Mouth", "Music", "Night", "Noise", "North", "Novel", "Nurse", "Offer", "Order", "Other", "Owner", "Panel", "Paper", "Party", "Peace", "Peter", "Phase", "Phone", "Piece", "Pilot", "Pitch", "Place", "Plane", "Plant", "Plate", "Point", "Pound", "Power", "Press", "Price", "Pride", "Prize", "Proof", "Queen", "Radio", "Range", "Ratio", "Reply", "Right", "River", "Round", "Route", "Rugby", "Scale", "Scene", "Scope", "Score", "Sense", "Shape", "Share", "Sheep", "Sheet", "Shift", "Shirt", "Shock", "Sight", "Simon", "Skill", "Sleep", "Smile", "Smith", "Smoke", "Sound", "South", "Space", "Speed", "Spite", "Sport", "Squad", "Staff", "Stage", "Start", "State", "Steam", "Steel", "Stock", "Stone", "Store", "Study", "Stuff", "Style", "Sugar", "Table", "Taste", "Terry", "Theme", "Thing", "Title", "Total", "Touch", "Tower", "Track", "Trade", "Train", "Trend", "Trial", "Trust", "Truth", "Uncle", "Union", "Unity", "Value", "Video", "Visit", "Voice", "Waste", "Watch", "Water", "While", "White", "Whole", "Woman", "World", "Youth"];
        
        this.letters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter", "z", "x", "c", "v", "b", "n", "m", "del"];

        this.word = words[Math.floor(Math.random() * words.length)].toLowerCase();
        this.guessedWord = "";
        this.enterCnt = 0;
        this.selectedKeys = [];
        console.log(this.word)

        this.keyboard = document.getElementById("keyboard-container");
        this.board = document.getElementById("board-container");

        this.keyboard.innerHTML = "";

        for(var i = 0; i < this.board.children.length; i++){
            for(var j = 0; j < this.board.children[i].children.length; j++){
                this.board.children[i].children[j].innerText = "";
                this.board.children[i].children[j].classList = "cell";
            }
        }
        
        this.topRow = document.createElement("div")
        this.topRow.className = "keyboard-row top";

        this.middleRow = document.createElement("div")
        this.middleRow.className = "keyboard-row middle";

        this.bottomRow = document.createElement("div")
        this.bottomRow.className = "keyboard-row bottom";

        this.keyboard.appendChild(this.topRow);
        this.keyboard.appendChild(this.middleRow);
        this.keyboard.appendChild(this.bottomRow);

        this.letters.forEach((letter, index) => {
            var parent;
            if (index < 10) {
                parent = this.topRow;
            } else if (index < 19) {
                parent = this.middleRow;
            } else {
                parent = this.bottomRow;
            }
            let wrapper = document.createElement("div");
            wrapper.className = (letter == "enter" || letter == "del") ? "key special" : "key";
            wrapper.innerText = letter.toUpperCase();
            let game = this;
            wrapper.addEventListener("click", function(e){
                game.keyClicked(e)
            })
            parent.appendChild(wrapper)
        });
    }

    keyClicked(e) {
        let letter = e.currentTarget.innerText;
        switch (letter) {
            case "ENTER":
                if (this.guessedWord.length == 5) {
                    this.checkWord().then(() => {
                        this.enterCnt++;
                        this.guessedWord = "";
                        this.selectedKeys = [];
                    });
                }
                break;
            case "DEL":
                if (this.guessedWord.length > 0) {
                    this.board.children[this.enterCnt].children[this.guessedWord.length - 1].innerText = "";
                    this.guessedWord = this.guessedWord.slice(0, -1);
                    this.selectedKeys.pop();
                }
                break;
            default:
                if (this.guessedWord.length < 5) {
                    this.guessedWord += letter;
                    this.board.children[this.enterCnt].children[this.guessedWord.length - 1].innerText = letter;
                    this.selectedKeys.push(e.currentTarget);
                }
                break;
        }
    }

    checkWord() {
        return new Promise((resolve, reject)=>{
            console.log("Clicked")
            let row = this.board.children[this.enterCnt].children;

            for (var index = 0; index < this.guessedWord.length; index++) {
                let letter = this.guessedWord[index].toLowerCase();
                let key = this.selectedKeys[index];

                if (this.word[index] == letter) {
                    row[index].classList = "cell filled correct";
                    key.classList = "key filled correct";
                } else if (this.word.includes(letter)) {
                    row[index].classList = "cell filled present";
                    key.classList = "key filled present";
                } else {
                    row[index].classList = "cell filled incorrect";
                    key.classList = "key filled incorrect";
                }
            }

            setTimeout(() => {
                if (this.guessedWord == this.word.toUpperCase()) {
                    console.log("Winner");
                    this.endGameModal(true)
                    return;
                }

                if (this.enterCnt == 5) {
                    console.log("you lose");
                    this.endGameModal(false)
                }
                resolve();
            }, 4000)
        })
    }

    endGameModal(won){
        let bg = document.createElement("div");
        let div = document.createElement("div");
        let text = document.createElement("span");
        let container = document.createElement("div");
        let cancel = document.createElement("button");
        let playAgain = document.createElement("button");

        bg.classList.add("bg");
        div.classList.add("modal");

        text.innerText = (won) ? "YOU WON!!" : "You Are Bad at This";

        container.classList.add("container")
        cancel.innerText = "Cancel";
        cancel.classList.add("cancel");
        cancel.addEventListener("click", () => {
            window.location.href = "https://youtu.be/dQw4w9WgXcQ";
        })
        playAgain.innerText = "Play Again";
        playAgain.classList.add("playAgain");
        playAgain.addEventListener("click", () => {
            let app = new Game();
            document.body.removeChild(bg);
        }, false)
        container.appendChild(cancel);
        container.appendChild(playAgain);
        
        div.appendChild(text)
        div.appendChild(container)
        bg.appendChild(div)
        document.body.appendChild(bg)
    }

    reset(){
        // this.keyboard.remove()
        new Game();
    }
}


document.body.style.height = `${window.innerHeight}px`;
var game = new Game();