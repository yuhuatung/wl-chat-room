
export enum ChatRecordSendType {
    // 系統
    SYSTEM = 0
    // 客服
    , CONSULTANT = 1
    // 客戶
    , CUSTOMER = 2
    // 客服預設訊息
    , CONSULTANTDEFAULT = 3
}

export enum ChatRecordDataType {
    // 文字
    TEXT = 0
    // 圖片
    , IMAGE = 1
    // 語音
    , VOICE = 2
    // 文件
    , DOC = 3
    // 通話
    , CALL = 4
    // 業務公告
    , ANNOUNCEMENT = 5
    // 結束評分
    , CLOSESCORE = 6
    // HTML
    , HTML = 7
    // 機器人訊息
    , BOT = 8
}


export enum ChatEventType {
    // 開啟聊天室
    CHATINFO = 0
    // 訊息
    , MESSAGE = 1
    // 客服列表
    , ONLINE = 2
    // 輸入
    , TYPING = 3
    // 客服資訊
    , CONSULTANT = 4
    // 刷新客戶資料(目前不需要)
    , CUSTOMER = 5
    // 內部協同
    , INTERNAL = 6
    // 撤回消息
    , UNSEND = 7
    // 結束離開狀態
    , COME_BACK = 8
    // 內部協同 客服列表
    , USER_ONLINE = 9
    // 客服轉接
    , SWITCH_USER = 10
    // 結束評分
    , CLOSESCORE = 11
}

export enum CustomerTypeEnum {
    GUEST = 1
    , NORMAL = 2
    , VIP = 3
}

export const CustomerType = {
    '1': '游客'
    , '2': '玩家'
    , '3': 'VIP'
};
export interface SubProduct {

    /** ID*/
    id: number;

    /** 主站ID*/
    productId: number;

    /** 聊天室icon*/
    chatIcon;

    /** 聊天室標題*/
    chatTitle;

    /** 預設訊息*/
    chatMessage;

    /** 網址*/
    url;

    /** 是否啟用*/
    enabled: boolean;

}

export interface ChatEvent {
    event: number;
}

export interface ChatInfo extends ChatEvent {
    subProductId: number;
    customerId: number;
    customer: Customer;
    chat: Chat;
    consultant: Consultant;
}


export interface ChatConsultant extends ChatEvent {
    data: Consultant;
}

export interface ChatSwitchUser extends ChatEvent {
    customerId: number;
    subProductId: number;
    data: ChatRecord;
}

export interface ChatCloseScore extends ChatEvent {
    chat: Chat;
    otp: string;
}

export interface ChatUser {
    id: number;
    nickname: string;
    icon: string;
}
export interface ChatUsers {
    [key: number]: ChatUser;
}
export interface Chat {
    time: number;

    id: number;

    customerId: number;

    userId: number;

    score: number;

    endTime: number;

    users: ChatUsers;

    otp?: string;

    tempScore?: number;
}

export interface ChatRecord {
    chatTime: number;
    chatId: number;
    id: number;
    sendType: number;
    userId: number;
    dataType: number;
    data: string;
    unsend: boolean;
    time: number;
    url: string;
    size: number;
    botData?: BotData;
}

interface BotData {
    recommend: Knowledge;
    solution: Knowledge;
    relatedProblems: [{ id: number; problem: string; keyCount: number; }];
}

export interface Customer {
    id: number;
    productId: number;
    subProductId: number;
    sourceId: string;
    type: number;
    name: string;
    nickname: string;
    channelId: number;
}

export interface Consultant {
    id: number;
    subProductId: string;
    type: number;
    nickname: string;
    added: UserAdded;
    userAnnounces: UserAnnounce[];
}
export interface ChatMessage extends ChatEvent {
    customerId: number;
    userId: number;
    data: ExtendChatRecord;
}


export interface UserAdded {

    userId: number;

    // 大頭照
    icon: string;

    // 預設語音
    voice: string;

    // 文字留言
    message: string;

    // 星级(1顆星20分)
    score: number;

    // 本月客户评分
    monthScore: number;

    // 服务规范性(1顆星20分)
    serviceNormativeScore: number;

    // 服务态度(1顆星20分)
    serviceAttitudeScore: number;

    // 专业性(1顆星20分)
    professionalScore: number;

    // 解决能力(1顆星20分)
    solvingAbilityScore: number;
}


export interface UserAnnounce {

    // 標籤
    tag: string;

    // 主題
    topic: string;

    // 內容
    content: string;

    // 圖片id
    dataUrl: string;

    // 圖片Url
    picUrl: string;
}

export interface ExtendChatRecord extends ChatRecord {
    botData?: any;
    announce?: UserAnnounce;
    progress?: number;
    file?: File;
    fail?: boolean;
}

/** 知識庫 */
export interface Knowledge {
    id: number; /**ID*/
    problem: string; /**问题*/
    solution: string; /**答案*/
    keyWords: string; /**关键词*/
    updateUser?: number; /**修改者*/
    updateTime?: number; /**修改時間*/
    createUser?: number; /**建立者*/
    createTime?: number; /**建立時間*/
}
