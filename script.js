const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const iniciarOuPausarBtnIcone = document.querySelector('.app__card-primary-button-icon');
const startPauseBtn = document.querySelector('#start-pause');
const ComeçarOuPausarBtn = document.querySelector('#start-pause span');
const temporizador = document.querySelector('#timer');

const musica = new Audio('/sons/luna-rise-part-one.mp3');
const musicaIniciarTemporizador = new Audio('/sons/play.wav');
const musicaPausarTemporizador = new Audio('/sons/pause.mp3');
const musicaZerarTemporizador = new Audio('/sons/beep.mp3');

let banner = document.querySelector('.app__image');
let texto = document.querySelector('.app__title');
let bottons = document.querySelectorAll('.app__card-button');
let musicaFocoInput = document.querySelector('#alternar-musica');
let tempoDecorridoEmSegundos = 30;
let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

focoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 30;
    alterarContexto('foco');
    focoBtn.classList.add('active');
})

curtoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 5;
   alterarContexto('descanso-curto');
   curtoBtn.classList.add('active');
})

longoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 15;
    alterarContexto('descanso-longo');
    longoBtn.classList.add('active');
})

function alterarContexto(contexto) {
    mostrarTimer();
    bottons.forEach(function (contexto) {
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    
    switch (contexto) {
        case 'foco':
            texto.innerHTML = `Otimize sua produtividade, <strong class="app__title-strong">mergulhe no que importa.</strong> `;
            break;
        
        case 'descanso-curto':
            texto.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;

        case 'descanso-longo':
            texto.innerHTML = `Hora de voltar à superfície. <strong class="app__title-strong"> Faça uma pausa longa.</strong>`;
    
        default:
            break;
    }
}

const contagemRegressiva = () => {
    
    if (tempoDecorridoEmSegundos <= 0) {
        musicaZerarTemporizador.play();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if(focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
   }

    tempoDecorridoEmSegundos -= 1;
    mostrarTimer();
}

startPauseBtn.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar () {
    
    if(intervaloId) {
        musicaPausarTemporizador.play();
        zerar();
        return;
    }
    musicaIniciarTemporizador.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    ComeçarOuPausarBtn.textContent = 'Pausar';
    iniciarOuPausarBtnIcone.setAttribute('src', `/imagens/pause.png`);
}

function zerar() {
    clearInterval(intervaloId);
    ComeçarOuPausarBtn.textContent = 'Começar';
    iniciarOuPausarBtnIcone.setAttribute('src', `/imagens/play_arrow.png`);
    intervaloId = null;
}

function mostrarTimer() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    temporizador.innerHTML = `${tempoFormatado}`;
}

mostrarTimer();