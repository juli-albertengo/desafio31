process.on('message', cant => {
    dev = new Object();
    for(let i = 0; i < cant; i++){
        let randomNumber = Math.floor(Math.random() * (1 - 1000) + 1000);
        if(dev.hasOwnProperty(randomNumber)){
            dev[randomNumber] = dev[randomNumber] + 1;
        } else {
            dev[randomNumber] = 1;
        }  
    }
    process.send(dev);
})



//module.exports = calcularRandom;