// src/modules/events/events.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { JwtCookieGuard } from "../auth/guards/jwt-cookie.guard";
import { CheckInTicketDto } from "./dto/check-in-ticket.dto";

@Controller("events")
@ApiTags("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: "Create a new event" })
  @ApiResponse({ status: 201, description: "Event created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: "Get all events" })
  @ApiResponse({ status: 200, description: "Return all events" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findAll() {
    return {
      events: await this.eventsService.findAll(),
    };
  }

  @Post("check-in-ticket")
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: "Check in a ticket" })
  @ApiResponse({ status: 200, description: "Ticket checked in successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  checkInTicket(@Body() checkInTicketDto: CheckInTicketDto, @Req() req: any) {
    const user = req.user;
    return this.eventsService.checkInTicket(checkInTicketDto, user);
  }

  @Get(":id")
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: "Get an event by id" })
  @ApiResponse({ status: 200, description: "Return the event" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Event not found" })
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: "Update an event" })
  @ApiResponse({ status: 200, description: "Event updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Event not found" })
  update(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(":id")
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: "Delete an event" })
  @ApiResponse({ status: 200, description: "Event deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Event not found" })
  remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }
}
