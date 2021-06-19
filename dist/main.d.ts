import { CompositeDisposable } from "sb-event-kit";
import { Disposable } from "atom";
import Commands from "./commands";
import ProvidersList from "./providers-list";
import ProvidersHighlight from "./providers-highlight";
import type { ListProvider, HighlightProvider } from "./types";
export declare class Intentions {
    active: Disposable | null | undefined;
    commands: Commands;
    providersList: ProvidersList;
    providersHighlight: ProvidersHighlight;
    subscriptions: CompositeDisposable;
    constructor();
    activate(): void;
    consumeListProvider(provider: ListProvider): void;
    deleteListProvider(provider: ListProvider): void;
    consumeHighlightProvider(provider: HighlightProvider): void;
    deleteHighlightProvider(provider: HighlightProvider): void;
    dispose(): void;
}
