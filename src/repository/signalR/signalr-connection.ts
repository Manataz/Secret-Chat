import * as signalR from "@microsoft/signalr";
const URL = "https://blinddate.darksea.ir/chathub";
class Connector {
    private connection: signalR.HubConnection | undefined;
    public events: ((onMessageReceived: (username: string, message: string) => void) => void) | undefined;
    static instance: Connector;
    private loginToken = localStorage.getItem("TOKEN");
    public isConnected = false;
    private onConnectCallback: (() => void) | undefined;

    constructor(onConnect?: () => void) {
        this.onConnectCallback = onConnect;
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                accessTokenFactory: () => { return this.loginToken ?? "" },
                transport: signalR.HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect()
            .build();
        this.connection.start().then(() => {
            this.isConnected = true;
            if(this.onConnectCallback) {
                this.onConnectCallback();
            }
        }).catch(err => console.error(err)).finally(() => {{this.isConnected = true}});
        this.events = (onMessageReceived) => {
            this.connection?.on("ReceiveMessage", (username, message) => {
                onMessageReceived(username, message);
            });
        };

    }

    public newMessage = (methodName: string, args: any[]) => {
        console.warn("args", methodName, args)
        this.connection?.send(methodName, ...args).then(x => console.log("sent"))
    }
    public static getInstance(onConnect: () => void): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector(onConnect);
        return Connector.instance;
    }
}
export default Connector.getInstance;
