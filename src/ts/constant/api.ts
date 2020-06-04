export enum ApiClassName {
    PostCustomerChatMessage = 'role-post-customer-chat-message',
    PostCustomerChatAck = 'role-post-customer-chat-ack',
    GetCustomerChatSse = 'role-get-customer-chat-sse',
}
export enum ApiPath {
    PostCustomerChatMessage = '/chat/message',
    PostCustomerChatAck = '/chat/ack',
    GetCustomerChatSse = '/chat/sse',
}