import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
  Query,
  Put,
} from "@nestjs/common";
import { FeedbackService } from "./Feedback.service";
import { FeedbackDto } from "./dto/Feedback.dto";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly FeedbackService: FeedbackService) {}

  @Post("addFeedback")
  addFeedback(@Body() dto: FeedbackDto) {
    return this.FeedbackService.addFeedback(dto);
  }

  @Get("getFeedback")
  getFeedback() {
    return this.FeedbackService.getFeedback();
  }
  @Get("getfeedbackbyid")
  getfeedbackbyid(@Query("id") id: string) {
    const feedbackID = parseInt(id);
    return this.FeedbackService.getfeedbackbyid(feedbackID);
  }

  @Delete("deleteFeedback")
    deleteFeedback(@Query("id") id: string) {
        const feedbackID = parseInt(id);
        return this.FeedbackService.deleteFeedback(feedbackID);
    }
}
