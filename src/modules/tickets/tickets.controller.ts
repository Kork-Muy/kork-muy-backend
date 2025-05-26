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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { BuyTicketDto } from "./dto/buy-ticket.dto";

@Controller("tickets")
@ApiTags("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new ticket" })
  @ApiResponse({ status: 201, description: "Ticket created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Post("buy-ticket")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Buy a ticket" })
  @ApiResponse({ status: 200, description: "Ticket bought successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  buyTicket(@Body() buyTicketDto: BuyTicketDto, @Req() req: any) {
    return this.ticketsService.buyTicket(buyTicketDto, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all tickets" })
  @ApiResponse({ status: 200, description: "Return all tickets" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(@Req() req: any) {
    return this.ticketsService.findAll(req.user);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a ticket by id" })
  @ApiResponse({ status: 200, description: "Return the ticket" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a ticket" })
  @ApiResponse({ status: 200, description: "Ticket updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  update(@Param("id") id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete a ticket" })
  @ApiResponse({ status: 200, description: "Ticket deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  remove(@Param("id") id: string) {
    return this.ticketsService.remove(id);
  }
}
