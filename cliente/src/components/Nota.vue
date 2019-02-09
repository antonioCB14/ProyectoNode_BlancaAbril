<template>
  <div class="nota">
    <div v-if="ensenar != true">
      <div class="mx-auto w-50">
        <h1>Proyecto Vue.js - Blanca Abril Gonzalez</h1>
        <b-form-input
          v-model="usuario"
          type="text"
          @keypress.native.enter="comprobarUsuario()"
          placeholder="Introduce nick?"
        ></b-form-input>
        <file-pond
          name="imagen"
          ref="pond"
          accepted-file-types="image/jpeg, image/png"
          label-idle="Drop files here..."
          allow-multiple="false"
          server="http://127.0.0.1:3000/upload"
          v-on:init="handleFilePondInit"
        />
      </div>
    </div>
    <div v-if="ensenar == true">
      

      <div class="mx-auto w-50">
        <h1>Proyecto Vue.js - Blanca Abril Gonzalez</h1>
        <br>
        <br>
        <input
          class="form-control input-lg"
          id="introducir"
          v-model="nuevaNota"
          @keypress.enter="anadirNota()"
          placeholder="What do you want to remember?"
        >
      </div>
      <div class="mx-auto w-50">
        <hr>
        <p style="text-align:left; ">
          <font-awesome-icon icon="chart-bar" style="height:13px;"></font-awesome-icon>
          {{ pendientes }} pending tasks of a total of {{ todo.length }} |
          <a
            style="color:orange; cursor:pointer;"
            @click="borrarTodas()"
          >
            <font-awesome-icon icon="times" style="height:13px;"></font-awesome-icon>Delete completed tasks
          </a>
        </p>
        <hr>
      </div>
      <div
        class="animated fadeInLeft mx-auto w-50"
        style="margin:0px auto; width: 70; border: 1px solid #807979; background-color:#342f2f; border-radius:5px;"
      >
        <div style="border: 1px solid #807979;" v-for="(todos,index) in filtrarTarea" :key="index">
          <b-container class="bv-example-row">
            <b-row align-v="center">
              <b-col cols="1">
                <b-button
                  variant="basic"
                  style="color:green;"
                  @click="cambiarCompletada(index,true)"
                  v-if="!todos.completada"
                >
                  <font-awesome-icon :icon="['far','circle']"></font-awesome-icon>
                </b-button>
                <b-button
                  variant="basic"
                  style="color:green;"
                  @click="cambiarCompletada(index,false)"
                  v-else
                >
                  <font-awesome-icon :icon="['far','check-circle']"></font-awesome-icon>
                </b-button>
              </b-col>
              <b-col cols="10" style=" text-align:left">
                <h1 v-if="!todos.completada">{{ todos.message }}</h1>
                <h1 v-else>
                  <Strike style="color:green">{{ todos.message }}</Strike>
                </h1>
              </b-col>
              <b-col class="align-self-end" cols="1">
                <b-button variant="danger" @click="borrar(index)">
                  <font-awesome-icon icon="minus-circle"></font-awesome-icon>
                </b-button>
              </b-col>
            </b-row>

            <b-row align-v="center">
              <b-col cols="1">
                <p style="margin-top:50%;">Priority:</p>
              </b-col>
              <div v-if="todos.prioridad == '3Baja'">
                <b-col cols="1">
                  <b-button-group size="sm">
                    <b-button variant="info" @click="cambiarValor(index,'3Baja')">Low</b-button>
                    <b-button @click="cambiarValor(index,'2Media')">Normal</b-button>
                    <b-button @click="cambiarValor(index,'1Alta')">High</b-button>
                  </b-button-group>
                </b-col>
              </div>

              <div v-if="todos.prioridad == '2Media'">
                <b-col cols="1">
                  <b-button-group size="sm">
                    <b-button @click="cambiarValor(index,'3Baja')">Low</b-button>
                    <b-button @click="cambiarValor(index,'2Media')" variant="primary">Normal</b-button>
                    <b-button @click="cambiarValor(index,'1Alta')">High</b-button>
                  </b-button-group>
                </b-col>
              </div>

              <div v-if="todos.prioridad == '1Alta'">
                <b-col cols="1">
                  <b-button-group size="sm">
                    <b-button @click="cambiarValor(index,'3Baja')">Low</b-button>
                    <b-button @click="cambiarValor(index,'2Media')">Normal</b-button>
                    <b-button @click="cambiarValor(index,'1Alta')" variant="danger">High</b-button>
                  </b-button-group>
                </b-col>
              </div>

              <b-col cols="1" style="text-align:right; padding-right:0px;">
                <font-awesome-icon icon="clock"></font-awesome-icon>
              </b-col>
              <b-col cols="4" style="text-align:left; margin-top:2%;">
                <p>Added {{ todos.fecha | moment("from", "now", true) }}</p>
              </b-col>
              <b-col cols="3" style="text-align:left; margin-top:2%;">
                <p>Created by {{ todos.creador }}</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <file-pond
                  name="test"
                  ref="pond"
                  label-idle="Drop files here..."
                  allow-multiple="true"
                  server="http://127.0.0.1:3000/upload"
                  v-bind:files="myFiles"
                  v-on:init="handleFilePondInit"
                />
              </b-col>
            </b-row>
          </b-container>
        </div>
      </div>
    </div>
    <beautiful-chat
        :participants="participants"
        :titleImageUrl="titleImageUrl"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :open="openChat"
        :showEmoji="false"
        :showFile="false"
        :showTypingIndicator="showTypingIndicator"
        :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :messageStyling="messageStyling"
      />
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  name: "nota",
  data: function() {
    return {
      nuevaNota: "",
      todo: [],
      usuario: "",
      myFiles: [],
      ensenar: false,
      participants: [], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    };
  },
  created: function() {},

  sockets: {
    nota(notas) {
      this.todo = notas;
    },
    usuarioRe(usuarioServer) {
      this.$notify({
        group: "foo",
        type: "warn",
        title: "Important message",
        text: "Se ha conectado " + usuarioServer
      });
      this.ensenar = true;
    },

    nuevaNota(notaRecibida) {
      this.$notify({
        group: "foo",
        type: "warn",
        title: "Important message",
        text: "El usuario " + notaRecibida.creador + " ha creado una nota"
      });
    },

    desconexion(usuarioServer) {
      this.$notify({
        group: "foo",
        type: "warn",
        title: "Important message",
        text: "Se ha desconectado " + usuarioServer
      });
    },

    borrar(notaBorrada) {
      this.$notify({
        group: "foo",
        type: "warn",
        title: "Important message",
        text: "Se ha borrado la nota " + notaBorrada.message
      });
    },

    error_Login(){
      this.$notify({
        group: "foo",
        type: "error",
        title: "Important message",
        text: "Invalid user"
      });
      
    },

    participantes(chatUsuarios){
      this.participants = chatUsuarios;
    },

    mensajesEnviados(mensajes){
      this.messageList.push(mensajes);
    }
  },

  methods: {
    anadirNota: function() {
      this.todo.push({
        message: this.nuevaNota,
        prioridad: "3Baja",
        fecha: new Date(),
        completada: false,
        creador: this.usuario
      });
      this.$socket.emit("nuevaNota", {
        message: this.nuevaNota,
        prioridad: "3Baja",
        fecha: new Date(),
        completada: false,
        creador: this.usuario
      });
      this.nuevaNota = "";

      console.log(this.usuario);
      console.log(this.nuevaNota);

      //localStorage.setItem('todasNotas',JSON.stringify(this.todo));
    },

    cambiarCompletada: function(indice, valor) {
      this.ordenarTareas[indice].completada = valor;
      this.$socket.emit("nota", this.todo);
      //localStorage.setItem('todasNotas',JSON.stringify(this.todo));
    },

    borrar: function(indice) {
      var index = this.todo.indexOf(this.filtrarTarea[indice]);
      this.$socket.emit("borrar", index);
      this.$delete(this.todo, index);

      //localStorage.setItem('todasNotas',JSON.stringify(this.todo));
    },

    borrarTodas: function() {
      this.todo = this.ordenarTareas.filter(function(index) {
        return index.completada == false;
      });
      this.$socket.emit("nota", this.todo);
      //localStorage.setItem('todasNotas',JSON.stringify(this.todo));
    },
    cambiarValor: function(index, valor) {
      this.ordenarTareas[index].prioridad = valor;
      this.$socket.emit("nota", this.todo);
      //localStorage.setItem('todasNotas',JSON.stringify(this.todo));
    },
    crearModal: function() {
      this.$cuteModal.open("example");
    },
    handleFilePondInit: function() {
      console.log("FilePond has initialized");

      // FilePond instance methods are available on `this.$refs.pond`
    },

    comprobarUsuario: function() {
      this.$socket.emit("usuarioRe", this.usuario);
    },
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'me', type: 'text', data: { text } })
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.$socket.emit('chatMensajes',{ author: this.usuario , type: 'text', data: message.data })
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    }
  },
  computed: {
    pendientes: function() {
      var num = 0;
      for (var i = 0; i < this.todo.length; i++) {
        if (!this.ordenarTareas[i].completada) {
          num++;
        }
      }
      return num;
    },

    ordenarTareas: function() {
      return _.orderBy(this.todo, "prioridad");
    },

    filtrarTarea: function() {
      return this.ordenarTareas.filter(nota => {
        return (
          nota.message.toLowerCase().indexOf(this.nuevaNota.toLowerCase()) > -1
        );
      });
    }
  },
  components: {
    FilePond
  }
};
</script>


<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.contenedor {
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
}
.modal {
  padding: 10px;
  width: 500px;
  margin: 40px auto;
  background: white;
  box-shadow: 0px 0px 10px black;
}
.modalheader {
  background: #006699;
  margin: -10px;
  text-align: center;
}
h1 {
  text-align: center;
  color: rgb(255, 235, 235);
}
.close {
  background: red;
  color: white;
}
.derecha {
  float: right;
}
.izquierda {
  float: left;
  width: 490px;
}
.clear {
  clear: both;
}

.user-list{
  color: black;
}
</style>
