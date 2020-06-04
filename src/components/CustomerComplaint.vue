<template>
  <div class="customer-complaint">
    <div class="customer-complaint-containar">
      <header>
        <i class="flaticon-prev" @click="closeCustomerComplaint()"></i>
        <p>投訴客服</p>
      </header>
      <div class="user-content">
        <!-- <img class="user-icon" src="{{icon}}" /> -->
        <img class="user-icon" />
        <!-- <div class="user-name">您正在投诉客服 {{nickName}}...</div> -->
        <div class="user-name">您正在投诉客服 ...</div>
      </div>

      <div class="opinion">
        <!-- <textarea placeholder="请输入您的投訴原因" [(ngModel)]="form.content"></textarea> -->
        <textarea placeholder="请输入您的投訴原因"></textarea>
        <div class="upload-containar">
          <!-- <ng-container *ngIf="form.files && form.files.length > 0">
          <div class="file-content" *ngFor="let file of form.files">
            <img class="file-img" [src]=" getImageUrl(file) | safeUrl" />
            <span tooltip="移除文件" class="flaticon-close file-span" (click)="removeFile(file)"></span>
          </div>
          </ng-container>-->
          <!-- <div class="upload-file" (click)="selectFile()"> -->
          <div class="upload-file">
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
        <!-- <input placeholder="请输入您的微信号" type="text" [(ngModel)]="form.weChat" /> -->
        <input placeholder="请输入您的微信号" type="text" />
      </div>

      <div class="data-form">
        <div class="icon-box flaticon-qq">
          <i></i>
        </div>
        <!-- <input placeholder="请输入您的qq号" type="text" [(ngModel)]="form.qq" /> -->
        <input placeholder="请输入您的qq号" type="text" />
      </div>

      <div class="data-form">
        <div class="icon-box flaticon-phone">
          <i></i>
        </div>
        <!-- <input placeholder="请输入您的手機号" type="text" [(ngModel)]="form.phone" /> -->
        <input placeholder="请输入您的手機号" type="text" />
      </div>

      <!-- <div class="submit-btn" (click)="save()">提交</div> -->
      <div class="submit-btn">提交</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeCustomerComplaint() {
      this.$emit("showCustomerComplaint", false, "slideRight");
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
            top: -0.8em;
            right: -0.8em;
            width: 2em;
            height: 2em;
            line-height: 2em;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            text-align: center;
            color: white;
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
          float: left;
          text-align: center;
          margin-top: 1rem;
          i {
            display: block;
            font-size: 1.6rem;
            margin-top: 0.3125rem;
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