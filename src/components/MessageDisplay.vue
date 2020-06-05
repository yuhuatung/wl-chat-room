<template>
  <div
    ref="containerMessageDisplay"
    :style="{background: colors.message.messagesDisplay.bg}"
    class="container-message-display"
    @scroll="updateScrollState"
  >
    <div v-if="loading" class="loader">
      <div class="message-loading"></div>
    </div>

    <!-- <div *ngIf="!this.hasLog" class="center-text">无历史纪录</div>
        <div *ngIf="this.hasLog" class="center-text cui-link-button" (click)="queryLog()">查询历史纪录
    </div>-->

    <!-- hasLog還需要改(martin) -->
    <div v-if="!hasLog" class="center-text">无历史纪录</div>
    <div v-if="hasLog" class="center-text cui-link-button">查询历史纪录</div>
    <template v-if="chatStorage">
      <template v-for="chat in chatStorage.records">
        <div class="center-text">
          对话开始
          <!-- getTimeFormat 無法使用(martin)-->
          <!-- <span v-text="getTimeFormat(chat.time)"></span> -->
        </div>
        <template v-if="chatRecordStorage">
          <div
            v-for="(record, index) in chatRecordStorage[chat.id].records"
            :key="index"
            class="message-container"
          >
            <MyMessage
              v-if="$parent.getMessageClassName(record) === 'message right'"
              :async-mode="asyncMode"
              :colors="colors"
              :profile-picture-config="profilePictureConfig"
              :timestamp-config="timestampConfig"
              :showPortrait="showPortrait(record)"
              :getMessageClassName="getMessageClassName(record)"
              :getPortrait="getPortrait(record)"
              :getMessageTime="getMessageTime(record)"
              :record="record"
              :getFileSize="getFileSize(record)"
              :getMessageName="getMessageName(record)"
              @download="download(record)"
              @onImageClicked="onImageClicked"
            />
            <OtherMessage
              v-if="$parent.getMessageClassName(record) === 'message left'"
              :async-mode="asyncMode"
              :colors="colors"
              :profile-picture-config="profilePictureConfig"
              :timestamp-config="timestampConfig"
              :showPortrait="showPortrait(record)"
              :getMessageClassName="getMessageClassName(record)"
              :getPortrait="getPortrait(record)"
              :getMessageTime="getMessageTime(record)"
              :record="record"
              :getFileSize="getFileSize(record)"
              :getMessageName="getMessageName(record)"
              @download="download(record)"
              @onImageClicked="onImageClicked"
            />
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { DateTime } from "luxon";
import MyMessage from "./MyMessage.vue";
import OtherMessage from "./OtherMessage.vue";
export default {
  components: {
    MyMessage,
    OtherMessage
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
    chatStorage: {
      type: Object,
      required: true
    },
    chatRecordStorage: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      updateScroll: true,
      lastMessage: null,
      loading: false
    };
  },
  computed: {
    ...mapGetters(["getParticipantById", "messages", "myself"])
  },
  mounted() {
    this.goToBottom();
    this.$refs.containerMessageDisplay.dispatchEvent(new CustomEvent("scroll"));
  },
  updated() {
    if (
      this.messages.length &&
      !this.messageCompare(
        this.messages[this.messages.length - 1],
        this.lastMessage
      )
    ) {
      if (
        this.updateScroll ||
        (this.scrollBottom.messageSent &&
          this.messages[this.messages.length - 1].participantId ==
            this.myself.id) ||
        (this.scrollBottom.messageReceived &&
          this.messages[this.messages.length - 1].participantId !=
            this.myself.id)
      ) {
        this.goToBottom();
        if (this.messages.length) {
          this.lastMessage = this.messages[this.messages.length - 1];
        }
      }
    }
  },
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

      if (typeof this.loadMoreMessages === "function" && scrollTop < 20) {
        this.loading = true;
        this.loadMoreMessages(messages => {
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
          this.loading = false;
        });
      }
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
      //會報錯(martin)
      return this.$parent.getMessageTime(record)
    },
    download(record) {
      this.$parent.download(record);
    },
    getFileSize(record) {
      return this.$parent.getFileSize(record);
    }
    // /**
    //  * 訊息時間
    //  * @param record
    //  */
    // getTimeFormat(time) {
    //  DateUtil無法引入(martin)
    //   return DateUtil.format(time, "MMMDo hh:mm:ssa");
    // }
  }
};
</script>

<style lang="less">
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
    margin-bottom: 10px;
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
