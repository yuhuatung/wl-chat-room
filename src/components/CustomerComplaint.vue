<template>
  <div class="customer-complaint">
    <div class="customer-complaint-containar">
      <header>
        <i class="flaticon-prev" @click="closeCustomerComplaint()"></i>
        <p>投訴客服</p>
      </header>
      <div class="user-content" v-if="consultant.added">
        <img class="user-icon" :src="consultant.added.icon" />
        <div class="user-name">您正在投诉客服 {{consultant.nickname}}...</div>
      </div>

      <div class="opinion">
        <textarea placeholder="请输入您的投訴原因" v-model="form.content"></textarea>
        <div class="upload-containar">
          <template v-if="form.files && form.files.length > 0">
            <div class="file-content" v-for="file in form.files">
              <img class="file-img" :src=" getImageUrl(file)" />
              <span tooltip="移除文件" class="flaticon-close file-span" @click="removeFile(file)"></span>
            </div>
          </template>
          <div class="upload-file" @click="selectFile">
            <i class="flaticon-camera-1"></i>
            <label>
              上传凭证
              <br />(最多9張)
            </label>
          </div>
        </div>
      </div>

      <div class="data-form">
        <div class="icon-box flaticon-wechat">
          <i></i>
        </div>
        <input placeholder="请输入您的微信号" type="text" v-model="form.weChat" />
      </div>

      <div class="data-form">
        <div class="icon-box flaticon-qq">
          <i></i>
        </div>
        <input placeholder="请输入您的qq号" type="text" v-model="form.qq" />
      </div>

      <div class="data-form">
        <div class="icon-box flaticon-phone">
          <i></i>
        </div>
        <input placeholder="请输入您的手機号" type="text" v-model="form.phone" />
      </div>

      <div class="submit-btn" @click="save">提交</div>
    </div>
  </div>
</template>

<script>
import { ChatService } from "@/ts/service/chat-service";
import { AjaxUtil } from "@/ts/lib/cui/core/ajax/ajax-util";
import { Image } from "@/ts/constant/img";
export default {
  data() {
    return {
      form: {
        content: "",
        weChat: "",
        qq: "",
        phone: "",
        skype: "",
        files: []
      },
      nickName: "",
      icon: "",
      userId: 0,
      fileElement: null,
      maxFileSize: 5 /**文件大小不超过5M*/,
      fileCount: 9 /**文件數量不超过9個*/,
      consultant: {}
    };
  },
  mounted() {
    this.fileElement = document.createElement("input");
    this.fileElement.accept = "image/*";
    this.fileElement.type = "file";
    this.fileElement.multiple = true;
    this.fileElement.addEventListener("change", this.addFile);
    this.bus.$on("consultant", $event => {
      this.consultant = $event;
    });
  },
  beforeDestroy(){
    this.bus.$off("consultant")
  },
  methods: {
    closeCustomerComplaint() {
      this.$emit("showCustomerComplaint", false, "slideRight");
    },
    // open(user) {
    //   if (!this.userId || this.userId !== user.id) {
    //     if (user.added.icon) {
    //       this.icon = user.added.icon;
    //     } else {
    //       this.icon = Image.CONSULTANTDEFAULT;
    //     }
    //     this.nickName = user.nickname;
    //     this.userId = user.id;
    //     this.initForm();
    //   }
    //   this.dialog.open();
    // },
    save() {
      ChatService.complaint(this.form, this.callback);
    },

    callback(result) {
      if (!result.success) {
        alert(AjaxUtil.getMessage(result));
        return;
      }
      // this.dialog.close();
      this.initForm();
      this.$emit("showCustomerComplaint", false, "slideRight");
    },

    initForm() {
      this.form = {
        content: "",
        weChat: "",
        qq: "",
        phone: "",
        skype: "",
        files: []
      };
    },
    selectFile() {
      this.fileElement.click();
    },
    removeFile(file) {
      if (this.form.files.length > 0) {
        let index = this.form.files.indexOf(file);
        if (index > -1) {
          this.form.files.splice(index, 1);
        }
      }
    },
    getImageUrl(file) {
      if (file) {
        return URL.createObjectURL(file);
      }
      return "";
    },
    addFile() {
      let uploadfileCount = this.form.files.length;
      let tempfileCount = this.fileElement.files.length;
      if (uploadfileCount + tempfileCount > this.fileCount) {
        alert("文件数量不超过9个");
        return;
      }

      let waringMsg = [];

      if (this.fileElement.files.length > 0) {
        let tempFiles = this.fileElement.files;

        for (let i = 0; i < tempFiles.length; i++) {
          let file = tempFiles.item(i);
          let fileSize = tempFiles.item(i).size / 1024 / 1024;

          if (fileSize > this.maxFileSize) {
            waringMsg.push(file.name);
            continue;
          }
          this.form.files.push(file);
        }

        if (waringMsg.length > 0) {
          alert(waringMsg + "  单个文件大小不超过5M");
        }
        // this.cdf.markForCheck();
      }
      this.fileElement.value = "";
    }
  }
};
</script>

<style lang="scss" scoped>
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
.customer-complaint {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 6;
  padding: 0.8rem;
  .customer-complaint-containar {
    max-width: 500px;
    margin: auto;
    header {
      width: 100%;
      position: relative;
      text-align: center;
      font-size: 1.2rem;
      i {
        position: absolute;
        left: 0;
        cursor: pointer;
      }
    }
    .user-content {
      display: flex;
      align-items: center;
      margin-top: 1.5rem;
      .user-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        margin-right: 1rem;
      }
    }
    .opinion {
      // padding: 1em 0;
      width: 100%;
      margin: 1em 0;
      position: relative;
      height: 13rem;
      textarea {
        width: 100%;
        height: 100%;
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 0.4rem;
        padding: 0.6rem;
        font-size: 1rem;
      }
      .upload-containar {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0.8rem;
        height: 7.6rem;
        overflow-y: auto;
        .file-content {
          width: 5rem;
          height: 5rem;
          float: left;
          margin-right: 1rem;
          position: relative;
          margin-top: 1rem;
          .file-img {
            width: 100%;
            height: 100%;
          }
          span {
            position: absolute;
            top: -0.7rem;
            right: -0.7rem;
            width: 1.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            text-align: center;
            color: white;
            font-size: 0.5rem;
          }
        }
        .upload-file {
          width: 5rem;
          height: 5rem;
          border: 1px dashed rgba(221, 221, 221, 1);
          // display: flex;
          // justify-content: center;
          // align-items: center;
          color: rgba(153, 153, 153, 1);
          // position: absolute;
          // bottom: .8rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 1rem;
          i {
            display: block;
            font-size: 1.6rem;
          }
          label{
            font-size: .8rem;
          }
        }
      }
    }
    .data-form {
      float: left;
      width: 100%;
      margin-bottom: 1rem;
      .icon-box {
        width: 2.5rem;
        height: 2.5rem;
        background-color: rgba(66, 144, 255, 0.2);
        border-radius: 50%;
        float: left;
        margin-right: 0.8rem;
        text-align: center;
        line-height: 2.5rem;
        color: rgba(66, 144, 255, 1);
        font-size: 1.3rem;
      }
      // ::-webkit-input-placeholder { color: rgba(204, 204, 204, 1); }
      //    /*Firefox 4-18瀏覽器專用*/
      // ::-moz-placeholder { color: rgba(204, 204, 204, 1); }
      //    /*Firefox 19+瀏覽器專用*/
      // ::-moz-placeholder{color:rgba(204, 204, 204, 1);}
      //    /*IE10瀏覽器專用*/
      // :-ms-input-placeholder{color: rgba(204, 204, 204, 1);}
      input {
        line-height: 2rem;
        border: unset;
        border-bottom: 1px solid rgba(242, 242, 242, 1);
        width: calc(100% - 3.4rem);
        padding-bottom: 1rem;
        font-size: 1rem;
        /*webkit瀏覽器專用*/
      }
    }
    .submit-btn {
      height: 3.5rem;
      width: 95%;
      margin: auto;
      border-radius: 3.5rem;
      background-color: rgba(66, 144, 255, 1);
      text-align: center;
      line-height: 3.5rem;
      color: #fff;
      font-size: 1.5rem;
      margin-top: 1.5rem;
      float: left;
      left: 2.5%;
      position: relative;
    }
  }
}
</style>