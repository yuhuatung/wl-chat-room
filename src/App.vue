<template>
  <div id="app">
    <div class="content">
      <div class="chat-container">
        <transition :name="slideDirection">
          <Chat
            v-if="visible"
            v-show="!showCustomerComplaint"
            :participants="participants"
            :myself="myself"
            :messages="messages"
            :chat-title="chatTitle"
            :placeholder="placeholder"
            :colors="colors"
            :border-style="borderStyle"
            :hide-close-button="hideCloseButton"
            :close-button-icon-size="closeButtonIconSize"
            :submit-icon-size="submitIconSize"
            :submit-image-icon-size="submitImageIconSize"
            :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
            :async-mode="asyncMode"
            :scroll-bottom="scrollBottom"
            :display-header="true"
            :send-images="true"
            :profile-picture-config="profilePictureConfig"
            :timestamp-config="timestampConfig"
            @onImageClicked="onImageClicked"
            @onImageSelected="onImageSelected"
            @onMessageSubmit="onMessageSubmit"
            @onType="onType"
            @onClose="onClose('param value')"
            @showCustomerComplaint="show"
          />
        </transition>
        <transition :name="slideDirection">
          <CustomerComplaint v-show="showCustomerComplaint" @showCustomerComplaint="show" />
        </transition>
      </div>
      <!-- <div class="external-controller">
                <div class="controller-btn-container">
                    <button class="btn-message" @click="addMessage">Add menssage</button>
                    <button class="btn-participant" @click="addParticipant">Add participant</button>
                    <button class="btn-participant" @click="changeAllProps">Change All Props</button>
                </div>
                <div class="message-list">
                    <ol>
                        <li v-for="(message, index) in messages" :key="index">
                            {{message.content}}
                        </li>
                    </ol>
                </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import Chat from "./components/Chat.vue";
import CustomerComplaint from "./components/CustomerComplaint.vue";
import { Global } from '@/ts/globle';

export default {
  name: "app",
  components: {
    Chat,
    CustomerComplaint
  },
  data() {
    return {
      visible: true,
      participants: [
        {
          name: "Arnaldo",
          id: 1,
          profilePicture:
            "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/NafSadh_Profile.jpg/768px-NafSadh_Profile.jpg"
        },
        {
          name: "Adam",
          id: 2,
          profilePicture:
            "https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg"
        }
      ],
      myself: {
        name: "John Doe",
        id: 3,
        profilePicture:
          "https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg"
      },
      messages: [
        {
          content: "Really?! I don't care! Haha",
          participantId: 1,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true,
          type: "text"
        },
        {
          content: "Really?! I don't care! Haha",
          participantId: 1,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true,
          type: "text"
        },
        {
          content: "Really?! I don't care! Haha",
          participantId: 1,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true,
          type: "text"
        },
        {
          content: "Hey, Jhon Doe! How are you today",
          participantId: 1,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true,
          type: "text"
        },
        {
          content: "Hey, Adam! I'm felling really fine this evening.",
          participantId: 3,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true,
          type: "text"
        },
        {
          content: "Really?! I don't care! Haha",
          participantId: 1,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true,
          type: "text"
        }
      ],
      chatTitle: "金马在线客服",
      placeholder: "send your message",
      colors: {
        header: {
          bg: "#fff"
          // text: '#fff'
        },
        message: {
          myself: {
            bg: "#4290FF",
            text: "#fff"
          },
          others: {
            bg: "#fff",
            text: "#333"
          },
          messagesDisplay: {
            //bg: 'rgb(247, 243, 243)',
            //bg: '#f7f3f3'
            bg: "#F6F6F6"
          }
        },
        submitIcon: "#b91010",
        submitImageIcon: "#b91010"
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px"
      },
      hideCloseButton: false,
      submitIconSize: 24,
      submitImageIconSize: 24,
      closeButtonIconSize: "20px",
      asyncMode: true,
      toLoad: [
        {
          content: "Hey, John Doe! How are you today?",
          participantId: 2,
          timestamp: {
            year: 2016,
            month: 3,
            day: 5,
            hour: 10,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        },
        {
          content: "Hey, Adam! I'm feeling really fine this evening.",
          participantId: 3,
          timestamp: {
            year: 2016,
            month: 1,
            day: 5,
            hour: 19,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        }
      ],
      scrollBottom: {
        messageSent: true,
        messageReceived: false
      },
      profilePictureConfig: {
        others: true,
        myself: true,
        styles: {
          width: "36px",
          height: "36px",
          borderRadius: "50%"
        }
      },
      timestampConfig: {
        format: "HH:mm",
        relative: false
      },
      showCustomerComplaint: false,
      slideDirection: ""
    };
  },
  mounted(){
    Global.parseQueryString();
  },
  methods: {
    // eslint-disable-next-line
    onType: function(e) {
      // eslint-disable-next-line
      console.log("typing");
    },
    loadMoreMessages(resolve) {
      setTimeout(() => {
        resolve(this.toLoad);
        //Make sure the loaded messages are also added to our local messages copy or they will be lost
        this.messages.unshift(...this.toLoad);
        this.toLoad = [];
      }, 1000);
    },
    onMessageSubmit(message) {
      /*
       * example simulating an upload callback.
       * It's important to notice that even when your message wasn't send
       * yet to the server you have to add the message into the array
       */
      this.messages.push(message);

      /*
       * you can update message state after the server response
       */
      // timeout simulating the request
      setTimeout(() => {
        message.uploaded = true;
        message.viewed = true;
      }, 2000);
    },
    onClose(param) {
      console.log(param);
      this.visible = false;
    },
    addMessage() {
      /* this.messages.push(
                    {
                        content: "Update state",
                        // myself: false,
                        participantId: 1,
                        timestamp: {year: 2014, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    }
                ) */
      this.messages.push({
        type: "image",
        preview: null,
        src:
          "https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg",
        content: "image",
        participantId: 1,
        timestamp: {
          year: 2014,
          month: 3,
          day: 5,
          hour: 20,
          minute: 10,
          second: 3,
          millisecond: 123
        },
        uploaded: true,
        viewed: false
      });
    },
    addParticipant() {
      let participant = {
        name: "Karl",
        id: 4
      };
      this.participants.push(participant);
    },
    changeAllProps() {
      this.myself = {
        name: "I Qanah",
        id: 3
      };
      this.participants = [
        {
          name: "Ibrahim",
          id: 5
        },
        {
          name: "Ana",
          id: 6
        }
      ];
      this.messages = [
        {
          content: "Really?! I don't care! Haha",
          participantId: 5,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        },
        {
          content: "Really?! I don't care! Haha",
          participantId: 6,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        },
        {
          content: "Really?! I don't care! Haha",
          participantId: 3,
          timestamp: {
            year: 2012,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        }
      ];

      this.toLoad = [
        {
          content: "Hey, John Doe! How are you today?",
          participantId: 6,
          timestamp: {
            year: 2016,
            month: 3,
            day: 5,
            hour: 10,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        },
        {
          content: "Hey, Adam! I'm feeling really fine this evening.",
          participantId: 3,
          timestamp: {
            year: 2016,
            month: 10,
            day: 5,
            hour: 19,
            minute: 10,
            second: 3,
            millisecond: 123
          },
          uploaded: true,
          viewed: true
        }
      ];

      this.chatTitle = "Change All Participants";
      this.placeholder = "اكتب رسالتك هنا";
    },
    onImageSelected({ file, message }) {
      let src =
        "https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg";
      this.messages.push(message);
      /**
       * This timeout simulates a requisition that uploads the image file to the server.
       * It's up to you implement the request and deal with the response in order to
       * update the message status and the message URL
       */
      setTimeout(
        res => {
          message.uploaded = true;
          message.src = res.src;
        },
        3000,
        { src }
      );
    },
    onImageClicked(message) {
      /**
       * This is the callback function that is going to be executed when some image is clicked.
       * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
       */
      console.log("Image clicked", message.src);
    },
    show(b,d) {
      this.slideDirection = d
      this.showCustomerComplaint = b;
    }
  }
};
</script>

<style>
html,
body {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 16px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: 100%;
}

.chat-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(247, 243, 243);
  /* padding: 10px 0 10px 0; */
  height: 100%;
  width: 100%;
}

.external-controller {
  background: #2c3e50;
  height: 300px;
  width: 600px;
  display: flex;
  color: #eee;
}

.controller-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  flex-wrap: wrap;
}

.btn-message {
  cursor: pointer;
  background: #eee;
  border: none;
  height: 40px;
  color: #2c3e50;
  border-radius: 5px;
  outline: none;
  transition: 0.3s;
}

.btn-participant {
  cursor: pointer;
  background: #eee;
  border: none;
  height: 40px;
  color: #2c3e50;
  border-radius: 5px;
  outline: none;
  transition: 0.3s;
}

.btn-message:hover {
  background: rgb(255, 255, 255);
}

.slideLeft-enter-to {
  transition: all 0.5s ease;
  transform: translateX(0);
}
.slideLeft-leave-active {
  transition: all 0.5s ease;
  transform: translateX(-100%);
}
.slideLeft-enter {
  transform: translateX(100%);
}
.slideLeft-leave {
  transform: translateX(0);
}
.slideRight-enter-to {
  transition: all 0.5s ease;
  transform: translateX(0);
}
.slideRight-leave-active {
  transition: all 0.5s ease;
  transform: translateX(100%);
}
.slideRight-enter {
  transform: translateX(-100%);
}
.slideRight-leave {
  transform: translateX(0);
}
</style>
