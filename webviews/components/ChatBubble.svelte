<script lang='ts'>
    export let text: string;
    export let isBot: boolean = false;
    export let name: string = isBot ? 'Code Assistant' : 'User';
    export let isTyping: boolean = false;
    let typingString: string = '...';
    const botImageSrc: string = window['botImageSrc'];
    console.log(`botImageSrc:`, botImageSrc)
    const userImageSrc: string = window['userImageSrc'];
    if (isTyping) {
        setInterval(() => {
            typingString = (typingString === '...') ? '.' : typingString+'.'
        }, 500)
    }
</script>

<style>
    .message-container {
        width: 100%;
        padding: 10px;
        color: #D4D4D4;
        display: flex;
        align-items: center;
    }
    pre {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .message-content {
        margin-left: 10px;
    }

    .bot-message {
        background-color: #192227;
        /* color: #4f7a87; */
        color: #5f7a87;
    }
    
    .human-message {
        background-color: #20292e;
        color: #5f7a87;
    }
    .link-txt {
        color: #55bec4;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
</style>

<div class={`message-container ${isBot ? 'bot-message' : 'human-message'}`}>
    <img class="avatar" src={isBot ? botImageSrc : userImageSrc} alt={name} />
    <div class="message-content">
        <strong>{name}</strong>
        {#if isBot && isTyping}
            <pre class="message-bubble-typing">{typingString}</pre>
        {:else}
            <pre>{text}</pre>
        {/if}
    </div>
</div>
