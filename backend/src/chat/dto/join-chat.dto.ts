import { IsNumber } from "class-validator";

export class JoinChatDto {

	@IsNumber()
	public channelId: number;
}
