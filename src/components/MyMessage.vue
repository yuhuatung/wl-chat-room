<template>
  <div class="myself-message-body">
    <div class="message-content">
      <!-- <template v-if="message.type == 'image'">
                <p class="message-username-image">{{myself.name}}</p>
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
          <span>{{getMessageTime}}</span>
          {{getMessageName}}
        </p>
        <div
          class="message-text"
          :style="{background: colors.message.myself.bg, color: colors.message.myself.text}"
        >
          <template v-if="record.dataType==ChatRecordDataType.TEXT">
            <p>{{record.data}}</p>
          </template>
          <template v-if="record.dataType==ChatRecordDataType.IMAGE">
            <!-- <img :src="record.url" @click="show" alt /> -->
            <img v-if="isMobile" v-gallery :src="record.url" />
            <viewer
              v-if="!isMobile"
              :images="images"
              @inited="inited"
              class="viewer"
              ref="viewer"
              @click="show"
            >
              <template slot-scope="scope">
                <img v-for="src in scope.images" :src="src" :key="src" />
                {{scope.options}}
              </template>
            </viewer>
          </template>
          <template v-if="record.dataType==ChatRecordDataType.VOICE">
            <audio :src="record.url" controls></audio>
          </template>
          <template v-if="record.dataType==ChatRecordDataType.DOC">
            <div class="file" @click="download(record)">
              <span class="flaticon-file" v-text="record.data+'('+getFileSize+')'"></span>
            </div>
          </template>
        </div>
      </template>
      <!-- <div class="message-timestamp" :style="{'justify-content': 'flex-end'}">
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
    <div v-if="profilePictureConfig.myself && showPortrait" class="thum-container">
      <img
        class="participant-thumb"
        :src="getPortrait"
        :style="{'width': profilePictureConfig.styles.width, 'height': profilePictureConfig.styles.height, 'border-radius': profilePictureConfig.styles.borderRadius}"
      />
    </div>
  </div>
</template>

<script>
import CheckIcon from "vue-material-design-icons/Check";
import CheckAll from "vue-material-design-icons/CheckAll";
import { mapGetters, mapMutations } from "vuex";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";
import gallery from "img-vuer";
Vue.use(Viewer);
Vue.use(gallery, {
  swipeThreshold: 150, // default 100
  isIndexShow: false, // show image index, default true
  useCloseButton: true, // trigger gallery close with close button, default true
  preload: true // preload images in the same group, default true
});
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
    },
    isMobile: {
      type: Boolean,
      required: true
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
    ...mapGetters(["getParticipantById", "messages", "myself"]),
    images() {
      return [this.record.url];
    }
  },
  methods: {
    onImageClicked: function(message) {
      this.$emit("onImageClicked", message);
    },
    download() {
      this.$emit("download");
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show() {
      this.$viewer.show();
    }
  }
};
</script>

<style lang="scss" scoped>
.container-message-display .myself-message-body {
  display: flex;
  // align-items: flex-end;
  padding-right: 10px;
  justify-content: flex-end;
  width: 100%;

  .message-content {
    text-align: right;
    width: 100%;
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
    display: inline-block;
    width: auto;
    max-width: 90%;
    padding: 0.63rem;
    margin-top: 5px;
    border-radius: 0.7rem;
    border-top-right-radius: 0px;
    font-size: 1.1em;
    text-align: left;
    word-wrap: break-word;
    word-break: break-all;
    p {
      line-height: 28px;
    }
    img,
    audio {
      width: unset;
      max-width: 100%;
      vertical-align: middle;
      cursor: pointer;
    }
    .file {
      padding: 5px;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>