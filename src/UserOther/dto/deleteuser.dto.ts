import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class DeleteUserDto {
    @IsNotEmpty()
    @IsString()
    public email: string;
}