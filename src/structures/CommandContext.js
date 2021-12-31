export class CommandContext {
    constructor(interaction) {
        this.context = interaction;
    }

    get client() {
        return this.context.guild.client;
    }

    get channel() {
        return this.context.channel;
    }

    get author() {
        return this.context.user;
    }

    get guild() {
        return this.context.guild;
    }

    get options() {
        return this.context.options;
    }

    get member() {
        return this.context.member;
    }

    send(options) {
        return this.context.editReply(options);
    }
}
