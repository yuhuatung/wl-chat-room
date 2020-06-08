<template>
  <div class="other-message-body">
    <div v-if="profilePictureConfig.others && showPortrait" class="thum-container">
      <img
        class="participant-thumb"
        :src="getPortrait"
        :style="{'width': profilePictureConfig.styles.width, 'height': profilePictureConfig.styles.height, 'border-radius': profilePictureConfig.styles.borderRadius}"
      />
    </div>
    <div class="message-content">
      <!-- <template v-if="message.type == 'image'">
                <p class="message-username-image">{{getParticipantById(message.participantId).name}}</p>
                <div v-if="message.uploaded" class="message-image">
                    <img class="message-image-display" :src="message.src" alt="" @click="onImageClicked(message)">
                </div>
                <div v-else class="message-image">
                    <img class="message-image-display img-overlay" :src="message.preview" alt="">
                    <div class="img-loading"></div>
                </div>
      </template>-->
      <template v-if="record">
        <p class="message-username">
          {{getMessageName}}
          <span>{{getMessageTime}}</span>
        </p>
        <div
          class="message-text"
          :style="{background: colors.message.others.bg, color: colors.message.others.text}"
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
          <template v-if="record.dataType==ChatRecordDataType.ANNOUNCEMENT">
            <h2 v-text="record.announce.topic"></h2>
            <h3 v-text="record.announce.tag"></h3>
            <div v-text="record.announce.content"></div>
            <a :href="record.announce.picUrl" target="_blank">
              <img :src="record.announce.dataUrl " />
            </a>
            <span>点击图片参加</span>
          </template>
          <template v-if="record.dataType==ChatRecordDataType.BOT && record.botData">
            <div class="bot-msg">
              <template v-if="record.botData.recommend">
                <div class="title">推荐</div>
                <div class="left-1" v-text="record.botData.recommend.problem"></div>
                <div class="left-2" v-text="record.botData.recommend.solution"></div>
              </template>
              <template v-if="record.botData.solution">
                <div class="left-1" v-text="record.botData.solution.problem"></div>
                <div class="left-2" v-text="record.botData.solution.solution"></div>
              </template>
              <template v-if="record.botData.relatedProblems.length > 0">
                <br />
                <div class="title">相关问题</div>
                <template v-for="(p,index) in record.botData.relatedProblems">
                  <div
                    :key="index"
                    class="related-problems left-1"
                    @click="getKnowledgeSolution(p.id, p.problem)"
                    v-text="p.problem"
                  ></div>
                </template>
              </template>
              <template v-if="isBotRecordEmpty(record)">
                <div>查无此相关资料，请再详述问题，谢谢您</div>
              </template>
            </div>
          </template>
        </div>
      </template>
      <!-- <div class="message-timestamp" :style="{'justify-content': 'baseline'}">
        <template v-if="timestampConfig.relative">{{message.timestamp.toRelative()}}</template>
        <template v-else>{{message.timestamp.toFormat(timestampConfig.format)}}</template>
        <CheckIcon
          v-if="asyncMode && message.uploaded && !message.viewed"
          :size="14"
          class="icon-sent"
        />
        <CheckAll
          v-else-if="asyncMode && message.uploaded && message.viewed"
          :size="14"
          class="icon-sent viewed"
        />
        <div v-else-if="asyncMode" class="message-loading"></div>
        {{getMessageTime}}
      </div>-->
    </div>
  </div>
</template>

<script>
import CheckIcon from "vue-material-design-icons/Check";
import CheckAll from "vue-material-design-icons/CheckAll";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    CheckIcon,
    CheckAll
  },
  props: {
    // asyncMode: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // },
    colors: {
      type: Object,
      required: true
    },
    /* onImageClicked: {
                type: Function,
                required: false,
                default: null
            }, */
    profilePictureConfig: {
      type: Object,
      required: true
    },
    // timestampConfig: {
    //   type: Object,
    //   required: true
    // },
    showPortrait: {
      type: Boolean,
      required: false,
      default: false
    },
    // getMessageClassName: {
    //   type: String,
    //   required: false
    // },
    getPortrait: {
      type: String,
      required: false
    },
    getMessageName: {
      type: String,
      required: false
    },
    getMessageTime: {
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
    onImageClicked: function(message) {
      this.$emit("onImageClicked", message);
    },
    getKnowledgeSolution(id, problem) {
      this.$emit("getKnowledgeSolution", id, problem);
    },
    isBotRecordEmpty(record) {
      return this.$parent.isBotRecordEmpty(record)
    }
  }
};
</script>

<style lang="less">
.container-message-display .other-message-body {
  display: flex;
  // align-items: flex-end;
  padding-left: 10px;

  .message-content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    max-width: 80%;
    .message-username {
      font-size: 0.8rem;
      font-weight: bold;
      color: #42bfc5;
      text-indent: unset;
      span {
        margin-left: 0.7rem;
        font-size: 0.6rem;
        color: #aaa;
        font-weight: 100;
      }
    }
  }

  .participant-thumb {
    /* width: 25px;
            height: 25px;
            border-radius: 50%; */
    margin-right: 10px;
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
    border-top-left-radius: 0px;
    word-break: break-word;
    img,
    audio {
      max-width: 100%;
    }
  }
}
</style>