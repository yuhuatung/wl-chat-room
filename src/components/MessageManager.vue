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
          <textarea placeholder="请输入消息..." type="text" id="clear" v-model="text"></textarea>
          <!-- <div *ngIf="!isQQ" class="send-btn {{text?'has-text':''}}" (click)="send(); triggerResize()"> -->
          <div class="send-btn" :class="text?'has-text':''" @click="send();triggerResize()">
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
        <div @click="selectImage()">
          <i class="flaticon-image"></i>
          <span tooltip="上传图片"></span>
          <p>相册</p>
        </div>
        <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="selectFile()"> -->
        <div @click="selectFile()">
          <i class="flaticon-folder"></i>
          <span tooltip="上传挡案" class="icon"></span>
          <p>档案</p>
        </div>
        <div class="emoji" @click="showEmoji.mobile=!showEmoji.mobile">
          <i class="flaticon-smile">
            <picker
              v-show="showEmoji.mobile"
              @select="addEmoji"
              title="表情符号"
              :i18n="i18n"
              :style="emojiStyle.mobile"
            />
          </i>
          <p>表情</p>
        </div>
        <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="score()"> -->
        <div @click="score()">
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
          <div @click="selectImage()">
            <i class="flaticon-image"></i>
          </div>
          <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="selectFile()"> -->
          <div @click="selectFile()">
            <i class="flaticon-folder"></i>
            <span tooltip="上传挡案" class="icon"></span>
          </div>
          <div class="emoji">
            <i class="flaticon-smile" @click="showEmoji.pc=!showEmoji.pc">
              <picker
                v-show="showEmoji.pc"
                title="表情符号"
                @select="addEmoji"
                :i18n="i18n"
                :style="emojiStyle.pc"
              />
            </i>
          </div>
          <!-- <div *ngIf="!this.consultant||this.consultant.type!=2" (click)="score()"> -->
          <div @click="score()">
            <i class="flaticon-love"></i>
            <span tooltip="客户打分" class="icon"></span>
          </div>
        </div>
        <div class="bottom-part">
          <!-- <textarea type="text" placeholder="请输入消息" [(ngModel)]="text" (keyup)="typing()" (keyup.enter)="send()">
          </textarea>-->
          <textarea v-model="text" type="text" placeholder="请输入消息"></textarea>
        </div>
      </div>
      <!-- <div class="send-btn {{text?'has-text':''}}" (click)="send()"> -->
      <div class="send-btn" :class="text !== ''?'has-text':''" @click="send()">发送</div>
    </footer>
  </div>
</template>

<script>
//import 'vue-material-design-icons/styles.css';
import { mapMutations } from "vuex";
import { DateTime } from "luxon";
import SendIcon from "vue-material-design-icons/Send";
import ImageIcon from "vue-material-design-icons/Image";
import { Picker } from 'emoji-mart-vue';
import { FileUtil } from '@/ts/util/file-util';
import { NotifyService } from '@/ts/component/notify-service';
import {
  Chat,
  ChatCloseScore,
  ChatConsultant,
  ChatEventType,
  ChatMessage,
  ChatInfo,
  ChatRecordDataType,
  ChatRecordSendType,
  ChatSwitchUser,
  Consultant,
  Customer,
  CustomerTypeEnum,
  CustomerType,
  ExtendChatRecord,
  SubProduct,
} from '@/ts/constant/chat';

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
        },
        imageElement: '',
        fileElement:'',
        listeners: {},
        consultant: ''
      },
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
  created(){
    this.initListener();
  },
  mounted(){
      this.imageElement = document.createElement('input');
      this.imageElement.type = 'file';
      this.imageElement.accept = 'image/*';
      this.imageElement.addEventListener('change', this.uploadImages);
  },
  methods: {
    showMore() {
      this.show = !this.show;
    },
    ...mapMutations(["newMessage"]),
    sendMessage(e) {
      this.textInput = this.$refs.userInput.textContent;
      this.$refs.userInput.textContent = "";

      if (this.textInput) {
        let inputLen = this.textInput.length;
        let inputText = this.textInput;
        if (this.textInput[inputLen - 1] === "\n") {
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
        //this.onMessageSubmit(message);
        this.newMessage(message);
      }
    },
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
      console.log(e.native)
      console.log(FileUtil.getFileSize('1025'))
    },
    initTitle() {
      if (this.subProduct) {
        if (this.subProduct.chatTitle) {
          this.chatTitle = this.subProduct.chatTitle;
        }
      }
      document.querySelector('title').innerText = this.chatTitle;
    },

    init() {
      this.fileElement = document.createElement('input');
      this.fileElement.type = 'file';
      this.fileElement.addEventListener('change', this.uploads);
      this.imageElement = document.createElement('input');
      this.imageElement.type = 'file';
      this.imageElement.accept = 'image/*';
      this.imageElement.addEventListener('change', this.uploadImages);
      this.initNotify();
      this.initListener();
      NotifyService.open('/chat');
    },

    /**
     * 初始化瀏覽器通知
     */
    initNotify() {
      if ('Notification' in window && (!Notification.permission || Notification.permission === 'default')) {
        Notification.requestPermission((permission) => {
        });
      }
    },

    /**
     * 發送瀏覽器通知
     */
    sendNotification(recrod) {
      if (document.hasFocus()) {
        return;
      }
      if (Notification.permission != 'granted') {
        return;
      }
      if (recrod.sendType == ChatRecordSendType.CUSTOMER) {
        return;
      }

      let notify = new Notification('客服訊息', {
        icon: ''
        , body: '您有新讯息'
        , tag: ChatEventType.MESSAGE + '-' + recrod.id
      });
      notify.onclick = () => {
        window.focus();
      };
    },

    /**
     * 初始化客戶跟清除資料
     * @param customer
     */
    initCustomer(customer) {
      if (this.customer && this.customer.id == customer.id) {
        this.chatStorage = this.initChatStroage(this.chatLog);
        this.chatRecordStorage = {};
        for (let chatId in this.chatRecordLog) {
          this.chatRecordStorage[chatId] = this.initChatRecordStroage(this.chatRecordLog[chatId]);
        }
      } else {
        this.chatStorage = this.initChatStroage(this.chatLog = []);
        this.chatRecordStorage = {};
        this.chatRecordLog = {};
      }
      this.customer = customer;
    },

    /**
     * 初始化聊天事件
     */
    initListener() {
      // 注册重连事件
      this.openListener = NotifyService.reOpenlistener(() => {
        // 斷線時，重連後查詢最新訊息
        if (this.currentChat) {
          this.query();
        }
      });
      // 聊天室資料

      this.listeners[ChatEventType.CHATINFO] = NotifyService.listener(ChatEventType.CHATINFO, (message) => {
        this.initCustomer(message.customer);
        this.appendChat(message.chat);
        this.consultant = message.consultant;
        // this.userComponent.refresh(message.consultant);
        if (this.currentChat && this.chatRecordLog[this.currentChat.id].length == 0) {
          this.queryLog();
        }
        // this.cdf.detectChanges();
        // Global.loader.close();
      });
      // 監聽聊天訊息
      this.listeners[ChatEventType.MESSAGE] = NotifyService.listener(ChatEventType.MESSAGE, (message) => {
        let record = message.data;

        // 暫時不處理自己發送的訊息
        if (this.sending && record.sendType == ChatRecordSendType.CUSTOMER) {
          this.waitMessage.push(message);
        } else {
          this.scrollDown = true;
          this.sendNotification(record);
          this.appendChatRecord(record);
          this.doScrollTop();
          // this.cdf.detectChanges();
        }
      });

      // 客服轉接
      this.listeners[ChatEventType.SWITCH_USER] = NotifyService.listener(ChatEventType.SWITCH_USER, (message) => {
        this.switchUser(message);
        this.appendChatRecord(message.data);
        this.doScrollTop();
        this.cdf.detectChanges();
      });

      this.listeners[ChatEventType.TYPING] = NotifyService.listener(ChatEventType.TYPING, (message) => {
        this.cdf.detectChanges();
      });

      // 結束聊天評分
      this.listeners[ChatEventType.CLOSESCORE] = NotifyService.listener(ChatEventType.CLOSESCORE, (message) => {
        this.currentChat = message.chat;
        this.appendChat(this.currentChat);
        this.currentChat.otp = message.otp;
        this.cdf.detectChanges();
      });

    },


    /**
    * 轉接客服
    */
    switchUser(message) {
      UserService.query((result) => {
        const defaultIcon = '/assets/images/consultant.jpg';
        if (!result.success) {
          alert(AjaxUtil.getMessage(result));
          return;
        }

        this.consultant = result.data;

        if (!this.consultant.added.icon) {
          this.consultant.added.icon = defaultIcon;
        }
        // this.userComponent.refresh(this.consultant);
        this.appendChat(result.added);
      });
    },

    /**
     * 滾動到指定位置
     */
    // @Delay(200)
    // public doScrollTop() {
    //   if (this.messagesElement) {
    //     if (this.scrollDown) {
    //       // 滾動到指定位置
    //       this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    //     } else {
    //       this.messagesElement.scrollTop = this.messagesElement.scrollHeight - this.scrollTop - this.messagesElement.clientHeight;
    //     }
    //   }
    // }

    /**
     * 選擇表情符號
     */
    onEmojiSelect(emoji){
      this.text += emoji.native;
    },

    /**
     * 聊天內容滾動事件
     */
    onScroll() {
      if (this.hasLog && !this.querying && this.messagesElement.scrollTop == 0) {
        this.queryLog();
      }
    },

    /**
     * 中斷對話
     */
    close() {
      if (!window.confirm('您确定要结束本次对话吗？')) {
        return;
      }
      Global.ajaxManager.request({
        url: '/chat',
        method: AjaxMethod.DELETE,
        callback: (result) => {
          if (result.success) {
            this.currentChatClose = true;
            this.cdf.markForCheck();
          } else {
            alert(result.message);
          }
        }
      });
    },

    /**
     * 輸入
     */
    // @Delay(500)
    typing() {
      if (this.currentChatClose
        || this.consultant.type == 2
        || (!this.typingText && !this.text)
      ) {
        return;
      }
      this.typingText = this.text;
      ChatService.typing({ text: this.text }
        , (result) => {
          console.log(result);
        });
    },

    /**
     * 查詢最新訊息
     */
    // @Delay(100)
    query() {
      let record = this.findLastChatRecord();
      if (!record) {
        this.queryLog();
        return;
      }
      this.scrollDown = true;
      this.querying = true;
      ChatService.query({
        chatTime: record.chatTime
        , chatId: record.chatId
        , time: record.time
        , id: record.id
      }, (result) => {
        if (result.success) {
          this.appendLastChatRecord(result.data);
          this.cdf.markForCheck();
          this.doScrollTop();
        } else {
          alert(result.message);
        }
        this.querying = false;
      });
    },

    /**
     * 查詢歷史紀錄
     */
    queryLog() {
      let record = this.findFirstChatRecord();
      let form;
      if (!this.hasLog) {
        return;
      }
      if (record) {
        form = {
          chatTime: record.chatTime
          , chatId: record.chatId
          , time: record.time
          , userId: this.currentChat.userId
          , id: record.id
        };
      } else if (this.currentChat) {
        form = {
          chatTime: this.currentChat.time
          , chatId: this.currentChat.id
          , time: DateUtil.now()
          , userId: this.currentChat.userId
        };
      } else {
        return;
      }
      this.scrollDown = false;
      this.querying = true;
      this.scrollTop = this.messagesElement.scrollHeight - this.messagesElement.clientHeight;
      ChatService.queryLog(form, (result) => {
        if (result.success) {
          this.appendChats(result.added);
          this.hasLog = this.appendFirstChatRecord(result.data) > 0;
          this.cdf.markForCheck();
          this.cdf.detectChanges();
          this.doScrollTop();
        } else {
          alert(result.message);
        }
        this.querying = false;
      });
    },

    /**
     * 重傳
     */
    reSend(record) {
      record.fail = false;
      if (record.dataType == this.ChatRecordDataType.TEXT) {
        this.doSend(record);
      } else {
        this.doUpload(record);
      }
    },

    /**
     * 發訊息
     */
    send() {
      if (!this.text) {
        return;
      }
      this.scrollDown = true;
      let record = this.buildText(this.text);
      this.appendSendingRecord(record);
      this.doSend(record);
    },

    showMore() {
        this.show = !this.show
    },
    /**
     * 實際發送
     */
    doSend(record) {
      this.sending++;
      if (this.consultant.type == 2 && !this.currentChatClose) { // 機器客服  *對話結束狀態時使用正常service
        BotService.send({
          text: record.data
        }, this.sendCallback.bind(this, record));
      } else {
        ChatService.send({
          text: record.data
        }, this.sendCallback.bind(this, record));
      }
      if(this.isQQ){
        // let dom = <HTMLInputElement>document.getElementById('clear');
        dom.value = ''
      }
      this.text = '';
    },


    /**
     * 批次上傳
     */
    uploads(){
      this.scrollDown = true;
      let files = this.fileElement.files;
      if (files.length == 0) {
        return;
      }
      for (let i = 0; i < files.length; i++) {
        this.upload(files.item(i));
      }
      this.fileElement.value = '';
    },

    /**
     * 批次上傳
     */
    uploadImages(){
      // this.scrollDown = true;
      let files = this.imageElement.files;
      if (files.length == 0) {
        return;
      }
      for (let i = 0; i < files.length; i++) {
        // this.upload(files.item(i));
      }
      this.imageElement.value = '';
    },


    /**
     * 執行上傳
     */
    upload(file) {
      let record = this.buildUpload(file);
      // this.appendSendingRecord(record);
      // this.doUpload(record);
    },

    /**
     * 執行上傳
     */
    doUpload(record) {
      this.sending++;
      this.cdf.markForCheck();
      ChatService.upload({
        file: record.file
        , type: record.dataType
      }, (xhr, e) => {
        record.progress = e.loaded;
        this.cdf.markForCheck();
      }, this.sendCallback.bind(this, record));
    },

    /**
     * 發送訊息Callback
     * @param oldMessage
     * @param result
     */
    sendCallback(
      oldMessage
      , result
    ) {
      this.sending--;
      if (result.success) {
        this.sendSuccess(oldMessage);
        this.appendChatRecord(result.data.data);
      } else {
        alert(result.message);
        this.sendFail(oldMessage);
      }
      this.cleanWaitRecord();
      this.cdf.detectChanges();
      this.doScrollTop();
    },

    /**
     * 處理尚未處理的訊息
     */
    cleanWaitRecord() {
      for (let i in this.waitMessage) {
        this.appendChatRecord(this.waitMessage[i].data);
      }
      this.waitMessage.length = 0;
    },

    /**
     * 選取图片
     */
    selectImage() {
      // if (this.consultant.type == 2) {
      //   alert('您好，智能客服目前不支持挡案上传。');
      //   return;
      // } 
      console.log(this.imageElement);
      
      this.imageElement.click();
    },

    /**
     * 選取檔案
     */
    selectFile() {
      // if (this.consultant.type == 2) {
      //   alert('您好，智能客服目前不支持挡案上传。');
      //   return;
      // }
      this.fileElement.click();
    },

    /**
     * 發送中訊息
     */
    appendSendingRecord(
      record
    ) {
      this.sendingRecords.push(record);
    },

    /**
     * 產生文字物件
     * @param text
     */
    buildText(text){
      return {
        chatTime: 0
        , chatId: 0
        , id: 0
        , sendType: ChatRecordSendType.CUSTOMER
        , userId: this.consultant.id
        , dataType: this.ChatRecordDataType.TEXT
        , data: text
        , unsend: false
        // , time: DateUtil.now() as number
        , url: null
        , size: null
        , progress: 0
        , fail: false
      };
    },
    /**
     * 產生上傳物件
     * @param file
     */
    buildUpload(file){
      return {
        chatTime: 0
        , chatId: 0
        , id: 0
        , sendType: ChatRecordSendType.CUSTOMER
        , userId: this.consultant.id
        , dataType: this.getFileType(file.type)
        , data: file.name
        , unsend: false
        // , time: DateUtil.now() as number
        , url: URL.createObjectURL(file)
        , size: file.size
        , progress: 0
        , fail: false
        , file: file
      };
    },

    /**
     * 發送成功
     * @param record
     */

    /**
     * 發送成功
     * @param record
     */
    sendSuccess(
      record
    ) {
      this.removeSendRecord(record);
    },

    /**
     * 移除發送的訊息
     * @param record
     */
    removeSendRecord(
      record
    ) {
      let index = this.sendingRecords.indexOf(record);
      if (index != -1) {
        this.sendingRecords.splice(index, 1);
      }
    },


    /**
     * 發送失敗
     * @param record
     */
    sendFail(
      record
    ) {
      record.fail = true;
    },

    /**
     * 機器客服訊息是否為空
     */
    isBotRecordEmpty(record) {
      if (record.botData.recommend
        || record.botData.solution
        || record.botData.relatedProblems.length > 0
      ) {
        return false;
      }
      return true;
    },

    /**
     * 取得知識庫解答   *fakeSend
     */
    getKnowledgeSolution(id, problem) {
      let record = this.buildText(problem);
      this.sending++;
      this.scrollDown = true;
      BotService.getKnowledgeSolution(id, (result) => {
        this.sending--;
        if (result.success) {
          this.sendSuccess(record);
          this.cleanWaitRecord();
          this.cdf.detectChanges();
          this.doScrollTop();
        } else {
          alert(AjaxUtil.getMessage(result));
        }
      });
    },

    /**
     * 打分
     */
    score() {
      this.scoring = !this.scoring;
      this.scrollDown = true;
      this.doScrollTop();
    },

    /**
     * 選擇分數
     */
    changeScore(chat, score) {
      chat.tempScore = score;
    },

    /**
     * 提交評估分數
     * @param record
     */
    submitScore(chat) {
      let score = chat.tempScore ? chat.tempScore : 0;
      if (score < 100 && !window.confirm('哥~ 小妹这么辛苦，真的只给' + score + '分吗?')) {
        return;
      }
      Global.loader.open('提交评分中');
      ChatService.score({
        score: score
        , chatId: chat.id
        , chatTime: chat.time
        , otp: chat.otp
      }, (result) => {
        Global.loader.close();
        chat.score = score;
        score = 0;
        if (result.success) {
          chat.otp = undefined;
        } else {
          alert(result.message);
        }
        this.scoring = false;
      });
    },

    /**
     * 瀏覽圖片
     * @param record
     */
    showImage(record) {
      this.currentRecord = record;
      this.dialog.open();
      if(this.isQQ) this.cdf.detectChanges();
    },

    resize(multi) {
      // let dom = <HTMLInputElement>document.getElementById('dialog')
      dom.style.transform = 'scale(' + multi  +')'
    },

    /**
     * 下載檔案
     * @param record
     */
    download(record) {
      if (!window.confirm('下载挡案?')) {
        return;
      }
      DownloadUtil.file(record.data, record.url);
    },

    /**
     * 計算上傳進度
     * @param record
     */
    progress(record) {
      return record.progress / record.size * 100 + '%';
    },

    /**
     * 計算檔案大小
     * @param record
     */
    getFileSize(record){
      return FileUtil.getFileSize(record.size);
    },

    /**
     * 取得檔案類型
     * @param type
     */
    getFileType(type){
      if (type.startsWith('image')) {
        return this.ChatRecordDataType.IMAGE;
      } else if (type.startsWith('audio')) {
        return this.ChatRecordDataType.VOICE;
      } else if (type.startsWith('video')) {
        return this.ChatRecordDataType.DOC;
      } else {
        return this.ChatRecordDataType.DOC;
      }
    },

    /**
     * 是否顯示頭像
     * @param record
     */
    showPortrait(record){
      return record.sendType != ChatRecordSendType.SYSTEM;
    },

    /**
     * 取得頭像
     * @param record
     */
    getPortrait(record){
      switch (record.sendType) {
        case ChatRecordSendType.CUSTOMER:
          return '/assets/images/customer.png';
        case ChatRecordSendType.CONSULTANT:
        case ChatRecordSendType.CONSULTANTDEFAULT:
          let chat = this.chatStorage.find(record.chatId);
          if (CUI.ignoreError(() => chat.users[record.userId].icon)) {
            return chat.users[record.userId].icon;
          }
          return '/assets/images/consultant.jpg';
      }
      return '';
    },

    /**
     * 決定訊息做邊還右邊
     * @param record
     */
    // @TryCatchTrace()
    getMessageClassName(record) {
      let className = 'message ';
      switch (record.sendType) {
        case ChatRecordSendType.SYSTEM:
          className += 'center system';
          break;

        case ChatRecordSendType.CONSULTANT:
        case ChatRecordSendType.CONSULTANTDEFAULT:
          className += 'left';
          break;
        case ChatRecordSendType.CUSTOMER:
          className += 'right';
          break;
      }
      return className;
    },

    /**
     * 訊息時間
     * @param record
     */
    getMessageTime(record) {
      return DateUtil.format(record.time, 'MMMDo hh:mm:ssa');
    },

    /**
     * 訊息時間
     * @param record
     */
    getTimeFormat(time) {
      return DateUtil.format(time, 'MMMDo hh:mm:ssa');
    },

    /**
     * 發送者名稱
     * @param record
     */
    getMessageName(record) {
      switch (record.sendType) {
        case ChatRecordSendType.SYSTEM:
          return '系统讯息';
        case ChatRecordSendType.CONSULTANT:
        case ChatRecordSendType.CONSULTANTDEFAULT:
          let chat = this.chatStorage.find(record.chatId);
          if (CUI.ignoreError(() => chat.users[record.userId].nickname)) {
            return chat.users[record.userId].nickname;
          }
          return '客服小妹';
        case ChatRecordSendType.CUSTOMER:
          if (this.customer.type != CustomerTypeEnum.GUEST && this.customer.nickname != null) {
            return this.CustomerType[this.customer.type] + '(' + this.customer.nickname + ')';
          } else {
            return this.CustomerType[this.customer.type] + '(' + this.customer.id + ')';
          }
      }
      return '';
    },

    openComplaint() {
      this.complaintDialog.open(this.consultant);
    },

    findFirstChatRecord(){
      if (!this.chatStorage || this.chatStorage.records.length == 0) {
        return undefined;
      }
      let chat = this.chatStorage.records[0];
      if (this.chatRecordStorage[chat.id].records.length == 0) {
        return undefined;
      }
      return this.chatRecordStorage[chat.id].records[0];
    },
    findLastChatRecordByLog() {
      if (!this.chatLog || this.chatLog.length == 0) {
        return undefined;
      }
      let chat = this.chatLog[this.chatLog.length - 1];
      let records = this.chatRecordLog[chat.id];
      if (records.length == 0) {
        return undefined;
      }
      return records[records.length - 1];
    },

    findLastChatRecord() {
      if (!this.chatStorage) {
        return undefined;
      }
      let chats = this.chatStorage.records;
      if (chats.length == 0) {
        return undefined;
      }
      let chat = chats[chats.length - 1];
      let records = this.chatRecordStorage[chat.id].records;
      if (records.length == 0) {
        return undefined;
      }
      return records[records.length - 1];
    },

    /**
     * 添加聊天室
     * @param chat
     */
    appendChats(chats) {
      if (!chats) { return; }
      for (let i in chats) {
        this.appendChat(chats[i]);
      }
    },

    appendChat(chat) {
      if (!chat) { return; }
      if ((this.currentChat && this.currentChat.id == chat.id) || this.currentChatClose) {
        this.currentChat = chat;
        this.currentChatClose = false;
        this.scrollDown = true;
        this.doScrollTop();
      }
      if (this.chatStorage.overwrite(chat) > 0) {
        if (!this.chatRecordStorage[chat.id]) {
          this.chatRecordStorage[chat.id] = this.initChatRecordStroage(this.chatRecordLog[chat.id] = []);
        }
        this.chatStorage.sort();
      }
    },

    appendFormat(record) {
      switch (record.dataType) {
        case this.ChatRecordDataType.ANNOUNCEMENT:
          record.announce = JSON.parse(record.data);
          break;
        case this.ChatRecordDataType.BOT:
          record.botData = JSON.parse(record.data);
          break;
      }
    },

    /**
     * 添加聊天訊息
     * @param record
     */
    appendChatRecord(record){
      if (!record) { return; }
      let storage = this.chatRecordStorage[record.chatId];
      if (!storage) {
        storage = this.chatRecordStorage[record.chatId] = this.initChatRecordStroage((this.chatRecordLog[record.chatId] = []));
      }

      this.appendFormat(record);
      return storage.append(record);
    },

    /**
     * 添加歷史聊天訊息
     * @param records
     */
    appendFirstChatRecord(records){
      if (!records) { return; }
      let record;
      // let storage: RecordStorage<ExtendChatRecord>;
      let c = 0;
      for (let i in records) {
        record = records[i];
        storage = this.chatRecordStorage[record.chatId];
        if (!storage) {
          storage = this.chatRecordStorage[record.chatId] = this.initChatRecordStroage((this.chatRecordLog[record.chatId] = []));
        }
        this.appendFormat(record);
        c += storage.appendFirst(record);
      }
      return c;
    },

    /**
     * 添加聊天訊息
     * @param records
     */
    appendLastChatRecord(records) {
      if (!records) { return; }
      let record;
      let storage;
      let c = 0;
      for (let i in records) {
        record = records[i];
        storage = this.chatRecordStorage[record.chatId];
        if (!storage) {
          storage = this.chatRecordStorage[record.chatId] = this.initChatRecordStroage((this.chatRecordLog[record.chatId] = []));
        }
        this.appendFormat(record);
        c += storage.append(record);
      }
      return c;
    },

    /**
     *
     * @param array
     */
    initChatStroage(array) {
      // return new RecordStorage<Chat>({
      //   logLimit: 200
      //   , logs: array
      //   , key: (r) => r.id
      //   , sort: (a, b) => a.time > b.time ? 1 : (a.time == b.time ? (a.id > b.id ? 1 : a.id == b.id ? 0 : -1) : -1)
      // });
    },

    /**
     *
     * @param array
     */
    initChatRecordStroage(array) {
      // return new RecordStorage<ExtendChatRecord>({
      //   logLimit: 200
      //   , logs: array
      //   , key: (r) => r.id
      //   , sort: (a, b) => a.time > b.time ? 1 : (a.time == b.time ? (a.id > b.id ? 1 : a.id == b.id ? 0 : -1) : -1)
      // });
    }
  }
}  
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
