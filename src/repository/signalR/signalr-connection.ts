import * as signalR from "@microsoft/signalr";
const URL = "https://blinddate.darksea.ir/chathub";
class Connector {
    private connection: signalR.HubConnection | undefined;
    public events: ((onMessageReceived: (username: string, message: string) => void) => void) | undefined;
    static instance: Connector;
    private loginToken = localStorage.getItem("TOKEN");
    public isConnected = false;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                accessTokenFactory: () => { return this.loginToken ?? "" },
                transport: signalR.HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect()
            .build();
        this.connection.start().then(() => {this.isConnected = true}).catch(err => console.error(err)).finally(() => {{this.isConnected = true}});
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
    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }

    public tryAnotherConnect = () => {
        this.isConnected = false;
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                accessTokenFactory: () => { return this.loginToken ?? "" },
                transport: signalR.HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect([0, 500, 1000, 2000, 5000])
            .build();
        this.connection.start().then(() => {this.isConnected = true}).catch(err => console.error(err)).finally(() => {{this.isConnected = true}});
        this.events = (onMessageReceived) => {
            this.connection?.on("ReceiveMessage", (username, message) => {
                onMessageReceived(username, message);
            });
        };

    }
}
export default Connector.getInstance;
