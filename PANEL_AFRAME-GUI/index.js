
console.log('RAC BUUUUU');



var countClick = 0;
function seleccionarSonido(sonido) {
    var audio;
    audio1 = document.getElementById("audio1");
    audio2 = document.getElementById("audio2");
    audio3 = document.getElementById("audio3");
    this.countClick += 1;
    if (this.countClick%2==0){
        // Lógica para el clic aquí
        switch(sonido) {
            case 'sonido1':
                console.log('RAC HE PULSADO SONIDO 1');
                audio2.pause();
                audio3.pause();
                if (audio1.paused){
                    console.log('VOY A HACER PLAY');
                    audio1.play();
                }else{
                    console.log('PASO POR EL ELSE');
                    audio1.pause();
                }
                break;
            case 'sonido2':
                console.log('RAC HE PULSADO SONIDO 2');
                audio1.pause();
                audio3.pause();
                if (audio2.paused){
                    audio2.play();
                }else{
                    audio2.pause();
                }
                break;
            case 'sonido3':
                console.log('RAC HE PULSADO SONIDO 3');
                audio1.pause();
                audio2.pause();
                if (audio3.paused){
                    audio3.play();
                }else{
                    audio3.pause();
                }
                break;
            default:
                audio = document.getElementById("audio3");
                if (audio.paused){
                    audio.play();
                }else{
                    audio.pause();
                };
        }



    }
        
        

    

}

function seleccionarIdioma(idioma) {
    var texto = '';
    var textoMuseo = document.getElementById("textoMuseo");

    switch(idioma) {
        case 'es':
            console.log('RAC HE PULSADO SPAIN');
            texto = 'BIENVENIDO AL MUSEO';
            break;
        case 'uk':
            console.log('RAC HE PULSADO UK');

            texto = 'WELCOME TO THE MUSEUM';
            break;
        case 'pt':
            console.log('RAC HE PULSADO PORTUGAL');

            texto = 'BEM-VINDO AO MUSEU';
            break;
        case 'de':
            console.log('RAC HE PULSADO GERMANY');

            texto = 'WILLKOMMEN IM MUSEUM';
            break;
        default:
            texto = 'BIENVENIDO AL MUSEO';
    }
    console.log('RAC texto ' + texto);
    textoMuseo.setAttribute('text', 'value: ' + texto + ';color: black; align: center; width: 5; zOffset: 0.1');

}

function seleccionarMascota(mascota) {
    var cat = document.getElementById("cat");
    var dog = document.getElementById("dog");
    var bird = document.getElementById("bird");
    var dragon = document.getElementById("dragon");

    

    switch(mascota) {
        case 'cat':
            console.log('RAC HE PULSADO CAT');
            cat.setAttribute('visible', 'true');
            dog.setAttribute('visible', 'false');
            bird.setAttribute('visible', 'false');
            dragon.setAttribute('visible', 'false');

            break;
        case 'dog':
            console.log('RAC HE PULSADO DOG');
            cat.setAttribute('visible', 'false');
            dog.setAttribute('visible', 'true');
            bird.setAttribute('visible', 'false');
            dragon.setAttribute('visible', 'false');

            break;
        case 'bird':
            console.log('RAC HE PULSADO BIRD');
            cat.setAttribute('visible', 'false');
            dog.setAttribute('visible', 'false');
            bird.setAttribute('visible', 'true');
            dragon.setAttribute('visible', 'false');

            break;
        case 'dragon':
            console.log('RAC HE PULSADO DRAGON');
            cat.setAttribute('visible', 'false');
            dog.setAttribute('visible', 'false');
            bird.setAttribute('visible', 'false');
            dragon.setAttribute('visible', 'true');

            break;
        default:
            cat.setAttribute('visible', 'false');
            dog.setAttribute('visible', 'true');
            bird.setAttribute('visible', 'false');
            dragon.setAttribute('visible', 'false');
    }

}


window.testSliderAction = function () {
    console.log("clicked GUI");
  
            
    
    
    
        
         
        }


window.testButtonAction1 = function () {
    console.log("clicked GUI");
}
window.testButtonAction2 = function () {
    console.log("clicked GUI");
}
window.testButtonAction3 = function () {
    console.log("clicked GUI");
}
window.testButtonAction4 = function () {
    console.log("clicked GUI");
}

