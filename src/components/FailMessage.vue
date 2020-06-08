<template>
  <div class="myself-message-body">
    <div class="message-content">
      <template v-if="record">
        <p class="message-username">{{getMessageName}}</p>
        <div
          class="message-text"
          :style="{background: colors.message.myself.bg, color: colors.message.myself.text}"
          :class="record.fail?'fail':'lds-hourglass'"
        >
          <template v-if="record.dataType==ChatRecordDataType.TEXT">
            <p>{{record.data}}</p>
          </template>
          <template v-if="record.dataType==ChatRecordDataType.IMAGE">
            <img :src="record.url" alt />
          </template>
          <template v-if="record.dataType==ChatRecordDataType.VOICE">
            <audio :src="record.url" controls></audio>
          </template>
          <template v-if="record.dataType==ChatRecordDataType.DOC">
            <div></div>
          </template>
        </div>
      </template>
    </div>
    <div v-if="profilePictureConfig.myself && showPortrait" class="thum-container">
      <img
        class="participant-thumb"
        :src="getPortrait"
        :style="{'width': profilePictureConfig.styles.width, 'height': profilePictureConfig.styles.height, 'border-radius': profilePictureConfig.styles.borderRadius}"
      />
    </div>
    <div class="text-tool" v-if="record.fail">
      <span @click="removeSendRecord">移除</span>
      <span @click="reSend">重传</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    colors: {
      type: Object,
      required: true
    },
    profilePictureConfig: {
      type: Object,
      required: true
    },
    showPortrait: {
      type: Boolean,
      required: false,
      default: false
    },
    getPortrait: {
      type: String,
      required: false
    },
    getMessageName: {
      type: String,
      required: false
    },
    record: {
      type: Object,
      required: false
    },
    getFileSize: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      ChatRecordDataType: {
        // 文字
        TEXT: 0,
        // 圖片
        IMAGE: 1,
        // 語音
        VOICE: 2,
        // 文件
        DOC: 3,
        // 通話
        CALL: 4,
        // 業務公告
        ANNOUNCEMENT: 5,
        // 結束評分
        CLOSESCORE: 6,
        // HTML
        HTML: 7,
        // 機器人訊息
        BOT: 8
      }
    };
  },
  computed: {
    ...mapGetters(["getParticipantById", "messages", "myself"])
  },
  methods: {
    removeSendRecord() {
      this.$emit("removeSendRecord");
    },
    reSend() {
      this.$emit("reSend",);
    }
  }
};
</script>

<style lang="less">
.container-message-display .myself-message-body {
  display: flex;
  // align-items: flex-end;
  padding-right: 10px;
  justify-content: flex-end;

  .message-content {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    flex-direction: column;
    max-width: 80%;
    .message-username {
      font-size: 0.8rem;
      font-weight: bold;
      color: #42bfc5;
      text-indent: unset;
      span {
        margin-right: 0.7rem;
        font-size: 0.6rem;
        color: #aaa;
        font-weight: 100;
      }
    }
  }

  .participant-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-left: 10px;
  }

  .message-timestamp {
    padding: 2px 7px;
    border-radius: 15px;
    margin: 0;
    overflow-wrap: break-word;
    text-align: left;
    font-size: 10px;
    color: #bdb8b8;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .message-text {
    background: #fff;
    padding: 10px;
    line-height: 14px;
    border-radius: 15px;
    margin: 5px 0 5px 0;
    overflow-wrap: break-word;
    text-align: left;
    white-space: pre-wrap;
    border-top-right-radius: 0px;
    word-break: break-word;
    img,
    audio {
      max-width: 100%;
    }
    &.fail {
      &:after {
        content: "發送失敗";
        color: #ff4081;
        font-size: 14px;
      }
    }
  }
  .text-tool {
    color: #aaa;
    font-size: 80%;
    cursor: pointer;
    text-align: right;

    span {
      margin: 2px;
    }
  }
}
</style>