<template>
  <!-- <div class="quick-chat-container"
  :style="{'border-bottom-left-radius': borderStyle.bottomLeft, 'border-bottom-right-radius': borderStyle.bottomRight, 'border-top-right-radius': borderStyle.topRight, 'border-top-left-radius': borderStyle.topLeft}">-->
  <div class="quick-chat-container">
    <Header
      v-if="displayHeader"
      :colors="colors"
      :chatTitle="chatTitle"
      :currentChatClose="currentChatClose"
      @showCustomerComplaint="showCustomerComplaint"
      @close="close"
    >
      <!-- <template #header>
        <slot name="header"></slot>
      </template>-->
    </Header>
    <MessageDisplay
      :colors="colors"
      :async-mode="asyncMode"
      :load-more-messages="loadMoreMessages"
      :scroll-bottom="scrollBottom"
      :profile-picture-config="profilePictureConfig"
      :timestamp-config="timestampConfig"
      :hasLog="hasLog"
      :chatStorage="chatStorage"
      :chatRecordStorage="chatRecordStorage"
      :querying="querying"
      :scoring="scoring"
      :currentChat="currentChat"
      :sendingRecords="sendingRecords"
      :consultant="consultant"
      @onImageClicked="onImageClicked"
      @showPortrait="showPortrait"
      @getMessageClassName="getMessageClassName"
      @queryLog="queryLog"
      @getKnowledgeSolution="getKnowledgeSolution"
      @submitScore="submitScore"
      @removeSendRecord="removeSendRecord"
      @reSend="reSend"
      ref="messages"
    />
    <MessageManager
      :colors="colors"
      :border-style="borderStyle"
      :submit-icon-size="submitIconSize"
      :submit-image-icon-size="submitImageIconSize"
      :send-images="sendImages"
      :consultant="consultant"
      @onImageSelected="onImageSelected"
      @onMessageSubmit="onMessageSubmit"
      @onType="onType"
      @send="send"
      @selectImage="selectImage"
      @selectFile="selectFile"
      @getMessageClassName="getMessageClassName"
      @score="score"
    />
  </div>
</template>

<script>
import Header from "./Header.vue";
import MessageDisplay from "./MessageDisplay.vue";
import MessageManager from "./MessageManager.vue";
import { mapMutations } from "vuex";
import store from "../store";
/////////////////////////////////////////////////
import { FileUtil } from "@/ts/util/file-util";
import { DateUtil } from "@/ts/util/date-util";
import { DownloadUtil } from "@/ts/util/download-util";
import { NotifyService } from "@/ts/component/notify-service";
import { ChatService } from "@/ts/service/chat-service";
import { UserService } from "@/ts/service/user-service";
import { BotService } from "@/ts/service/bot-service";
import { Global } from "@/ts/globle";
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
  SubProduct
} from "@/ts/constant/chat";
import { AjaxMethod } from "@/ts/lib/cui/core/ajax/ajax.enums";
import { AjaxUtil } from "@/ts/lib/cui/core/ajax/ajax-util";
import { Cache } from "@/ts/lib/cui/core/decorators/cache";
import { Delay } from "@/ts/lib/cui/core/decorators/async";
import { IAjaxManagerResult } from "@/ts/lib/cui/core/ajax/ajax.interfaces";
import { CUI } from "@/ts/lib/cui/core/cui";
import { TryCatchTrace } from "@/ts/lib/cui/core/decorators/try-catch-trace";
import { RecordStorage } from "@/ts/component/record-storage";
export default {
  name: "chat",
  components: {
    Header,
    MessageDisplay,
    MessageManager
  },
  props: {
    participants: {
      type: Array,
      required: true
    },
    // messages: {
    //   type: Array,
    //   required: true
    // },
    myself: {
      type: Object,
      required: true
    },
    // chatTitle: {
    //   type: String,
    //   required: false,
    //   default: ""
    // },
    placeholder: {
      type: String,
      required: false,
      default: "type your message here"
    },
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
    hideCloseButton: {
      type: Boolean,
      required: false,
      default: false
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
    closeButtonIconSize: {
      type: String,
      required: false,
      default: "15px"
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
    scrollBottom: {
      type: Object,
      required: false,
      default: () => {
        return {
          messageSent: true,
          messageReceived: false
        };
      }
    },
    displayHeader: {
      type: Boolean,
      required: false,
      default: true
    },
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
    /* onClose: {
                type: Function,
                required: false,
                default: () => false
            }, */
    /* onImageSelected: {
                type: Function,
                required: false,
                default: () => false
            }, */
    /* onImageClicked: {
                type: Function,
                required: false,
                default: () => false
            }, */
    sendImages: {
      type: Boolean,
      required: false,
      default: true
    },
    profilePictureConfig: {
      type: Object,
      required: false,
      default: () => {
        return {
          others: true,
          myself: false,
          styles: {
            width: "25px",
            height: "25px",
            borderRadius: "50%"
          }
        };
      }
    },
    timestampConfig: {
      type: Object,
      required: false,
      default: () => {
        return {
          format: "HH:mm",
          relative: false
        };
      }
    }
  },
  data() {
    return {
      text: "",
      imageElement: "",
      fileElement: "",
      listeners: {},
      consultant: {},
      messagesRef: "",
      chatStorage: {},
      sendingRecords: [],
      waitMessage: [],
      hasLog: true,
      chatRecordStorage: {},
      querying: false,
      messagesElement: {},
      scrollTop: "",
      subProduct: {},
      chatTitle: "",
      scrollDown: true,
      scoring: false,
      currentChat: {},
      currentChatClose: false,
      sending: 0
    };
  },
  watch: {
    participants() {
      this.setParticipants(this.participants);
    },
    myself() {
      this.setMyself(this.myself);
    },
    // messages() {
    //   this.setMessages(this.messages);
    // },
    placeholder() {
      this.setPlaceholder(this.placeholder);
    }
    // chatTitle() {
    //   this.setChatTitle(this.chatTitle);
    // }
  },
  beforeCreate() {
    this.$store = store();
  },
  mounted() {
    // this.setParticipants(this.participants);
    // this.setMyself(this.myself);
    // this.setMessages(this.messages);
    // this.setPlaceholder(this.placeholder);
    // this.setChatTitle(this.chatTitle);
    //////////////////////////////////////////////
    this.messagesElement = this.$refs.messages;
    console.log("123132", this.$refs.messages);

    let queryParamter = Global.queryString
      ? Global.getQueryParamter()
      : undefined;
    if (!this.consultant) {
      Global.loader.open("配对客服中...");
    }
    this.initCustomer(this.customer);
    let form = CUI.deepClone({}, queryParamter);
    let record = this.findLastChatRecordByLog();
    if (record) {
      form["time"] = record.time;
      form["id"] = record.id;
    }
    ChatService.init(form, result => {
      if (result.success) {
        this.subProduct = result.added.subProduct;
        this.initTitle();
        this.initCustomer(result.data);
        this.currentChat = result.added.chat;
        this.appendChat(result.added.chat);
        this.consultant = result.added.consultant;
        this.appendLastChatRecord(result.added.records);
        this.init();
        // this.cdf.markForCheck();
        this.bus.$emit("consultant", this.consultant);
      } else {
        alert(result.message);
        window.close();
      }
      Global.loader.close();
    });
    this.fileElement = document.createElement("input");
    this.fileElement.type = "file";
    this.fileElement.addEventListener("change", this.uploads);
    this.imageElement = document.createElement("input");
    this.imageElement.type = "file";
    this.imageElement.accept = "image/*";
    this.imageElement.addEventListener("change", this.uploadImages);
    this.initNotify();
    this.initListener();
    NotifyService.open("/chat");
  },
  methods: {
    ...mapMutations([
      "setParticipants",
      "setMyself",
      "setMessages",
      "setPlaceholder",
      "setChatTitle"
    ]),
    onClose: function() {
      this.$emit("onClose");
    },
    onType: function(e) {
      this.$emit("onType", e);
    },
    onMessageSubmit: function(message) {
      this.$emit("onMessageSubmit", message);
    },
    onImageSelected: function(data) {
      this.$emit("onImageSelected", data);
    },
    onImageClicked: function(message) {
      this.$emit("onImageClicked", message);
    },
    ///////////////////////////////////////////////////////////
    showCustomerComplaint() {
      this.$emit("showCustomerComplaint", true, "slideLeft");
    },
    initTitle() {
      if (this.subProduct) {
        if (this.subProduct.chatTitle) {
          this.chatTitle = this.subProduct.chatTitle;
        }
      }
      document.querySelector("title").innerText = this.chatTitle;
    },

    init() {
      // this.fileElement = document.createElement('input');
      // this.fileElement.type = 'file';
      // this.fileElement.addEventListener('change', this.uploads);
      // this.imageElement = document.createElement('input');
      // this.imageElement.type = 'file';
      // this.imageElement.accept = 'image/*';
      // this.imageElement.addEventListener('change', this.uploadImages);
      // this.initNotify();
      // this.initListener();
      // NotifyService.open('/chat');
    },

    /**
     * 初始化瀏覽器通知
     */
    initNotify() {
      if (
        "Notification" in window &&
        (!Notification.permission || Notification.permission === "default")
      ) {
        Notification.requestPermission(permission => {});
      }
    },

    /**
     * 發送瀏覽器通知
     */
    sendNotification(recrod) {
      if (document.hasFocus()) {
        return;
      }
      if (Notification.permission != "granted") {
        return;
      }
      if (recrod.sendType == ChatRecordSendType.CUSTOMER) {
        return;
      }

      let notify = new Notification("客服訊息", {
        icon: "",
        body: "您有新讯息",
        tag: ChatEventType.MESSAGE + "-" + recrod.id
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
          this.chatRecordStorage[chatId] = this.initChatRecordStroage(
            this.chatRecordLog[chatId]
          );
        }
      } else {
        this.chatStorage = this.initChatStroage((this.chatLog = []));
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
      this.listeners[ChatEventType.CHATINFO] = NotifyService.listener(
        ChatEventType.CHATINFO,
        message => {
          this.initCustomer(message.customer);
          this.appendChat(message.chat);
          this.consultant = message.consultant;
          // this.userComponent.refresh(message.consultant);
          if (
            this.currentChat &&
            this.chatRecordLog[this.currentChat.id].length == 0
          ) {
            this.queryLog();
          }
          // this.cdf.detectChanges();
          // Global.loader.close();
        }
      );
      // 監聽聊天訊息
      this.listeners[ChatEventType.MESSAGE] = NotifyService.listener(
        ChatEventType.MESSAGE,
        message => {
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
        }
      );

      // 客服轉接
      this.listeners[ChatEventType.SWITCH_USER] = NotifyService.listener(
        ChatEventType.SWITCH_USER,
        message => {
          this.switchUser(message);
          this.appendChatRecord(message.data);
          this.doScrollTop();
          // this.cdf.detectChanges();
        }
      );

      this.listeners[ChatEventType.TYPING] = NotifyService.listener(
        ChatEventType.TYPING,
        message => {
          // this.cdf.detectChanges();
        }
      );

      // 結束聊天評分
      this.listeners[ChatEventType.CLOSESCORE] = NotifyService.listener(
        ChatEventType.CLOSESCORE,
        message => {
          this.currentChat = message.chat;
          this.appendChat(this.currentChat);
          this.currentChat.otp = message.otp;
          // this.cdf.detectChanges();
        }
      );
    },

    /**
     * 轉接客服
     */
    switchUser(message) {
      UserService.query(result => {
        const defaultIcon = "/assets/images/consultant.jpg";
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
    doScrollTop() {
      if (this.messagesElement) {
        if (this.scrollDown) {
          // 滾動到指定位置
          this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
        } else {
          this.messagesElement.scrollTop =
            this.messagesElement.scrollHeight -
            this.scrollTop -
            this.messagesElement.clientHeight;
        }
      }
    },

    /**
     * 選擇表情符號
     */
    // onEmojiSelect(emoji) {
    //   this.text += emoji.native;
    // },

    /**
     * 聊天內容滾動事件
     */
    onScroll() {
      if (
        this.hasLog &&
        !this.querying &&
        this.messagesElement.scrollTop == 0
      ) {
        this.queryLog();
      }
    },

    /**
     * 中斷對話
     */
    close() {
      if (!window.confirm("您确定要结束本次对话吗？")) {
        return;
      }
      Global.ajaxManager.request({
        url: "/chat",
        method: AjaxMethod.DELETE,
        callback: result => {
          if (result.success) {
            this.currentChatClose = true;
            // this.cdf.markForCheck();
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
      if (
        this.currentChatClose ||
        this.consultant.type == 2 ||
        (!this.typingText && !this.text)
      ) {
        return;
      }
      this.typingText = this.text;
      ChatService.typing({ text: this.text }, result => {
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
      ChatService.query(
        {
          chatTime: record.chatTime,
          chatId: record.chatId,
          time: record.time,
          id: record.id
        },
        result => {
          if (result.success) {
            this.appendLastChatRecord(result.data);
            // this.cdf.markForCheck();
            this.doScrollTop();
          } else {
            alert(result.message);
          }
          this.querying = false;
        }
      );
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
          chatTime: record.chatTime,
          chatId: record.chatId,
          time: record.time,
          userId: this.currentChat.userId,
          id: record.id
        };
      } else if (this.currentChat) {
        form = {
          chatTime: this.currentChat.time,
          chatId: this.currentChat.id,
          time: DateUtil.now(),
          userId: this.currentChat.userId
        };
      } else {
        return;
      }
      this.scrollDown = false;
      this.querying = true;
      this.scrollTop =
        this.messagesElement.scrollHeight - this.messagesElement.clientHeight;
      ChatService.queryLog(form, result => {
        if (result.success) {
          this.appendChats(result.added);
          this.hasLog = this.appendFirstChatRecord(result.data) > 0;
          // this.cdf.markForCheck();
          // this.cdf.detectChanges();
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
      if (record.dataType == ChatRecordDataType.TEXT) {
        this.doSend(record);
      } else {
        this.doUpload(record);
      }
    },

    /**
     * 發訊息
     */
    send(text) {
      this.text = text;
      if (!this.text) {
        return;
      }
      this.scrollDown = true;
      let record = this.buildText(this.text);
      this.appendSendingRecord(record);
      this.doSend(record);
    },

    /**
     * 實際發送
     */
    doSend(record) {
      this.sending++;
      if (this.consultant.type == 2 && !this.currentChatClose) {
        // 機器客服  *對話結束狀態時使用正常service
        BotService.send(
          {
            text: record.data
          },
          this.sendCallback.bind(this, record)
        );
      } else {
        ChatService.send(
          {
            text: record.data
          },
          this.sendCallback.bind(this, record)
        );
      }
      if (this.isQQ) {
        // let dom = <HTMLInputElement>document.getElementById('clear');
        dom.value = "";
      }
      this.text = "";
    },

    /**
     * 批次上傳
     */
    uploads() {
      this.scrollDown = true;
      let files = this.fileElement.files;
      if (files.length == 0) {
        return;
      }
      for (let i = 0; i < files.length; i++) {
        this.upload(files.item(i));
      }
      this.fileElement.value = "";
    },

    /**
     * 批次上傳
     */
    uploadImages() {
      // this.scrollDown = true;
      let files = this.imageElement.files;
      if (files.length == 0) {
        return;
      }
      for (let i = 0; i < files.length; i++) {
        this.upload(files.item(i));
      }
      this.imageElement.value = "";
    },

    /**
     * 執行上傳
     */
    upload(file) {
      let record = this.buildUpload(file);
      this.appendSendingRecord(record);
      this.doUpload(record);
    },

    /**
     * 執行上傳
     */
    doUpload(record) {
      this.sending++;
      // this.cdf.markForCheck();
      ChatService.upload(
        {
          file: record.file,
          type: record.dataType
        },
        (xhr, e) => {
          record.progress = e.loaded;
          // this.cdf.markForCheck();
        },
        this.sendCallback.bind(this, record)
      );
    },

    /**
     * 發送訊息Callback
     * @param oldMessage
     * @param result
     */
    sendCallback(oldMessage, result) {
      this.sending--;
      if (result.success) {
        this.sendSuccess(oldMessage);
        this.appendChatRecord(result.data.data);
      } else {
        alert(result.message);
        this.sendFail(oldMessage);
      }
      this.cleanWaitRecord();
      // this.cdf.detectChanges();
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
      if (this.consultant.type == 2) {
        alert("您好，智能客服目前不支持挡案上传。");
        return;
      }
      this.imageElement.click();
    },

    /**
     * 選取檔案
     */
    selectFile() {
      if (this.consultant.type == 2) {
        alert("您好，智能客服目前不支持挡案上传。");
        return;
      }
      this.fileElement.click();
    },

    /**
     * 發送中訊息
     */
    appendSendingRecord(record) {
      this.sendingRecords.push(record);
    },

    /**
     * 產生文字物件
     * @param text
     */
    buildText(text) {
      return {
        chatTime: 0,
        chatId: 0,
        id: 0,
        sendType: ChatRecordSendType.CUSTOMER,
        userId: this.consultant.id,
        dataType: ChatRecordDataType.TEXT,
        data: text,
        unsend: false,
        // , time: DateUtil.now() as number
        url: null,
        size: null,
        progress: 0,
        fail: false
      };
    },
    /**
     * 產生上傳物件
     * @param file
     */
    buildUpload(file) {
      return {
        chatTime: 0,
        chatId: 0,
        id: 0,
        sendType: ChatRecordSendType.CUSTOMER,
        userId: this.consultant.id,
        dataType: this.getFileType(file.type),
        data: file.name,
        unsend: false,
        // , time: DateUtil.now() as number
        url: URL.createObjectURL(file),
        size: file.size,
        progress: 0,
        fail: false,
        file: file
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
    sendSuccess(record) {
      this.removeSendRecord(record);
    },

    /**
     * 移除發送的訊息
     * @param record
     */
    removeSendRecord(record) {
      let index = this.sendingRecords.indexOf(record);
      if (index != -1) {
        this.sendingRecords.splice(index, 1);
      }
    },

    /**
     * 發送失敗
     * @param record
     */
    sendFail(record) {
      record.fail = true;
    },

    /**
     * 機器客服訊息是否為空
     */
    isBotRecordEmpty(record) {
      if (
        record.botData.recommend ||
        record.botData.solution ||
        record.botData.relatedProblems.length > 0
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
      BotService.getKnowledgeSolution(id, result => {
        this.sending--;
        if (result.success) {
          this.sendSuccess(record);
          this.cleanWaitRecord();
          // this.cdf.detectChanges();
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
     * 提交評估分數
     * @param record
     */
    submitScore(chat) {
      let score = chat.tempScore ? chat.tempScore : 0;
      if (
        score < 100 &&
        !window.confirm("哥~ 小妹这么辛苦，真的只给" + score + "分吗?")
      ) {
        return;
      }
      Global.loader.open("提交评分中");
      ChatService.score(
        {
          score: score,
          chatId: chat.id,
          chatTime: chat.time,
          otp: chat.otp
        },
        result => {
          Global.loader.close();
          chat.score = score;
          score = 0;
          if (result.success) {
            chat.otp = undefined;
          } else {
            alert(result.message);
          }
          this.scoring = false;
        }
      );
    },

    /**
     * 瀏覽圖片
     * @param record
     */
    showImage(record) {
      this.currentRecord = record;
      this.dialog.open();
      // if (this.isQQ) this.cdf.detectChanges();
    },

    resize(multi) {
      // let dom = <HTMLInputElement>document.getElementById('dialog')
      dom.style.transform = "scale(" + multi + ")";
    },

    /**
     * 下載檔案
     * @param record
     */
    download(record) {
      if (!window.confirm("下载挡案?")) {
        return;
      }
      DownloadUtil.file(record.data, record.url);
    },

    /**
     * 計算上傳進度
     * @param record
     */
    progress(record) {
      return (record.progress / record.size) * 100 + "%";
    },

    /**
     * 計算檔案大小
     * @param record
     */
    getFileSize(record) {
      return FileUtil.getFileSize(record.size);
    },

    /**
     * 取得檔案類型
     * @param type
     */
    getFileType(type) {
      if (type.startsWith("image")) {
        return ChatRecordDataType.IMAGE;
      } else if (type.startsWith("audio")) {
        return ChatRecordDataType.VOICE;
      } else if (type.startsWith("video")) {
        return ChatRecordDataType.DOC;
      } else {
        return ChatRecordDataType.DOC;
      }
    },

    /**
     * 是否顯示頭像
     * @param record
     */
    showPortrait(record) {
      return record.sendType != ChatRecordSendType.SYSTEM;
    },

    /**
     * 取得頭像
     * @param record
     */
    getPortrait(record) {
      switch (record.sendType) {
        case ChatRecordSendType.CUSTOMER:
          return "/assets/images/customer.png";
        case ChatRecordSendType.CONSULTANT:
        case ChatRecordSendType.CONSULTANTDEFAULT:
          let chat = this.chatStorage.find(record.chatId);
          if (CUI.ignoreError(() => chat.users[record.userId].icon)) {
            return chat.users[record.userId].icon;
          }
          return "/assets/images/consultant.jpg";
      }
      return "";
    },

    /**
     * 決定訊息做邊還右邊
     * @param record
     */
    // @TryCatchTrace()
    getMessageClassName(record) {
      let className = "message ";
      switch (record.sendType) {
        case ChatRecordSendType.SYSTEM:
          className += "left";
          break;

        case ChatRecordSendType.CONSULTANT:
        case ChatRecordSendType.CONSULTANTDEFAULT:
          className += "left";
          break;
        case ChatRecordSendType.CUSTOMER:
          className += "right";
          break;
      }
      return className;
    },

    /**
     * 訊息時間
     * @param record
     */
    getMessageTime(record) {
      return DateUtil.format(record.time, "MMMDo hh:mm:ssa");
    },

    /**
     * 訊息時間
     * @param record
     */
    getTimeFormat(time) {
      return DateUtil.format(time, "MMMDo hh:mm:ssa");
    },

    /**
     * 發送者名稱
     * @param record
     */
    getMessageName(record) {
      switch (record.sendType) {
        case ChatRecordSendType.SYSTEM:
          return "系统讯息";
        case ChatRecordSendType.CONSULTANT:
        case ChatRecordSendType.CONSULTANTDEFAULT:
          let chat = this.chatStorage.find(record.chatId);
          if (CUI.ignoreError(() => chat.users[record.userId].nickname)) {
            return chat.users[record.userId].nickname;
          }
          return "客服小妹";
        case ChatRecordSendType.CUSTOMER:
          if (
            this.customer.type != CustomerTypeEnum.GUEST &&
            this.customer.nickname != null
          ) {
            return (
              CustomerType[this.customer.type] +
              "(" +
              this.customer.nickname +
              ")"
            );
          } else {
            if(process.env.NODE_ENV == 'dev'){
              return  CustomerType[this.customer.type] + "(" + this.customer.id + ")"
            }
            else{
              return  CustomerType[this.customer.type]
            }
          }
      }
      return "";
    },

    openComplaint() {
      this.complaintDialog.open(this.consultant);
    },

    findFirstChatRecord() {
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
      if (!chats) {
        return;
      }
      for (let i in chats) {
        this.appendChat(chats[i]);
      }
    },

    appendChat(chat) {
      if (!chat) {
        return;
      }
      if (
        (this.currentChat && this.currentChat.id == chat.id) ||
        this.currentChatClose
      ) {
        this.currentChat = chat;
        this.currentChatClose = false;
        this.scrollDown = true;
        this.doScrollTop();
      }
      if (this.chatStorage.overwrite(chat) > 0) {
        if (!this.chatRecordStorage[chat.id]) {
          this.chatRecordStorage[chat.id] = this.initChatRecordStroage(
            (this.chatRecordLog[chat.id] = [])
          );
        }
        this.chatStorage.sort();
      }
    },

    appendFormat(record) {
      switch (record.dataType) {
        case ChatRecordDataType.ANNOUNCEMENT:
          record.announce = JSON.parse(record.data);
          break;
        case ChatRecordDataType.BOT:
          record.botData = JSON.parse(record.data);
          break;
      }
    },

    /**
     * 添加聊天訊息
     * @param record
     */
    appendChatRecord(record) {
      if (!record) {
        return;
      }
      let storage = this.chatRecordStorage[record.chatId];
      if (!storage) {
        storage = this.chatRecordStorage[
          record.chatId
        ] = this.initChatRecordStroage(
          (this.chatRecordLog[record.chatId] = [])
        );
      }

      this.appendFormat(record);
      let c = storage.append(record);
      this.chatRecordStorage = Object.assign({}, this.chatRecordStorage);
      this.chatRecordStorage[record.chatId] = storage;
      return c;
    },

    /**
     * 添加歷史聊天訊息
     * @param records
     */
    appendFirstChatRecord(records) {
      if (!records) {
        return;
      }
      let record;
      let storage;
      let c = 0;
      for (let i in records) {
        record = records[i];
        storage = this.chatRecordStorage[record.chatId];
        if (!storage) {
          storage = this.chatRecordStorage[
            record.chatId
          ] = this.initChatRecordStroage(
            (this.chatRecordLog[record.chatId] = [])
          );
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
      if (!records) {
        return;
      }
      let record;
      let storage;
      let c = 0;
      for (let i in records) {
        record = records[i];
        storage = this.chatRecordStorage[record.chatId];
        if (!storage) {
          storage = this.chatRecordStorage[
            record.chatId
          ] = this.initChatRecordStroage(
            (this.chatRecordLog[record.chatId] = [])
          );
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
      return new RecordStorage({
        logLimit: 200,
        logs: array,
        key: r => r.id,
        sort: (a, b) =>
          a.time > b.time
            ? 1
            : a.time == b.time
            ? a.id > b.id
              ? 1
              : a.id == b.id
              ? 0
              : -1
            : -1
      });
    },

    /**
     *
     * @param array
     */
    initChatRecordStroage(array) {
      return new RecordStorage({
        logLimit: 200,
        logs: array,
        key: r => r.id,
        sort: (a, b) =>
          a.time > b.time
            ? 1
            : a.time == b.time
            ? a.id > b.id
              ? 1
              : a.id == b.id
              ? 0
              : -1
            : -1
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.quick-chat-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: #f0eeee;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
}
</style>
