import { CommandEvent } from "atom"

export interface CommandEventExtended<T extends Event = Event> extends CommandEvent {
  originalEvent: T
}
