<template>
  <div class="header-container" :style="{background: colors.header.bg}">
    <!-- <slot name="header" :colors="colors" :chatTitle="chatTitle"
              :participants="participants"
    :myself="myself"></slot>-->
    <div v-if="!hasHeaderSlot" class="header-title">
      <p class="header-title-text" :style="{color: colors.header.text}">{{chatTitle}}</p>
      <!-- <p class="header-paticipants-text">
                <span>{{myself.name}}, </span>
                <span v-for="(participant, index) in participants" :key="participant.id">{{participant.name}}{{participants.length - index - 1 ? ', ' : ''}}</span>
      </p>-->
      <div class="top-bar-tool">
        <!-- <button class="cui-button" *ngIf="!this.consultant||this.consultant.type!=2" (click)="openComplaint()">投诉</button> -->
        <!-- <ng-container *ngIf="!currentChatClose"> -->
        <!-- <button class="cui-button flaticon-close" (click)="close()"></button> -->
        <!-- </ng-container> -->
        <button class="cui-button" @click="showCustomerComplaint()">投诉</button>
        <template v-if="!currentChatClose">
          <button class="cui-button flaticon-close" @click="close()"></button>
        </template>
      </div>
    </div>

    <!-- <div v-if="!hideCloseButton && !hasHeaderSlot" class="header-exit">
            <slot name="close-button">
                <a class="header-exit-button" href="#" :style="{fontSize: closeButtonIconSize}"
                   @click.prevent="onClose">✕</a>
            </slot>
    </div>-->
  </div>
</template>

<script>
/*
 * TODO: improve support for more than 10 participants (the names list may break in some cases)
 */
export default {
  props: {
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
    closeButtonIconSize: {
      type: String,
      required: false,
      default: "15px"
    },
    chatTitle: {
      type: String,
      required: false,
      default: "客服"
    },
    currentChatClose: {
      type: Boolean,
      required: false,
      default: false
    }
    /* onClose: {
                type: Function,
                required: false,
                default: () => false
            } */
  },
  computed: {
    participants() {
      return this.$store.state.participants;
    },
    myself() {
      return this.$store.state.myself;
    },
    // chatTitle() {
    //   return this.$store.state.chatTitle;
    // },
    hasHeaderSlot: function() {
      return !!this.$slots["header"];
    }
  },
  methods: {
    onClose: function() {
      this.$emit("onClose");
    },
    showCustomerComplaint() {
      this.$emit("showCustomerComplaint");
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
.quick-chat-container .header-container {
  padding: 0.8rem;
  width: 100%;
  // height: 2.78rem;
  z-index: 5;

  .header-title {
    // padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    text-align: left;
    font-size: 1.2rem;
  }
  .top-bar-tool {
    position: absolute;
    right: 0;
    .cui-button {
      // float: right;
      background-color: #fff;
      color: #000;
      box-shadow: unset;
      padding: 0;
      margin: 0;
      font-size: 0.8em;
      margin-left: 0.5em;
      border: 0px;
      border-radius: 2px;
      letter-spacing: 1px;
      user-select: none;
      touch-action: manipulation;
      cursor: pointer;
      &:focus {
        outline: none;
      }
      &::before {
        font-size: 0.7em;
      }
    }
  }
  .header-title-text {
    margin-bottom: 0;
  }

  .header-paticipants-text {
    color: #e4e4e4;
    font-size: 12px;
    margin-top: 5px;
    max-height: 30px;
    overflow: hidden;
  }

  .header-exit-button {
    text-decoration: none;
    color: #fff;
    font-size: 20px;
  }

  .icon-close-chat {
    color: #fff;
    width: 100%;
  }

  .icon-close-chat:hover {
    color: rgb(238, 121, 121);
  }
}
</style>
