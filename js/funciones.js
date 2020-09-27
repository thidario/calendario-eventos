window.addEventListener("load", function(){

//variables para establecer una fecha
var nombreMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; 
var fecha = new Date(); // coge la fecha del ordenador
var hoy = fecha.getDate(); //devuelve el dia de la semana
var dia = fecha.getDay(); // devuelve el dia de hoy
var mes = fecha.getMonth(); // devuelve un nº entre 0 seria enero y 11 diciembre
var anyo = fecha.getFullYear(); // devuelve el año
var diaempi = 1;
var eventos = [];


//capturamos a cada uno de los elementos en el DOM
var calendario = document.querySelector(".fechas")
var dias = document.getElementById("dias");
var meses = document.getElementById("mes");
var any = document.getElementById("anyo");
var enlace = document.querySelectorAll("a");
var flechaAnterior = document.getElementById("mes-anterior");
var flechaSiguiente = document.getElementById("mes-siguiente");
var modal = document.querySelector(".modalContainer");
var textoModal = document.querySelector(".textoModal");
var modalTexto = JSON.stringify(textoModal);


//llamamos las funciones cuando haga click en las flechas 
flechaAnterior.addEventListener("click", ()=>mesAnterior());
flechaSiguiente.addEventListener("click", ()=>mesSiguiente());


//creamos las funciones que necesitamos
// funcion que tiene como parametro "mes" para escribir los meses 
function escribirMes(mesActual,anyoActual) {
	//pasamos el mes y año actual al DOM 
	meses.innerHTML = nombreMeses[mesActual];
	any.innerHTML = anyoActual;

	dias.innerHTML = "";

	for(var i=comienzaDia(); i>0; i--){ //para saber en que dia empieza el dia 1, sino serian todos el lunes. 
		var diaTemporal = document.createElement("div");
		diaTemporal.className = "fechas item fecha-anterior";
		diaTemporal.innerHTML = diasTotal(mes-1)-(i-1);
		dias.appendChild(diaTemporal); 
	}


	for(var i=1; i<=diasTotal(mesActual); i++){ // hacemos un bucle empezando por el dia 1
		var evento = false;
		var infoEvento; 

		for(var j = 0; j < eventos.length; j++){
			var fechaEvento = eventos[j].fecha.split("-");
			if(fechaEvento[0] == i + 1 && fechaEvento[1] == mesActual + 1 && fechaEvento[2] == anyoActual){
				evento = true;
				infoEvento = eventos[j];
			}
		}

		var diaTemporal = document.createElement("div");
		diaTemporal.className = "fechas item";

		if(evento){
			var enlaceEvento = document.createElement("a");
			enlaceEvento.href = "#modalTexto";
			enlaceEvento.setAttribute("data-evento",infoEvento.evento);
			enlaceEvento.innerHTML = i; 
			enlaceEvento.addEventListener("click", evento=>{
				evento.preventDefault();
				//console.log(infoEvento);
				modal.classList.add("visible");
				textoModal.innerHTML = infoEvento.evento;

				modal.addEventListener("click", evento=>{
				evento.preventDefault();
				modal.classList.remove("visible");
				});
			});
			diaTemporal.appendChild(enlaceEvento);
		}else{
			diaTemporal.innerHTML = i;
		}

		dias.appendChild(diaTemporal);
	
	}	


	for(var i=terminaDia() +1; i <= 6; i++){ //para saber en que dia empieza el dia 1, sino serian todos el lunes. 
		var diaTemporal = document.createElement("div");
		diaTemporal.className = "fechas item fecha-anterior";
		diaTemporal.innerHTML = diaempi;
		dias.appendChild(diaTemporal);
		diaempi=diaempi+1;
	}

	diaempi=1
}


//para saber el total de dias que tiene que escribir, si son 28, 29, 30 o 31
function diasTotal(meses) {
	if(meses === - 1) meses = 11;

	if(meses == 0 || meses == 2 || meses == 4 || meses == 6 || meses == 7 || meses == 9 || meses == 11) {
		return 31;

	}else if(meses == 3 || meses == 5 || meses == 8 || meses == 10) {
		return 30;

	}else{
		return bisiesto() ? 29:28;

	}

}


// 1 - para saber si es año bisiesto 
function bisiesto() {
	/*primero comprobamos que el año actual es bisiesto, si sacamos el modulo 
	de este año entre 100 tiene que ser distinto de 0. Además sacamos del año actual 
	su módulo de 4 tiene que ser igual a 0, o año actual entre 400. La función ya devuelve 
	un boolean, entonces hacemos un return para devolver el resultado de la comprobación. */
	return ((anyo % 100 !== 0) && (anyo % 4 === 0) || (anyo % 400 === 0))
}


// 2 - calcular para saber el dia que empieza la semana
function comienzaDia() {
	let comienza = new Date(anyo, mes, 1);// crea una nueva fecha para saber en que cae el dia 1 del mes
	return ((comienza.getDay()-1) === -1) ? 6 : comienza.getDay()-1; //devolvemos que dia de la semana es dia 1, devuelve 0 si es domingo o 6 si es sabado, adaptamos al calendario español para empezar el lunes. 
}


function terminaDia() {
	let termina = new Date(anyo, mes, diasTotal(mes));
	return ((termina.getDay()-1) === -1) ? 6 : termina.getDay()-1;
}


// 3 - dibuja el mes anterior y cambiar con las flechas
function mesAnterior() {
	if(mes !== 0) { //comprobamos si el mes es distinto de 0, si es así no estamos en enero.
		mes--;
	}else{
		mes = 11; // en el caso que estamos en enero y quitamos 1 mes, saltamos a diciembre y diciembre es mes 11. 
		anyo--; // por retroceder 1 mes diciembre, tambien retrocede el año.
	}

	setNewDate(); // establece la nueva fecha. 
}

// 4 - dibuja el mes siguiente 
function mesSiguiente() {
	if(mes !== 11) { //comprobamos si el mes es distinto de 11.
		mes++; // si es distinto de 11 sumamos 1 mes
	}else{
		mes = 0; // si el mes es 11, decimos que pase a enero. 
		anyo++; // el año sumamos 1.
	}

	setNewDate();
}

// 5 - establece la nueva fecha cuando se mueve el calendario 
function setNewDate() { //modificamos la fecha que ya tenemos, para esteblecer la nueva fecha.
	escribirMes(mes,anyo);
}


//eventos JSON
var peticionAjax = { 
	metodo: "GET",
	url: "eventos.json",
	callback: function (datos){
		var datos = JSON.parse(datos); // se mete los eventos en un array para imprimir en la consola
		for(var i=0; i<datos.length; i++){
			eventos.push(datos[i]);
		}

		//llamamos la funcion para escribir mes
		escribirMes(mes,anyo);

	}

}

ajax(peticionAjax);

});





