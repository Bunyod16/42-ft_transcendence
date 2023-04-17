import { IsDate, IsNotEmpty, IsNumber, IsString, } from "class-validator";

export class CreateChatDto {

	@IsNumber()
	@IsNotEmpty()
	public channelId: number;

	@IsString()
	public message: string;
}
