const mainLetterRef = document.getElementById("mainLetter");
const resultsContainer = document.getElementById("results");
const optionsRef = [{main:document.getElementById("capsOption"),withR:document.getElementById("capsWithRandomness")},
document.getElementById("lettersOption"),document.getElementById("resetOption"),document.getElementById("gameModes"),document.getElementById("customStringOption")]

let player = {shiftDown:false,key:null,index:0}
let practiceCount = optionsRef[1].value % 100;
let keys = [];
let currentKeyCount=0;
let results = {loops:0,loopTime:0,currentKeyTime:0};
let lastTime = practiceCount*100;

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max)+1;
    return Math.floor((Math.random() * (max - min))) + min;
}

function genCharacters(){

    let useCustomString = false;
    if(optionsRef[4].value != ""){
        optionsRef[1].value = optionsRef[4].value.length;
        useCustomString = true;
    }

    practiceCount = optionsRef[1].value % 100;
    keys = [];
    for(var i =0;i<practiceCount;i++){

        keys[i] = String.fromCharCode(getRandomInt(65,90)).toLowerCase();

        if(useCustomString){
            keys[i] = optionsRef[4].value[i];
        }

        if(optionsRef[0].main.checked){
            var r = 0
            if(optionsRef[0].withR.checked){
                r = getRandomInt(0,1);
            }
            if(r == 0) keys[i] = keys[i].toUpperCase();
        }
    }
}

function init(){
    genCharacters();
    update();
}init();

function update(){
    requestAnimationFrame(update);

     // I know I don't need this onupdate but it solves simple problems so whatever
     if(optionsRef[3].value == "characterClick" || practiceCount>30){
        mainLetterRef.style.fontSize = `${16}em`; 
        mainLetterRef.innerHTML = keys[player.index];
    }else if(optionsRef[3].value == "stringForm"){
        mainLetterRef.style.fontSize = `${(practiceCount/(practiceCount/2))*3}em`; 
        let stingRepresentation = genString(player.index);
        mainLetterRef.innerHTML = stingRepresentation;
    }

    if(!optionsRef[0].main.checked){
        optionsRef[0].withR.checked = false;
    }
    currentKeyCount++;
    results.currentKeyTime = (currentKeyCount/60).toFixed(3);
}

function genString(ind,start){
    var string = "";
    if(optionsRef[1].value > 14){
        var goTo = 0;
        if(keys.length<14){
            goTo = keys.length;
        }else{
            goTo = (ind + 14);
            if(((keys.length-ind)-14)<0){
                goTo = keys.length;
            }
        }
        for(var i = ind; i < goTo;i++){
            if(i == ind){
                string += "<u>" + keys[i] + "</u>"
            }else{
                string += keys[i]
            }
        }
    }else{
        for(var i = 0; i < keys.length;i++){
            if(i == ind){
                string += "<u>" + keys[i] + "</u>"
            }else{
                string += keys[i]
            }
        }
    }
    return string
}


//KeyBoard Event Handlers
document.addEventListener("keyup",(e)=>{
    if(e.keyCode == 16){
        player.shiftDown = false;
    }
});
document.addEventListener("keydown",(e)=>{ 

    player.key = e.key; 

    if(player.key == keys[player.index]){
        res = document.createElement("li");
        res.appendChild(document.createTextNode(`Time: ${results.currentKeyTime}s Key: ${keys[player.index]}`));
        resultsContainer.appendChild(res);
        player.index = (player.index + 1) % practiceCount;
        results.loopTime += parseFloat(results.currentKeyTime);
        currentKeyCount = 0;
        if(player.index == 0){

            results.loops++;

            res = document.createElement("li");
            res.appendChild(document.createTextNode(`Loop Time: ${parseFloat(results.loopTime).toFixed(3)}s`));
            res.appendChild(document.createElement('br'));
            res.appendChild(document.createTextNode(`Loops Done: ${results.loops}`));
            
            res.style.color = "red";
            if(lastTime>=results.loopTime){
                res.style.color = "green";
            } 
            lastTime = results.loopTime;
            resultsContainer.appendChild(res);
            results.loopTime = 0;
            frameCount = 0;
            if(optionsRef[2].checked){
                genCharacters();
            }
            
        } 
    }
});

function ResetKeyLog(e){
        resultsContainer.innerText = "";
        practiceCount = optionsRef[1].value % 100;
        player = {shiftDown:false,key:null,index:0}
        genCharacters();
        frameCount = 0;
        currentKeyCount = 0;
        results.loops = 0;
        lastTime = practiceCount*100;
        e.blur();
}