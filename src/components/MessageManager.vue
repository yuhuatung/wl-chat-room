<template>
  <!-- <div class="container-message-manager">
        <div class="message-text-box">
            <div ref="userInput" class="message-input" :placeholder="placeholder"
                 tabIndex="0" contenteditable="true"
                 @input="handleType" @keyup.enter.exact="sendMessage"></div>
        </div>
        <div class="container-send-message icon-send-message" @click.prevent="sendMessage">
            <SendIcon :size="submitIconSize" :fill-color="colors.submitIcon"/>
        </div>
        <div v-if="sendImages" class="container-send-message icon-send-message" @click="pickImage">
            <input ref="inputImage" accept="image/*" type="file" style="display: none;" @input="handleImageChange">
            <ImageIcon :size="submitImageIconSize" :fill-color="colors.submitImageIcon"/>
        </div>
  </div>-->
  <div class="container-message-manager">
    <footer class="mobile-footer">
      <div class="top-part">
        <div class="input">
          <!-- <textarea matInput placeholder="请输入消息..." cdkTextareaAutosize cdkAutosizeMinRows="1"
                cdkAutosizeMaxRows="5" #autosize="cdkTextareaAutosize" type="text" [(ngModel)]="text"
          (keyup)="typing()" id="clear"></textarea>-->
          <textarea-autosize placeholder="请输入消息..." rows="1" type="text" v-model="text" :min-height="20" :max-height="80"/>
          <!-- <div *ngIf="!isQQ" class="send-btn {{text?'has-text':''}}" (click)="send(); triggerResize()"> -->
          <div class="send-btn" :class="text?'has-text':''" @click="send()">
            <div class="icon-send">发送</div>
          </div>
        </div>
        <!-- <div class="more-btn {{show?'show':''}}" (click)="showMore()"> -->
        <div class="more-btn" :class="show?'show':''" @click="showMore()">
          <i class="flaticon-add2"></i>
        </div>
      </div>
      <!-- <div class="bottom-part {{show?'show':''}}"> -->
      <div class="bottom-part" :class="show?'show':''">
        <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="selectImage()"> -->
        <div v-if="!this.consultant||this.consultant.type!=2" @click="selectImage()">
          <i class="flaticon-image"></i>
          <span tooltip="上传图片"></span>
          <p>相册</p>
        </div>
        <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="selectFile()"> -->
        <div v-if="!this.consultant||this.consultant.type!=2" @click="selectFile()">
          <i class="flaticon-folder"></i>
          <span tooltip="上传挡案" class="icon"></span>
          <p>档案</p>
        </div>
        <div class="emoji">
          <i class="flaticon-smile" @click="showEmoji.mobile= !showEmoji.mobile"></i>
          <p @click="showEmoji.mobile= !showEmoji.mobile">表情</p>
          <picker
            v-show="showEmoji.mobile"
            @select="addEmoji"
            title="表情符号"
            :i18n="i18n"
            :style="emojiStyle.mobile"
          />
        </div>
        <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="score()"> -->
        <div v-if="!this.consultant||this.consultant.type!=2" @click="score()">
          <i class="flaticon-love"></i>
          <span tooltip="客户打分" class="icon"></span>
          <p>打分</p>
        </div>
      </div>
    </footer>
    <footer class="pc-footer">
      <div class="edit">
        <div class="top-part">
          <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="selectImage()"> -->
          <div v-if="!this.consultant||this.consultant.type!=2" @click="selectImage()">
            <i class="flaticon-image"></i>
          </div>
          <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="selectFile()"> -->
          <div v-if="!this.consultant||this.consultant.type!=2" @click="selectFile()">
            <i class="flaticon-folder"></i>
            <span tooltip="上传挡案" class="icon"></span>
          </div>
          <div class="emoji">
            <i class="flaticon-smile" @click="showEmoji.pc=!showEmoji.pc"></i>
            <picker
              v-show="showEmoji.pc"
              title="表情符号"
              @select="addEmoji"
              :i18n="i18n"
              :style="emojiStyle.pc"
            />
          </div>
          <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="score()"> -->
          <div v-if="!this.consultant||this.consultant.type!=2" @click="score()">
            <i class="flaticon-love"></i>
            <span tooltip="客户打分" class="icon"></span>
          </div>
        </div>
        <div class="bottom-part">
          <!-- <textarea type="text" placeholder="请输入消息" [(ngModel)]="text" (keyup)="typing()" (keyup.enter)="send()">
          </textarea>-->
          <textarea v-model="text" type="text" placeholder="请输入消息" v-on:keydown.enter="send($event)"></textarea>
        </div>
      </div>
      <!-- <div class="send-btn {{text?'has-text':''}}" (click)="send()"> -->
      <div class="send-btn" :class="text !== ''?'has-text':''"  @click="send()">发送</div>
    </footer>
  </div>
</template>

<script>
//import 'vue-material-design-icons/styles.css';
import { mapMutations } from "vuex";
import { DateTime } from "luxon";
import SendIcon from "vue-material-design-icons/Send";
import ImageIcon from "vue-material-design-icons/Image";
import { Picker } from "emoji-mart-vue";
import Vue from 'vue';
import TextareaAutosize from 'vue-textarea-autosize';
Vue.use(TextareaAutosize)
export default {
  components: {
    SendIcon,
    ImageIcon,
    Picker
  },
  props: {
    /* onType: {
                type: Function,
                required: false,
                default: () => false
            }, */
    /* onMessageSubmit: {
                type: Function,
                required: false,
                default: () => false
            }, */
    colors: {
      type: Object,
      required: true
    },
    consultant: {
      type: Object,
      required: true
    },
    borderStyle: {
      type: Object,
      required: false,
      default: () => {
        return {
          topLeft: "10px",
          topRight: "10px",
          bottomLeft: "10px",
          bottomRight: "10px"
        };
      }
    },
    submitIconSize: {
      type: Number,
      required: false,
      default: 24
    },
    submitImageIconSize: {
      type: Number,
      required: false,
      default: 24
    },
    /* onImageSelected: {
                type: Function,
                required: false,
                default: () => false
            }, */
    sendImages: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      textInput: "",
      text: "",
      show: false,
      showEmoji: {
        pc: false,
        mobile: false
      },
      i18n: {
        search: "搜索",
        notfound: "未找到",
        categories: {
          search: "搜索结果",
          recent: "最近使用",
          people: "表情符号与人物",
          nature: "动物与自然",
          foods: "饮食",
          activity: "活动",
          places: "旅游与地点",
          objects: "物品",
          symbols: "符号",
          flags: "旗帜"
        }
      },
      emojiStyle: {
        pc: {
          width: "355px",
          position: "fixed",
          left: 0,
          bottom: "100px",
          zIndex: 9999
        },
        mobile: {
          width: "355px",
          position: "fixed",
          left: 0,
          bottom: "60px",
          zIndex: 9999
        }
      }
    };
  },
  computed: {
    myself() {
      return this.$store.state.myself;
    },
    placeholder() {
      return this.$store.state.placeholder;
    }
  },
  created() {
    // this.messagesElement = this.messagesRef.nativeElement;
  },
  methods: {
    ...mapMutations(["newMessage"]),
    handleType: function(e) {
      this.$emit("onType", e);
    },
    pickImage: function() {
      this.$refs.inputImage.click();
    },
    handleImageChange: async function(e) {
      const files = e.target.files;
      let message = {
        type: "image",
        preview: URL.createObjectURL(files[0]),
        src: "",
        content: "image",
        participantId: this.myself.id,
        timestamp: DateTime.local(),
        uploaded: false,
        viewed: false
      };
      this.$emit("onImageSelected", { file: files[0], message });
      //this.onImageSelected(files, message)
      this.newMessage(message);
    },
    addEmoji(e) {
      this.text += e.native;
      this.showEmoji.mobile = false;
      this.showEmoji.pc = false;
      console.log(e.native);
      console.log(FileUtil.getFileSize("1025"));
    },
    send(event) {
      if (this.text) {
        this.$emit("send", this.text);
        let inputLen = this.text.length;
        let inputText = this.text;
        if (this.text[inputLen - 1] === "\n") {
          inputText = inputText.slice(0, inputLen - 1);
        }
        let message = {
          content: inputText,
          // myself: true,
          participantId: this.myself.id,
          timestamp: DateTime.local(),
          uploaded: false,
          viewed: false,
          type: "text"
        };
        this.$emit("onMessageSubmit", message);
        this.newMessage(message);
        this.text = "";
        if(event){
          event.preventDefault()
        }
      } else {
        if(event){
          event.preventDefault()
        }
      }
    },
    triggerResize() {
      // this.$emit("triggerResize");
    },
    selectImage() {
      this.$emit("selectImage");
    },
    selectFile() {
      this.$emit("selectFile");
    },
    showMore() {
      this.show = !this.show;
    },
    score() {
      this.$emit("score");
    }
  }
};
</script>

<style lang="scss" scoped>
// .quick-chat-container .container-message-manager {
//     height: 65px;
//     background: #fff;
//     display: flex;
//     align-items: center;
//     padding: 0 20px 0 20px;
//     -webkit-box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);
//     box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);

//     .message-text-box {
//         padding: 0 10px 0 10px;
//         flex: 1;
//         overflow: hidden;
//     }

//     .message-input {
//         width: 100%;
//         resize: none;
//         border: none;
//         outline: none;
//         box-sizing: border-box;
//         font-size: 15px;
//         font-weight: 400;
//         line-height: 1.33;
//         white-space: pre-wrap;
//         word-wrap: break-word;
//         color: #565867;
//         -webkit-font-smoothing: antialiased;
//         max-height: 40px;
//         bottom: 0;
//         overflow: scroll;
//         overflow-x: hidden;
//         overflow-y: auto;
//         text-align: left;
//         cursor: text;
//         display: inline-block;
//     }

//     .message-input:empty:before {
//         content: attr(placeholder);
//         display: block; /* For Firefox */
//         filter: contrast(15%);
//         outline: none;
//     }

//     .message-input:focus {
//         outline: none;
//     }

//     .container-send-message {
//         margin-left: 10px;
//     }

//     .container-send-message svg {
//         -webkit-box-sizing: content-box;
//         box-sizing: content-box;
//     }

//     .icon-send-message {
//         cursor: pointer;
//         opacity: 0.7;
//         transition: 0.3s;
//         border-radius: 11px;
//         padding: 8px;
//     }

//     .icon-send-message:hover {
//         opacity: 1;
//         background: #eee;
//     }
// }
::-webkit-input-placeholder {
  color: rgba(204, 204, 204, 1);
}

/*Firefox 4-18瀏覽器專用*/
::-moz-placeholder {
  color: rgba(204, 204, 204, 1);
}

/*Firefox 19+瀏覽器專用*/
::-moz-placeholder {
  color: rgba(204, 204, 204, 1);
}

/*IE10瀏覽器專用*/
:-ms-input-placeholder {
  color: rgba(204, 204, 204, 1);
}
.mobile-footer {
  border-top: 1px #eee solid;
  .top-part {
    // height: 3.75rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem;
    background: #f8f8f8;

    .input {
      width: 90%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;

      textarea {
        border: none;
        border-radius: 5rem;
        width: 100%;
        padding: 0.5rem 1.25rem;
        padding-right: 3.5rem;
        overflow-y: hidden;
        resize: none;
        height: 2.5rem;
        font-size: 1rem;
        vertical-align: middle;
        &:focus {
          outline: none;
        }
      }

      .unset {
        height: unset;
      }

      input {
        width: 100%;
        height: 100%;
        background: #fff;
        padding: 0.625rem 3.4rem 0.625rem 1.25rem;
        border: none;
        border-radius: 1rem;
      }

      .send-btn {
        // transform: scale(0);
        // transition: transform .3s;
        color: #999;
        position: absolute;
        right: 0.5rem;

        .icon-send {
          font-size: 0.8rem;
          padding: 0.4em;
        }
      }

      .has-text {
        // transform: scale(1);
        background: #4290ff;
        border-radius: 1.17em;
        color: white;
      }
    }

    .more-btn {
      // position: absolute;
      // right: 10px;
      transition: transform 0.3s;
      -webkit-transition: transform 0.3s;
      -moz-transition: transform 0.3s;
      -o-transition: transform 0.3s;
      -ms-transition: transform 0.3s;
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      cursor: pointer;
      margin: auto;
      i {
        font-size: 1.5em;
      }
    }

    .show {
      transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -o-transform: rotate(45deg);
    }
  }

  .bottom-part {
    height: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 3rem;
    background: #f8f8f8;
    overflow: hidden;
    transition: height 0.3s;
    -webkit-transition: height 0.3s;
    -moz-transition: height 0.3s;
    -o-transition: height 0.3s;
    -ms-transition: height 0.3s;
    .file-album {
      margin-top: -5px;
    }

    .flaticon-folder-1 {
      font-size: 1rem;
    }
  }

  .bottom-part.show {
    height: 4rem;
  }

  .bottom-part > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .bottom-part > div p {
    font-size: 0.93em;
    color: #333;
    margin-top: 0.06em;
  }

  .bottom-part i {
    font-size: 1.5rem;
  }
}
.pc-footer {
  height: 6.25rem;
  border-top: 1px #eee solid;
  .edit {
    flex: 1;
    border-right: 1px solid #e7e6e9;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .top-part {
      height: 1.93rem;
      display: flex;
      padding: 0.33rem 0.93rem 0;

      i {
        font-size: 1em;
      }

      & > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-right: 1.2rem;
      }
    }

    .bottom-part {
      flex: 1;

      textarea {
        width: 100%;
        height: 100%;
        padding: 0.33rem 0.93rem;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
        resize: none;
        line-height: 1.5;
        border: unset;
        font-size: 1.2rem;
        &:focus {
          outline: none;
        }
      }
    }
  }

  .send-btn {
    width: 5rem;
    text-align: center;
    line-height: 6.25rem;
    font-size: 0.9em;
    color: #999;
    background: #fff;
  }

  .has-text {
    background: #4290ff;
    color: white;
    cursor: pointer;
  }
}
@media screen and (min-width: 767.98px) {
  .mobile-footer {
    display: none;
  }

  .pc-footer {
    display: flex;
  }
}
@media screen and (max-width: 767.98px) {
  .mobile-footer {
    display: block;
  }

  .pc-footer {
    display: none;
  }
}
</style>
