import { Disposable } from "atom";
import type { ListProvider, HighlightProvider } from "./types";
export default function activate(): void;
export declare function deactivate(): void;
export declare function consumeListIntentions(provider: ListProvider | Array<ListProvider>): Disposable | undefined;
export declare function consumeHighlightIntentions(provider: HighlightProvider | Array<HighlightProvider>): Disposable | undefined;
