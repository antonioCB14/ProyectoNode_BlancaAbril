<!-- API KEY 8a01ab5ef3b353ed92527b2a84a01899 -->

<template>
  <div class="tiempo">
    <h1>Proyecto Vue.js - Blanca Abril Gonzalez  </h1> 
    <hr>
    <div v-if="this.datos != ''">
         <h3>Weather in {{this.datos.name}}</h3>
         <p style="font-size:10px;">Last update: {{this.hora}}</p>
        <b-container class="bv-example-row ">
            <b-row class="justify-content-md-center" >
                <img :src="icono">
                <h3>{{this.datos.main.temp}} ºC </h3>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <p class="text-capitalize">{{this.datos.weather[0].description}}</p>
                </b-col>
                 <hr>
            </b-row>
            <b-row class="mx-auto w-50" >
                <table class="table" style="background-color:#342f2f; border:1px solid #807979">
                <thead>
                    <tr>
                        <th scope="row" style="color:orange">Kind</th>
                        <th scope="row" style="color:orange">Data</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row"><font-awesome-icon icon="wind" style="height:13px; color: #bebebe;"></font-awesome-icon> Wind</th>
                        <td> {{this.datos.wind.speed}} m/s</td>
                    </tr>
                    <tr>
                        <th scope="row">Pressure</th>
                        <td>{{this.datos.main.pressure}} hPa</td>
                    </tr>
                     <tr>
                        <th scope="row">Humidity</th>
                        <td>{{this.datos.main.humidity}} %</td>
                    </tr>
                     <tr>
                        <th scope="row"><font-awesome-icon icon="temperature-high" style="height:13px; color: #bebebe;"/>Temperature Max</th>
                        <td>{{this.datos.main.temp_max}} ºC</td>
                    </tr>
                   <tr>
                        <th scope="row"><font-awesome-icon icon="temperature-low" style="height:13px; color: #bebebe;"/> Temperature Min</th>
                        <td>{{this.datos.main.temp_min}} ºC</td>
                    </tr>
                    <tr>
                        <th scope="row"><font-awesome-icon icon="sort-up" style="height:13px; color: #bebebe;"/><font-awesome-icon icon="cloud-sun" style="height:13px; color: #bebebe;"/> 
                        Sunrise</th>
                        <td>{{this.transformarDate(this.datos.sys.sunrise)}}</td>
                    </tr>
                    <tr>
                        <th scope="row"><font-awesome-icon icon="sort-down" style="height:13px; color: #bebebe;"/><font-awesome-icon icon="cloud-sun" style="height:13px; color: #bebebe;"/>
                         Sunset</th>
                        <td>{{this.transformarDate(this.datos.sys.sunset)}}</td>
                    </tr>
                </tbody>
                </table> 
            </b-row>
        </b-container>
    </div>
   
    
    
    
  </div>
</template>

<script>
export default {
  name: 'tiempo',
  data: function() {
    return {
      datos: [],
      lat:'',
      lon:'',
      APIkey:"8a01ab5ef3b353ed92527b2a84a01899",
      icono: '',
      hora:'',
      fields: [ 'Kind', 'Data'],
      items: [
      ]
       
    };
  },
  methods:{
    Tiempo: function () {		
	 if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(this.showPosition);
	 }else{
	 this.error = "Geolocation is not supported."; 
		 
	 }
    },
	showPosition:function (position) {	
		this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.recibirDatos();
    },

    transformarDate(dato){
        var date = new Date(dato*1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        return hours + ':' + minutes.substr(-2); 
    },
    
    recibirDatos(){
        if(this.lat != "" && this.lon != ""){
            this.axios.get('https://api.openweathermap.org/data/2.5/weather?lat='+this.lat+'&lon='+this.lon+'&units=metric&appid='+this.APIkey).then(response=>{
            this.datos = response.data;
            this.hora = new Date().getHours() + ":"+ new Date().getMinutes() + " " + new Date().getDate() + "/" + new Date().getMonth()+1 + "/"+ new Date().getFullYear();
            this.icono = "https://openweathermap.org/img/w/"+this.datos.weather[0].icon+".png";
        })
        }
    }
  },
  mounted(){
      setTimeout(this.Tiempo,600000);
      
  },

  beforeMount(){
      this.Tiempo();
  }

}
</script>