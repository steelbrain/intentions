import { CommandEvent } from "atom"

export interface CommandEventExtended<T extends Event = Event> extends CommandEvent {
  // TODO add to @types/atom
  // TODO will it be undefined?
  originalEvent?: T
}
