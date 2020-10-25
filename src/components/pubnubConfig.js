import PubNub from "pubnub";

const uuid = PubNub.generateUUID();
export const PubNubConfig = new PubNub({
  publishKey: "pub-c-1aa7020f-422a-4e2f-96c1-22f4bedd7977",
  subscribeKey: "sub-c-7276bbe0-fe62-11ea-afa2-4287c4b9a283",
  uuid: uuid,
});
