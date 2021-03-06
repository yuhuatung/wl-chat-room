<template>
  <div
    ref="containerMessageDisplay"
    :style="{background: colors.message.messagesDisplay.bg}"
    class="container-message-display"
    @scroll="updateScrollState"
  >
    <div v-if="querying" class="loader">
      <div class="message-loading"></div>
    </div>
    <div v-if="!hasLog" class="center-text">无历史纪录</div>
    <div v-if="hasLog" class="center-text cui-link-button" @click="queryLog">查询历史纪录</div>
    <template v-if="chatStorage">
      <template v-for="chat in chatStorage.records">
        <div class="center-text">
          对话开始
          <span v-text="getTimeFormat(chat.time)"></span>
        </div>
        <template v-if="chatRecordStorage">
          <div
            v-for="(record, index) in chatRecordStorage[chat.id].records"
            :key="`${chat.id}${index}`"
            class="message-container"
          >
            <MyMessage
              v-if="$parent.getMessageClassName(record) === 'message right'"
              :colors="colors"
              :profile-picture-config="profilePictureConfig"
              :showPortrait="showPortrait(record)"
              :getPortrait="getPortrait(record)"
              :getMessageTime="getMessageTime(record)"
              :record="record"
              :getFileSize="getFileSize(record)"
              :getMessageName="getMessageName(record)"
              :isMobile="isMobile"
              @download="download(record)"
              @onImageClicked="onImageClicked"
              @doScrollTop="doScrollTop"
            />
            <OtherMessage
              v-if="$parent.getMessageClassName(record) === 'message left'"
              :colors="colors"
              :profile-picture-config="profilePictureConfig"
              :showPortrait="showPortrait(record)"
              :getPortrait="getPortrait(record)"
              :getMessageTime="getMessageTime(record)"
              :record="record"
              :getFileSize="getFileSize(record)"
              :getMessageName="getMessageName(record)"
              :isMobile="isMobile"
              @download="download(record)"
              @onImageClicked="onImageClicked"
              @getKnowledgeSolution="getKnowledgeSolution"
              @doScrollTop="doScrollTop"
            />
          </div>
        </template>
        <div v-if="chat.endTime" class="center-text">本次对话已结束{{getTimeFormat(chat.endTime)}}</div>
        <template v-if="scoring && currentChat.id == chat.id">
          <template v-if="chat.score">
            <div class="message-score">
              <div class="text">{{consultant.nickname}} 已得到{{chat.score}}分</div>
            </div>
          </template>
          <div class="message-score">
            <div class="text">请对 {{consultant.nickname}} 的本次咨询服务打分</div>
            <div class="loves">
              <template v-for="(i,index) in scores">
                <span
                  :key="index"
                  :class="chat.tempScore 
                        ? i<=chat.tempScore?'flaticon-love love':'flaticon-unlove unlove'
                        : i<=chat.score?'flaticon-love love':'flaticon-unlove unlove'"
                  @click="changeScore(chat,i)"
                ></span>
              </template>
            </div>
            <div class="submit">
              <button class="cui-button" @click="submitScore(chat)">提交</button>
            </div>
          </div>
        </template>
      </template>
    </template>
    <template v-for="(record,index) in sendingRecords">
      <FailMessage
        :key="index"
        :colors="colors"
        :profile-picture-config="profilePictureConfig"
        :showPortrait="showPortrait(record)"
        :getPortrait="getPortrait(record)"
        :record="record"
        :getFileSize="getFileSize(record)"
        :getMessageName="getMessageName(record)"
        @download="download(record)"
        @removeSendRecord="removeSendRecord(record)"
        @reSend="reSend(record)"
        @doScrollTop="doScrollTop"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { DateTime } from "luxon";
import MyMessage from "./MyMessage.vue";
import OtherMessage from "./OtherMessage.vue";
import FailMessage from "./FailMessage.vue";
export default {
  components: {
    MyMessage,
    OtherMessage,
    FailMessage
  },
  props: {
    colors: {
      type: Object,
      required: true
    },
    asyncMode: {
      type: Boolean,
      required: false,
      default: false
    },
    loadMoreMessages: {
      type: Function,
      required: false,
      default: null
    },
    /* onImageClicked: {
                type: Function,
                required: false,
                default: null
            }, */
    scrollBottom: {
      type: Object,
      required: true
    },
    profilePictureConfig: {
      type: Object,
      required: true
    },
    timestampConfig: {
      type: Object,
      required: true
    },
    hasLog: {
      type: Boolean,
      required: false,
      default: false
    },
    querying: {
      type: Boolean,
      required: false,
      default: false
    },
    scoring: {
      type: Boolean,
      required: false,
      default: false
    },
    chatStorage: {
      type: Object,
      required: true
    },
    chatRecordStorage: {
      type: Object,
      required: true
    },
    currentChat: {
      type: Object,
      required: true
    },
    sendingRecords: {
      type: Array,
      required: true
    },
    consultant: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      updateScroll: true,
      lastMessage: null,
      loading: false,
      scores: [20, 40, 60, 80, 100],
      isMobile: false,
    };
  },
  computed: {
    ...mapGetters(["getParticipantById", "messages", "myself"])
  },
  mounted() {
    this.goToBottom();
    this.$refs.containerMessageDisplay.dispatchEvent(new CustomEvent("scroll"));
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
  },
  // updated() {
  //   if (
  //     this.messages.length &&
  //     !this.messageCompare(
  //       this.messages[this.messages.length - 1],
  //       this.lastMessage
  //     )
  //   ) {
  //     if (
  //       this.updateScroll ||
  //       (this.scrollBottom.messageSent &&
  //         this.messages[this.messages.length - 1].participantId ==
  //           this.myself.id) ||
  //       (this.scrollBottom.messageReceived &&
  //         this.messages[this.messages.length - 1].participantId !=
  //           this.myself.id)
  //     ) {
  //       this.goToBottom();
  //       if (this.messages.length) {
  //         this.lastMessage = this.messages[this.messages.length - 1];
  //       }
  //     }
  //   }
  // },
  methods: {
    ...mapMutations(["setMessages"]),
    /**
     * This function compare two messages without looking at the uploaded propertie.
     * This function has been implemented to prevent chat scrolling down after changing the message from 'uploaded = false' to 'uploaded = true'.
     * @param {Object} message1 the first message object
     * @param {Object} message2 the second message object
     * @return {Boolean} true if the messages are equal and false if they are different
     */
    messageCompare(message1, message2) {
      /**
       * if one of the messages are null, you can safely compare the messages with '==='
       */
      if (!message2 || !message1) {
        return message1 === message2;
      }
      /**
       * compare the immutable properties of a message
       */
      let participant_equal = message1.participantId == message2.participantId;
      let content_equal = message1.content == message2.content;
      let timestamp_equal =
        message1.timestamp.valueOf() === message2.timestamp.valueOf();

      return participant_equal && content_equal && timestamp_equal;
    },
    updateScrollState({ target: { scrollTop, clientHeight, scrollHeight } }) {
      this.updateScroll = scrollTop + clientHeight >= scrollHeight;

      // if (typeof this.loadMoreMessages === "function" && scrollTop < 20 && this.hasLog && !this.querying) {
      if (scrollTop < 20 && this.hasLog && !this.querying) {
        this.loading = true;
        // this.loadMoreMessages(messages => {
        //if (Array.isArray(messages) && messages.length > 0) {
        /**
         * this code will be removed before the next release
         *
         * this line is commented because the setMessages is already called
         * when 'this.messages.unshift(...this.toLoad)' is executed at App.vue line 177
         * it was executing the same function twice, causing unexpected behavior with Luxon date objects
         */
        //this.setMessages([...messages, ...this.messages]);
        //}
        // this.loading = false;
        // });

        this.loading = false;
      }
    },
    queryLog() {
      this.$emit("queryLog");
    },
    goToBottom() {
      let scrollDiv = this.$refs.containerMessageDisplay;
      scrollDiv.scrollTop = scrollDiv.scrollHeight;

      this.updateScroll = false;
    },
    onImageClicked(message) {
      this.$emit("onImageClicked", message);
    },
    showPortrait(record) {
      return this.$parent.showPortrait(record);
    },
    getMessageClassName(record) {
      return this.$parent.getMessageClassName(record);
    },
    getPortrait(record) {
      return this.$parent.getPortrait(record);
    },
    getMessageName(record) {
      return this.$parent.getMessageName(record);
    },
    getMessageTime(record) {
      return this.$parent.getMessageTime(record);
    },
    download(record) {
      this.$parent.download(record);
    },
    getFileSize(record) {
      return this.$parent.getFileSize(record);
    },
    getTimeFormat(time) {
      return this.$parent.getTimeFormat(time);
    },
    getKnowledgeSolution(id, problem) {
      this.$emit("getKnowledgeSolution", id, problem);
    },
    isBotRecordEmpty(record) {
      return this.$parent.isBotRecordEmpty(record);
    },
    changeScore(chat, score) {
      this.$set(chat, "tempScore", score);
    },
    submitScore(chat) {
      this.$emit("submitScore", chat);
    },
    removeSendRecord(record) {
      this.$emit("removeSendRecord", record);
    },
    reSend(record) {
      this.$emit("reSend", record);
    },
    doScrollTop(){
      this.$emit("doScrollTop");
    }
  }
};
</script>

<style lang="scss" scoped>
.quick-chat-container .container-message-display {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow-y: auto;
  // overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  max-height: 100%;
  // height: calc(100% - 48.59px - 65px);
  /************** Safari 10.1+ ********************/
  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      .message-container {
        display: -webkit-box !important;
      }
    }
  }

  .message-image {
    padding: 6px 10px;
    border-radius: 15px;
    margin: 5px 0 5px 0;
    max-width: 70%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .message-image-display {
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .message-image-display:hover {
    opacity: 0.8;
  }

  .message-text > p {
    margin: 5px 0 5px 0;
    font-size: 14px;
  }

  .my-message > .message-timestamp {
    text-align: right;
  }

  /* .my-message {
            justify-content: flex-end;
            padding-right: 15px;
            align-items: flex-end;
        } */

  .other-message {
    justify-content: flex-start;
    padding-left: 15px;
    align-items: flex-start;
  }

  .other-message > .message-text {
    color: #fff;
    border-bottom-left-radius: 0;
  }

  .my-message > .message-text {
    border-bottom-right-radius: 0;
  }

  .message-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin: 10px 0;
  }

  .message-username {
    font-size: 10px;
    font-weight: bold;
  }

  .icon-sent {
    padding-left: 5px;
    color: rgb(129, 127, 127);
  }

  .message-loading {
    height: 8px;
    width: 8px;
    border: 1px solid rgb(187, 183, 183);
    border-left-color: rgb(59, 59, 59);
    border-radius: 50%;
    margin-left: 5px;
    display: inline-block;
    animation: spin 1.3s ease infinite;
  }

  .loader .message-loading {
    width: 16px;
    height: 16px;
    margin: 5px 0 0 0;
  }

  .img-loading {
    height: 20px;
    width: 20px;
    border: 3px solid #ffffff00;
    border-left-color: #847f7f;
    border-top-color: #847f7f;
    border-radius: 50%;
    margin-left: 5px;
    display: inline-block;
    -webkit-animation: spin 1s ease infinite;
    animation: spin 1s ease infinite;
    position: absolute;
  }

  .img-overlay {
    opacity: 0.4;
  }

  .message-username-image {
    margin: 10px 10px 0px 10px;
    font-size: 12px;
    font-weight: bold;
  }

  .center-text {
    text-align: center;
    line-height: 3em;
    color: #999;
    font-size: 0.8rem;
  }

  .cui-link-button {
    padding: 0.2em 0.8em 0.2em 0.8em;
    cursor: pointer;
    -webkit-text-decoration-line: underline;
    text-decoration-line: underline;
  }
  .message-score {
    width: 100%;
    line-height: 2em;
    padding: 1em 0.5em;
    .text {
      padding: 5px;
      overflow: hidden;
      word-break: break-word;
      text-align: center;
    }
    .loves {
      text-align: center;
      font-size: 2em;
      color: #ff4081;
      span {
        margin: 0.1em;
        cursor: pointer;
      }
    }
    .submit {
      text-align: center;
      cursor: pointer;
      .cui-button {
        padding: 0.5em 1em;
        margin: 5px;
        border: 0;
        border-radius: 2px;
        letter-spacing: 1px;
        background-color: #2196f3;
        color: #fff;
        text-transform: none;
        font-size: 80%;
        font-family: inherit;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12),
          0 1px 4px rgba(0, 0, 0, 0.24);
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
