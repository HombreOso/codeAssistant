<script lang='ts'>
    export let text: string;
    export let isBot: boolean = false;
    export let isTyping: boolean = false;
</script>

<style>
    .message-bubble {
        background-color: #1E1E1E;
        color: #D4D4D4;
        border-radius: 10px;
        padding: 10px;
        max-width: 70%;
        animation: popIn 0.3s ease-out;
    }
    .message-bubble-bot {
        color: #D4D4D4;
    }
    .message-bubble-typing {
        display: inline-block;
        margin-right: 10px;
        animation: typing 1s infinite;
    }
    @keyframes typing {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
    /* @keyframes popIn {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
    } */
</style>

<span class={`message-bubble ${isBot ? 'message-bubble-bot' : ''}`}>
    {#if isTyping}
    <span class="message-bubble-typing">...</span>
    {:else}
    {text}
    {/if}
</span>
