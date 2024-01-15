// Calcolatrice Gravidanza by Armando "FL3R" Fiore

// Dichiarazione delle variabili globali
var pregnancyWeekRounded;
var dueDate;
var daysToDueDate;
var progressPercentage;
var pregnancyWeekValue;
var dueDateValue;
var description;
var shareDaysToDueDate;

// Definizione della funzione fadeIn
function fadeIn(element) {
    var startTime = null;
    function fade(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var opacity = progress / 500;
        element.style.opacity = opacity;
        if (progress < 500) {
            requestAnimationFrame(fade);
        }
    }
    requestAnimationFrame(fade);
}

// Definizione della funzione formatDate
function formatDate(date) {
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
}

// Funzione per l'aggiornamento degli elementi HTML nell'area di condivisione
function updateShareElements() {
    var sharePregnancyWeekValue = document.getElementById("sharePregnancyWeekValue");
    var shareDueDateValue = document.getElementById("shareDueDateValue");
    var shareDaysRemaining = document.getElementById("shareDaysRemaining");

    sharePregnancyWeekValue.textContent = pregnancyWeekValue;
    shareDueDateValue.textContent = dueDateValue;
    shareDaysRemaining.textContent = shareDaysToDueDate;

    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + shareDaysToDueDate);
    shareDueDateValue.textContent = formatDate(dueDate);
}

// X per resettare
function resetCalculator() {
    var lastPeriodDateInput = document.getElementById("lastPeriodDate");
    var calculateButton = document.getElementById("calculateButton");
    lastPeriodDateInput.value = "";
    calculateButton.disabled = true;

    // Nascondi la sezione dei risultati
    var resultSection = document.getElementById("result");
    resultSection.style.opacity = "0";
    setTimeout(function () {
        resultSection.style.display = "none";
    }, 100);
}

// Funzione per la validazione dell'input e l'abilitazione/disabilitazione del pulsante
function validateInput() {
    var lastPeriodDate = document.getElementById("lastPeriodDate").value;
    var calculateButton = document.getElementById("calculateButton");
    calculateButton.disabled = !lastPeriodDate;
}

// Aggiungi l'evento di change all'input della data
document.getElementById("lastPeriodDate").addEventListener("change", validateInput);

// Funzione per ottenere la settimana di gravidanza e i giorni
function formatPregnancyWeekAndDays(pregnancyWeekExact, days) {
    var pregnancyWeek = Math.floor(pregnancyWeekExact);
    if (days === 1) {
        return pregnancyWeek + 'ª settimana e 1 giorno';
    } else if (days === 0) {
        return pregnancyWeek + 'ª settimana e 0 giorni';
    } else {
        return pregnancyWeek + 'ª settimana e ' + days + ' giorni';
    }
}

// Funzione per la calcolatrice
function calculatePregnancyWeek() {
    var lastPeriodDate = new Date(document.getElementById("lastPeriodDate").value);
    var currentDate = new Date();

    var timeDiff = currentDate.getTime() - lastPeriodDate.getTime();
    var totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    shareDaysToDueDate = 280 - totalDays;

    if (totalDays < 0 || totalDays > 280) {
        document.getElementById("result").style.display = "none";
        document.getElementById("alternateMessage").style.display = "block";
        document.getElementById("alternateMessage").textContent = "Le settimane di gravidanza sono fuori dai limiti previsti.";
        return;
    }

    function calculateProgressPercentage(daysToDueDate) {
        return ((280 - daysToDueDate) / 280) * 100;
    }

    var progressFill = document.querySelector(".progress-fill");
    var progressPercentage = calculateProgressPercentage(shareDaysToDueDate);
    progressFill.style.width = progressPercentage + "%";

    var pregnancyWeekExact = totalDays / 7;
    pregnancyWeekRounded = Math.ceil(pregnancyWeekExact);

    var days = totalDays % 7;

    var resultSection = document.getElementById("result");
    resultSection.style.opacity = "0";
    resultSection.style.display = "block";
    fadeIn(resultSection);

    var alternateMessage = document.getElementById("alternateMessage");
    alternateMessage.style.display = "none";

    dueDate = new Date(lastPeriodDate);
    dueDate.setDate(dueDate.getDate() + 280); // Aggiungi 280 giorni alla data delle ultime mestruazioni

    // Assegna i valori alle variabili globali
    pregnancyWeekValue = pregnancyWeekRounded;
    dueDateValue = formatDate(dueDate); // Ora la data prevista del parto dovrebbe essere corretta

    document.getElementById("pregnancyWeek").textContent = pregnancyWeekRounded;
    document.getElementById("dueDate").textContent = formatDate(dueDate);
    document.getElementById("pregnancyWeekValue").textContent = pregnancyWeekRounded;
    document.getElementById("dueDateValue").textContent = dueDateValue; // Assegna il valore di dueDateValue

    document.getElementById("pregnancyWeekValueAndDays").textContent = formatPregnancyWeekAndDays(pregnancyWeekExact, days);

    var shareFruitDescription = getShareFruit(pregnancyWeekRounded);
    document.getElementById("shareFruit").textContent = shareFruitDescription;
	
	var mom = getMomDescription(pregnancyWeekRounded);
	document.getElementById("mom").textContent = mom;

    var description = getFetalDescription(pregnancyWeekRounded);
	document.getElementById("description").textContent = description;
	
    var fetalImage = getFetalImage(pregnancyWeekRounded);
    document.getElementById("fetalImage").src = fetalImage;

    var tips = getTipsAndFacts(pregnancyWeekRounded);
    document.getElementById("tips").textContent = tips;

    var exams = getExams(pregnancyWeekRounded);
    document.getElementById("exams").textContent = exams;

    document.getElementById("daysToDueDate").textContent = shareDaysToDueDate;

    // Aggiorna l'immagine condivisibile
    updateShareElements();
}
// Funzione per condividere l'immagine
function shareImage() {
    updateShareElements();

    var shareImage = document.getElementById("shareImage");

    // Imposta la scala desiderata (ad esempio, 2 per raddoppiare le dimensioni)
    var scale = 2;

    // Cattura la schermata dell'elemento shareImage con la scala specificata
    html2canvas(shareImage, {
        scale: scale
    }).then(function(canvas) {
        // Crea un'immagine Blob dall'elemento catturato
        canvas.toBlob(function(blob) {
            // Utilizza l'API Web Share per condividere l'immagine Blob
            if (navigator.share) {
                navigator.share({
                    title: "Condivisione dell'immagine",
                    text: "Guarda questa immagine",
                    files: [new File([blob], "share.png", { type: "image/png" })]
                }).then(function() {
                    console.log("Immagine condivisa con successo.");
                }).catch(function(error) {
                    console.error("Errore durante la condivisione dell'immagine:", error);
                });
            } else {
                // L'API Web Share non è supportata sul dispositivo
                // Puoi fornire un messaggio alternativo o un altro comportamento qui
                console.log("L'API Web Share non è supportata su questo dispositivo.");
            }
        }, "image/png");
    });
}

// Funzione per ottenere la descrizione del frutto o alimento per la condivisione
function getShareFruit(week) {
    // Descrizioni per ogni settimana di gravidanza
    var shareFruit = {
		0: "Il tuo piccolino ancora non c'è, è troppo presto!",
        1: "Il tuo piccolino ancora non c'è, è troppo presto!",
        2: "Il piccolino ancora non c'è, è troppo presto!",
        3: "Il piccolino ancora non c'è, è troppo presto!",
        4: "Il bambino è grande come un piccolo pisello",
        5: "Il bambino è grande come un pisello",
        6: "Il bambino è grande come una lenticchia",
        7: "Il bambino è grande come un mirtillo",
        8: "Il bambino è grande come un lampone",
        9: "Il bambino è grande come un chicco d'uva",
        10: "Il bambino è grande come un'oliva",
        11: "Il bambino è grande come un piccolo fico",
        12: "Il bambino è grande come un lime",
        13: "Il bambino è grande come una cipolla",
        14: "Il bambino è grande come un limone",
        15: "Il bambino è grande come una nocepesca",
        16: "Il bambino è grande come una mela",
        17: "Il bambino è grande come un'arancia",
        18: "Il bambino è grande come un melograno",
        19: "Il bambino è grande come una grossa pera",
        20: "Il bambino è grande come un piccolo peperone",
        21: "Il bambino è grande come un avocado",
        22: "Il bambino è grande come una noce di cocco",
        23: "Il bambino è grande come un avocado",
        24: "Il bambino è grande come una banana",
        25: "Il bambino è grande come un cavolo",
        26: "Il bambino è grande come una pannocchia",
        27: "Il bambino è grande come un cavolfiore",
        28: "Il bambino è grande come un peperone",
        29: "Il bambino è grande come una zucchina",
        30: "Il bambino è grande come un'insalata romana",
        31: "Il bambino è grande come una grossa melanzana",
        32: "Il bambino è grande come un'ananas",
        33: "Il bambino è grande come una piccola zucca",
        34: "Il bambino è grande come una verza",
        35: "Il bambino è grande come un'anguria baby",
        36: "Il bambino è grande come un sedano",
        37: "Il bambino è grande come un cavolo cappuccio",
        38: "Il bambino è grande come un grosso pompelmo",
        39: "Il bambino è grande come una grossa zucca",
        40: "Il bambino è grande come un cocomero"
    };

    // Restituisci la descrizione corrispondente alla settimana, se disponibile
    return shareFruit[week] || "Risultato non disponbile";
}

function getMomDescription(week) {
    var mom = {
        0: "Il tuo corpo sta lavorando per prepararti ad un viaggio incredibile. Non c'è da stupirsi se ti senti un mix di emozioni, dall'entusiasmo alla paura. Comincia a prenderti cura di te stessa e della nuova vita che porterai in grembo.",
        1: "Il tuo corpo sta lavorando per prepararti ad un viaggio incredibile. Non c'è da stupirsi se ti senti un mix di emozioni, dall'entusiasmo alla paura. Comincia a prenderti cura di te stessa e della nuova vita che porterai in grembo.",
        2: "Continua ad essere gentile con te stessa in queste settimane cruciali. Potresti avvertire alcuni cambiamenti leggeri come stanchezza o senso di tensione nei seni. È normale! Questi sintomi sono spesso tra i primi segni della tua gravidanza in evoluzione. Prenditi il tempo per riposare e ricorda che stai portando avanti una piccola meraviglia.",
        3: "Continua ad essere gentile con te stessa in queste settimane cruciali. Potresti avvertire alcuni cambiamenti leggeri come stanchezza o senso di tensione nei seni. È normale! Questi sintomi sono spesso tra i primi segni della tua gravidanza in evoluzione. Prenditi il tempo per riposare e ricorda che stai portando avanti una piccola meraviglia.",
        4: "Sei nella fase in cui il tuo corpo inizia a produrre l'ormone della gravidanza, la gonadotropina corionica umana (hCG), principalmente dalle cellule del trofoblasto, un tessuto che si sviluppa intorno all'embrione appena impiantato nell'utero. La sua funzione principale è quella di sostenere la gravidanza mantenendo il corpo luteo, che a sua volta produce progesterone, un ormone essenziale per il mantenimento della gravidanza nelle prime settimane. L'hCG si divide in due frazioni, l'alfa e la beta: i valori di quest'ultima aumentano durante le prime settimane di gravidanza e sono utilizzati per determinare la data approssimativa del concepimento e per confermare se una donna è incinta o meno. Potresti sperimentare le prime nausee mattutine e cambiamenti di umore. Non preoccuparti, è tutto parte del processo. Continua a mangiare sano, bere molta acqua e prendere vitamine prenatali.",
        5: "Sei nella fase in cui il tuo corpo inizia a produrre l'ormone della gravidanza, la gonadotropina corionica umana (hCG), principalmente dalle cellule del trofoblasto, un tessuto che si sviluppa intorno all'embrione appena impiantato nell'utero. La sua funzione principale è quella di sostenere la gravidanza mantenendo il corpo luteo, che a sua volta produce progesterone, un ormone essenziale per il mantenimento della gravidanza nelle prime settimane. L'hCG si divide in due frazioni, l'alfa e la beta: i valori di quest'ultima aumentano durante le prime settimane di gravidanza e sono utilizzati per determinare la data approssimativa del concepimento e per confermare se una donna è incinta o meno. Potresti sperimentare le prime nausee mattutine e cambiamenti di umore. Non preoccuparti, è tutto parte del processo. Continua a mangiare sano, bere molta acqua e prendere vitamine prenatali.",
        6: "Questa settimana sei nella fase in cui i sintomi della gravidanza diventano più evidenti, come la stanchezza, la frequente voglia di urinare e il seno sensibile. Considera di condividere la notizia con il tuo partner o alcune persone vicine, se lo desideri. È normale avere domande e preoccupazioni; assicurati di discutere qualsiasi dubbio con il tuo medico.",
        7: "Questa settimana sei nella fase in cui i sintomi della gravidanza diventano più evidenti, come la stanchezza, la frequente voglia di urinare e il seno sensibile. Considera di condividere la notizia con il tuo partner o alcune persone vicine, se lo desideri. È normale avere domande e preoccupazioni; assicurati di discutere qualsiasi dubbio con il tuo medico.",
        8: "Il tuo bambino è lungo solo due centimetri, ma il tuo corpo sta già facendo un grande lavoro per nutrirlo e proteggerlo. Potresti notare che il tuo seno continua a crescere e che hai una maggiore sensazione di affaticamento. Non dimenticare di ascoltare il tuo corpo e di riposare quando ne hai bisogno.",
        9: "Il tuo bambino è lungo solo due centimetri, ma il tuo corpo sta già facendo un grande lavoro per nutrirlo e proteggerlo. Potresti notare che il tuo seno continua a crescere e che hai una maggiore sensazione di affaticamento. Non dimenticare di ascoltare il tuo corpo e di riposare quando ne hai bisogno.",
        10: "Mentre il tuo corpo si adatta a questa nuova realtà potresti notare che la tua pelle cambia leggermente, diventando più liscia o più grassa. Alcune future mamme sperimentano anche le prime voglie. Ricorda di mantenere una dieta equilibrata e di fare una passeggiata leggera ogni giorno, se possibile. Prenditi il tempo per goderti questo momento unico nella tua vita.",
        11: "Potresti avvertire meno nausea e vomito rispetto alle settimane precedenti. L'utero continua a crescere, spingendo l'ombelico verso l'esterno e potresti sentire il bisogno di urinare più spesso a causa della pressione sulla vescica.",
        12: "È ufficiale: hai raggiunto il secondo trimestre! La stanchezza delle prime settimane potrebbe diminuire e la tua pelle potrebbe cominciare a risplendere grazie all'incremento del flusso sanguigno. In questa settimana potresti anche aver la possibilità di ascoltare il battito cardiaco del tuo bambino tramite un'ecografia.",
        13: "La tua pancia sta crescendo, e la tua capigliatura potrebbe essere più folta e luminosa grazie agli ormoni. Alcune mamme iniziano a sentirsi meglio dopo le nausea delle prime settimane.",
        14: "Le nausee mattutine dovrebbero iniziare a diminuire notevolmente o addirittura sparire. Potresti anche iniziare a sentire i primi movimenti del tuo bambino, noti come flutters.",
        15: "Le dimensioni del tuo utero continuano a crescere, spingendo verso l'alto l'addome. Potresti iniziare a notare un leggero arrossamento sulla pelle dell'addome, noto come linea alba o linea nigra: si tratta della linea che divide verticalmente i tuoi addominali, normalmente non è visibile ma durante la gravidanza si scurisce e spicca sul resto della pancia. Tipicamente va dal pube all'ombelico ma in alcuni casi può prolungarsi fino ai seni. Non ti piace? Tranquilla, scomparirà da sola due o tre mesi dopo il parto.",
        16: "La tua pancia è più evidente e potresti aver bisogno di abiti premaman.",
        17: "La pancia continua a crescere e potresti iniziare a sperimentare crampi alle gambe a causa dell'aumento del peso e del volume sanguigno.",
        18: "Il tuo utero sta crescendo e il tuo corpo si sta già attrezzando per produrre il latte. Potresti notare un cambiamento nella tua pelle, con la comparsa di alcune macchie scure, chiamate cloasmi gravidici, che si manifestano principalmente sul viso, il petto e le mani.",
        19: "Potresti iniziare a notare che il tuo addome si indurisce leggermente quando il tuo bambino si muove. È importante continuare a seguire una dieta sana e bilanciata e fare esercizio fisico leggero.",
        20: "La tua pancia è ormai ben visibile, e potresti sentire il tuo bambino muoversi con regolarità.",
        21: "In questa fase della gravidanza potresti sentirti più stanca del solito. Prenditi il tempo per riposare quando ne hai bisogno e fai attenzione a te stessa. Ricorda di mantenere una buona alimentazione e di bere molta acqua.",
        22: "Assicurati di indossare abiti comodi e prenditi del tempo per rilassarti.",
        23: "Con il passare delle settimane potresti notare che hai più fame del solito; è importante nutrirsi bene per sostenere la crescita del tuo corpo e del tuo bambino. Ricorda di includere cibi sani nella tua dieta quotidiana.",
        24: "A questo punto potresti cominciare a sperimentare qualche fastidio come il mal di schiena o il gonfiore alle gambe: esercizi leggeri e una buona postura possono aiutarti a gestire questi sintomi.",
        25: "La tua pancia continua a crescere e potresti notare delle smagliature sulla pelle, è del tutto normale durante la gravidanza. Assicurati di idratare bene la tua pelle per mantenerla elastica.",
        26: "In questa fase è importante prendersi cura di te stessa e di eliminare lo stress. Puoi aituarti a mantenere un equilibrio psicofisico eccellente anche con semplici esercizi di rilassamento o di yoga.",
        27: "La data del parto si avvicina e dovresti iniziare a pensare al piano di nascita e alle tue preferenze per il parto. Parla con il tuo medico o ostetrico su come vorresti che si svolgesse.",
        28: "Sei ufficialmente nel terzo trimestre! Continua a seguire una dieta equilibrata e assicurati di fare attività fisica leggera per rimanere in forma.",
        29: "Durante questa fase potresti notare un aumento del gonfiore alle mani e ai piedi. Sollevare le gambe quando puoi e bere molta acqua può aiutare a ridurre il gonfiore.",
        30: "Mancano ormai poche settimane alla nascita del tuo bambino. Continua a prenderti cura di te stessa, mantieni una buona igiene e consulta il tuo medico o ostetrico per qualsiasi domanda o preoccupazione sulla gravidanza.",
        31: "A questo punto della gravidanza potresti avvertire seriamente il peso della pancia. Assicurati di mantenere una buona postura e di prenderti dei momenti di riposo quando ne hai bisogno. Continua a seguire le indicazioni del medico per la salute tua e del tuo bambino.",
        32: "Il tuo bambino sta crescendo rapidamente e potresti sentirlo muoversi con più frequenza. Questo è un segno positivo della sua salute. Ricorda di fare regolarmente controlli prenatali per assicurarti che tutto proceda bene.",
        33: "Potresti iniziare a sperimentare il bruciore di stomaco o l'acidità. Parla con il tuo medico su come gestire questi sintomi in modo sicuro per te e il tuo bambino.",
        34: "Con l'avvicinarsi del termine della gravidanza è importante iniziare a pianificare il parto. Discuti le tue opzioni con il medico e preparati per l'arrivo del piccolo.",
        35: "Sei nel nono mese di gravidanza! In questa fase il bambino potrebbe già essersi girato nella posizione cefalica in vista del parto.",
        36: "Con l'approccio del parto potresti sentirti emozionata e ansiosa. È normale avere dubbi e preoccupazioni: parla con il partner, familiari o amici di fiducia e condividi i tuoi sentimenti. Ci sono tante persone che ti vogliono bene e sono pronte a darti una mano.",
        37: "Alla trentasettesima settimana il bambino è considerato a termine, il che significa che potrebbe nascere in qualsiasi momento! Assicurati di avere tutto pronto per il suo arrivo, inclusa una borsa per il ricovero ed un piano di nascita ben definito. Per maggiori informazioni puoi contattare il reparto prenatale dell'ospedale o della clinica privita.",
        38: "Potresti notare che il tuo corpo è pronto per il parto, con sintomi come il rilassamento dei legamenti pelvici. Tieni il telefono a portata di mano e segui le istruzioni del tuo medico per il momento del parto, manca pochissimo!",
        39: "Ormai sei vicina alla fine del tuo viaggio di gravidanza. Continua a monitorare attentamente il movimento del bambino e contatta immediatamente il tuo medico se noti cambiamenti significativi.",
        40: "L'hai immaginato da tanto ma finalmente il momento tanto atteso è giunto: presto avrai il tuo piccolo tra le braccia!"
    };
    return mom[week] || "Ops! Il calcolo non è disponbile.";
}

function getFetalDescription(week) {
    // Descrizioni per il feto per ogni settimana di gravidanza
    var descriptions = {
		0: "Nella prima settimana, potresti non essere ancora a conoscenza della gravidanza, poiché la concezione di solito avviene entro la fine di questa settimana. Prenditi cura di te stessa senza sapere ancora cosa sta accadendo all'interno del tuo corpo.",
  1: "Anche se potrebbe sembrare presto per pensare alla gravidanza, questa è la settimana in cui tutto ha inizio. Il tuo corpo si sta preparando per l'incredibile viaggio che ti attende. Prenditi cura di te, mantieni un'alimentazione sana e ricorda di bere molta acqua.",
  2: "Durante questa seconda settimana, le tue ovaie hanno generato un ovocita che sarà poi catturato dalla tuba di Falloppio durante il processo di ovulazione; gli estrogeni, nel mentre, modificano la cavità uterina che accoglierà il tuo piccino.",
  3: "Nonostante la tua gravidanza potrebbe non essere ancora confermata da un test, durante questa settimana il tuo corpo sta producendo l'ormone della gravidanza, l'hCG. Alcune donne possono sperimentare leggeri sintomi, come stanchezza o sensibilità al seno.",
  4: "In questa settimana, il tuo embrione si sta impiantando nella parete uterina. Potresti iniziare a notare alcune lievi perdite, chiamate 'spotting', che è un segno comune di impianto. Mantieni una dieta sana e prendi acido folico.",
  5: "L'embrione ha ora circa due settimane di vita ed è lungo meno di un millimetro. Anche se è ancora troppo piccolo per essere visibile, il tuo corpo sta lavorando duramente per nutrirlo e proteggerlo.",
  6: "Il tuo piccolo è lungo circa 1,5 millimetri, ma crescerà rapidamente. Il sistema nervoso inizia a svilupparsi, così come la colonna vertebrale e il cuore primitivo. Continua a seguire una dieta equilibrata e a prendere gli integratori raccomandati.",
  7: "Il tuo piccolo è ora lungo circa 4 millimetri e ha una forma vagamente simile a un embrione umano. Inizia a svilupparsi la testa, gli occhi, le orecchie e la bocca. Assicurati di evitare alcol e sostanze nocive.",
  8: "Nella nona settimana, il tuo piccolo è diventato ufficialmente un feto. Tutti gli organi principali si stanno sviluppando rapidamente, e il tuo piccolo inizia a muoversi, anche se non lo sentirai ancora. Mantieni uno stile di vita sano.",
  9: "Il tuo piccolo ha ora una lunghezza di circa 2,5 centimetri e sta crescendo a vista d'occhio. Inizia a formarsi il viso, con le narici, la bocca e le orecchie ben evidenti. È un periodo cruciale per lo sviluppo. Continua a prendere acido folico e fai esercizio leggero.",
  10: "Nella decima settimana, il tuo piccolo ha una lunghezza di circa 3,5 centimetri. Le dita delle mani e dei piedi si stanno formando, così come i capelli e le unghie. Potresti iniziare a notare cambiamenti nel tuo corpo, come seni più pieni e maggiore affaticamento.",
  11: "Il tuo piccolo è lungo circa 5 centimetri ed è in costante movimento, anche se non lo senti ancora. Le ossa iniziano a svilupparsi, e il tuo feto inizia a succhiare il pollice. Mantieni una dieta equilibrata e consulta il tuo medico per i primi esami prenatali.",
  12: "Alla dodicesima settimana, il tuo piccolo ha una lunghezza di circa 6 centimetri e pesa circa 14 grammi. Il sistema digestivo si sviluppa ulteriormente, e il tuo feto inizia a fare movimenti respiratori. Potresti iniziare a sentirti meno stancata.",
  13: "Il tuo piccolo ha ora circa 7 centimetri di lunghezza e il corpo sta diventando più proporzionato. I genitali esterni sono in fase di sviluppo, ma è troppo presto per rivelare il sesso. Alcune donne iniziano a notare un aumento di energia.",
  14: "Nella quattordicesima settimana, il tuo piccolo ha una lunghezza di circa 8 centimetri e pesa circa 23 grammi. Il capelli iniziano a crescere, così come le ciglia e i sopraccigli. Il tuo feto può fare facce e succhiare il pollice. Potresti iniziare a sentire i primi movimenti.",
  15: "Il tuo piccolo è lungo circa 9 centimetri e pesa circa 43 grammi. La pelle è ancora molto sottile e traslucida, ma il corpo si sta coprendo di lanugine. Potresti iniziare a sperimentare la 'linea nigra' sulla pancia. Continua a seguire una dieta sana.",
  16: "Alla sedicesima settimana, il tuo piccolo ha una lunghezza di circa 10 centimetri e pesa circa 70 grammi. Il sistema muscolare si sta sviluppando, e il tuo feto può muovere gli arti in modo più coordinato. Potresti iniziare a notare la pancia che cresce.",
  17: "Il tuo piccolo è lungo circa 11 centimetri e pesa circa 100 grammi. Il corpo sta crescendo più velocemente e il tuo feto inizia a sviluppare il riflesso di suzione. Potresti iniziare a notare miglioramenti nella tua pelle e nei capelli.",
  18: "Nella diciottesima settimana, il tuo piccolo ha una lunghezza di circa 12 centimetri e pesa circa 140 grammi. Inizia a svilupparsi il senso dell'udito, quindi potresti considerare di leggere storie al tuo piccolo. Potresti anche iniziare a sentire i movimenti del feto più chiaramente.",
  19: "Il tuo piccolo è lungo circa 14 centimetri e pesa circa 190 grammi. Il corpo sta diventando più proporzionato, e la cute è ancora coperta da lanugine. Potresti iniziare a notare un aumento di energia.",
  20: "Alla ventesima settimana, il tuo piccolo ha una lunghezza di circa 16 centimetri e pesa circa 260 grammi. Inizia a svilupparsi il sistema immunitario, e il tuo feto potrebbe iniziare a deglutire il liquido amniotico. Potresti sperimentare l'aumento di fame.",
    21: "Nella ventunesima settimana, il tuo piccolo ha una lunghezza di circa 27 centimetri e pesa circa 360 grammi. Il sistema digerente si sta sviluppando ulteriormente, e il tuo feto potrebbe iniziare a succhiare il pollice. Continua a prestare attenzione alla tua alimentazione e all'assunzione di nutrienti essenziali.",
  22: "Il tuo piccolo è lungo circa 28 centimetri e pesa circa 430 grammi. I suoi movimenti sono più evidenti, e potresti sentire calci e spinte più chiaramente. Assicurati di mantenere un adeguato apporto di calcio nella tua dieta.",
  23: "Nella ventitreesima settimana, il tuo piccolo ha una lunghezza di circa 29 centimetri e pesa circa 501 grammi. La cute è ancora rugosa a causa della mancanza di grasso sottocutaneo. Inizia a svilupparsi il senso dell'equilibrio.",
  24: "Il tuo piccolo è lungo circa 30 centimetri e pesa circa 600 grammi. I polmoni stanno continuando a svilupparsi, anche se sono ancora immaturi. Il tuo feto inizia a sperimentare il sonno e la veglia.",
  25: "Alla venticinquesima settimana, il tuo piccolo ha una lunghezza di circa 34 centimetri e pesa circa 660 grammi. I capelli sulla testa stanno crescendo, e il feto può sentire i suoni esterni, inclusi la tua voce e la musica.",
  26: "Il tuo piccolo è lungo circa 35 centimetri e pesa circa 760 grammi. Gli occhi si stanno aprendo gradualmente, e il tuo feto inizia a distinguere la luce dall'oscurità. Assicurati di continuare a seguire le visite prenatali.",
  27: "Nella ventisettesima settimana, il tuo piccolo ha una lunghezza di circa 36 centimetri e pesa circa 875 grammi. I polmoni stanno sviluppando ulteriormente, e il feto potrebbe iniziare a prendere posizioni diverse nel tuo utero.",
  28: "Il tuo piccolo è lungo circa 37 centimetri e pesa circa 1005 grammi. La cute è ancora rugosa, ma il grasso sottocutaneo si sta accumulando gradualmente. I movimenti del feto sono più evidenti, e potresti notare calci più forti.",
  29: "Il tuo piccolo ha una lunghezza di circa 38 centimetri e pesa circa 1150 grammi. Inizia a svilupparsi il riflesso di suzione, e il feto potrebbe succhiare il pollice o le dita. Continua a prestare attenzione alla tua dieta e all'esercizio fisico moderato.",
  30: "Alla trentesima settimana, il tuo piccolo ha una lunghezza di circa 39 centimetri e pesa circa 1305 grammi. I polmoni si stanno preparando per la respirazione al di fuori dell'utero. Potresti sperimentare il 'nido' e iniziare a preparare la casa per l'arrivo del tuo bebè.",
  31: "Il tuo piccolo è lungo circa 40 centimetri e pesa circa 1500 grammi. Il sistema immunitario sta continuando a svilupparsi, e il feto inizia a immagazzinare ferro nel suo corpo. Assicurati di mantenere una dieta ricca di nutrienti.",
  32: "Nella trentaduesima settimana, il tuo piccolo ha una lunghezza di circa 41 centimetri e pesa circa 1702 grammi. Il sistema nervoso è sempre più sviluppato, e il feto può sentire e rispondere ai suoni esterni, inclusi i battiti del tuo cuore.",
  33: "Il tuo piccolo è lungo circa 42 centimetri e pesa circa 1918 grammi. I polmoni si stanno maturando, e il feto inizia a praticare la respirazione attraverso il liquido amniotico. Potresti sperimentare braxton hicks, le cosiddette 'contrazioni di prova'.",
  34: "Il tuo piccolo ha una lunghezza di circa 43 centimetri e pesa circa 2146 grammi. Il tessuto adiposo sottocutaneo si sta accumulando, e la cute sta diventando meno rugosa. Il feto ha meno spazio per muoversi, ma i movimenti sono ancora evidenti.",
  35: "Alla trentacinquesima settimana, il tuo piccolo ha una lunghezza di circa 44 centimetri e pesa circa 2383 grammi. Il sistema digestivo sta maturando ulteriormente, e il feto potrebbe iniziare a passare il meconio, la prima feci del neonato.",
  36: "Il tuo piccolo è lungo circa 45 centimetri e pesa circa 2622 grammi. Il sistema immunitario si sta preparando per la vita al di fuori dell'utero, grazie agli anticorpi che sta ricevendo da te. Continua a seguire le visite prenatali e a prepararti per il parto.",
  37: "Nella trentasettesima settimana, il tuo piccolo ha una lunghezza di circa 46 centimetri e pesa circa 2859 grammi. Il feto è sempre più stretto nello spazio uterino, quindi i movimenti potrebbero essere meno intensi, ma dovresti ancora sentirli.",
  38: "Il tuo piccolo è lungo circa 47 centimetri e pesa circa 3083 grammi. La maggior parte degli organi è ormai completamente sviluppata, e il feto si sta preparando per il passaggio attraverso il canale del parto. Mantieni la calma e continua a prepararti per l'arrivo del tuo bebè.",
  39: "Alla trentanovesima settimana, il tuo piccolo ha una lunghezza di circa 48 centimetri e pesa circa 3300 grammi. Il feto potrebbe iniziare a muoversi verso la posizione di testa in vista del parto. Assicurati di avere tutto pronto per l'ospedale o il luogo in cui darai alla luce.",
  40: "Il grande giorno è alle porte! Alla quarantesima settimana, il tuo piccolo ha una lunghezza di circa 49 centimetri e pesa circa 3500 grammi o più. Ora sei a termine, e il tuo corpo è pronto per il travaglio e il parto. Presta attenzione ai segnali del tuo corpo e preparati per incontrare il tuo bebè molto presto!"
    };

    return descriptions[week] || "Ops! Il calcolo non è disponbile.";
}

function getFetalImage(week) {
    // Aggiungi immagini per ogni settimana di gravidanza
    var fetalImages = {
		0: "00.svg",
        1: "01.svg",
        2: "02.svg",
        3: "03.svg",
        4: "04.svg",
        5: "05.svg",
        6: "06.svg",
        7: "07.svg",
        8: "08.svg",
        9: "09.svg",
        10: "10.svg",
        11: "11.svg",
        12: "12.svg",
        13: "13.svg",
        14: "14.svg",
        15: "15.svg",
        16: "16.svg",
        17: "17.svg",
        18: "18.svg",
        19: "19.svg",
        20: "20.svg",
        21: "21.svg",
        22: "22.svg",
        23: "23.svg",
        24: "24.svg",
        25: "25.svg",
        26: "26.svg",
        27: "27.svg",
        28: "28.svg",
        29: "29.svg",
        30: "30.svg",
        31: "31.svg",
        32: "32.svg",
        33: "33.svg",
        34: "34.svg",
        35: "35.svg",
        36: "36.svg",
        37: "37.svg",
        38: "38.svg",
        39: "39.svg",
        40: "40.svg"
    };

    return fetalImages[week] || "";
}

function getTipsAndFacts(week) {
    // Aggiungi consigli e suggerimenti per ogni settimana di gravidanza
    var TipsAndFacts = {
		0: "È ancora troppo presto per parlare di gravidanza, ma puoi già cominciare a creare un piccolo cantuccio per la vita che porterai in grembo! Prenditi cura di te, elimina o almeno modera gli alcolici e non fumare.",
        1: "Il calcolo dell'età gestazionale è molto diverso da quella del concepimento: la crescita del tuo bambino, così come la data presunta del parto, verrà valutata in base alla data delle ultime mestruazioni. Ecco un consiglio importante: inizia a fare delle modifiche positive al tuo stile di vita. Elimina il fumo, l'alcol e qualsiasi farmaco che potrebbe non essere sicuro per la gravidanza. La tua salute e quella del tuo bambino sono adesso la tua priorità. Continua a seguire una dieta equilibrata e, se non lo hai già fatto, parla con il tuo medico sulla possibilità di iniziare un programma di attività fisica moderata; questo ti aiuterà a rimanere in forma e a gestire al meglio la gravidanza.",
        2: "Il periodo migliore per rimanere incinta è solitamente due settimane dopo le ultime mestruazioni: è il momento giusto per un po' di coccole con il partner!",
        3: "Potresti iniziare a notare dei cambiamenti nelle tue abitudini alimentari e nei tuoi gusti. Alcune donne sperimentano leggeri cambiamenti del palato o voglie insolite.",
        4: "Elimina - almeno per il momento - salumi ed insaccati. Lava con il bicarbonato o con prodotti specifici le verdure crude e la frutta. Questi accorgimenti ti aiuteranno ed evitare la toxoplasmosi: se non hai mai sviluppato questa zoonosi (lo scoprirai con un esame ematico di routine durante la gravidanza) dovrai continuare a seguire questa dieta. Elimina alcolici e fumo.",
        5: "Sono incinta? La quinta settimana è quella in cui la maggior parte delle donne si pone la fatidica domanda!",
        6: "I gatti sono portatori di un'importante zoonosi, la toxoplasmosi. Se hai un micio in casa fai attenzione a non farti graffiare o leccare, ed evita assolutamente di pulire la sua lettiera.",
        7: "L'embrione è cresciuto di 10.000 volte rispetto a qualche settimana fa. Impressionante!",
        8: "Il tuo piccolino comincia ad agitarsi dentro di te, ma non preoccuparti: ha un sacco di spazio in cui muoversi!",
        9: "Questo è il periodo in cui ti verranno tante voglie strane ma stai tranquilla: se non riesci a soddisfarne una tuo figlio non nascerà con una macchia sulla pelle come in molti credono!",
        10: "Il cuore del tuo piccino batte a 180 battiti al minuti, tre volte quello di suo papà.",
        11: "Mentre il tuo bambino continua a crescere, potresti iniziare a notare un maggiore afflusso di sangue alle gengive, che potrebbero apparire più gonfie e sensibili.",
        12: "Nel secondo trimestre, potresti finalmente sperimentare un aumento dell'energia e una diminuzione della stanchezza. Questo è un buon momento per iniziare a praticare esercizi leggeri.",
        13: "Il tuo bambino sta crescendo rapidamente e potresti iniziare a sentire i primi movimenti, spesso descritti come 'scatti' o 'sensazioni di farfalla'.",
        14: "Il tuo corpo sta iniziando a produrre più sangue per sostenere la crescita del bambino. Potresti notare un leggero arrossamento della pelle.",
        15: "In questa settimana, potresti iniziare a notare un aumento della sudorazione. Questo è normale poiché il tuo corpo sta lavorando di più per sostenere la gravidanza.",
        16: "Con l'entrata nel quarto mese, potresti notare che i tuoi capelli sembrano più folti e lucenti. Questo è dovuto agli ormoni della gravidanza.",
        17: "Il tuo bambino sta sviluppando il sistema nervoso e potresti iniziare a sentire piccoli movimenti regolari. Potrebbe essere il momento giusto per iniziare a pianificare la tua lista di nascita.",
        18: "In questa settimana, potresti notare un aumento della fame e delle voglie. Assicurati di consumare una dieta equilibrata e ricca di nutrienti.",
        19: "Stai entrando nel quinto mese e potresti iniziare a notare un aumento del tuo appetito. Assicurati di soddisfare la tua fame con opzioni nutrienti e sane.",
        20: "Il tuo bambino è ora abbastanza grande da iniziare a sentire i suoni dal mondo esterno. Potresti notare che i suoi movimenti sono diventati più decisi e pronunciati.",
        21: "Mentre il tuo corpo si adatta ai cambiamenti, potresti notare che il tuo girovita sta iniziando a diventare più pronunciato. Questo è un segno dei cambiamenti in corso nel tuo utero.",
        22: "Il tuo bambino sta crescendo rapidamente e potresti iniziare a sperimentare qualche dolore lombare. Assicurati di praticare esercizi per il tono muscolare e il benessere.",
        23: "In questa settimana, il tuo corpo sta lavorando sodo per fornire tutti i nutrienti necessari al tuo bambino in crescita. Assicurati di mangiare cibi ricchi di nutrienti e bere molta acqua.",
        24: "Stai entrando nel sesto mese e potresti iniziare a notare un aumento delle voglie per certi cibi. Cerca di bilanciare le tue voglie con una dieta equilibrata.",
        25: "Il tuo bambino sta sviluppando i suoi sensi e potrebbe essere in grado di sentire suoni provenienti dall'esterno del tuo corpo. Parlagli dolcemente e fai ascoltare la tua voce.",
        26: "In questa settimana, potresti iniziare a sperimentare alcuni disturbi del sonno. Trova posizioni comode per dormire e prendi il tuo tempo per rilassarti prima di coricarti.",
        27: "Il tuo utero sta crescendo e potresti iniziare a notare un leggero gonfiore delle mani e dei piedi. Solleva le gambe quando puoi e bevi molta acqua per ridurre il gonfiore.",
        28: "Con l'arrivo del terzo trimestre, potresti notare che il tuo respiro è diventato più corto. Ciò è dovuto alla pressione esercitata dall'utero sul diaframma. Prenditi pause per respirare profondamente.",
        29: "Stai entrando nell'ottavo mese e potresti iniziare a sentire contrazioni di Braxton Hicks. Queste contrazioni fanno parte della preparazione del tuo corpo al travaglio.",
        30: "Il tuo bambino sta crescendo rapidamente e potresti iniziare a sentire i suoi movimenti più energici. Prenditi il ​​tempo per rilassarti e goderti queste interazioni.",
        31: "In questa settimana, potresti iniziare a notare cambiamenti nella tua postura. La crescita del tuo bambino influisce sulla distribuzione del peso nel tuo corpo.",
        32: "Il tuo bambino sta accumulando riserve di grasso per sostenere la crescita e la termoregolazione. Potresti notare che il tuo stomaco è diventato abbastanza grande da influenzare il tuo equilibrio.",
        33: "Con l'entrata nel nono mese, potresti notare un aumento dell'affaticamento. Il tuo corpo sta lavorando sodo per supportare il bambino e potrebbe essere il momento di prendere più riposo.",
        34: "Il tuo bambino sta assumendo una posizione per il travaglio, spesso con la testa rivolta verso il basso. Potresti notare che la pressione sulla vescica è aumentata, portando a frequenti viaggi in bagno.",
        35: "In questa settimana, potresti iniziare a sentire una maggiore pressione nella zona pelvica. Questo è normale poiché il tuo corpo si prepara al parto.",
        36: "Il tuo corpo sta producendo colostro, il primo latte ricco di nutrienti per il tuo bambino. Prenditi del tempo per conoscere le basi dell'allattamento al seno.",
        37: "Il tuo bambino è considerato a termine e potrebbe nascere in qualsiasi momento. Continua a monitorare i segni del travaglio e mantieni un contatto regolare con il tuo medico.",
        38: "Con l'arrivo dell'ultima settimana del tuo trimestre, potresti notare che il tuo respiro è diventato più profondo. Il tuo corpo sta preparandosi per il travaglio imminente.",
        39: "Il tuo corpo è pronto per il parto e potresti sperimentare un aumento della frequenza delle contrazioni. Assicurati di avere tutto pronto per l'arrivo del tuo bambino.",
        40: "Stai arrivando alla fine del tuo incredibile viaggio di gravidanza. Il tuo corpo è pronto per il parto e presto incontrerai finalmente il tuo piccolo tesoro."
    };

    return TipsAndFacts[week] || "Non disponibile";
}

function getExams(week) {
    // Aggiungi gli esami consigliati per ogni settimana di gravidanza
    var exams = {
		0: "Non ci sono esami specifici per questa settimana, è ancora un po' presto.",
        1: "Il primo passo è confermare la gravidanza, e puoi farlo attraverso un test di gravidanza domestico. Questo test rileverà l'ormone beta-hCG nelle tue urine: se il test risulta positivo non c'è bisogno di preoccuparsi, è una notizia meravigliosa. Oltre a questo è il momento di iniziare ad assumere l'acido folico. Questo piccolo integratore è incredibilmente importante per il benessere del tuo futuro bambino, poiché aiuta a prevenire difetti del tubo neurale e contribuisce allo sviluppo del cervello e del midollo spinale del feto. Buon inizio di gravidanza!",
        2: "Non ci sono esami specifici per questa settimana.",
        3: "In questa settimana, potresti iniziare a pensare a una visita prenatale iniziale. Il tuo medico potrebbe prescrivere un esame del sangue completo per verificare i livelli di emoglobina, globuli bianchi e altri parametri importanti per la tua salute.",
        4: "Durante questa settimana, potresti sottoporsi a un esame delle urine per verificare la presenza di infezioni o altri problemi renali. Il medico potrebbe anche consigliarti un esame ecografico per confermare la posizione dell'embrione nell'utero.",
        5: "In questa fase, potresti considerare un esame del sangue per rilevare eventuali malattie sessualmente trasmissibili (MST). È importante garantire una buona salute sessuale durante la gravidanza.",
        6: "Durante questa settimana, potresti iniziare a pianificare il tuo primo esame ecografico. L'ecografia potrebbe rivelare il battito cardiaco del feto e confermare la data presunta del parto.",
        7: "È consigliabile fare un esame del sangue per verificare i livelli di ormoni tiroidei. Le fluttuazioni ormonali durante la gravidanza potrebbero influenzare la funzione della tiroide.",
        8: "Durante questa settimana, potresti sottoporsi a un esame delle urine per monitorare i livelli di proteine e zucchero. Il medico potrebbe anche consigliarti un esame per verificare la presenza di eventuali anomalie cromosomiche.",
        9: "In questa fase, potresti fare un esame del sangue per rilevare la presenza di anticorpi Rh nel tuo sistema. Se sei Rh negativa e il tuo partner è Rh positivo, potresti avere bisogno di un trattamento specifico.",
        10: "Durante questa settimana, potresti considerare un esame ecografico per valutare la crescita del feto e il funzionamento della placenta. Questa ecografia aiuterà a rilevare eventuali anomalie precoci.",
        11: "Potresti sottoporsi a un esame del sangue per valutare il rischio di malattie genetiche ereditarie. Questo test potrebbe essere consigliato in base alla tua storia familiare e al tuo background etnico.",
        12: "In questa fase, potrebbe essere consigliato un esame del sangue per misurare i livelli di alfa-fetoproteina (AFP). Questo test può rilevare eventuali anomalie neurali nel feto.",
        13: "Durante questa settimana, potresti considerare un esame ecografico dettagliato, noto come ecografia del primo trimestre. Questo esame aiuta a valutare la salute del feto e a rilevare possibili anomalie.",
        14: "Potresti fare un esame del sangue per verificare i livelli di ormoni tiroidei e l'insulina. Mantenere questi livelli sotto controllo è importante per la tua salute e quella del tuo bambino.",
        15: "In questa fase, potresti discutere con il tuo medico la possibilità di sottoporsi a un test diagnostico prenatale, come l'amniocentesi o la villocentesi. Questi test possono rilevare eventuali anomalie cromosomiche con maggiore precisione.",
        16: "Durante questa settimana, potresti fare un esame delle urine per verificare la presenza di zucchero e proteine. Questo esame è importante per monitorare la tua salute renale.",
        17: "Potrebbe essere il momento di pianificare una seconda ecografia, nota come ecografia morfologica del secondo trimestre. Questo esame valuta dettagliatamente l'anatomia del feto e può rilevare eventuali malformazioni.",
        18: "Durante questa fase, potresti sottoporsi a un esame del sangue per verificare i livelli di ferro e altre sostanze nutritive. Mantenere un buon apporto di nutrienti è essenziale per la tua salute e quella del bambino.",
        19: "In questa settimana, potresti discutere con il tuo medico la possibilità di un test non invasivo di screening per rilevare eventuali anomalie genetiche nel feto. Questo test potrebbe includere il sequenziamento del DNA fetale.",
        20: "Potresti considerare un esame ecografico avanzato, noto come ecografia fetale. Questo esame valuta l'anatomia e la crescita del feto in dettaglio, consentendo al medico di monitorare la sua salute.",
        21: "Durante questa settimana, potresti considerare un esame diagnostico prenatale come l'amniocentesi o la villocentesi, se non lo hai ancora fatto. Questi test possono rilevare eventuali anomalie genetiche con maggiore precisione.",
        22: "Potresti fare un esame del sangue per controllare i livelli di zucchero e diagnosticare eventuali problemi di diabete gestazionale. Mantenere il controllo dei livelli di zucchero è importante per la tua salute e quella del bambino.",
        23: "In questa fase, potrebbe essere consigliato un esame ecografico dettagliato per valutare la crescita e lo sviluppo del feto. L'ecografia aiuta a monitorare la salute complessiva del bambino.",
        24: "Potresti considerare un esame del sangue per verificare i livelli di proteine e albumina. Questo esame è importante per monitorare la tua salute renale e quella del bambino.",
        25: "Durante questa settimana, potresti sottoporsi a un esame ecografico per valutare l'anatomia e la crescita del feto. L'ecografia aiuta a rilevare eventuali problemi e a garantire una gravidanza sana.",
        26: "Potrebbe essere il momento di fare un esame del sangue per controllare i livelli di emoglobina. Mantenere livelli adeguati di emoglobina è essenziale per prevenire l'anemia durante la gravidanza.",
        27: "In questa fase, potresti considerare un esame dell'urina per controllare la presenza di proteine e zucchero. Questo esame è importante per monitorare la tua salute renale e quella del bambino.",
        28: "Potresti sottoporsi a un esame ecografico dettagliato per valutare l'anatomia e la crescita del feto. L'ecografia fornisce informazioni preziose sullo stato di salute del bambino.",
        29: "Durante questa settimana, potresti fare un esame del sangue per controllare i livelli di zucchero e monitorare eventuali problemi di diabete gestazionale.",
        30: "Potrebbe essere il momento di un esame ecografico tridimensionale (3D) o ecocardiografico fetale. Questi esami forniscono immagini dettagliate del feto e del suo cuore.",
        31: "Durante questa settimana, potresti considerare un esame ecografico per monitorare la crescita e lo sviluppo del tuo bambino. L'ecografia fornisce informazioni dettagliate sulla salute fetale.",
        32: "Potrebbe essere il momento di fare un esame del sangue per controllare i livelli di ferro. Mantenere livelli adeguati di ferro è importante per prevenire l'anemia.",
        33: "In questa fase, potresti sottoporsi a un esame dell'urina per verificare la presenza di proteine e zucchero. Questo esame è importante per monitorare la tua salute renale e quella del bambino.",
        34: "Potresti fare un esame ecografico per valutare la posizione del tuo bambino e la quantità di liquido amniotico. Queste informazioni sono essenziali per il monitoraggio finale della gravidanza.",
        35: "Durante questa settimana, potresti fare un esame del sangue per verificare i livelli di zucchero e controllare il diabete gestazionale.",
        36: "Potrebbe essere il momento di sottoporsi a un esame ecografico per monitorare la crescita e la posizione del tuo bambino. L'ecografia aiuta a garantire una gravidanza sicura e sana.",
        37: "In questa fase, potresti fare un esame del sangue per controllare i livelli di emoglobina e ferro. Mantenere buoni livelli di emoglobina è importante per la tua salute e quella del bambino.",
        38: "Potresti considerare un esame ecografico per monitorare l'anatomia, la posizione e la crescita del tuo bambino. Queste informazioni sono fondamentali per l'ultima fase della gravidanza.",
        39: "Durante questa settimana, potresti fare un esame del sangue per controllare i livelli di zucchero e monitorare il diabete gestazionale.",
        40: "Potrebbe essere il momento di sottoporsi a un esame ecografico finale per valutare la posizione del tuo bambino e prepararti al parto. Mantieni la calma e ricorda che stai per vivere un momento straordinario!"
    };

    return exams[week] || "Non disponibile";
}
