function ajax(configuracion){ 

	var conexion=new XMLHttpRequest();
	conexion.open(configuracion.metodo,configuracion.url);
	var datos=configuracion.datos||null;
		if(datos){
			conexion.setRequestHeader("Content-type",`application/${configuracion.tipo?"x-www-form-urlencoded":"json"}`) 
		}
	conexion.send(datos);
	conexion.addEventListener("load", function(){
		if(this.status==200){
			configuracion.callback(this.responseText)
		}
	})

}

/*objeto de configuración
{
	metodo:GET/POST(string)
	url:url(string)
	datos:solo en el caso de POST y será string
	tipo:boolean, solo true en el caso que los datos sean urlencoded
	callback:funcion que recibirá la respuesta (recibiendo responseText de Ajax)

}  */