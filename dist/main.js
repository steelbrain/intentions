"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intentions = void 0;
const sb_event_kit_1 = require("sb-event-kit");
const commands_1 = __importDefault(require("./commands"));
const view_list_1 = __importDefault(require("./view-list"));
const providers_list_1 = __importDefault(require("./providers-list"));
const providers_highlight_1 = __importStar(require("./providers-highlight"));
class Intentions {
    constructor() {
        this.active = null;
        this.commands = new commands_1.default();
        this.providersList = new providers_list_1.default();
        this.providersHighlight = new providers_highlight_1.default();
        this.subscriptions = new sb_event_kit_1.CompositeDisposable();
        this.subscriptions.add(this.commands);
        this.subscriptions.add(this.providersList);
        this.subscriptions.add(this.providersHighlight);
        // eslint-disable-next-line arrow-parens
        this.commands.onListShow(async (textEditor) => {
            const results = await this.providersList.trigger(textEditor);
            if (!results.length) {
                return false;
            }
            const listView = new view_list_1.default();
            const subscriptions = new sb_event_kit_1.CompositeDisposable();
            listView.activate(textEditor, results);
            listView.onDidSelect(function (intention) {
                intention.selected();
                subscriptions.dispose();
            });
            subscriptions.add(listView);
            subscriptions.add(() => {
                if (this.active === subscriptions) {
                    this.active = null;
                }
            });
            subscriptions.add(this.commands.onListMove(function (movement) {
                listView.move(movement);
            }));
            subscriptions.add(this.commands.onListConfirm(function () {
                listView.select();
            }));
            subscriptions.add(this.commands.onListHide(function () {
                subscriptions.dispose();
            }));
            this.active = subscriptions;
            return true;
        });
        // eslint-disable-next-line arrow-parens
        this.commands.onHighlightsShow(async (textEditor) => {
            const results = await this.providersHighlight.trigger(textEditor);
            if (!results.length) {
                return false;
            }
            const painted = providers_highlight_1.paint(textEditor, results);
            const subscriptions = new sb_event_kit_1.CompositeDisposable();
            subscriptions.add(() => {
                if (this.active === subscriptions) {
                    this.active = null;
                }
            });
            subscriptions.add(this.commands.onHighlightsHide(function () {
                subscriptions.dispose();
            }));
            subscriptions.add(painted);
            this.active = subscriptions;
            return true;
        });
    }
    activate() {
        this.commands.activate();
    }
    consumeListProvider(provider) {
        this.providersList.addProvider(provider);
    }
    deleteListProvider(provider) {
        this.providersList.deleteProvider(provider);
    }
    consumeHighlightProvider(provider) {
        this.providersHighlight.addProvider(provider);
    }
    deleteHighlightProvider(provider) {
        this.providersHighlight.deleteProvider(provider);
    }
    dispose() {
        this.subscriptions.dispose();
        if (this.active) {
            this.active.dispose();
        }
    }
}
exports.Intentions = Intentions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBa0Q7QUFHbEQsMERBQWlDO0FBQ2pDLDREQUFrQztBQUNsQyxzRUFBNEM7QUFDNUMsNkVBQWlFO0FBR2pFLE1BQWEsVUFBVTtJQU9yQjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBUSxFQUFFLENBQUE7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHdCQUFhLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSw2QkFBa0IsRUFBRSxDQUFBO1FBQ2xELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxrQ0FBbUIsRUFBRSxDQUFBO1FBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDL0Msd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRTtZQUM1QyxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBRTVELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNuQixPQUFPLEtBQUssQ0FBQTthQUNiO1lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUE7WUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxrQ0FB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QUE7SUFDL0MsQ0FBQztJQUVELHVCQUF1QixDQUFDLFFBQTJCO1FBQ2pELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRTVCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7U0FDdEI7SUFDSCxDQUFDO0NBQ0Y7QUE1R0QsZ0NBNEdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJzYi1ldmVudC1raXRcIlxyXG5pbXBvcnQgeyBEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIlxyXG5cclxuaW1wb3J0IENvbW1hbmRzIGZyb20gXCIuL2NvbW1hbmRzXCJcclxuaW1wb3J0IExpc3RWaWV3IGZyb20gXCIuL3ZpZXctbGlzdFwiXHJcbmltcG9ydCBQcm92aWRlcnNMaXN0IGZyb20gXCIuL3Byb3ZpZGVycy1saXN0XCJcclxuaW1wb3J0IFByb3ZpZGVyc0hpZ2hsaWdodCwgeyBwYWludCB9IGZyb20gXCIuL3Byb3ZpZGVycy1oaWdobGlnaHRcIlxyXG5pbXBvcnQgdHlwZSB7IExpc3RQcm92aWRlciwgSGlnaGxpZ2h0UHJvdmlkZXIgfSBmcm9tIFwiLi90eXBlc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgSW50ZW50aW9ucyB7XHJcbiAgYWN0aXZlOiBEaXNwb3NhYmxlIHwgbnVsbCB8IHVuZGVmaW5lZFxyXG4gIGNvbW1hbmRzOiBDb21tYW5kc1xyXG4gIHByb3ZpZGVyc0xpc3Q6IFByb3ZpZGVyc0xpc3RcclxuICBwcm92aWRlcnNIaWdobGlnaHQ6IFByb3ZpZGVyc0hpZ2hsaWdodFxyXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcclxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxyXG4gICAgdGhpcy5wcm92aWRlcnNMaXN0ID0gbmV3IFByb3ZpZGVyc0xpc3QoKVxyXG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQgPSBuZXcgUHJvdmlkZXJzSGlnaGxpZ2h0KClcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5wcm92aWRlcnNMaXN0KVxyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodClcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJvdy1wYXJlbnNcclxuICAgIHRoaXMuY29tbWFuZHMub25MaXN0U2hvdyhhc3luYyAodGV4dEVkaXRvcikgPT4ge1xyXG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5wcm92aWRlcnNMaXN0LnRyaWdnZXIodGV4dEVkaXRvcilcclxuXHJcbiAgICAgIGlmICghcmVzdWx0cy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbGlzdFZpZXcgPSBuZXcgTGlzdFZpZXcoKVxyXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxyXG4gICAgICBsaXN0Vmlldy5hY3RpdmF0ZSh0ZXh0RWRpdG9yLCByZXN1bHRzKVxyXG4gICAgICBsaXN0Vmlldy5vbkRpZFNlbGVjdChmdW5jdGlvbiAoaW50ZW50aW9uKSB7XHJcbiAgICAgICAgaW50ZW50aW9uLnNlbGVjdGVkKClcclxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxyXG4gICAgICB9KVxyXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChsaXN0VmlldylcclxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmNvbW1hbmRzLm9uTGlzdE1vdmUoZnVuY3Rpb24gKG1vdmVtZW50KSB7XHJcbiAgICAgICAgICBsaXN0Vmlldy5tb3ZlKG1vdmVtZW50KVxyXG4gICAgICAgIH0pXHJcbiAgICAgIClcclxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoXHJcbiAgICAgICAgdGhpcy5jb21tYW5kcy5vbkxpc3RDb25maXJtKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxpc3RWaWV3LnNlbGVjdCgpXHJcbiAgICAgICAgfSlcclxuICAgICAgKVxyXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICAgIHRoaXMuYWN0aXZlID0gc3Vic2NyaXB0aW9uc1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSlcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJvdy1wYXJlbnNcclxuICAgIHRoaXMuY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhhc3luYyAodGV4dEVkaXRvcikgPT4ge1xyXG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcih0ZXh0RWRpdG9yKVxyXG5cclxuICAgICAgaWYgKCFyZXN1bHRzLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBwYWludGVkID0gcGFpbnQodGV4dEVkaXRvciwgcmVzdWx0cylcclxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcclxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHBhaW50ZWQpXHJcbiAgICAgIHRoaXMuYWN0aXZlID0gc3Vic2NyaXB0aW9uc1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKCkge1xyXG4gICAgdGhpcy5jb21tYW5kcy5hY3RpdmF0ZSgpXHJcbiAgfVxyXG5cclxuICBjb25zdW1lTGlzdFByb3ZpZGVyKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIpIHtcclxuICAgIHRoaXMucHJvdmlkZXJzTGlzdC5hZGRQcm92aWRlcihwcm92aWRlcilcclxuICB9XHJcblxyXG4gIGRlbGV0ZUxpc3RQcm92aWRlcihwcm92aWRlcjogTGlzdFByb3ZpZGVyKSB7XHJcbiAgICB0aGlzLnByb3ZpZGVyc0xpc3QuZGVsZXRlUHJvdmlkZXIocHJvdmlkZXIpXHJcbiAgfVxyXG5cclxuICBjb25zdW1lSGlnaGxpZ2h0UHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XHJcbiAgICB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodC5hZGRQcm92aWRlcihwcm92aWRlcilcclxuICB9XHJcblxyXG4gIGRlbGV0ZUhpZ2hsaWdodFByb3ZpZGVyKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlcikge1xyXG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQuZGVsZXRlUHJvdmlkZXIocHJvdmlkZXIpXHJcbiAgfVxyXG5cclxuICBkaXNwb3NlKCkge1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxyXG5cclxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZS5kaXNwb3NlKClcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19