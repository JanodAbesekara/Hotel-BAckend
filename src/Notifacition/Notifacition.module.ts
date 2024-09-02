import { Module } from "@nestjs/common";
import { NotifacitionReal } from "./NotifacitionReal";


@Module({
  providers:[NotifacitionReal]
})

export class NotifacitionModule {}